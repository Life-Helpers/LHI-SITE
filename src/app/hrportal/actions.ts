"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

import { getCurrentUser, hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";
import { rateLimited } from "@/lib/rate-limit";
import {
  accessProblem,
  annualLeaveUsed,
  canDecideLeave,
  canGrant,
  canManageAccount,
  createsReportingLoop,
  effectivePermissions,
  findRole,
  has,
  homePath,
  workingDays,
} from "@/lib/hr/access";
import { mapEmployeeRows, parseCsv } from "@/lib/hr/csv-import";
import { consumeHrToken, createHrToken, hrAudit, peekHrToken } from "@/lib/hr/data";
import { createHrSession, destroyHrSession, HrAccessError, requireHrAction, type HrContext } from "@/lib/hr/session";
import {
  BUILT_IN_HR_ROLES,
  employeeName,
  STANDARD_DEPARTMENTS,
  isEmployeeStatus,
  statusLabel,
  isHrPermission,
  LEAVE_TYPES,
  type HrAccount,
  type HrDepartment,
  type HrEmployee,
  type HrPermission,
  type LeaveType,
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

// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
let dummyHash: Promise<string> | null = null;

export async function hrSignInAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  try {
    const address = email(form);
    const password = String(form.get("password") ?? "").slice(0, 200);
    if (!address || !password) return fail("Enter your email and password.");
    if (locked(address)) return fail("Too many failed attempts. Try again in 15 minutes.");
    if (await rateLimited(new Request("http://hrportal.local/", { headers: await headers() }), "hr-login", 30, 900)) {
      return fail("Too many sign-in attempts from this connection. Try again in 15 minutes.");
    }
    const account = (await readStore("hrAccounts")).find((a) => a.email === address);
    dummyHash ??= hashPassword(randomUUID());
    const valid = await verifyPassword(password, account?.passwordHash ?? (await dummyHash));
    if (!account || !account.passwordHash || !valid) {
      noteFailure(address);
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
      const next = { ...found, passwordHash, sessionVersion: found.sessionVersion + 1 };
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
      annualLeaveDays: 20,
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
    // Always the signed-in person's own record: no employee id is taken from the form.
    await updateStore("hrEmployees", (items) => ({
      items: items.map((e) => (e.id === ctx.employee.id ? { ...e, ...changes, updatedAt: new Date().toISOString() } : e)),
    }));
    refresh();
    return done("Your contact details are saved.");
  });
}

/** Validate a leave request for `employee`. Returns the details, or an error message. */
async function checkLeave(form: FormData, employee: HrEmployee, who: "you" | "they") {
  const type = text(form, "type", 40) as LeaveType;
  const startDate = text(form, "startDate", 10);
  const endDate = text(form, "endDate", 10);
  const reason = text(form, "reason", 500);
  if (!LEAVE_TYPES.includes(type)) return { error: "Choose a leave type." };
  if (!isDate(startDate) || !isDate(endDate) || endDate < startDate) return { error: "Enter a valid start and end date." };
  const days = workingDays(startDate, endDate);
  if (days < 1) return { error: "The dates chosen don't include any working days." };
  if (days > 130) return { error: "A single request can cover at most 130 working days." };
  const leave = await readStore("hrLeave");
  const booked = leave.filter((l) => l.employeeId === employee.id && (l.status === "pending" || l.status === "approved"));
  if (booked.some((l) => l.startDate <= endDate && l.endDate >= startDate)) {
    return { error: `${who === "you" ? "You already have" : "They already have"} leave booked or pending in those dates.` };
  }
  if (type === "Annual") {
    const used = annualLeaveUsed(employee.id, Number(startDate.slice(0, 4)), leave);
    const left = employee.annualLeaveDays - used.approved - used.pending;
    if (days > left) {
      return { error: `That's ${days} working days, but ${who === "you" ? "you have" : "they have"} ${Math.max(0, left)} annual leave days left this year (including pending requests).` };
    }
  }
  return { type, startDate, endDate, reason, days };
}

export async function requestLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.request");
    // Always for the signed-in person: no employee id is taken from the form.
    const checked = await checkLeave(form, ctx.employee, "you");
    if ("error" in checked) return fail(checked.error!);
    const { type, startDate, endDate, reason, days } = checked;
    await updateStore("hrLeave", (items) => ({
      items: [
        { id: randomUUID(), employeeId: ctx.employee.id, type, startDate, endDate, days, reason, status: "pending" as const, createdAt: new Date().toISOString() },
        ...items,
      ],
    }));
    refresh();
    return done(`Leave request sent: ${days} working day${days === 1 ? "" : "s"}.`);
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
    await updateStore("hrLeave", (items) => ({
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
          ...(approved ? { decidedByAccountId: ctx.account.id, decidedByName: ctx.displayName, decidedAt: now, decisionNote: "Recorded by HR" } : {}),
        },
        ...items,
      ],
    }));
    await hrAudit(ctx, approved ? "recorded approved leave" : "recorded leave application", `leave of ${employeeName(employee)}`, `${type}, ${startDate} to ${endDate} (${days} days)`);
    refresh();
    return done(`${type} leave recorded for ${employeeName(employee)} (${days} working day${days === 1 ? "" : "s"}, ${approved ? "approved" : "pending"}).`);
  });
}

export async function cancelMyLeaveAction(_prev: HrResult | null, form: FormData): Promise<HrResult> {
  return guarded(async () => {
    const ctx = await requireHrAction("leave.request");
    const id = text(form, "leaveId", 64);
    const ok = await updateStore("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      // Only the person's own, still-pending requests.
      if (!found || found.employeeId !== ctx.employee.id || found.status !== "pending") return { items, result: false };
      return { items: items.map((l) => (l.id === id ? { ...l, status: "cancelled" as const } : l)), result: true };
    });
    if (!ok) return fail("That request can't be cancelled.");
    refresh();
    return done("Request cancelled.");
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
    const employees = await readStore("hrEmployees");
    const decided = await updateStore("hrLeave", (items) => {
      const found = items.find((l) => l.id === id);
      if (!found || !canDecideLeave(ctx.actor, found, employees, ctx.departments)) return { items, result: null };
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
    if (!decided) return fail("You can't decide this request (it may already be decided, be your own, or be outside your team).");
    const who = employeeName(employees.find((e) => e.id === decided.employeeId));
    await hrAudit(ctx, `${decided.status} leave`, `leave of ${who}`, `${decided.type}, ${decided.startDate} to ${decided.endDate} (${decided.days} days)${note ? `. Note: ${note}` : ""}`);
    refresh();
    return done(`Leave ${decided.status} for ${who}.`);
  });
}

/* ------------------------------------------------------------------ Employee records */

function employeeFields(form: FormData, departments: HrDepartment[]) {
  const annual = Number(text(form, "annualLeaveDays", 4));
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
    annualLeaveDays: Number.isFinite(annual) && annual >= 0 && annual <= 365 ? Math.round(annual) : 20,
  };
}

function checkEmployee(fields: ReturnType<typeof employeeFields>, employees: HrEmployee[], selfId: string | null, form?: FormData): string | null {
  if (!fields.firstName || !fields.lastName) return "Enter a first and last name.";
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
    return done(`Account created for ${employeeName(employee)}. Send them this one-time link (valid 7 days) to set their password.`, `${await baseUrl()}/hrportal/activate?token=${token}`);
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
    if (!canGrant(ctx.actor, [...role.permissions, ...target.extraPermissions])) return fail("You can't give access you don't have yourself.");
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
    const extra = permsFrom(form);
    const added = extra.filter((p) => !target.extraPermissions.includes(p));
    const removed = target.extraPermissions.filter((p) => !extra.includes(p));
    if (!added.length && !removed.length) return done("No change.");
    if (!canGrant(ctx.actor, added)) return fail("You can't give permissions you don't have yourself.");
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
      if (role && !canGrant(ctx.actor, [...role.permissions, ...target.extraPermissions])) return fail("You can't reactivate an account with more access than you have.");
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
        annualLeaveDays: 20,
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
