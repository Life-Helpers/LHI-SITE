import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { sessionKey, sign } from "@/lib/cms/auth";
import { readStore, updateStore } from "@/lib/cms/store";
import { accessProblem, effectivePermissions, findRole, homePath, type AccessProblem, type Actor } from "@/lib/hr/access";
import type { HrAccount, HrDepartment, HrEmployee, HrLeaveType, HrPermission, HrRole } from "@/lib/hr/types";

/**
 * HR portal sessions. The cookie only says which account signed in and which version of that
 * account's access it was issued for. Everything else (active?, role, permissions, employee
 * link) is read from the store on every request, and a session stops working as soon as the
 * account's sessionVersion is bumped (deactivation, role or permission change, password reset).
 */

export const HR_SESSION_COOKIE = "lhi_hr_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const signHr = async (payload: string) => sign(`hr.${payload}`, await sessionKey());

/** `via`: how the person proved who they are ("microsoft" for single sign-on with their LHI Microsoft account). */
export async function createHrSession(account: HrAccount, via: "password" | "microsoft" = "password") {
  const payload = Buffer.from(
    JSON.stringify({ aid: account.id, v: account.sessionVersion, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, n: randomUUID(), ...(via === "microsoft" ? { m: "ms" } : {}) }),
  ).toString("base64url");
  (await cookies()).set(HR_SESSION_COOKIE, `${payload}.${await signHr(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

/**
 * Sign out: the cookie is deleted, and the account's session version is bumped so a copy of the
 * cookie (e.g. on a shared computer) stops working too. This signs the person out on every device.
 */
export async function destroyHrSession() {
  const claims = await readSessionClaims();
  if (claims) {
    await updateStore("hrAccounts", (items) => ({
      items: items.map((a) => (a.id === claims.aid && a.sessionVersion === claims.v ? { ...a, sessionVersion: a.sessionVersion + 1 } : a)),
    }));
  }
  (await cookies()).delete(HR_SESSION_COOKIE);
}

async function readSessionClaims(): Promise<{ aid: string; v: number; sso: boolean } | null> {
  const token = (await cookies()).get(HR_SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(await signHr(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { aid, v, exp, m } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { aid: string; v: number; exp: number; m?: string };
    if (typeof aid !== "string" || typeof v !== "number" || !(exp >= Date.now() / 1000)) return null;
    return { aid, v, sso: m === "ms" };
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
  /** Every department (for routing leave to heads and approvers). */
  departments: HrDepartment[];
  /** Configured leave types (active and retired). */
  leaveTypes: HrLeaveType[];
  /** Shown in the portal header. */
  displayName: string;
  /** Signed in with their LHI Microsoft account rather than a portal password. */
  viaMicrosoft: boolean;
}

export type HrSessionState =
  | { status: "signed-out" }
  | { status: "problem"; problem: Exclude<AccessProblem, null>; account: HrAccount }
  | { status: "ok"; ctx: HrContext };

/** The signed-in person's current access, read fresh from the store. */
export async function loadHrSession(): Promise<HrSessionState> {
  const claims = await readSessionClaims();
  if (!claims) return { status: "signed-out" };
  const [accounts, employees, customRoles, departments] = await Promise.all([
    readStore("hrAccounts"),
    readStore("hrEmployees"),
    readStore("hrRoles"),
    readStore("hrDepartments"),
  ]);
  const leaveTypes = await readStore("hrLeaveTypes");
  const account = accounts.find((a) => a.id === claims.aid);
  // Unknown account, or access changed since this session was issued: treat as signed out.
  // A session needs a password set, or (for a Microsoft sign-in) the account linked by one.
  if (!account || account.sessionVersion !== claims.v || !(account.passwordHash || (claims.sso && account.ssoAt))) return { status: "signed-out" };
  const employee = employees.find((e) => e.id === account.employeeId);
  const problem = accessProblem(account, customRoles, employee);
  if (problem) return { status: "problem", problem, account };
  const role = findRole(account.roleId, customRoles)!;
  const permissions = effectivePermissions(account, customRoles, employee, departments);
  if (permissions.length === 0) return { status: "problem", problem: "no-role", account };
  return {
    status: "ok",
    ctx: {
      account,
      employee: employee!,
      role,
      permissions,
      actor: { accountId: account.id, employeeId: employee!.id, permissions },
      departments,
      leaveTypes,
      displayName: `${employee!.firstName} ${employee!.lastName}`.trim() || account.email,
      viaMicrosoft: claims.sso,
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
  // A password HR chose must be replaced before anything else (not needed after a Microsoft sign-in).
  if (state.ctx.account.mustChangePassword && !state.ctx.viaMicrosoft) redirect("/hrportal/password?required=1");
  if (!allowed(state.ctx.permissions, need)) redirect(`${homePath(state.ctx.permissions)}?denied=1`);
  return state.ctx;
}

export class HrAccessError extends Error {}

/** For server actions: throw (the action turns it into an error message) instead of redirecting. */
export async function requireHrAction(need?: Need): Promise<HrContext> {
  const state = await loadHrSession();
  if (state.status === "signed-out") throw new HrAccessError("Your session has ended. Please sign in again.");
  if (state.status === "problem") throw new HrAccessError("Your account doesn't have access to the HR portal. Contact HR.");
  if (state.ctx.account.mustChangePassword) throw new HrAccessError("Choose your own password first.");
  if (!allowed(state.ctx.permissions, need)) throw new HrAccessError("You don't have permission to do that.");
  return state.ctx;
}

export const HR_PROBLEM_MESSAGES: Record<Exclude<AccessProblem, null>, string> = {
  inactive: "Your HR portal account has been deactivated. If you think this is a mistake, contact the HR team.",
  "no-role": "Your HR portal account doesn't have a valid role, so you can't access any HR information yet. Contact the HR team.",
  "no-employee": "Your HR portal account isn't linked to an active employee record. Contact the HR team.",
};
