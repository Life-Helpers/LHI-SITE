import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { sessionKey, sign } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";
import { accessProblem, effectivePermissions, findRole, homePath, type AccessProblem, type Actor } from "@/lib/hr/access";
import type { HrAccount, HrEmployee, HrPermission, HrRole } from "@/lib/hr/types";

/**
 * HR portal sessions. The cookie only says which account signed in and which version of that
 * account's access it was issued for. Everything else (active?, role, permissions, employee
 * link) is read from the store on every request, and a session stops working as soon as the
 * account's sessionVersion is bumped (deactivation, role or permission change, password reset).
 */

export const HR_SESSION_COOKIE = "lhi_hr_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const signHr = async (payload: string) => sign(`hr.${payload}`, await sessionKey());

export async function createHrSession(account: HrAccount) {
  const payload = Buffer.from(
    JSON.stringify({ aid: account.id, v: account.sessionVersion, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, n: randomUUID() }),
  ).toString("base64url");
  (await cookies()).set(HR_SESSION_COOKIE, `${payload}.${await signHr(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroyHrSession() {
  (await cookies()).delete(HR_SESSION_COOKIE);
}

async function readSessionClaims(): Promise<{ aid: string; v: number } | null> {
  const token = (await cookies()).get(HR_SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(await signHr(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { aid, v, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { aid: string; v: number; exp: number };
    if (typeof aid !== "string" || typeof v !== "number" || !(exp >= Date.now() / 1000)) return null;
    return { aid, v };
  } catch {
    return null;
  }
}

export interface HrContext {
  account: HrAccount;
  employee: HrEmployee;
  role: HrRole;
  permissions: HrPermission[];
  actor: Actor;
  /** Shown in the portal header. */
  displayName: string;
}

export type HrSessionState =
  | { status: "signed-out" }
  | { status: "problem"; problem: Exclude<AccessProblem, null>; account: HrAccount }
  | { status: "ok"; ctx: HrContext };

/** The signed-in person's current access, read fresh from the store. */
export async function loadHrSession(): Promise<HrSessionState> {
  const claims = await readSessionClaims();
  if (!claims) return { status: "signed-out" };
  const [accounts, employees, customRoles] = await Promise.all([readStore("hrAccounts"), readStore("hrEmployees"), readStore("hrRoles")]);
  const account = accounts.find((a) => a.id === claims.aid);
  // Unknown account, or access changed since this session was issued: treat as signed out.
  if (!account || account.sessionVersion !== claims.v || !account.passwordHash) return { status: "signed-out" };
  const employee = employees.find((e) => e.id === account.employeeId);
  const problem = accessProblem(account, customRoles, employee);
  if (problem) return { status: "problem", problem, account };
  const role = findRole(account.roleId, customRoles)!;
  const permissions = effectivePermissions(account, customRoles, employee);
  if (permissions.length === 0) return { status: "problem", problem: "no-role", account };
  return {
    status: "ok",
    ctx: {
      account,
      employee: employee!,
      role,
      permissions,
      actor: { accountId: account.id, employeeId: employee!.id, permissions },
      displayName: `${employee!.firstName} ${employee!.lastName}`.trim() || account.email,
    },
  };
}

type Need = HrPermission | HrPermission[] | undefined;
const allowed = (perms: readonly HrPermission[], need: Need) =>
  !need || (Array.isArray(need) ? need.some((p) => perms.includes(p)) : perms.includes(need));

/**
 * For pages. Signed out → the sign-in page; no valid access → the explanation page; missing
 * the permission → their own dashboard with a notice. `need` as an array means "any of".
 */
export async function requireHrPage(need?: Need): Promise<HrContext> {
  const state = await loadHrSession();
  if (state.status === "signed-out") redirect("/hrportal");
  if (state.status === "problem") redirect("/hrportal/no-access");
  if (!allowed(state.ctx.permissions, need)) redirect(`${homePath(state.ctx.permissions)}?denied=1`);
  return state.ctx;
}

export class HrAccessError extends Error {}

/** For server actions: throw (the action turns it into an error message) instead of redirecting. */
export async function requireHrAction(need?: Need): Promise<HrContext> {
  const state = await loadHrSession();
  if (state.status === "signed-out") throw new HrAccessError("Your session has ended. Please sign in again.");
  if (state.status === "problem") throw new HrAccessError("Your account doesn't have access to the HR portal. Contact HR.");
  if (!allowed(state.ctx.permissions, need)) throw new HrAccessError("You don't have permission to do that.");
  return state.ctx;
}

export const HR_PROBLEM_MESSAGES: Record<Exclude<AccessProblem, null>, string> = {
  inactive: "Your HR portal account has been deactivated. If you think this is a mistake, contact the HR team.",
  "no-role": "Your HR portal account doesn't have a valid role, so you can't access any HR information yet. Contact the HR team.",
  "no-employee": "Your HR portal account isn't linked to an active employee record. Contact the HR team.",
};
