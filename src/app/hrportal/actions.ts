"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

import { getCurrentUser, hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";
import { clientIp } from "@/lib/client-ip";
import { microsoftConfig } from "@/lib/hr/microsoft-sso";
import { rateLimited } from "@/lib/rate-limit";
import {
  accessProblem,
  awaitingReliever,
  canDecideLeave,
  canGrant,
  canManageAccount,
  canManageApprovedLeave,
  createsReportingLoop,
  effectivePermissions,
  exceptWebsiteAdminOnly,
  findRole,
  has,
  holidayDates,
  isWorkingDay,
  homePath,
  relieverOptions,
  shortenLeave,
  workingDays,
} from "@/lib/hr/access";
import { mapEmployeeRows, parseCsv } from "@/lib/hr/csv-import";
import { isOccurrence } from "@/lib/hr/calendar";
import { approvalRequired, daysOverBalance } from "@/lib/hr/leave-balance";
import { describeRule, monthlyPay, payrollRules } from "@/lib/hr/payroll";
import { consumeHrToken, createHrToken, hrAudit, peekHrToken } from "@/lib/hr/data";
import { createHrSession, destroyHrSession, HrAccessError, loadHrSession, requireHrAction, type HrContext } from "@/lib/hr/session";
import {
  BUILT_IN_HR_ROLES,
  employeeName,
  STANDARD_DEPARTMENTS,
  EMPLOYMENT_TYPES,
  GENDERS,
  isEmployeeStatus,
  statusLabel,
  isHrPermission,
  type HrAccount,
  type HrCalendarEvent,
  type HrDepartment,
  type HrEmployee,
  type HrLeavePolicy,
  type PayrollRule,
  type HrSalary,
  PAYROLL_RULES_VERSION,
  type HrPayslip,
  type PayLine,
  type HrLeaveRequest,
  type HrLeaveType,
  LEAVE_COLORS,
  type HrPermission,
  isCurrentStaff,
} from "@/lib/hr/types";

export interface HrResult {
  ok: boolean;
  error?: string;
  message?: string;
  /** A one-time invite or reset link to pass on to the person. */
  link?: string;
}

const fail = (error: string): HrResult => ({ ok: false, error });
const done = (message: string, link?: string): HrResult => ({ ok: true, message, ...(link ? { link } : {}) });

/** Run an action body; access errors and unexpected failures become messages. */
async function guarded(fn: () => Promise<HrResult>): Promise<HrResult> {
  try {
    return await fn();
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof HrAccessError) return fail(err.message);
    console.error("HR portal action failed:", err);
    return fail("Something went wrong. Please try again.");
  }
}

const text = (form: FormData, key: string, max = 200) => String(form.get(key) ?? "").trim().slice(0, max);
const email = (form: FormData, key = "email") => text(form, key, 254).toLowerCase();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
const permsFrom = (form: FormData) => [...new Set(form.getAll("permissions").map(String).filter(isHrPermission))] as HrPermission[];

/** Base URL of this deployment, for links handed to staff. */
async function baseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const refresh = () => revalidatePath("/hrportal", "layout");

/* ------------------------------------------------------------------ Sign-in */

const failures = new Map<string, { count: number; until: number }>();
const locked = (key: string) => {
  const f = failures.get(key);
  return Boolean(f && f.count >= 5 && f.until > Date.now());
};
const noteFailure = (key: string) => {
  const f = failures.get(key);
  const fresh = !f || f.until < Date.now();
  failures.set(key, { count: fresh ? 1 : f.count + 1, until: Date.now() + 15 * 60_000 });
};

/** Connections with too many failed sign-ins recently (until when). */
const blockedIps = new Map<string, number>();

// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
let dummyHash: Promise<string> | null = null;

export async function hrSignInAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  try {
    const address = email(form);
    const password = String(form.get("password") ?? "").slice(0, 200);
    if (!address || !password) return fail("Enter your email and password.");
    if (locked(address)) return fail("Too many failed attempts. Try again in 15 minutes.");
    // Only failed sign-ins count against a connection, so a whole office sharing one internet
    // connection isn't locked out by colleagues signing in successfully.
    const request = new Request("http://hrportal.local/", { headers: await headers() });
    const ip = clientIp(request);
    if ((blockedIps.get(ip) ?? 0) > Date.now()) return fail("Too many failed sign-in attempts from this connection. Try again in 15 minutes.");
    const account = (await readStore("hrAccounts")).find((a) => a.email === address);
    dummyHash ??= hashPassword(randomUUID());
    const valid = await verifyPassword(password, account?.passwordHash ?? (await dummyHash));
    if (!account || !account.passwordHash || !valid) {
      noteFailure(address);
      if (await rateLimited(request, "hr-login-failed", 50, 900)) blockedIps.set(ip, Date.now() + 15 * 60_000);
      return fail("Incorrect email or password.");
    }
    failures.delete(address);
    if (!account.active) return fail("This account has been deactivated. If you think this is a mistake, contact the HR team.");

    const [employees, customRoles, departments] = await Promise.all([readStore("hrEmployees"), readStore("hrRoles"), readStore("hrDepartments")]);
    const employee = employees.find((e) => e.id === account.employeeId);
    await updateStore("hrAccounts", (items) => ({
      items: items.map((a) => (a.id === account.id ? { ...a, lastLoginAt: new Date().toISOString() } : a)),
    }));
    await createHrSession(account);
    if (accessProblem(account, customRoles, employee)) redirect("/hrportal/no-access");
    if (account.mustChangePassword) redirect("/hrportal/password?required=1");
    redirect(homePath(effectivePermissions(account, customRoles, employee, departments)));
  } catch (err) {
    unstable_rethrow(err);
    console.error("HR sign-in failed:", err);
    return fail("Sign-in couldn't be completed right now. Please try again shortly.");
  }
}

export async function hrSignOutAction() {
  await destroyHrSession();
  redirect("/hrportal");
}

/** Set a password from an invite or reset link. */
export async function hrActivateAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const token = text(form, "token", 200);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) return fail("The two passwords don't match.");
    const weak = validatePasswordStrength(password);
    if (weak) return fail(weak);
    if (!(await peekHrToken(token))) return fail("This link is invalid, has expired or was already used. Ask the HR team for a new one.");
    const passwordHash = await hashPassword(password);
    const used = await consumeHrToken(token);
    if (!used) return fail("This link is invalid, has expired or was already used. Ask the HR team for a new one.");
    const account = await updateStore("hrAccounts", (items) => {
      const found = items.find((a) => a.id === used.accountId);
      if (!found) return { items, result: null };
      const next = { ...found, passwordHash, mustChangePassword: false, sessionVersion: found.sessionVersion + 1 };
      return { items: items.map((a) => (a.id === found.id ? next : a)), result: next };
    });
    if (!account) return fail("This account no longer exists. Contact the HR team.");
    await hrAudit({ system: "HR portal" }, used.purpose === "invite" ? "activated account" : "reset password", `account ${account.email}`);
    if (!account.active) return fail("Your password is set, but this account has been deactivated. Contact the HR team.");
    await createHrSession(account);
    redirect("/hrportal");
  });
}

/**
 * First-time setup: while the portal has no accounts at all, a website administrator (signed
 * in to /admin with the Users & roles permission) creates the first HR Administrator.
 */
export async function hrBootstrapAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const cmsUser = await getCurrentUser();
    if (!cmsUser || cmsUser.mustChangePassword || !can(cmsUser, "users")) {
      return fail("Sign in to the website admin as an administrator (with Users & roles) first.");
    }
    const firstName = text(form, "firstName", 80);
    const lastName = text(form, "lastName", 80);
    const address = email(form);
    if (!firstName || !lastName) return fail("Enter the HR administrator's first and last name.");
    if (!isEmail(address)) return fail("Enter a valid email address.");
    const now = new Date().toISOString();
    const employee: HrEmployee = {
      id: randomUUID(),
      staffNumber: text(form, "staffNumber", 40),
      firstName,
      lastName,
      email: address,
      phone: "",
      jobTitle: text(form, "jobTitle", 120) || "HR Administrator",
      department: text(form, "department", 120) || "Human Resources & Administration",
      location: text(form, "location", 120),
      managerId: null,
      startDate: "",
      status: "active",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      createdAt: now,
      updatedAt: now,
    };
    const account: HrAccount = {
      id: randomUUID(),
      email: address,
      employeeId: employee.id,
      roleId: "hr_admin",
      extraPermissions: [],
      active: true,
      sessionVersion: 1,
      createdAt: now,
      createdBy: `website admin ${cmsUser.email}`,
    };
    const created = await updateStore("hrAccounts", (items) =>
      items.length > 0 ? { items, result: false } : { items: [account], result: true },
    );
    if (!created) return fail("The HR portal is already set up. HR administrators manage accounts from inside the portal.");
    await updateStore("hrEmployees", (items) => ({ items: [...items, employee] }));
    const token = await createHrToken(account.id, "invite");
    await hrAudit({ system: `website administrator ${cmsUser.email}` }, "created first HR administrator", `account ${address}`, "Role: HR Administrator");
    return done(`${firstName} ${lastName} is the first HR Administrator. Send them this one-time link (valid 7 days) to set their password.`, `${await baseUrl()}/hrportal/activate?token=${token}`);
  });
}

/**
 * Audit trail access is for the IT team only. It is granted and removed by a website
 * administrator (signed in to /admin with Users & roles), never from inside the HR portal,
 * so HR administrators can't give themselves a view of the record of their own changes.
 */
export async function setAuditAccessAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const cmsUser = await getCurrentUser();
    if (!cmsUser || cmsUser.mustChangePassword || !can(cmsUser, "users")) {
      return fail("Sign in to the website admin as an administrator (with Users & roles) first.");
    }
    const grant = text(form, "grant", 5) === "true";
    const accounts = await readStore("hrAccounts");
    const target = accounts.find((a) => a.id === text(form, "accountId", 64));
    if (!target) return fail("Choose a portal account.");
    if (grant && !target.active) return fail("That account is deactivated.");
    const hasIt = target.extraPermissions.includes("audit.view");
    if (grant === hasIt) return done("No change.");
    await changeAccount(target.id, (a) => ({
      ...a,
      extraPermissions: grant ? [...a.extraPermissions, "audit.view"] : a.extraPermissions.filter((p) => p !== "audit.view"),
    }));
    await hrAudit({ system: `website administrator ${cmsUser.email}` }, grant ? "granted audit trail access" : "removed audit trail access", `account ${target.email}`, "IT team");
    refresh();
    return done(grant ? `${target.email} can now open the audit trail (after signing in again).` : `${target.email} no longer has audit trail access.`);
  });
}

/**
 * Empty, or one or more phone numbers ("0803 123 4567 / 0706 000 1111"): each made of digits with
 * optional +, spaces, dots, dashes and brackets, 7 to 15 digits long. Rejects text like "abc".
 */
const phoneOk = (v: string) =>
  !v || v.split(/\s*(?:[/,;]|\bor\b)\s*/i).every((n) => /^[+\d(][\d\s().-]*$/.test(n.trim()) && /^\d{7,15}$/.test(n.replace(/\D/g, "")));

/* ------------------------------------------------------------------ Self-service */

export async function updateMyContactAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("self.update");
    const changes = {
      phone: text(form, "phone", 40),
      address: text(form, "address", 300),
      emergencyContactName: text(form, "emergencyContactName", 120),
      emergencyContactPhone: text(form, "emergencyContactPhone", 40),
    };
    if (!phoneOk(changes.phone) || !phoneOk(changes.emergencyContactPhone)) return fail("Enter phone numbers as digits, e.g. 0803 123 4567 or +234 803 123 4567.");
    // Always the signed-in person's own record: no employee id is taken from the form.
    await updateStore("hrEmployees", (items) => ({
      items: items.map((e) => (e.id === ctx.employee.id ? { ...e, ...changes, updatedAt: new Date().toISOString() } : e)),
    }));
    refresh();
    return done("Your contact details are saved.");
  });
}

/** The refusal shown when a request asks for more days than are left. */
function overMessage(days: number, left: number, typeName: string, startDate: string, who: "you" | "they") {
  const remaining = Math.max(0, left);
  return `That's ${days} working day${days === 1 ? "" : "s"}, but ${who === "you" ? "you have" : "they have"} only ${remaining} ${typeName} day${remaining === 1 ? "" : "s"} left in ${startDate.slice(0, 4)} (pending requests count too). Choose ${remaining ? `at most ${remaining} working day${remaining === 1 ? "" : "s"}` : "another leave type"}.`;
}

/** Validate a leave request for `employee`. Returns the details, or an error message. */
async function checkLeave(form: FormData, employee: HrEmployee, who: "you" | "they") {
  const type = text(form, "type", 64);
  const startDate = text(form, "startDate", 10);
  const endDate = text(form, "endDate", 10);
  const reason = text(form, "reason", 500);
  const relieverId = text(form, "relieverId", 64);
  const [types, policies, adjustments, leave, employees, accounts, events, departments] = await Promise.all([
    readStore("hrLeaveTypes"),
    readStore("hrLeavePolicies"),
    readStore("hrLeaveAdjustments"),
    readStore("hrLeave"),
    readStore("hrEmployees"),
    readStore("hrAccounts"),
    readStore("hrEvents"),
    readStore("hrDepartments"),
  ]);
  const leaveType = types.find((t) => t.id === type && t.active);
  if (!leaveType) return { error: "Choose a leave type." };
  if (!isDate(startDate) || !isDate(endDate) || endDate < startDate) return { error: "Enter a valid start and end date." };
  // Only working days count: weekends and public holidays (fixed ones and those on the calendar) are free.
  const days = workingDays(startDate, endDate, holidayDates(events, Number(startDate.slice(0, 4)), Number(endDate.slice(0, 4))));
  if (days < 1) return { error: "The dates chosen are all weekends or public holidays, so there are no working days to take." };
  if (days > 130) return { error: "A single request can cover at most 130 working days." };
  if (startDate.slice(0, 4) !== endDate.slice(0, 4)) return { error: "Split leave that crosses into a new year into two requests (one per year)." };
  const booked = leave.filter((l) => l.employeeId === employee.id && (l.status === "pending" || l.status === "approved"));
  if (booked.some((l) => l.startDate <= endDate && l.endDate >= startDate)) {
    return { error: `${who === "you" ? "You already have" : "They already have"} leave booked or pending in those dates.` };
  }
  // Staff asking for their own leave name a reliever (when anyone can relieve them); HR may add one.
  const options = relieverOptions(employee, employees, accounts, departments);
  const reliever = relieverId ? options.find((e) => e.id === relieverId) : undefined;
  if (relieverId && !reliever) return { error: "Choose a reliever from the list (a current colleague with a portal login)." };
  if (!relieverId && who === "you" && options.length) return { error: "Choose who will relieve you while you're away." };
  if (reliever && leave.some((l) => l.employeeId === reliever.id && (l.status === "pending" || l.status === "approved") && l.startDate <= endDate && l.endDate >= startDate)) {
    return { error: `${employeeName(reliever)} has leave booked in those dates. Choose another reliever.` };
  }
  const over = daysOverBalance(employee, { id: "", type, startDate, days }, types, policies, leave, adjustments);
  if (over > 0) return { error: overMessage(days, days - over, leaveType.name, startDate, who) };
  return {
    type,
    startDate,
    endDate,
    reason,
    days,
    typeName: leaveType.name,
    needsApproval: approvalRequired(employee, type, policies),
    reliever,
    /** Re-checks the balance against the leave list as it is at the moment of saving. */
    overAtSave: (current: HrLeaveRequest[]) => daysOverBalance(employee, { id: "", type, startDate, days }, types, policies, current, adjustments),
  };
}

export async function requestLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.request");
    // Always for the signed-in person: no employee id is taken from the form.
    const checked = await checkLeave(form, ctx.employee, "you");
    if ("error" in checked) return fail(checked.error!);
    const { type, startDate, endDate, reason, days, needsApproval, reliever } = checked;
    const now = new Date().toISOString();
    // A policy marked "approval not required" approves the request at once (or when the reliever accepts).
    const approveNow = !needsApproval && !reliever;
    const auto = approveNow ? { decidedByAccountId: "policy", decidedByName: "Approved automatically (leave policy)", decidedAt: now } : {};
    const saved = await updateStore<"hrLeave", boolean>("hrLeave", (items) => {
      // Checked again as the request is saved, so two requests sent at once can't both use the same days.
      if (checked.overAtSave(items) > 0) return { items, result: false };
      return {
        result: true,
        items: [
        {
          id: randomUUID(),
          employeeId: ctx.employee.id,
          type,
          startDate,
          endDate,
          days,
          reason,
          status: approveNow ? ("approved" as const) : ("pending" as const),
          createdAt: now,
          ...(reliever ? { relieverId: reliever.id, relieverStatus: "pending" as const } : {}),
          ...auto,
        },
        ...items,
        ],
      };
    });
    if (!saved) return fail("Your leave balance changed while you were sending this request, and it no longer fits. Check your balance and try again.");
    if (approveNow) await hrAudit(ctx, "approved leave", `leave of ${employeeName(ctx.employee)}`, `${checked.typeName}, ${startDate} to ${endDate}: approval not required by policy`);
    refresh();
    const plural = `${days} working day${days === 1 ? "" : "s"}`;
    if (approveNow) return done(`${checked.typeName} approved: ${plural}. This leave type doesn't need approval.`);
    return done(
      reliever
        ? `Leave request sent: ${plural}. ${employeeName(reliever)} has been asked to confirm they'll relieve you; ${needsApproval ? "your approver can approve it once they accept" : "it's approved as soon as they accept"}.`
        : `Leave request sent: ${plural}.`,
    );
  });
}

/** HR records a leave application for an employee (e.g. from a paper form). Never for themselves. */
export async function recordLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.manage");
    const employeeId = text(form, "employeeId", 64);
    if (employeeId === ctx.employee.id) return fail("Request your own leave from My record, so someone else approves it.");
    const employee = (await readStore("hrEmployees")).find((e) => e.id === employeeId && isCurrentStaff(e));
    if (!employee) return fail("Choose an active employee.");
    const checked = await checkLeave(form, employee, "they");
    if ("error" in checked) return fail(checked.error!);
    const { type, startDate, endDate, reason, days } = checked;
    const approved = text(form, "status", 10) === "approved";
    const now = new Date().toISOString();
    const saved = await updateStore<"hrLeave", boolean>("hrLeave", (items) => {
      if (checked.overAtSave(items) > 0) return { items, result: false };
      return {
        result: true,
        items: [
        {
          id: randomUUID(),
          employeeId,
          type,
          startDate,
          endDate,
          days,
          reason,
          status: approved ? ("approved" as const) : ("pending" as const),
          createdAt: now,
          // On an approved paper form the reliever has already signed; otherwise they confirm in the portal.
          ...(checked.reliever ? { relieverId: checked.reliever.id, relieverStatus: approved ? ("accepted" as const) : ("pending" as const), ...(approved ? { relieverRespondedAt: now, relieverNote: "Recorded by HR" } : {}) } : {}),
          ...(approved ? { decidedByAccountId: ctx.account.id, decidedByName: ctx.displayName, decidedAt: now, decisionNote: "Recorded by HR" } : {}),
        },
        ...items,
        ],
      };
    });
    if (!saved) return fail("Their leave balance changed while this was being saved, and it no longer fits. Check their balance and try again.");
    await hrAudit(ctx, approved ? "recorded approved leave" : "recorded leave application", `leave of ${employeeName(employee)}`, `${checked.typeName}, ${startDate} to ${endDate} (${days} days)`);
    refresh();
    return done(`${checked.typeName} recorded for ${employeeName(employee)} (${days} working day${days === 1 ? "" : "s"}, ${approved ? "approved" : "pending"}).`);
  });
}

const lagosToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());

/**
 * The person cancels their own request: a pending one, or an approved one that hasn't started yet
 * (every day goes back to their balance and the reliever is released). No approval is needed.
 */
export async function cancelMyLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.request");
    const id = text(form, "leaveId", 64);
    const reason = text(form, "note", 300);
    const today = lagosToday();
    const now = new Date().toISOString();
    const cancelled = await updateStore<"hrLeave", HrLeaveRequest | null>("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      // Only the person's own requests: pending, or approved and not started.
      if (!found || found.employeeId !== ctx.employee.id) return { items, result: null };
      if (!(found.status === "pending" || (found.status === "approved" && found.startDate > today))) return { items, result: null };
      const next = { ...found, status: "cancelled" as const, cancelledAt: now, cancelledByName: ctx.displayName, cancelReason: reason, returnRequest: undefined };
      return { items: items.map((l) => (l.id === id ? next : l)), result: found };
    });
    if (!cancelled) return fail("That leave can't be cancelled (it may have started already). Ask your manager or HR if your plans have changed.");
    if (cancelled.status === "approved") {
      await hrAudit(ctx, "cancelled approved leave", `leave of ${employeeName(ctx.employee)}`, `${cancelled.startDate} to ${cancelled.endDate} (${cancelled.days} days returned)${reason ? `. Reason: ${reason}` : ""}`);
    }
    refresh();
    return done(cancelled.status === "approved" ? `Leave cancelled. ${cancelled.days} day${cancelled.days === 1 ? " is" : "s are"} back in your balance.` : "Request cancelled.");
  });
}

/** While on approved leave, the person says they came back early. Their approver confirms the date. */
export async function requestEarlyReturnAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.request");
    const id = text(form, "leaveId", 64);
    const resumeDate = text(form, "resumeDate", 10);
    const reason = text(form, "reason", 300);
    const today = lagosToday();
    if (!isDate(resumeDate)) return fail("Enter the date you were back at work.");
    if (resumeDate > today) return fail("Record your return once you're back (the date can't be in the future).");
    const saved = await updateStore<"hrLeave", HrLeaveRequest | "dates" | null>("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      if (!found || found.employeeId !== ctx.employee.id || found.status !== "approved" || found.startDate > today) return { items, result: null };
      if (resumeDate <= found.startDate || resumeDate > found.endDate) return { items, result: "dates" as const };
      const next = { ...found, returnRequest: { resumeDate, reason, at: new Date().toISOString() } };
      return { items: items.map((l) => (l.id === id ? next : l)), result: next };
    });
    if (saved === "dates") return fail("The date you were back must be after your leave started and no later than its last day.");
    if (!saved) return fail("You can only record an early return on your own approved leave that has started.");
    await hrAudit(ctx, "reported early return", `leave of ${employeeName(ctx.employee)}`, `Back on ${resumeDate} (leave was until ${saved.endDate})${reason ? `. ${reason}` : ""}`);
    refresh();
    return done("Thanks. Your approver will confirm the date, and the unused days will go back to your balance.");
  });
}

/** Apply a return or recall: the leave ends the day before `resumeDate`, and unused days go back. */
function endEarly(l: HrLeaveRequest, resumeDate: string, kind: "returned" | "recalled", reason: string, byName: string, holidays: ReadonlySet<string>): HrLeaveRequest {
  const now = new Date().toISOString();
  const endedEarly = { kind, resumeDate, reason, byName, at: now };
  const shorter = shortenLeave(l, resumeDate, holidays);
  if (!shorter) return { ...l, status: "cancelled", cancelledAt: now, cancelledByName: byName, cancelReason: reason, endedEarly, returnRequest: undefined };
  return { ...l, originalEndDate: l.originalEndDate ?? l.endDate, originalDays: l.originalDays ?? l.days, endDate: shorter.endDate, days: shorter.days, endedEarly, returnRequest: undefined };
}

/** The approver (or HR) confirms or declines a reported early return. */
export async function confirmEarlyReturnAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction(["team.leave.approve", "leave.manage"]);
    const id = text(form, "leaveId", 64);
    const answer = text(form, "answer", 10);
    const note = text(form, "note", 300);
    if (answer !== "confirm" && answer !== "decline") return fail("Choose confirm or decline.");
    const [employees, events] = await Promise.all([readStore("hrEmployees"), readStore("hrEvents")]);
    const updated = await updateStore<"hrLeave", HrLeaveRequest | null>("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      if (!found?.returnRequest || !canManageApprovedLeave(ctx.actor, found, employees, ctx.departments)) return { items, result: null };
      const next = answer === "confirm" ? endEarly(found, found.returnRequest.resumeDate, "returned", found.returnRequest.reason, ctx.displayName, holidayDates(events, Number(found.startDate.slice(0, 4)), Number(found.endDate.slice(0, 4)))) : { ...found, returnRequest: undefined };
      return { items: items.map((l) => (l.id === id ? next : l)), result: next };
    });
    if (!updated) return fail("You can't confirm this return (it may already be handled, be your own, or be outside your team).");
    const who = employeeName(employees.find((e) => e.id === updated.employeeId));
    if (answer === "confirm") {
      await hrAudit(ctx, "confirmed early return", `leave of ${who}`, `Back on ${updated.endedEarly?.resumeDate}; ${updated.originalDays !== undefined ? `${updated.originalDays - updated.days} day(s) returned` : "leave cancelled"}`);
    } else {
      await hrAudit(ctx, "declined early return", `leave of ${who}`, note || "No reason given");
    }
    refresh();
    return done(answer === "confirm" ? `Early return confirmed. ${who}'s unused days are back in their balance.` : `Early return declined; ${who}'s leave stays as approved.`);
  });
}

/** The approver or HR calls someone back from approved leave (before or during it), with a reason. */
export async function recallLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction(["team.leave.approve", "leave.manage"]);
    const id = text(form, "leaveId", 64);
    const resumeDate = text(form, "resumeDate", 10);
    const reason = text(form, "reason", 300);
    const today = lagosToday();
    if (!isDate(resumeDate)) return fail("Enter the date they should be back at work.");
    if (!reason) return fail("Give the reason for the recall (it's kept on their record).");
    if (resumeDate < today) return fail("The return date can't be in the past.");
    const [employees, events] = await Promise.all([readStore("hrEmployees"), readStore("hrEvents")]);
    const updated = await updateStore<"hrLeave", HrLeaveRequest | "dates" | null>("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      if (!found || !canManageApprovedLeave(ctx.actor, found, employees, ctx.departments) || found.endDate < today) return { items, result: null };
      if (resumeDate > found.endDate) return { items, result: "dates" as const };
      const next = endEarly(found, resumeDate, "recalled", reason, ctx.displayName, holidayDates(events, Number(found.startDate.slice(0, 4)), Number(found.endDate.slice(0, 4))));
      return { items: items.map((l) => (l.id === id ? next : l)), result: next };
    });
    if (updated === "dates") return fail("The return date is after the leave ends, so there's nothing to recall.");
    if (!updated) return fail("You can't recall this leave (it may have ended, be your own, or be outside your team).");
    const who = employeeName(employees.find((e) => e.id === updated.employeeId));
    const returned = updated.status === "cancelled" ? updated.days : (updated.originalDays ?? updated.days) - updated.days;
    await hrAudit(ctx, "recalled from leave", `leave of ${who}`, `Back on ${resumeDate}. ${returned} day(s) returned. Reason: ${reason}`);
    refresh();
    return done(
      updated.status === "cancelled"
        ? `${who}'s leave is called off before it started; all ${updated.days} day${updated.days === 1 ? "" : "s"} are back in their balance.`
        : `${who} is recalled from ${resumeDate}. Their leave now ends on ${updated.endDate}, and ${returned} unused day${returned === 1 ? "" : "s"} are back in their balance.`,
    );
  });
}

/** The named reliever accepts or declines covering a colleague's leave. Only the reliever can answer. */
export async function respondReliefAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("self.view");
    const id = text(form, "leaveId", 64);
    const answer = text(form, "answer", 10);
    const note = text(form, "note", 300);
    if (answer !== "accept" && answer !== "decline") return fail("Choose accept or decline.");
    const [employees, policies, types, adjustments] = await Promise.all([readStore("hrEmployees"), readStore("hrLeavePolicies"), readStore("hrLeaveTypes"), readStore("hrLeaveAdjustments")]);
    const now = new Date().toISOString();
    const updated = await updateStore("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      // Always the signed-in person as reliever: nobody can answer for someone else.
      if (!found || found.relieverId !== ctx.employee.id || found.status !== "pending" || found.relieverStatus !== "pending") return { items, result: null };
      const requester = employees.find((e) => e.id === found.employeeId);
      // Approved straight away only if no approval is needed and it still fits the balance; otherwise it waits for an approver.
      const autoApprove =
        answer === "accept" && requester !== undefined && !approvalRequired(requester, found.type, policies) && daysOverBalance(requester, found, types, policies, items, adjustments) === 0;
      const next = {
        ...found,
        relieverStatus: answer === "accept" ? ("accepted" as const) : ("declined" as const),
        relieverRespondedAt: now,
        relieverNote: note,
        ...(autoApprove ? { status: "approved" as const, decidedByAccountId: "policy", decidedByName: "Approved automatically (leave policy)", decidedAt: now } : {}),
      };
      return { items: items.map((l) => (l.id === id ? next : l)), result: next };
    });
    if (!updated) return fail("This relief request can't be answered (it may have been withdrawn, changed or already decided).");
    const who = employeeName(employees.find((e) => e.id === updated.employeeId));
    await hrAudit(ctx, answer === "accept" ? "accepted relief" : "declined relief", `leave of ${who}`, `${updated.startDate} to ${updated.endDate}${note ? `. Note: ${note}` : ""}`);
    if (updated.status === "approved") await hrAudit(ctx, "approved leave", `leave of ${who}`, "Approval not required by policy; approved when the reliever accepted");
    refresh();
    return done(answer === "accept" ? `You've agreed to relieve ${who}.` : `You've declined. ${who} will be asked to choose someone else.`);
  });
}

/** The person on leave names a different reliever (e.g. after a decline), while the request is pending. */
export async function changeRelieverAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.request");
    const id = text(form, "leaveId", 64);
    const relieverId = text(form, "relieverId", 64);
    const [leave, employees, accounts] = await Promise.all([readStore("hrLeave"), readStore("hrEmployees"), readStore("hrAccounts")]);
    const request = leave.find((l) => l.id === id);
    // Only the person's own, still-pending requests.
    if (!request || request.employeeId !== ctx.employee.id || request.status !== "pending") return fail("That request can't be changed.");
    const reliever = relieverOptions(ctx.employee, employees, accounts, ctx.departments).find((e) => e.id === relieverId);
    if (!reliever) return fail("Choose a reliever from the list.");
    if (reliever.id === request.relieverId && request.relieverStatus !== "declined") return done("No change.");
    if (leave.some((l) => l.employeeId === reliever.id && (l.status === "pending" || l.status === "approved") && l.startDate <= request.endDate && l.endDate >= request.startDate)) {
      return fail(`${employeeName(reliever)} has leave booked in those dates. Choose another reliever.`);
    }
    await updateStore("hrLeave", (items) => ({
      items: items.map((l) =>
        l.id === id && l.employeeId === ctx.employee.id && l.status === "pending"
          ? { ...l, relieverId: reliever.id, relieverStatus: "pending" as const, relieverRespondedAt: undefined, relieverNote: undefined }
          : l,
      ),
    }));
    await hrAudit(ctx, "changed reliever", `leave of ${employeeName(ctx.employee)}`, `${request.startDate} to ${request.endDate}: ${employeeName(reliever)}`);
    refresh();
    return done(`${employeeName(reliever)} has been asked to confirm they'll relieve you.`);
  });
}

/* ------------------------------------------------------------------ Leave decisions */

export async function decideLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction(["team.leave.approve", "leave.manage"]);
    const id = text(form, "leaveId", 64);
    const decision = text(form, "decision", 10);
    const note = text(form, "note", 500);
    if (decision !== "approve" && decision !== "reject") return fail("Choose approve or reject.");
    const [employees, types, policies, adjustments] = await Promise.all([readStore("hrEmployees"), readStore("hrLeaveTypes"), readStore("hrLeavePolicies"), readStore("hrLeaveAdjustments")]);
    let over = 0;
    const decided = await updateStore<"hrLeave", HrLeaveRequest | "reliever" | "over" | null>("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      if (!found || !canDecideLeave(ctx.actor, found, employees, ctx.departments)) return { items, result: null };
      if (decision === "approve" && awaitingReliever(found)) return { items, result: "reliever" as const };
      // The balance is checked again at approval: a policy or adjustment may have changed since the request.
      const requester = employees.find((e) => e.id === found.employeeId);
      over = decision === "approve" && requester ? daysOverBalance(requester, found, types, policies, items, adjustments) : 0;
      if (over > 0) return { items, result: "over" as const };
      const next = {
        ...found,
        status: decision === "approve" ? ("approved" as const) : ("rejected" as const),
        decidedByAccountId: ctx.account.id,
        decidedByName: ctx.displayName,
        decidedAt: new Date().toISOString(),
        decisionNote: note,
      };
      return { items: items.map((l) => (l.id === id ? next : l)), result: next };
    });
    if (decided === "reliever") return fail("The reliever hasn't accepted yet, so this can't be approved. You can still reject it.");
    if (decided === "over") return fail(`This request is ${over} working day${over === 1 ? "" : "s"} more than the leave they have left, so it can't be approved. Reject it, or ask HR to check their allowance.`);
    if (!decided) return fail("You can't decide this request (it may already be decided, be your own, or be outside your team).");
    const who = employeeName(employees.find((e) => e.id === decided.employeeId));
    await hrAudit(ctx, `${decided.status} leave`, `leave of ${who}`, `${decided.type}, ${decided.startDate} to ${decided.endDate} (${decided.days} days)${note ? `. Note: ${note}` : ""}`);
    refresh();
    return done(`Leave ${decided.status} for ${who}.`);
  });
}

/* ------------------------------------------------------------------ Employee records */

function employeeFields(form: FormData, departments: HrDepartment[]) {
  const departmentId = text(form, "departmentId", 64);
  const dept = departments.find((d) => d.id === departmentId && d.active);
  return {
    staffNumber: text(form, "staffNumber", 40),
    firstName: text(form, "firstName", 80),
    lastName: text(form, "lastName", 80),
    email: email(form),
    phone: text(form, "phone", 40),
    jobTitle: text(form, "jobTitle", 120),
    // A department from the list; before HR sets up departments, free text is accepted.
    department: dept ? dept.name : departmentId ? "" : text(form, "department", 120),
    departmentId: dept?.id,
    location: text(form, "location", 120),
    managerId: text(form, "managerId", 64) || null,
    startDate: text(form, "startDate", 10),
    dateOfBirth: text(form, "dateOfBirth", 10),
    gender: (GENDERS as readonly string[]).includes(text(form, "gender", 30)) ? text(form, "gender", 30) : "",
    employmentType: (EMPLOYMENT_TYPES as readonly string[]).includes(text(form, "employmentType", 40)) ? text(form, "employmentType", 40) : "",
  };
}

function checkEmployee(fields: ReturnType<typeof employeeFields>, employees: HrEmployee[], selfId: string | null, form?: FormData): string | null {
  if (!fields.firstName || !fields.lastName) return "Enter a first and last name.";
  if (!phoneOk(fields.phone)) return "Enter phone numbers as digits, e.g. 0803 123 4567 or +234 803 123 4567.";
  if (form && text(form, "departmentId", 64) && !fields.departmentId) return "Choose an active department.";
  if (fields.email && !isEmail(fields.email)) return "Enter a valid work email, or leave it blank.";
  if (fields.email && employees.some((e) => e.email === fields.email && e.id !== selfId)) return "Another employee already has that email.";
  if (fields.startDate && !isDate(fields.startDate)) return "Enter a valid start date.";
  if (fields.dateOfBirth && (!isDate(fields.dateOfBirth) || fields.dateOfBirth > new Date().toISOString().slice(0, 10))) return "Enter a valid date of birth.";
  if (fields.managerId) {
    const manager = employees.find((e) => e.id === fields.managerId);
    if (!manager || !isCurrentStaff(manager)) return "Choose an active employee as the line manager.";
    if (selfId && createsReportingLoop(selfId, fields.managerId, employees)) return "That would create a reporting loop (someone can't report to a person who reports to them).";
  }
  return null;
}

export async function createEmployeeAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const [employees, departments] = await Promise.all([readStore("hrEmployees"), readStore("hrDepartments")]);
    const fields = employeeFields(form, departments);
    const problem = checkEmployee(fields, employees, null, form);
    if (problem) return fail(problem);
    const now = new Date().toISOString();
    const employee: HrEmployee = {
      id: randomUUID(),
      ...fields,
      status: "active",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      createdAt: now,
      updatedAt: now,
    };
    await updateStore("hrEmployees", (items) => ({ items: [...items, employee] }));
    const manager = employees.find((e) => e.id === employee.managerId);
    await hrAudit(ctx, "created employee record", employeeName(employee), manager ? `Reports to ${employeeName(manager)}` : "No line manager");
    refresh();
    return done(`${employeeName(employee)} added.`);
  });
}

export async function updateEmployeeAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const id = text(form, "employeeId", 64);
    if (id === ctx.employee.id) return fail("You can't edit your own HR record here. Ask another HR colleague, or update your contact details under My record.");
    const employees = await readStore("hrEmployees");
    const current = employees.find((e) => e.id === id);
    if (!current) return fail("Employee not found.");
    const fields = employeeFields(form, await readStore("hrDepartments"));
    const rawStatus = text(form, "status", 12);
    const status = isEmployeeStatus(rawStatus) ? rawStatus : current.status;
    const problem = checkEmployee(fields, employees, id, form);
    if (problem) return fail(problem);
    const next: HrEmployee = { ...current, ...fields, status, updatedAt: new Date().toISOString() };
    await updateStore("hrEmployees", (items) => ({ items: items.map((e) => (e.id === id ? next : e)) }));

    const name = (eid: string | null) => (eid ? employeeName(employees.find((e) => e.id === eid)) : "nobody");
    const other = (Object.keys(fields) as (keyof typeof fields)[]).filter(
      (k) => k !== "managerId" && String(current[k] ?? "") !== String(next[k] ?? ""),
    );
    if (current.managerId !== next.managerId) {
      await hrAudit(ctx, "changed reporting line", employeeName(next), `Line manager: ${name(current.managerId)} → ${name(next.managerId)}`);
    }
    if (current.status !== next.status) {
      await hrAudit(ctx, "changed employee status", employeeName(next), `${statusLabel(current.status)} → ${statusLabel(next.status)}. Portal access is only for active and probation staff.`);
    }
    if (other.length) await hrAudit(ctx, "updated employee record", employeeName(next), `Changed: ${other.join(", ")}`);
    refresh();
    return done(`${employeeName(next)} saved.`);
  });
}

/* ------------------------------------------------------------------ Portal accounts */

async function loadAccountTarget(ctx: HrContext, accountId: string) {
  const target = (await readStore("hrAccounts")).find((a) => a.id === accountId);
  if (!target) throw new HrAccessError("Account not found.");
  if (!canManageAccount(ctx.actor, target)) throw new HrAccessError("You can't change your own account. Ask another HR administrator.");
  return target;
}

/** Apply a change to one account and end its sessions (access is re-checked at next sign-in). */
async function changeAccount(accountId: string, change: (a: HrAccount) => HrAccount) {
  return updateStore("hrAccounts", (items) => {
    const found = items.find((a) => a.id === accountId);
    if (!found) return { items, result: null };
    const next = { ...change(found), sessionVersion: found.sessionVersion + 1 };
    return { items: items.map((a) => (a.id === accountId ? next : a)), result: next };
  });
}

const permList = (perms: readonly HrPermission[]) => (perms.length ? perms.join(", ") : "none");

export async function createAccountAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("accounts.manage");
    const employeeId = text(form, "employeeId", 64);
    const roleId = text(form, "roleId", 64);
    const extra = permsFrom(form);
    const [accounts, employees, customRoles] = await Promise.all([readStore("hrAccounts"), readStore("hrEmployees"), readStore("hrRoles")]);
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee || !isCurrentStaff(employee)) return fail("Choose an active employee to link the account to.");
    if (accounts.some((a) => a.employeeId === employeeId)) return fail(`${employeeName(employee)} already has a portal account.`);
    const address = email(form) || employee.email;
    if (!isEmail(address)) return fail("Enter the email they'll sign in with (or add a work email to their employee record).");
    if (accounts.some((a) => a.email === address)) return fail("Another account already uses that email.");
    const role = findRole(roleId, customRoles);
    if (!role) return fail("Choose a role.");
    if (extra.length && !has(ctx.permissions, "roles.manage")) return fail("Giving extra permissions needs the Configure roles & permissions permission.");
    if (!canGrant(ctx.actor, [...role.permissions, ...extra])) return fail("You can't give access you don't have yourself.");
    const account: HrAccount = {
      id: randomUUID(),
      email: address,
      employeeId,
      roleId,
      extraPermissions: extra,
      active: true,
      sessionVersion: 1,
      createdAt: new Date().toISOString(),
      createdBy: ctx.account.email,
    };
    const created = await updateStore("hrAccounts", (items) =>
      items.some((a) => a.employeeId === employeeId || a.email === address) ? { items, result: false } : { items: [...items, account], result: true },
    );
    if (!created) return fail("An account for that employee or email was just created.");
    const token = await createHrToken(account.id, "invite");
    await hrAudit(ctx, "created account", `account ${address}`, `Linked to ${employeeName(employee)}. Role: ${role.name}. Extra permissions: ${permList(extra)}`);
    refresh();
    const viaMicrosoft = microsoftConfig() ? ` Or they can simply use "Sign in with Microsoft" with ${address}: no password needed.` : "";
    return done(`Account created for ${employeeName(employee)}. Send them this one-time link (valid 7 days) to set their password.${viaMicrosoft}`, `${await baseUrl()}/hrportal/activate?token=${token}`);
  });
}

export async function setAccountRoleAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("accounts.manage");
    const target = await loadAccountTarget(ctx, text(form, "accountId", 64));
    const customRoles = await readStore("hrRoles");
    const role = findRole(text(form, "roleId", 64), customRoles);
    if (!role) return fail("Choose a role.");
    if (role.id === target.roleId) return done("No change.");
    // IT audit access (granted by a website administrator) stays as it is and doesn't block a role change.
    if (!canGrant(ctx.actor, [...role.permissions, ...exceptWebsiteAdminOnly(target.extraPermissions)])) return fail("You can't give access you don't have yourself.");
    const before = findRole(target.roleId, customRoles)?.name ?? `missing role "${target.roleId}"`;
    await changeAccount(target.id, (a) => ({ ...a, roleId: role.id }));
    await hrAudit(ctx, "changed role", `account ${target.email}`, `${before} → ${role.name}`);
    refresh();
    return done(`Role changed to ${role.name}. Their current sessions have ended.`);
  });
}

export async function setExtraPermissionsAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction(["accounts.manage"]);
    if (!has(ctx.permissions, "roles.manage")) return fail("Changing permissions needs the Configure roles & permissions permission.");
    const target = await loadAccountTarget(ctx, text(form, "accountId", 64));
    // Permissions the editor doesn't hold (e.g. IT-only audit access) show as locked boxes and stay as they are.
    const locked = target.extraPermissions.filter((p) => !has(ctx.permissions, p));
    const extra = [...new Set([...permsFrom(form), ...locked])];
    const added = extra.filter((p) => !target.extraPermissions.includes(p));
    const removed = target.extraPermissions.filter((p) => !extra.includes(p));
    if (!added.length && !removed.length) return done("No change.");
    if (!canGrant(ctx.actor, added)) return fail("You can't give permissions you don't have yourself.");
    if (!canGrant(ctx.actor, removed)) return fail("You can't remove permissions you don't have yourself.");
    await changeAccount(target.id, (a) => ({ ...a, extraPermissions: extra }));
    await hrAudit(ctx, "changed extra permissions", `account ${target.email}`, `Added: ${permList(added)}. Removed: ${permList(removed)}.`);
    refresh();
    return done("Permissions saved. Their current sessions have ended.");
  });
}

export async function setAccountActiveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("accounts.manage");
    const target = await loadAccountTarget(ctx, text(form, "accountId", 64));
    const active = text(form, "active", 5) === "true";
    if (active === target.active) return done("No change.");
    if (active) {
      const role = findRole(target.roleId, await readStore("hrRoles"));
      if (role && !canGrant(ctx.actor, [...role.permissions, ...exceptWebsiteAdminOnly(target.extraPermissions)])) return fail("You can't reactivate an account with more access than you have.");
    }
    await changeAccount(target.id, (a) => ({ ...a, active, deactivatedAt: active ? undefined : new Date().toISOString() }));
    if (!active) {
      // Unused invite or reset links stop working too.
      await updateStore("hrTokens", (items) => ({ items: items.filter((t) => t.accountId !== target.id || t.usedAt) }));
    }
    await hrAudit(ctx, active ? "reactivated account" : "deactivated account", `account ${target.email}`);
    refresh();
    return done(active ? "Account reactivated." : "Account deactivated. They've been signed out everywhere.");
  });
}

export async function issueResetLinkAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("accounts.manage");
    const target = await loadAccountTarget(ctx, text(form, "accountId", 64));
    if (!target.active) return fail("Reactivate the account first.");
    const purpose = target.passwordHash ? "reset" : "invite";
    const token = await createHrToken(target.id, purpose);
    await hrAudit(ctx, purpose === "reset" ? "issued password reset link" : "issued new invite link", `account ${target.email}`);
    return done(
      `Send ${target.email} this one-time link (valid ${purpose === "reset" ? "24 hours" : "7 days"}). Earlier links for this account no longer work.`,
      `${await baseUrl()}/hrportal/activate?token=${token}`,
    );
  });
}

export async function relinkAccountAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("accounts.manage");
    const target = await loadAccountTarget(ctx, text(form, "accountId", 64));
    const employeeId = text(form, "employeeId", 64);
    if (employeeId === target.employeeId) return done("No change.");
    const [accounts, employees] = await Promise.all([readStore("hrAccounts"), readStore("hrEmployees")]);
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee || !isCurrentStaff(employee)) return fail("Choose an active employee.");
    if (employeeId === ctx.employee.id) return fail("That's your own employee record.");
    if (accounts.some((a) => a.employeeId === employeeId)) return fail(`${employeeName(employee)} already has a portal account.`);
    const before = employeeName(employees.find((e) => e.id === target.employeeId));
    await changeAccount(target.id, (a) => ({ ...a, employeeId }));
    await hrAudit(ctx, "changed linked employee", `account ${target.email}`, `${before} → ${employeeName(employee)}`);
    refresh();
    return done(`Account now linked to ${employeeName(employee)}.`);
  });
}

/* ------------------------------------------------------------------ Roles */

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);

export async function saveRoleAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("roles.manage");
    const existingId = text(form, "roleId", 64);
    const name = text(form, "name", 60);
    const description = text(form, "description", 200);
    const permissions = permsFrom(form);
    if (!name) return fail("Give the role a name.");
    if (!permissions.length) return fail("Choose at least one permission.");
    if (BUILT_IN_HR_ROLES.some((r) => r.id === existingId)) return fail("Built-in roles can't be changed. Create a custom role instead.");
    const customRoles = await readStore("hrRoles");
    const current = existingId ? customRoles.find((r) => r.id === existingId) : undefined;
    if (existingId && !current) return fail("Role not found.");
    const added = permissions.filter((p) => !current?.permissions.includes(p));
    if (!canGrant(ctx.actor, added)) return fail("You can't give a role permissions you don't have yourself.");
    // Nobody may widen a role they hold themselves.
    if (current && ctx.account.roleId === current.id && added.length) return fail("You can't add permissions to your own role. Ask another HR administrator.");
    const id = current?.id ?? `custom_${slug(name) || "role"}_${randomUUID().slice(0, 6)}`;
    const role = { id, name, description, permissions };
    await updateStore("hrRoles", (items) => ({ items: current ? items.map((r) => (r.id === id ? role : r)) : [...items, role] }));
    if (current) {
      // End sessions of everyone holding the role so the new permissions apply at once.
      await updateStore("hrAccounts", (items) => ({ items: items.map((a) => (a.roleId === id ? { ...a, sessionVersion: a.sessionVersion + 1 } : a)) }));
      const removed = current.permissions.filter((p) => !permissions.includes(p));
      await hrAudit(ctx, "changed role permissions", `role ${name}`, `Added: ${permList(added)}. Removed: ${permList(removed)}.`);
    } else {
      await hrAudit(ctx, "created role", `role ${name}`, `Permissions: ${permList(permissions)}`);
    }
    refresh();
    return done(current ? `${name} saved. Everyone with this role has been signed out so the change applies.` : `${name} created.`);
  });
}

export async function deleteRoleAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("roles.manage");
    const id = text(form, "roleId", 64);
    if (BUILT_IN_HR_ROLES.some((r) => r.id === id)) return fail("Built-in roles can't be deleted.");
    const [customRoles, accounts] = await Promise.all([readStore("hrRoles"), readStore("hrAccounts")]);
    const role = customRoles.find((r) => r.id === id);
    if (!role) return fail("Role not found.");
    const users = accounts.filter((a) => a.roleId === id).length;
    if (users) return fail(`${users} account${users === 1 ? " uses" : "s use"} this role. Give them another role first.`);
    await updateStore("hrRoles", (items) => ({ items: items.filter((r) => r.id !== id) }));
    await hrAudit(ctx, "deleted role", `role ${role.name}`);
    refresh();
    return done(`${role.name} deleted.`);
  });
}

/* ------------------------------------------------------------------ Departments */

const deptSlug = (name: string) => `dept_${slug(name) || "department"}`;

export async function saveDepartmentAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const existingId = text(form, "departmentId", 64);
    const name = text(form, "name", 80);
    const description = text(form, "description", 300);
    const headEmployeeId = text(form, "headEmployeeId", 64) || null;
    const approverIds = [...new Set(form.getAll("approverIds").map(String))].filter((id) => id && id !== headEmployeeId).slice(0, 10);
    const active = existingId ? text(form, "active", 5) !== "false" : true;
    if (!name) return fail("Give the department a name.");
    const [departments, employees] = await Promise.all([readStore("hrDepartments"), readStore("hrEmployees")]);
    const current = existingId ? departments.find((d) => d.id === existingId) : undefined;
    if (existingId && !current) return fail("Department not found.");
    if (departments.some((d) => d.name.toLowerCase() === name.toLowerCase() && d.id !== existingId)) return fail("There is already a department with that name.");
    const activeIds = new Set(employees.filter((e) => isCurrentStaff(e)).map((e) => e.id));
    if (headEmployeeId && !activeIds.has(headEmployeeId)) return fail("Choose an active employee as head of department.");
    if (approverIds.some((id) => !activeIds.has(id))) return fail("Approvers must be active employees.");
    const now = new Date().toISOString();
    const dept: HrDepartment = {
      id: current?.id ?? deptSlug(name) + (departments.some((d) => d.id === deptSlug(name)) ? `_${randomUUID().slice(0, 6)}` : ""),
      name,
      description,
      headEmployeeId,
      approverIds,
      active,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };
    await updateStore("hrDepartments", (items) => ({ items: current ? items.map((d) => (d.id === dept.id ? dept : d)) : [...items, dept] }));
    if (current && current.name !== name) {
      await updateStore("hrEmployees", (items) => ({ items: items.map((e) => (e.departmentId === dept.id ? { ...e, department: name } : e)) }));
    }
    const who = (id: string | null) => (id ? employeeName(employees.find((e) => e.id === id)) : "nobody");
    const list = (ids: string[]) => (ids.length ? ids.map(who).join(", ") : "none");
    if (!current) {
      await hrAudit(ctx, "created department", `department ${name}`, `Head: ${who(headEmployeeId)}. Approvers: ${list(approverIds)}`);
    } else {
      const changes = [
        current.name !== name ? `Name: ${current.name} → ${name}` : "",
        current.headEmployeeId !== headEmployeeId ? `Head: ${who(current.headEmployeeId)} → ${who(headEmployeeId)}` : "",
        current.approverIds.join() !== approverIds.join() ? `Approvers: ${list(current.approverIds)} → ${list(approverIds)}` : "",
        current.active !== active ? (active ? "Reopened" : "Closed") : "",
      ].filter(Boolean);
      if (changes.length) await hrAudit(ctx, "changed department", `department ${name}`, changes.join(". "));
    }
    refresh();
    return done(current ? `${name} saved.` : `${name} created.`);
  });
}

/** Add LHI's standard departments that don't exist yet, and link staff already recorded under those names. */
/** Delete a department nobody is in. Departments with staff or leave policies must be emptied first. */
export async function deleteDepartmentAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const id = text(form, "departmentId", 64);
    const [departments, employees, policies] = await Promise.all([readStore("hrDepartments"), readStore("hrEmployees"), readStore("hrLeavePolicies")]);
    const dept = departments.find((d) => d.id === id);
    if (!dept) return fail("Department not found.");
    const staff = employees.filter((e) => e.departmentId === id && isCurrentStaff(e));
    if (staff.length) return fail(`Move its ${staff.length} staff member${staff.length === 1 ? "" : "s"} to another department first.`);
    const scoped = policies.filter((p) => p.scope === "department" && p.scopeValue === id);
    if (scoped.length) return fail(`Change or remove the leave polic${scoped.length === 1 ? "y" : "ies"} for this department first (${scoped.map((p) => p.name).join(", ")}).`);
    await updateStore("hrDepartments", (items) => ({ items: items.filter((d) => d.id !== id) }));
    // Former staff keep the department's name on their record, without the link.
    await updateStore("hrEmployees", (items) => ({ items: items.map((e) => (e.departmentId === id ? { ...e, departmentId: undefined } : e)) }));
    await hrAudit(ctx, "deleted department", dept.name);
    refresh();
    return done(`${dept.name} deleted.`);
  });
}

export async function addStandardDepartmentsAction(): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const now = new Date().toISOString();
    const added = await updateStore("hrDepartments", (items) => {
      const missing = STANDARD_DEPARTMENTS.filter((n) => !items.some((d) => d.name.toLowerCase() === n.toLowerCase()));
      const fresh = missing.map((name) => ({ id: deptSlug(name), name, description: "", headEmployeeId: null, approverIds: [], active: true, createdAt: now, updatedAt: now }));
      return { items: [...items, ...fresh], result: fresh.map((d) => d.name) };
    });
    const departments = await readStore("hrDepartments");
    await updateStore("hrEmployees", (items) => ({
      items: items.map((e) => {
        if (e.departmentId || !e.department) return e;
        const match = departments.find((d) => d.name.toLowerCase() === e.department.toLowerCase());
        return match ? { ...e, departmentId: match.id, department: match.name } : e;
      }),
    }));
    if (added?.length) await hrAudit(ctx, "created departments", "departments", added.join(", "));
    refresh();
    return done(added?.length ? `Added ${added.length} department${added.length === 1 ? "" : "s"}.` : "All standard departments already exist.");
  });
}

/** Staff choose their own department, which decides who receives their leave requests. */
export async function setMyDepartmentAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("self.update");
    const departmentId = text(form, "departmentId", 64);
    const departments = await readStore("hrDepartments");
    const dept = departments.find((d) => d.id === departmentId && d.active);
    if (!dept) return fail("Choose your department.");
    if (ctx.employee.departmentId === dept.id) return done("No change.");
    // Only a first choice: once someone is in an active department, HR moves them (it changes who approves their leave).
    if (ctx.employee.departmentId && departments.some((d) => d.id === ctx.employee.departmentId && d.active)) {
      return fail("You already have a department. Ask HR to move you to another one.");
    }
    const before = ctx.employee.department || "none";
    // Always the signed-in person's own record.
    await updateStore("hrEmployees", (items) => ({
      items: items.map((e) => (e.id === ctx.employee.id ? { ...e, departmentId: dept.id, department: dept.name, updatedAt: new Date().toISOString() } : e)),
    }));
    await hrAudit(ctx, "changed own department", employeeName(ctx.employee), `${before} → ${dept.name}`);
    refresh();
    return done(`You're now in ${dept.name}. Leave requests go to its head and approvers, and to your line manager.`);
  });
}

/* ------------------------------------------------------------------ Employee import */

const MAX_IMPORT_BYTES = 1_000_000;
const MAX_IMPORT_ROWS = 1000;

/** Add employee records from a CSV file. Existing emails are skipped, never overwritten. */
export async function importEmployeesAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) return fail("Choose a CSV file.");
    if (file.size > MAX_IMPORT_BYTES) return fail("The file is too large (1 MB at most).");
    if (!/\.csv$/i.test(file.name)) return fail("Upload a .csv file (in Excel: File → Save As → CSV).");
    const { records, missingColumns } = mapEmployeeRows(parseCsv(await file.text()));
    if (missingColumns.length) return fail(`The file needs these columns: ${missingColumns.join(", ")}.`);
    if (!records.length) return fail("The file has no rows.");
    if (records.length > MAX_IMPORT_ROWS) return fail(`Import at most ${MAX_IMPORT_ROWS} rows at a time.`);

    const [employees, departments] = await Promise.all([readStore("hrEmployees"), readStore("hrDepartments")]);
    const emails = new Set(employees.map((e) => e.email).filter(Boolean));
    const now = new Date().toISOString();
    const created: (HrEmployee & { managerEmail?: string })[] = [];
    const skipped: string[] = [];
    records.forEach((r, i) => {
      const line = i + 2;
      const firstName = (r.firstName ?? "").slice(0, 80);
      const lastName = (r.lastName ?? "").slice(0, 80);
      const mail = (r.email ?? "").toLowerCase().slice(0, 254);
      if (!firstName || !lastName) return void skipped.push(`row ${line}: missing name`);
      if (mail && !isEmail(mail)) return void skipped.push(`row ${line}: invalid email`);
      if (mail && emails.has(mail)) return void skipped.push(`row ${line}: ${mail} already exists`);
      const startDate = r.startDate && isDate(r.startDate) ? r.startDate : "";
      const status = (r.status ?? "").toLowerCase();
      const dept = departments.find((d) => d.name.toLowerCase() === (r.department ?? "").toLowerCase());
      if (mail) emails.add(mail);
      created.push({
        id: randomUUID(),
        staffNumber: (r.staffNumber ?? "").slice(0, 40),
        firstName,
        lastName,
        email: mail,
        phone: (r.phone ?? "").slice(0, 40),
        jobTitle: (r.jobTitle ?? "").slice(0, 120),
        department: dept?.name ?? (r.department ?? "").slice(0, 120),
        ...(dept ? { departmentId: dept.id } : {}),
        location: (r.location ?? "").slice(0, 120),
        managerId: null,
        startDate,
        status: status === "terminated" || status === "left" ? "left" : isEmployeeStatus(status) ? status : "active",
          address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        createdAt: now,
        updatedAt: now,
        managerEmail: (r.managerEmail ?? "").toLowerCase(),
      });
    });
    // Line managers by email, among existing staff and this file.
    const everyone = [...employees, ...created];
    const records2: HrEmployee[] = created.map(({ managerEmail, ...e }) => {
      const manager = managerEmail ? everyone.find((m) => m.email === managerEmail && m.id !== e.id) : undefined;
      return manager ? { ...e, managerId: manager.id } : e;
    });
    if (records2.length) {
      await updateStore("hrEmployees", (items) => {
        const taken = new Set(items.map((e) => e.email).filter(Boolean));
        return { items: [...items, ...records2.filter((e) => !e.email || !taken.has(e.email))] };
      });
      await hrAudit(ctx, "imported employees", `${records2.length} employee records`, `From ${file.name.slice(0, 100)}. Skipped ${skipped.length}.`);
    }
    refresh();
    const more = skipped.length > 5 ? ` and ${skipped.length - 5} more` : "";
    return done(`Imported ${records2.length} employee${records2.length === 1 ? "" : "s"}.${skipped.length ? ` Skipped ${skipped.length}: ${skipped.slice(0, 5).join("; ")}${more}.` : ""}`);
  });
}

/* ------------------------------------------------------------------ Passwords */

/** HR sets someone's password (e.g. they can't receive links). By default they must change it at next sign-in. */
export async function setPasswordAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("accounts.manage");
    const target = await loadAccountTarget(ctx, text(form, "accountId", 64));
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) return fail("The two passwords don't match.");
    const weak = validatePasswordStrength(password);
    if (weak) return fail(weak);
    const mustChange = form.get("mustChange") !== null;
    const passwordHash = await hashPassword(password);
    await changeAccount(target.id, (a) => ({ ...a, passwordHash, mustChangePassword: mustChange }));
    // Links issued earlier stop working.
    await updateStore("hrTokens", (items) => ({ items: items.filter((t) => t.accountId !== target.id || t.usedAt) }));
    await hrAudit(ctx, "changed password", `account ${target.email}`, mustChange ? "They must choose their own at next sign-in." : "Set by HR.");
    refresh();
    return done(`Password changed for ${target.email}. Their other sessions have ended.${mustChange ? " They'll choose their own when they next sign in." : ""}`);
  });
}

/** Anyone signed in changes their own password (also used when HR set it). */
export async function changeOwnPasswordAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const state = await loadHrSession();
    if (state.status !== "ok") throw new HrAccessError("Your session has ended. Please sign in again.");
    const { account } = state.ctx;
    const current = String(form.get("current") ?? "");
    const password = String(form.get("password") ?? "");
    if (!account.passwordHash || !(await verifyPassword(current, account.passwordHash))) return fail("Your current password isn't right.");
    if (password !== String(form.get("confirm") ?? "")) return fail("The two new passwords don't match.");
    if (password === current) return fail("Choose a password different from the current one.");
    const weak = validatePasswordStrength(password);
    if (weak) return fail(weak);
    const passwordHash = await hashPassword(password);
    const updated = await changeAccount(account.id, (a) => ({ ...a, passwordHash, mustChangePassword: false }));
    if (!updated) return fail("Your account no longer exists.");
    // Other devices are signed out; this one gets a fresh session.
    await createHrSession(updated);
    await hrAudit(state.ctx, "changed own password", `account ${account.email}`);
    redirect(homePath(state.ctx.permissions));
  });
}

/* ------------------------------------------------------------------ Delete employee */

/**
 * Permanently remove an employee record with its portal login and leave history. Prefer marking
 * people as Terminated; deletion is for records created by mistake.
 */
export async function deleteEmployeeAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("employees.manage");
    const id = text(form, "employeeId", 64);
    if (id === ctx.employee.id) return fail("You can't delete your own record.");
    const [employees, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts")]);
    const person = employees.find((e) => e.id === id);
    if (!person) return fail("Employee not found.");
    const account = accounts.find((a) => a.employeeId === id);
    if (account && !canManageAccount(ctx.actor, account)) return fail("This person has a portal login; only an HR administrator can delete them.");
    if (account && !canGrant(ctx.actor, exceptWebsiteAdminOnly(effectivePermissions(account, await readStore("hrRoles"), person, ctx.departments)))) {
      return fail("You can't delete someone with more access than you.");
    }
    const removedLeave = (await readStore("hrLeave")).filter((l) => l.employeeId === id).length;
    await updateStore("hrEmployees", (items) => ({ items: items.filter((e) => e.id !== id).map((e) => (e.managerId === id ? { ...e, managerId: null } : e)) }));
    if (account) {
      await updateStore("hrAccounts", (items) => ({ items: items.filter((a) => a.id !== account.id) }));
      await updateStore("hrTokens", (items) => ({ items: items.filter((t) => t.accountId !== account.id) }));
    }
    await updateStore("hrLeave", (items) => ({ items: items.filter((l) => l.employeeId !== id) }));
    await updateStore("hrDepartments", (items) => ({
      items: items.map((d) => ({ ...d, headEmployeeId: d.headEmployeeId === id ? null : d.headEmployeeId, approverIds: d.approverIds.filter((x) => x !== id) })),
    }));
    await hrAudit(ctx, "deleted employee", employeeName(person), `${person.email || "no email"}; ${account ? `login ${account.email} removed; ` : ""}${removedLeave} leave request(s) removed.`);
    refresh();
    return done(`${employeeName(person)} deleted.`);
  });
}

/* ------------------------------------------------------------------ Banking */

/** Salary account details: the person themselves, or HR staff who manage records. */
export async function updateBankingAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const employeeId = text(form, "employeeId", 64);
    const ctx = await requireHrAction(["self.update", "employees.manage"]);
    const self = employeeId === ctx.employee.id;
    if (self ? !has(ctx.permissions, "self.update") : !has(ctx.permissions, "employees.manage")) throw new HrAccessError("You don't have permission to do that.");
    const bankName = text(form, "bankName", 80);
    const bankAccountName = text(form, "bankAccountName", 120);
    // The full number is never sent to the browser, so a blank box keeps the number on file.
    const typed = text(form, "bankAccountNumber", 30).replace(/\s+/g, "");
    if (typed && !/^\d{10}$/.test(typed)) return fail("Enter the 10-digit NUBAN account number (digits only).");
    const person = (await readStore("hrEmployees")).find((e) => e.id === employeeId);
    if (!person) return fail("Employee not found.");
    const bankAccountNumber = typed || person.bankAccountNumber || "";
    const changed = bankName !== (person.bankName ?? "") || bankAccountName !== (person.bankAccountName ?? "") || bankAccountNumber !== (person.bankAccountNumber ?? "");
    if (!changed) return done("No change.");
    const now = new Date().toISOString();
    await updateStore("hrEmployees", (items) => ({
      // A change the person makes themselves is flagged to HR before the next payroll.
      items: items.map((e) => (e.id === employeeId ? { ...e, bankName, bankAccountName, bankAccountNumber, bankChangedAt: now, bankChangedBySelf: self, updatedAt: now } : e)),
    }));
    await hrAudit(ctx, self ? "updated own banking details" : "updated banking details", employeeName(person), bankAccountNumber ? `Account ending ${bankAccountNumber.slice(-4)}` : "Cleared");
    refresh();
    return done(self ? "Bank details saved. HR is told, so they can check them before the next payroll." : "Bank details saved.");
  });
}

/* ------------------------------------------------------------------ Leave types, policies, adjustments */

const daysOrNull = (v: string): number | null | undefined => {
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 366 ? Math.round(n * 2) / 2 : undefined;
};

export async function saveLeaveTypeAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.manage");
    const existingId = text(form, "typeId", 64);
    const name = text(form, "name", 60);
    const color = text(form, "color", 20) as HrLeaveType["color"];
    const defaultDays = daysOrNull(text(form, "defaultDays", 6));
    if (!name) return fail("Give the leave type a name.");
    if (!LEAVE_COLORS.includes(color)) return fail("Choose a colour.");
    if (defaultDays === undefined) return fail("Days a year must be a number from 0 to 366, or blank for no limit.");
    const types = await readStore("hrLeaveTypes");
    const current = existingId ? types.find((t) => t.id === existingId) : undefined;
    if (existingId && !current) return fail("Leave type not found.");
    if (types.some((t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== existingId)) return fail("There is already a leave type with that name.");
    const type: HrLeaveType = {
      id: current?.id ?? `lt_${slug(name) || "leave"}_${randomUUID().slice(0, 6)}`,
      name,
      description: text(form, "description", 300),
      color,
      paid: form.get("paid") !== null,
      defaultDays,
      carryOver: current?.carryOver ?? false,
      active: existingId ? text(form, "active", 5) !== "false" : true,
    };
    await updateStore("hrLeaveTypes", (items) => ({ items: current ? items.map((t) => (t.id === type.id ? type : t)) : [...items, type] }));
    if (!current) {
      // Every new type starts with its own all-staff policy, so it shows (and can be tuned) under Leave Policies.
      const now = new Date().toISOString();
      await updateStore("hrLeavePolicies", (items) => ({
        items: [
          ...items,
          { id: `lp_${randomUUID().slice(0, 8)}`, name: `${name} Policy`, description: "", typeId: type.id, days: defaultDays, carryForward: 0, approvalRequired: true, scope: "all" as const, scopeValue: "", active: true, createdAt: now, updatedAt: now },
        ],
      }));
    }
    const days = (d: number | null) => (d === null ? "no limit" : `${d} days`);
    await hrAudit(
      ctx,
      current ? "changed leave type" : "created leave type",
      `leave type ${name}`,
      current
        ? [current.name !== name ? `Name: ${current.name} → ${name}` : "", current.defaultDays !== defaultDays ? `Default: ${days(current.defaultDays)} → ${days(defaultDays)}` : "", current.active !== type.active ? (type.active ? "Reopened" : "Retired") : ""].filter(Boolean).join(". ")
        : `Default: ${days(defaultDays)}${type.paid ? ", paid" : ", unpaid"}`,
    );
    refresh();
    return done(current ? `${name} saved.` : `${name} created.`);
  });
}

export async function saveLeavePolicyAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.manage");
    const existingId = text(form, "policyId", 64);
    const name = text(form, "name", 80);
    const typeId = text(form, "typeId", 64);
    const scope = (text(form, "scope", 20) || "all") as HrLeavePolicy["scope"];
    const scopeValue = scope === "department" ? text(form, "departmentId", 64) : scope === "employmentType" ? text(form, "employmentType", 40) : "";
    const days = daysOrNull(text(form, "days", 6));
    const carryForward = Number(text(form, "carryForward", 4) || 0);
    if (!name) return fail("Give the policy a name.");
    const types = await readStore("hrLeaveTypes");
    const type = types.find((t) => t.id === typeId);
    if (!type) return fail("Choose a leave type.");
    if (days === undefined) return fail("Days a year must be a number from 0 to 366, or blank for no limit.");
    if (!Number.isFinite(carryForward) || carryForward < 0 || carryForward > 366) return fail("Carry forward must be a number of days from 0 to 366.");
    if (!["all", "department", "employmentType"].includes(scope)) return fail("Choose who the policy applies to.");
    if (scope === "department" && !ctx.departments.some((d) => d.id === scopeValue)) return fail("Choose a department.");
    if (scope === "employmentType" && !(EMPLOYMENT_TYPES as readonly string[]).includes(scopeValue)) return fail("Choose an employment type.");
    const policies = await readStore("hrLeavePolicies");
    const current = existingId ? policies.find((p) => p.id === existingId) : undefined;
    if (existingId && !current) return fail("Policy not found.");
    const active = existingId ? text(form, "active", 5) !== "false" : true;
    if (active && policies.some((p) => p.active && p.id !== existingId && p.typeId === typeId && p.scope === scope && p.scopeValue === scopeValue)) {
      return fail(`Another active ${type.name} policy already covers the same staff. Edit that one instead.`);
    }
    const now = new Date().toISOString();
    const policy: HrLeavePolicy = {
      id: current?.id ?? `lp_${randomUUID().slice(0, 8)}`,
      name,
      description: text(form, "description", 300),
      typeId,
      days,
      carryForward: Math.round(carryForward),
      approvalRequired: text(form, "approvalRequired", 5) !== "false",
      scope,
      scopeValue,
      active,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };
    await updateStore("hrLeavePolicies", (items) => ({ items: current ? items.map((p) => (p.id === policy.id ? policy : p)) : [...items, policy] }));
    const summary = `${type.name}: ${days === null ? "no limit" : `${days} days`}; carry forward ${policy.carryForward} days; approval ${policy.approvalRequired ? "required" : "not required"}${active ? "" : "; inactive"}`;
    await hrAudit(ctx, current ? "changed leave policy" : "created leave policy", `leave policy ${name}`, summary);
    refresh();
    return done(current ? `${name} saved. Balances are updated straight away.` : `${name} created. Balances are updated straight away.`);
  });
}

/** Lock (pause) or unlock a policy without deleting it. */
export async function setLeavePolicyActiveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.manage");
    const id = text(form, "policyId", 64);
    const active = text(form, "active", 5) === "true";
    const policies = await readStore("hrLeavePolicies");
    const policy = policies.find((p) => p.id === id);
    if (!policy) return fail("Policy not found.");
    if (policy.active === active) return done("No change.");
    if (active && policies.some((p) => p.active && p.id !== id && p.typeId === policy.typeId && p.scope === policy.scope && p.scopeValue === policy.scopeValue)) {
      return fail("Another active policy already covers the same leave type and staff.");
    }
    await updateStore("hrLeavePolicies", (items) => ({ items: items.map((p) => (p.id === id ? { ...p, active, updatedAt: new Date().toISOString() } : p)) }));
    await hrAudit(ctx, active ? "unlocked leave policy" : "locked leave policy", `leave policy ${policy.name}`);
    refresh();
    return done(active ? `${policy.name} is active again.` : `${policy.name} is locked (inactive). The leave type's default applies until it's unlocked.`);
  });
}

export async function deleteLeavePolicyAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.manage");
    const id = text(form, "policyId", 64);
    const policy = (await readStore("hrLeavePolicies")).find((p) => p.id === id);
    if (!policy) return fail("Policy not found.");
    await updateStore("hrLeavePolicies", (items) => ({ items: items.filter((p) => p.id !== id) }));
    await hrAudit(ctx, "deleted leave policy", `leave policy ${policy.name}`);
    refresh();
    return done(`${policy.name} deleted.`);
  });
}

/** Add or remove days on one person's balance for a year, with a reason. */
export async function addLeaveAdjustmentAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.manage");
    const employeeId = text(form, "employeeId", 64);
    const typeId = text(form, "typeId", 64);
    const year = Number(text(form, "year", 4));
    const days = Number(text(form, "days", 6));
    const reason = text(form, "reason", 300);
    if (employeeId === ctx.employee.id) return fail("Ask another HR colleague to adjust your own balance.");
    const [employees, types] = await Promise.all([readStore("hrEmployees"), readStore("hrLeaveTypes")]);
    const person = employees.find((e) => e.id === employeeId);
    const type = types.find((t) => t.id === typeId);
    if (!person) return fail("Choose an employee.");
    if (!type || (type.defaultDays === null && !(await readStore("hrLeavePolicies")).some((p) => p.typeId === typeId && p.days !== null))) {
      return fail("Choose a leave type that has an allowance (unlimited types have no balance).");
    }
    if (!Number.isInteger(year) || year < 2000 || year > 2100) return fail("Enter a valid year.");
    if (!Number.isFinite(days) || days === 0 || Math.abs(days) > 366) return fail("Enter the number of days to add (or a negative number to remove).");
    if (!reason) return fail("Give a reason (it's kept in the record).");
    await updateStore("hrLeaveAdjustments", (items) => ({
      items: [...items, { id: randomUUID(), employeeId, typeId, year, days: Math.round(days * 2) / 2, reason, byName: ctx.displayName, at: new Date().toISOString() }],
    }));
    await hrAudit(ctx, "adjusted leave balance", employeeName(person), `${type.name} ${year}: ${days > 0 ? "+" : ""}${days} days. ${reason}`);
    refresh();
    return done(`${type.name} for ${employeeName(person)} adjusted by ${days > 0 ? "+" : ""}${days} days.`);
  });
}

/* ------------------------------------------------------------------ Sample data for testing */

/**
 * Five made-up staff (clearly marked SAMPLE) to try the portal with. Everyone has a line manager:
 * Grace (Deputy Director) reports to whoever loads the data, Aisha and Chinedu to Grace, and
 * Ibrahim and Fatima to Aisha.
 */
const SAMPLE_PEOPLE = [
  { first: "Aisha", last: "Bello", title: "Programme Manager", dept: "Programmes", station: "Sokoto", type: "Full-time", role: "manager", status: "active", manager: 4 },
  { first: "Ibrahim", last: "Musa", title: "Field Officer", dept: "Programmes", station: "Sokoto", type: "Full-time", role: "employee", status: "active", manager: 0 },
  { first: "Fatima", last: "Abubakar", title: "Nutrition Officer", dept: "Health & Nutrition", station: "Maiduguri", type: "Fixed-term contract", role: "employee", status: "probation", manager: 0 },
  { first: "Chinedu", last: "Okafor", title: "Finance Officer", dept: "Finance & Grants", station: "Abuja", type: "Full-time", role: "finance_officer", status: "active", manager: 4 },
  { first: "Grace", last: "Danjuma", title: "Deputy Director", dept: "Human Resources & Administration", station: "Sokoto", type: "Full-time", role: "management", status: "active", manager: "loader" },
] as const;

/** Made-up monthly pay for each sample person (same order), to try payroll with. */
const SAMPLE_PAY: { basic: number; housing: number; transport: number; annualRent: number; allowances: PayLine[]; deductions: PayLine[]; bank: string }[] = [
  { basic: 450_000, housing: 180_000, transport: 70_000, annualRent: 1_800_000, allowances: [{ name: "Field allowance", amount: 40_000 }], deductions: [], bank: "First Bank" },
  { basic: 220_000, housing: 90_000, transport: 40_000, annualRent: 600_000, allowances: [{ name: "Field allowance", amount: 25_000 }], deductions: [{ name: "Staff loan repayment", amount: 15_000 }], bank: "Access Bank" },
  { basic: 260_000, housing: 100_000, transport: 45_000, annualRent: 0, allowances: [], deductions: [], bank: "Zenith Bank" },
  { basic: 300_000, housing: 120_000, transport: 50_000, annualRent: 960_000, allowances: [], deductions: [{ name: "Cooperative savings", amount: 10_000 }], bank: "GTBank" },
  { basic: 650_000, housing: 260_000, transport: 90_000, annualRent: 3_000_000, allowances: [{ name: "Responsibility allowance", amount: 60_000 }], deductions: [], bank: "UBA" },
];

const roleName = (id: string) => BUILT_IN_HR_ROLES.find((r) => r.id === id)?.name ?? id;

const sampleEmail = (first: string, last: string) => `${first}.${last}.sample@example.test`.toLowerCase();

export async function loadSampleDataAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction(["accounts.manage"]);
    if (!has(ctx.permissions, "employees.manage")) throw new HrAccessError("You don't have permission to do that.");
    // Every sample person gets a login; with no password given, one is made up and shown once.
    const chosen = String(form.get("password") ?? "");
    if (chosen) {
      const weak = validatePasswordStrength(chosen);
      if (weak) return fail(`Sample login password: ${weak}`);
    }
    const password = chosen || `Sample-${randomBytes(4).toString("hex")}-${100 + (randomBytes(1)[0] % 900)}`;
    const [employees, departments, events] = await Promise.all([readStore("hrEmployees"), readStore("hrDepartments"), readStore("hrEvents")]);
    if (employees.some((e) => e.sample)) return fail("Sample data is already loaded. Remove it first to load it again.");

    const now = new Date().toISOString();
    const today = new Date(`${new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date())}T12:00:00Z`);
    const day = (offset: number) => {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() + offset);
      return d.toISOString().slice(0, 10);
    };
    const monday = (weeks: number) => day(((8 - today.getUTCDay()) % 7 || 7) - 7 + weeks * 7);

    const people: HrEmployee[] = SAMPLE_PEOPLE.map((p, i) => {
      const dept = departments.find((d) => d.active && d.name.toLowerCase() === p.dept.toLowerCase());
      return {
        id: randomUUID(),
        staffNumber: `SAMPLE-00${i + 1}`,
        firstName: p.first,
        lastName: p.last,
        email: sampleEmail(p.first, p.last),
        phone: "",
        jobTitle: p.title,
        department: dept?.name ?? p.dept,
        ...(dept ? { departmentId: dept.id } : {}),
        location: p.station,
        managerId: null,
        startDate: day(-(120 + i * 90)),
        status: p.status,
        employmentType: p.type,
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        bankName: SAMPLE_PAY[i].bank,
        bankAccountName: `${p.first} ${p.last}`,
        bankAccountNumber: `00000000${i + 1}${i + 1}`.slice(-10),
        createdAt: now,
        updatedAt: now,
        sample: true,
      };
    });
    SAMPLE_PEOPLE.forEach((p, i) => {
      people[i].managerId = p.manager === "loader" ? ctx.employee.id : people[p.manager].id;
    });

    const req = (who: number, type: string, start: string, end: string, status: HrLeaveRequest["status"], reason: string): HrLeaveRequest => ({
      id: randomUUID(),
      employeeId: people[who].id,
      type,
      startDate: start,
      endDate: end,
      days: workingDays(start, end, holidayDates(events, Number(start.slice(0, 4)), Number(end.slice(0, 4)))),
      reason,
      status,
      createdAt: now,
      // Decided by the person's line manager (or, for Grace, whoever loaded the data), never by themselves.
      ...(status === "approved" || status === "rejected"
        ? { decidedByAccountId: "sample", decidedByName: who === 4 ? ctx.displayName : `${employeeName(people.find((p) => p.id === people[who].managerId))} (sample)`, decidedAt: now }
        : {}),
      sample: true,
    });
    const thisMonday = monday(0);
    const leave = [
      req(1, "Annual", thisMonday, day(Math.round((Date.parse(thisMonday) - today.getTime()) / 86_400_000) + 4), "approved", "Sample: family visit"),
      req(2, "Sick", monday(1), day(Math.round((Date.parse(monday(1)) - today.getTime()) / 86_400_000) + 1), "pending", "Sample: medical appointment"),
      req(3, "Annual", monday(3), day(Math.round((Date.parse(monday(3)) - today.getTime()) / 86_400_000) + 4), "pending", "Sample: annual leave"),
      req(4, "Study", monday(-4), day(Math.round((Date.parse(monday(-4)) - today.getTime()) / 86_400_000) + 1), "rejected", "Sample: workshop"),
      req(0, "Annual", monday(5), day(Math.round((Date.parse(monday(5)) - today.getTime()) / 86_400_000) + 1), "approved", "Sample: personal leave"),
    ].filter((l) => l.days > 0 && l.startDate.slice(0, 4) === l.endDate.slice(0, 4));

    await updateStore("hrEmployees", (items) => ({ items: [...items, ...people] }));
    await updateStore("hrLeave", (items) => ({ items: [...leave, ...items] }));
    // Salaries only for someone who may set them (HR Administrators can).
    const salaries: HrSalary[] = has(ctx.permissions, "payroll.salaries.manage")
      ? people.map((e, i) => {
          const { basic, housing, transport, annualRent, allowances, deductions } = SAMPLE_PAY[i];
          return { employeeId: e.id, basic, housing, transport, annualRent, allowances, deductions, updatedAt: now, updatedByName: `${ctx.displayName} (sample)` };
        })
      : [];
    if (salaries.length) await updateStore("hrSalaries", (items) => ({ items: [...items, ...salaries] }));
    // Published payslips for the last two months, so each sample person has some to view and download.
    const slips: HrPayslip[] = [];
    if (salaries.length && has(ctx.permissions, "payroll.runs")) {
      const rules = payrollRules((await readStore("hrPayrollSettings"))[0]);
      for (const back of [2, 1]) {
        const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - back, 1));
        const month = first.toISOString().slice(0, 7);
        const holidays = holidayDates(events, first.getUTCFullYear());
        let payDate = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
        while (!isWorkingDay(payDate, holidays)) payDate = new Date(Date.parse(`${payDate}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
        people.forEach((e, i) => {
          slips.push({
            id: randomUUID(),
            employeeId: e.id,
            month,
            status: "published",
            employee: { name: employeeName(e), staffNumber: e.staffNumber, jobTitle: e.jobTitle, department: e.department, bankName: e.bankName ?? "", bankAccountEnding: (e.bankAccountNumber ?? "").slice(-4) },
            ...monthlyPay(salaries[i], rules),
            preparedByName: `${ctx.displayName} (sample)`,
            createdAt: now,
            publishedAt: now,
            payDate,
          });
        });
      }
      await updateStore("hrPayslips", (items) => ({ items: [...items, ...slips] }));
    }

    let logins = 0;
    {
      const passwordHash = await hashPassword(password);
      const accounts: HrAccount[] = people.map((e, i) => ({
        id: randomUUID(),
        email: e.email,
        employeeId: e.id,
        roleId: SAMPLE_PEOPLE[i].role,
        extraPermissions: [],
        active: true,
        passwordHash,
        sessionVersion: 1,
        createdAt: now,
        createdBy: ctx.account.email,
        sample: true,
      }));
      await updateStore("hrAccounts", (items) => {
        const taken = new Set(items.map((a) => a.email));
        const fresh = accounts.filter((a) => !taken.has(a.email));
        logins = fresh.length;
        return { items: [...items, ...fresh] };
      });
    }
    await hrAudit(ctx, "loaded sample data", "sample records", `${people.length} sample employees, ${leave.length} leave requests, ${salaries.length} salaries, ${slips.length} payslips, ${logins} sample logins`);
    refresh();
    const loginList = people.map((e, i) => `${e.email} (${roleName(SAMPLE_PEOPLE[i].role)})`).join("; ");
    return done(
      `Loaded ${people.length} sample employees, ${leave.length} leave requests${salaries.length ? `, ${salaries.length} salaries` : ""}${slips.length ? ` and ${slips.length} published payslips` : ""}. ` +
        (logins
          ? `Sample logins, all with the password ${chosen ? "you entered" : password}: ${loginList}. Change any of them under Accounts. `
          : "") +
        `Remove everything any time with "Remove sample data".`,
    );
  });
}

export async function removeSampleDataAction(): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction(["accounts.manage"]);
    if (!has(ctx.permissions, "employees.manage")) throw new HrAccessError("You don't have permission to do that.");
    const [employees, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts")]);
    const ids = new Set(employees.filter((e) => e.sample).map((e) => e.id));
    const accountIds = new Set(accounts.filter((a) => a.sample || ids.has(a.employeeId)).map((a) => a.id));
    if (!ids.size && !accountIds.size) return done("There is no sample data to remove.");
    if (accountIds.has(ctx.account.id)) return fail("You're signed in with a sample login; sign in with your own account to remove sample data.");
    await updateStore("hrEmployees", (items) => ({ items: items.filter((e) => !ids.has(e.id)).map((e) => (e.managerId && ids.has(e.managerId) ? { ...e, managerId: null } : e)) }));
    await updateStore("hrAccounts", (items) => ({ items: items.filter((a) => !accountIds.has(a.id)) }));
    await updateStore("hrTokens", (items) => ({ items: items.filter((t) => !accountIds.has(t.accountId)) }));
    await updateStore("hrLeave", (items) => ({ items: items.filter((l) => !l.sample && !ids.has(l.employeeId)) }));
    await updateStore("hrLeaveAdjustments", (items) => ({ items: items.filter((a) => !ids.has(a.employeeId)) }));
    await updateStore("hrSalaries", (items) => ({ items: items.filter((x) => !ids.has(x.employeeId)) }));
    await updateStore("hrPayslips", (items) => ({ items: items.filter((x) => !ids.has(x.employeeId)) }));
    await updateStore("hrDepartments", (items) => ({
      items: items.map((d) => ({ ...d, headEmployeeId: d.headEmployeeId && ids.has(d.headEmployeeId) ? null : d.headEmployeeId, approverIds: d.approverIds.filter((x) => !ids.has(x)) })),
    }));
    await hrAudit(ctx, "removed sample data", "sample records", `${ids.size} sample employees and ${accountIds.size} sample logins removed`);
    refresh();
    return done(`Removed ${ids.size} sample employees, their leave, salaries and payslips, and ${accountIds.size} sample logins.`);
  });
}

/* ------------------------------------------------------------------ Calendar events */

const EVENT_KINDS = ["meeting", "holiday", "event"] as const;

const REPEATS = ["none", "daily", "weekly", "monthly"] as const;

/**
 * Who may add calendar entries: HR (anything, for all staff) and managers (meetings for their
 * team only). Managers can change and delete only the meetings they added.
 */
async function requireCalendarEditor() {
  const ctx = await requireHrAction(["employees.manage", "team.view"]);
  return { ctx, isHr: has(ctx.permissions, "employees.manage") };
}
const canChangeEvent = (ctx: HrContext, isHr: boolean, e: HrCalendarEvent) => isHr || e.ownerEmployeeId === ctx.employee.id;

export async function saveCalendarEventAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const { ctx, isHr } = await requireCalendarEditor();
    const existingId = text(form, "eventId", 64);
    const title = text(form, "title", 120);
    // Managers add meetings for their team; only HR adds holidays and events, or shares with everyone.
    const kind = (isHr ? text(form, "kind", 10) : "meeting") as (typeof EVENT_KINDS)[number];
    const audience = isHr ? (text(form, "audience", 5) === "team" ? "team" : "all") : "team";
    const startDate = text(form, "startDate", 10);
    const endDate = text(form, "endDate", 10) || startDate;
    const time = text(form, "time", 5);
    const repeat = (text(form, "repeat", 10) || "none") as (typeof REPEATS)[number];
    const repeatUntil = repeat === "none" ? "" : text(form, "repeatUntil", 10);
    if (!title) return fail("Give the event a title.");
    if (!EVENT_KINDS.includes(kind)) return fail("Choose meeting, holiday or event.");
    if (!REPEATS.includes(repeat)) return fail("Choose how it repeats.");
    if (!isDate(startDate) || !isDate(endDate) || endDate < startDate) return fail("Enter a valid start and end date.");
    if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return fail("Enter the time as HH:MM, or leave it blank.");
    if (repeat !== "none") {
      if (!isDate(repeatUntil) || repeatUntil < startDate) return fail("Choose the date it repeats until (on or after the first day).");
      if (Date.parse(repeatUntil) - Date.parse(startDate) > 2 * 366 * 86_400_000) return fail("Repeats can run for at most two years; add it again after that.");
      if (repeat === "daily" && endDate !== startDate) return fail("A daily repeat must be a one-day event.");
    }
    const events = await readStore("hrEvents");
    const current = existingId ? events.find((e) => e.id === existingId) : undefined;
    if (existingId && !current) return fail("Event not found.");
    if (current && !canChangeEvent(ctx, isHr, current)) return fail("You can only change meetings you added.");
    const event: HrCalendarEvent = {
      id: current?.id ?? randomUUID(),
      title,
      kind,
      startDate,
      endDate,
      time,
      location: text(form, "location", 120),
      description: text(form, "description", 500),
      repeat,
      repeatUntil,
      audience: current && !isHr ? current.audience : audience,
      ownerEmployeeId: current?.ownerEmployeeId ?? ctx.employee.id,
      // Occurrences skipped or changed on their own stay that way when the series is edited.
      ...(repeat !== "none" && current?.skipDates?.length ? { skipDates: current.skipDates } : {}),
      ...(repeat !== "none" && current?.overrides?.length ? { overrides: current.overrides } : {}),
      createdByName: current?.createdByName ?? ctx.displayName,
      createdAt: current?.createdAt ?? new Date().toISOString(),
    };
    await updateStore("hrEvents", (items) => ({ items: current ? items.map((e) => (e.id === event.id ? event : e)) : [...items, event] }));
    const when = `${startDate}${endDate !== startDate ? ` to ${endDate}` : ""}${time ? ` at ${time}` : ""}${repeat !== "none" ? `, repeats ${repeat} until ${repeatUntil}` : ""}`;
    await hrAudit(ctx, current ? "changed calendar event" : "added calendar event", `${kind} ${title}`, `${when}. For ${event.audience === "team" ? "their team" : "all staff"}.`);
    refresh();
    return done(current ? `${title} saved.` : `${title} added to the calendar${event.audience === "team" ? " for your team" : ""}.`);
  });
}

export async function deleteCalendarEventAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const { ctx, isHr } = await requireCalendarEditor();
    const id = text(form, "eventId", 64);
    const event = (await readStore("hrEvents")).find((e) => e.id === id);
    if (!event) return fail("Event not found.");
    if (!canChangeEvent(ctx, isHr, event)) return fail("You can only delete meetings you added.");
    await updateStore("hrEvents", (items) => ({ items: items.filter((e) => e.id !== id) }));
    await hrAudit(ctx, "deleted calendar event", `${event.kind} ${event.title}`, `${event.startDate}${event.repeat && event.repeat !== "none" ? ` (every occurrence)` : ""}`);
    refresh();
    return done(`${event.title} removed from the calendar.`);
  });
}

/** Load a repeating entry the signed-in person may change, and check `date` is one of its occurrences. */
async function loadOccurrence(form: FormData) {
  const { ctx, isHr } = await requireCalendarEditor();
  const id = text(form, "eventId", 64);
  const date = text(form, "occurrenceDate", 10);
  const event = (await readStore("hrEvents")).find((e) => e.id === id);
  if (!event) throw new HrAccessError("Event not found.");
  if (!canChangeEvent(ctx, isHr, event)) throw new HrAccessError("You can only change meetings you added.");
  if (!event.repeat || event.repeat === "none" || !isDate(date) || !isOccurrence(event, date)) throw new HrAccessError("That isn't one of this meeting's dates.");
  return { ctx, event, date };
}

/** Change one occurrence of a repeating entry (its date, time, title, place or details). */
export async function saveOccurrenceAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const { ctx, event, date } = await loadOccurrence(form);
    const title = text(form, "title", 120);
    const startDate = text(form, "startDate", 10);
    const endDate = text(form, "endDate", 10) || startDate;
    const time = text(form, "time", 5);
    if (!title) return fail("Give it a title.");
    if (!isDate(startDate) || !isDate(endDate) || endDate < startDate) return fail("Enter a valid date.");
    if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return fail("Enter the time as HH:MM, or leave it blank.");
    const override = { date, startDate, endDate, time, title, location: text(form, "location", 120), description: text(form, "description", 500) };
    await updateStore("hrEvents", (items) => ({
      items: items.map((e) =>
        e.id === event.id ? { ...e, overrides: [...(e.overrides ?? []).filter((o) => o.date !== date), override], skipDates: (e.skipDates ?? []).filter((d) => d !== date) } : e,
      ),
    }));
    await hrAudit(ctx, "changed one occurrence", `${event.kind} ${event.title}`, `${date} → ${startDate}${time ? ` at ${time}` : ""}${title !== event.title ? `, "${title}"` : ""}`);
    refresh();
    return done(`Changed for ${date} only. The rest of the series is unchanged.`);
  });
}

/** Take one occurrence out of a repeating entry (e.g. no stand-up on a public holiday). */
export async function skipOccurrenceAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const { ctx, event, date } = await loadOccurrence(form);
    await updateStore("hrEvents", (items) => ({
      items: items.map((e) =>
        e.id === event.id ? { ...e, skipDates: [...new Set([...(e.skipDates ?? []), date])].sort(), overrides: (e.overrides ?? []).filter((o) => o.date !== date) } : e,
      ),
    }));
    await hrAudit(ctx, "skipped one occurrence", `${event.kind} ${event.title}`, date);
    refresh();
    return done(`Skipped on ${date}. You can restore it from the meeting's details.`);
  });
}

/** Put a skipped or changed occurrence back as the series has it. */
export async function restoreOccurrenceAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const { ctx, event, date } = await loadOccurrence(form);
    await updateStore("hrEvents", (items) => ({
      items: items.map((e) => (e.id === event.id ? { ...e, skipDates: (e.skipDates ?? []).filter((d) => d !== date), overrides: (e.overrides ?? []).filter((o) => o.date !== date) } : e)),
    }));
    await hrAudit(ctx, "restored one occurrence", `${event.kind} ${event.title}`, date);
    refresh();
    return done(`${date} is back as the series has it.`);
  });
}


/* ------------------------------------------------------------------ Payroll */

const money = (form: FormData, key: string) => {
  const raw = text(form, key, 20).replace(/,/g, "");
  if (raw === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 && n <= 1_000_000_000 ? Math.round(n * 100) / 100 : NaN;
};
const payLines = (form: FormData, prefix: string) => {
  const lines: { name: string; amount: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const name = text(form, `${prefix}_name_${i}`, 60);
    const amount = money(form, `${prefix}_amount_${i}`);
    if (!name && !amount) continue;
    if (!name || Number.isNaN(amount)) return null;
    lines.push({ name, amount });
  }
  return lines;
};

/** HR or Finance sets someone's monthly salary. Nobody sets their own. */
export async function saveSalaryAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.salaries.manage");
    const employeeId = text(form, "employeeId", 64);
    if (employeeId === ctx.employee.id) return fail("Ask a colleague in HR or Finance to set your own salary.");
    const person = (await readStore("hrEmployees")).find((e) => e.id === employeeId);
    if (!person) return fail("Employee not found.");
    const basic = money(form, "basic");
    const housing = money(form, "housing");
    const transport = money(form, "transport");
    const annualRent = money(form, "annualRent");
    const allowances = payLines(form, "allowance");
    const deductions = payLines(form, "deduction");
    if ([basic, housing, transport, annualRent].some(Number.isNaN)) return fail("Amounts must be numbers of naira (e.g. 250000).");
    if (!basic) return fail("Enter the basic salary.");
    if (!allowances || !deductions) return fail("Each extra allowance or deduction needs a name and an amount.");
    // Each tax or deduction ticked (or not) for this person.
    const rules = payrollRules((await readStore("hrPayrollSettings"))[0]);
    const salary = {
      employeeId,
      basic,
      housing,
      transport,
      annualRent,
      allowances,
      deductions,
      applies: Object.fromEntries(rules.map((r) => [r.id, form.get(`apply_${r.id}`) !== null])),
      updatedAt: new Date().toISOString(),
      updatedByName: ctx.displayName,
    };
    const before = (await readStore("hrSalaries")).find((s) => s.employeeId === employeeId);
    await updateStore("hrSalaries", (items) => ({ items: [...items.filter((s) => s.employeeId !== employeeId), salary] }));
    // The amounts aren't written to the audit trail, only that the salary changed.
    await hrAudit(ctx, before ? "changed salary" : "set salary", employeeName(person));
    refresh();
    return done(`Salary saved for ${employeeName(person)}. It applies to payslips prepared from now on.`);
  });
}

const PAY_BASES = ["basic", "basic_housing_transport", "gross", "gross_before_penalty", "taxable", "annual_rent"] as const;
const RULE_KINDS = ["deduction", "relief", "employer"] as const;

/** HR or Finance adds or edits a tax or statutory deduction (e.g. a new levy, or new PAYE bands). */
export async function savePayrollRuleAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.components.manage");
    const existingId = text(form, "ruleId", 64);
    const name = text(form, "name", 60);
    const method = text(form, "method", 10) as PayrollRule["method"];
    const base = text(form, "base", 30) as PayrollRule["base"];
    const rate = Number(text(form, "rate", 10) || 0);
    const amount = money(form, "amount");
    const kind = (text(form, "kind", 10) || "deduction") as NonNullable<PayrollRule["kind"]>;
    // Only items taken from pay can be "before tax"; reliefs lower taxable pay by definition.
    const beforeTax = kind === "deduction" && form.get("beforeTax") !== null;
    const capRaw = text(form, "cap", 20).replace(/,/g, "");
    const cap = capRaw ? Number(capRaw) : null;
    if (!name) return fail("Give it a name, e.g. Development levy.");
    if (!RULE_KINDS.includes(kind)) return fail("Choose what kind of item it is.");
    if (cap !== null && (!Number.isFinite(cap) || cap <= 0)) return fail("Enter the yearly limit in naira, or leave it blank for no limit.");
    if (kind === "relief" && base === "taxable") return fail("A relief can't be worked out on taxable pay. Choose yearly rent paid, basic, or gross.");
    if (!["percent", "fixed", "bands"].includes(method)) return fail("Choose how it's worked out.");
    if (!PAY_BASES.includes(base)) return fail("Choose what it's worked out on.");
    if (method === "percent" && (!Number.isFinite(rate) || rate <= 0 || rate > 100)) return fail("Enter a percentage above 0 and up to 100.");
    if (method === "fixed" && (Number.isNaN(amount) || amount <= 0)) return fail("Enter the amount in naira a month.");
    if (beforeTax && base === "taxable") return fail("An item taken off before tax can't be worked out on taxable pay. Choose basic, basic + housing + transport, or gross.");
    const bands: PayrollRule["bands"] = [];
    if (method === "bands") {
      for (let i = 0; i < 8; i++) {
        const upToRaw = text(form, `band_upTo_${i}`, 20).replace(/,/g, "");
        const rateRaw = text(form, `band_rate_${i}`, 6);
        if (!upToRaw && !rateRaw) continue;
        const r = Number(rateRaw);
        const upTo = upToRaw ? Number(upToRaw) : null;
        if (!Number.isFinite(r) || r < 0 || r > 100 || (upTo !== null && (!Number.isFinite(upTo) || upTo <= 0))) return fail(`Check band ${i + 1}.`);
        bands.push({ upTo, rate: r });
      }
      if (!bands.length || bands.at(-1)!.upTo !== null) return fail("The last band must have no upper limit (leave its 'up to' blank).");
      if (bands.slice(0, -1).some((b) => b.upTo === null)) return fail("Only the last band can have no upper limit.");
      if (bands.some((b, i) => i > 0 && b.upTo !== null && b.upTo <= (bands[i - 1].upTo ?? Infinity))) return fail("Bands must go up in order.");
    }
    const settings = (await readStore("hrPayrollSettings"))[0];
    const rules = payrollRules(settings);
    const current = existingId ? rules.find((r) => r.id === existingId) : undefined;
    if (existingId && !current) return fail("That item wasn't found.");
    if (rules.some((r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== existingId)) return fail("There's already an item with that name.");
    const rule: PayrollRule = {
      id: current?.id ?? `rule_${randomUUID().slice(0, 8)}`,
      name,
      method,
      rate: method === "percent" ? rate : 0,
      amount: method === "fixed" ? amount : 0,
      base: method === "fixed" ? "gross" : base,
      bands,
      beforeTax,
      defaultOn: form.get("defaultOn") !== null,
      active: existingId ? form.get("active") !== null : true,
      kind,
      cap,
    };
    const next = current ? rules.map((r) => (r.id === rule.id ? rule : r)) : [...rules, rule];
    await updateStore("hrPayrollSettings", () => ({ items: [{ id: "settings" as const, rules: next, updatedAt: new Date().toISOString(), updatedByName: ctx.displayName, rulesVersion: PAYROLL_RULES_VERSION }] }));
    await hrAudit(ctx, current ? "changed payroll item" : "added payroll item", `payroll ${name}`, `${describeRule(rule)}${rule.beforeTax ? ", before tax" : ""}${rule.active ? "" : ", switched off"}`);
    refresh();
    return done(`${name} saved. It applies to payslips prepared from now on; published payslips don't change.`);
  });
}

export async function deletePayrollRuleAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.components.manage");
    const id = text(form, "ruleId", 64);
    const rules = payrollRules((await readStore("hrPayrollSettings"))[0]);
    const rule = rules.find((r) => r.id === id);
    if (!rule) return fail("That item wasn't found.");
    await updateStore("hrPayrollSettings", () => ({ items: [{ id: "settings" as const, rules: rules.filter((r) => r.id !== id), updatedAt: new Date().toISOString(), updatedByName: ctx.displayName, rulesVersion: PAYROLL_RULES_VERSION }] }));
    await hrAudit(ctx, "removed payroll item", `payroll ${rule.name}`);
    refresh();
    return done(`${rule.name} removed. Published payslips keep it.`);
  });
}

/** Prepare draft payslips for a month for every current employee with a salary (published ones stay). */
export async function preparePayslipsAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.runs");
    const month = text(form, "month", 7);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return fail("Choose a month.");
    const [employees, salaries, settingsList, departments, events] = await Promise.all([
      readStore("hrEmployees"),
      readStore("hrSalaries"),
      readStore("hrPayrollSettings"),
      readStore("hrDepartments"),
      readStore("hrEvents"),
    ]);
    // Pay date: as chosen, or the month's last working day.
    let payDate = text(form, "payDate", 10);
    if (payDate && !isDate(payDate)) return fail("Enter a valid pay date.");
    if (!payDate) {
      const holidays = holidayDates(events, Number(month.slice(0, 4)));
      payDate = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10);
      while (!isWorkingDay(payDate, holidays)) payDate = new Date(Date.parse(`${payDate}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
    }
    const rules = payrollRules(settingsList[0]);
    const now = new Date().toISOString();
    const counts = await updateStore<"hrPayslips", { made: number; kept: number }>("hrPayslips", (items) => {
      const published = new Set(items.filter((p) => p.month === month && p.status === "published").map((p) => p.employeeId));
      // Penalties already entered on this month's drafts carry over when the drafts are prepared again.
      const penalties = new Map(items.filter((p) => p.month === month && p.status === "draft" && p.penalty).map((p) => [p.employeeId, { penalty: p.penalty!, penaltyReason: p.penaltyReason ?? "" }]));
      const fresh = employees
        .filter((e) => isCurrentStaff(e) && !published.has(e.id))
        .flatMap((e) => {
          const salary = salaries.find((s) => s.employeeId === e.id);
          if (!salary) return [];
          const kept = penalties.get(e.id);
          const pay = monthlyPay(salary, rules, kept);
          return [
            {
              id: randomUUID(),
              employeeId: e.id,
              month,
              status: "draft" as const,
              employee: {
                name: employeeName(e),
                staffNumber: e.staffNumber,
                jobTitle: e.jobTitle,
                department: departments.find((d) => d.id === e.departmentId)?.name ?? e.department,
                bankName: e.bankName ?? "",
                bankAccountEnding: (e.bankAccountNumber ?? "").slice(-4),
              },
              ...pay,
              preparedByName: ctx.displayName,
              createdAt: now,
              payDate,
              ...(kept ? kept : {}),
            },
          ];
        });
      // Drafts for the month are replaced; published payslips are never changed.
      return { items: [...items.filter((p) => !(p.month === month && p.status === "draft")), ...fresh], result: { made: fresh.length, kept: published.size } };
    });
    const missing = employees.filter((e) => isCurrentStaff(e) && !salaries.some((s) => s.employeeId === e.id)).length;
    await hrAudit(ctx, "prepared payslips", `payslips ${month}`, `${counts?.made ?? 0} drafts`);
    refresh();
    return done(
      `${counts?.made ?? 0} draft payslip${counts?.made === 1 ? "" : "s"} prepared for ${month}.${counts?.kept ? ` ${counts.kept} already published were left as they are.` : ""}${missing ? ` ${missing} current staff have no salary set yet.` : ""} Check them, then publish.`,
    );
  });
}

/** Set (or clear, with 0) a penalty on one draft payslip; its pay is worked out again. */
export async function setPayslipPenaltyAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.runs");
    // Entering a penalty shows that person's pay, so it also needs "See everyone's payslips".
    if (!has(ctx.permissions, "payroll.payslips.view")) throw new HrAccessError("You don't have permission to do that.");
    const payslipId = text(form, "payslipId", 64);
    const penalty = money(form, "penalty");
    const reason = text(form, "penaltyReason", 80);
    if (Number.isNaN(penalty) || penalty < 0) return fail("Enter the penalty in naira (0 to clear it).");
    const [slips, salaries, settingsList] = await Promise.all([readStore("hrPayslips"), readStore("hrSalaries"), readStore("hrPayrollSettings")]);
    const slip = slips.find((p) => p.id === payslipId);
    if (!slip) return fail("Payslip not found.");
    if (slip.status !== "draft") return fail("Published payslips can't be changed.");
    if (slip.employeeId === ctx.employee.id) return fail("Ask a colleague to change your own payslip.");
    const salary = salaries.find((x) => x.employeeId === slip.employeeId);
    if (!salary) return fail("This person has no salary any more; prepare the month again.");
    if (penalty > 0 && !reason) return fail("Give a short reason for the penalty (it shows on the payslip).");
    const pay = monthlyPay(salary, payrollRules(settingsList[0]), { penalty, penaltyReason: reason });
    if (penalty > pay.gross) return fail("The penalty can't be more than the month's gross pay.");
    await updateStore("hrPayslips", (items) => ({
      items: items.map((p) => (p.id === slip.id && p.status === "draft" ? { ...p, ...pay, penalty: penalty || undefined, penaltyReason: penalty ? reason : undefined } : p)),
    }));
    // Amounts aren't written to the audit trail.
    await hrAudit(ctx, penalty ? "set payslip penalty" : "cleared payslip penalty", `payslip ${slip.month} ${slip.employee.name}`, penalty ? reason : "");
    refresh();
    return done(penalty ? `Penalty saved for ${slip.employee.name}; their draft payslip has been worked out again.` : `Penalty cleared for ${slip.employee.name}.`);
  });
}

/** Publish a month's drafts: staff can then see and print them. Published payslips can't be changed. */
export async function publishPayslipsAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.runs");
    const month = text(form, "month", 7);
    const now = new Date().toISOString();
    const n = await updateStore<"hrPayslips", number>("hrPayslips", (items) => {
      let count = 0;
      const next = items.map((p) => (p.month === month && p.status === "draft" ? (count++, { ...p, status: "published" as const, publishedAt: now }) : p));
      return { items: next, result: count };
    });
    if (!n) return fail("There are no drafts to publish for that month.");
    await hrAudit(ctx, "published payslips", `payslips ${month}`, `${n} payslips`);
    refresh();
    return done(`${n} payslip${n === 1 ? "" : "s"} published. Staff can now view and print them under My payslips.`);
  });
}

export async function discardPayslipDraftsAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.runs");
    const month = text(form, "month", 7);
    const n = await updateStore<"hrPayslips", number>("hrPayslips", (items) => {
      const keep = items.filter((p) => !(p.month === month && p.status === "draft"));
      return { items: keep, result: items.length - keep.length };
    });
    if (!n) return done("There were no drafts to discard.");
    await hrAudit(ctx, "discarded payslip drafts", `payslips ${month}`, `${n} drafts`);
    refresh();
    return done(`${n} draft${n === 1 ? "" : "s"} discarded.`);
  });
}

/** Remove someone's salary (e.g. set by mistake). Their published payslips stay. */
export async function removeSalaryAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.salaries.manage");
    const employeeId = text(form, "employeeId", 64);
    if (employeeId === ctx.employee.id) return fail("Ask a colleague in HR or Finance to change your own salary.");
    const person = (await readStore("hrEmployees")).find((e) => e.id === employeeId);
    const had = (await readStore("hrSalaries")).some((s) => s.employeeId === employeeId);
    if (!person || !had) return fail("There's no salary to remove.");
    await updateStore("hrSalaries", (items) => ({ items: items.filter((s) => s.employeeId !== employeeId) }));
    await hrAudit(ctx, "removed salary", employeeName(person));
    refresh();
    return done(`Salary removed for ${employeeName(person)}. Their published payslips stay.`);
  });
}

/** Switch a tax or deduction on or off without removing it. */
export async function setPayrollRuleActiveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("payroll.components.manage");
    const id = text(form, "ruleId", 64);
    const active = text(form, "active", 5) === "true";
    const rules = payrollRules((await readStore("hrPayrollSettings"))[0]);
    const rule = rules.find((r) => r.id === id);
    if (!rule) return fail("That item wasn't found.");
    await updateStore("hrPayrollSettings", () => ({ items: [{ id: "settings" as const, rules: rules.map((r) => (r.id === id ? { ...r, active } : r)), updatedAt: new Date().toISOString(), updatedByName: ctx.displayName, rulesVersion: PAYROLL_RULES_VERSION }] }));
    await hrAudit(ctx, active ? "switched on payroll item" : "switched off payroll item", `payroll ${rule.name}`);
    refresh();
    return done(`${rule.name} is ${active ? "in use again" : "switched off"} for payslips prepared from now on.`);
  });
}

