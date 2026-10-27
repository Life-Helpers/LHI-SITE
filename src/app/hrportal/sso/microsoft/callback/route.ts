import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { sessionKey, sign } from "@/lib/cms/auth";
import { readStore, updateStore } from "@/lib/cms/store";
import { accessProblem, effectivePermissions, homePath } from "@/lib/hr/access";
import { callbackUrl, exchangeCode, microsoftConfig, microsoftKeys, MS_FLOW_COOKIE, tokenKeyId, verifyIdToken } from "@/lib/hr/microsoft-sso";
import { createHrSession } from "@/lib/hr/session";

export const dynamic = "force-dynamic";

/**
 * Microsoft sends people back here after they sign in. Everything is checked before a session is
 * made: this sign-in's state, Microsoft's signed ID token, and an active portal account with the
 * same email. Any problem goes back to the sign-in page with a plain message, never a session.
 */
export async function GET(req: Request) {
  const back = (reason: string) => Response.redirect(new URL(`/hrportal?sso=${reason}`, req.url), 302);
  const cfg = microsoftConfig();
  if (!cfg) return new Response("Not found", { status: 404 });
  const url = new URL(req.url);
  const jar = await cookies();
  const flow = jar.get(MS_FLOW_COOKIE)?.value;
  jar.delete(MS_FLOW_COOKIE);
  if (url.searchParams.get("error")) return back("cancelled");

  // The secrets from the start of this sign-in, untouched and in time.
  const [payload, mac] = (flow ?? "").split(".");
  if (!payload || !mac) return back("expired");
  const expected = Buffer.from(sign(`hr-ms.${payload}`, await sessionKey()));
  if (expected.length !== Buffer.from(mac).length || !timingSafeEqual(expected, Buffer.from(mac))) return back("expired");
  const saved = JSON.parse(Buffer.from(payload, "base64url").toString()) as { state: string; nonce: string; verifier: string; exp: number };
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  if (saved.exp < Date.now() || !code || state.length !== saved.state.length || !timingSafeEqual(Buffer.from(state), Buffer.from(saved.state))) return back("expired");

  let email: string;
  try {
    const idToken = await exchangeCode(cfg, { code, redirectUri: callbackUrl(req, cfg.redirectUri), verifier: saved.verifier });
    let keys = await microsoftKeys(cfg);
    // Microsoft rotates its keys: fetch again once if this token uses one we haven't seen.
    if (!keys.some((k) => (k as { kid?: string }).kid === tokenKeyId(idToken))) keys = await microsoftKeys(cfg, { refresh: true });
    email = verifyIdToken(idToken, keys, { tenantId: cfg.tenantId, clientId: cfg.clientId, nonce: saved.nonce, authority: cfg.authority }).email;
  } catch (err) {
    console.error("HR Microsoft sign-in failed:", err instanceof Error ? err.message : err);
    return back("failed");
  }

  // Only someone HR has already given an active account: Microsoft sign-in never creates one.
  const [accounts, employees, customRoles, departments] = await Promise.all([readStore("hrAccounts"), readStore("hrEmployees"), readStore("hrRoles"), readStore("hrDepartments")]);
  const account = accounts.find((a) => a.email === email);
  if (!account) return back("no-account");
  if (!account.active) return back("inactive");
  const now = new Date().toISOString();
  const linked = await updateStore<"hrAccounts", typeof account | undefined>("hrAccounts", (items) => {
    const next = items.map((a) => (a.id === account.id ? { ...a, ssoAt: a.ssoAt ?? now, lastLoginAt: now } : a));
    return { items: next, result: next.find((a) => a.id === account.id) };
  });
  await createHrSession(linked ?? account, "microsoft");
  const employee = employees.find((e) => e.id === account.employeeId);
  if (accessProblem(account, customRoles, employee)) return Response.redirect(new URL("/hrportal/no-access", req.url), 302);
  return Response.redirect(new URL(homePath(effectivePermissions(account, customRoles, employee, departments)), req.url), 302);
}
