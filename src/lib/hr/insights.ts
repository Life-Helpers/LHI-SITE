/**
 * "Needs attention" for the dashboards: rules over the records that turn figures into things
 * to do, most urgent first. Pure functions, so each page and its tests work them out the same way.
 */
import { awaitingReliever, isWorkingDay } from "@/lib/hr/access";
import { employeeName, isCurrentStaff, type HrAccount, type HrEmployee, type HrLeaveRequest, type HrPayslip, type HrSalary } from "@/lib/hr/types";

export type InsightTone = "critical" | "warning" | "info" | "good";
export interface Insight {
  id: string;
  tone: InsightTone;
  title: string;
  detail?: string;
  href?: string;
  /** Link text, e.g. "Review". */
  action?: string;
}

const DAY = 86_400_000;
const at = (iso: string) => Date.parse(`${iso.slice(0, 10)}T12:00:00Z`);
const addDays = (iso: string, n: number) => new Date(at(iso) + n * DAY).toISOString().slice(0, 10);
const ageDays = (iso: string, today: string) => Math.floor((at(today) - at(iso)) / DAY);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const SHORT = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const short = (iso: string) => SHORT.format(new Date(`${iso}T12:00:00Z`));
const names = (list: string[], max = 3) => (list.length <= max ? list.join(", ") : `${list.slice(0, max).join(", ")} and ${list.length - max} more`);

const ORDER: Record<InsightTone, number> = { critical: 0, warning: 1, info: 2, good: 3 };
export const byUrgency = (items: Insight[]) => [...items].sort((a, b) => ORDER[a.tone] - ORDER[b.tone]);

/** The next `n` working days from today (today included when it is one). */
function nextWorkingDays(today: string, n: number, holidays?: ReadonlySet<string>) {
  const out: string[] = [];
  for (let d = today; out.length < n; d = addDays(d, 1)) if (isWorkingDay(d, holidays)) out.push(d);
  return out;
}

/** Leave that needs someone to act: decisions due, stuck relievers, early returns and thin cover. */
export function leaveInsights({
  leave,
  employees,
  today,
  holidays,
  href,
  groupOf,
}: {
  leave: HrLeaveRequest[];
  employees: HrEmployee[];
  today: string;
  holidays?: ReadonlySet<string>;
  /** Where the leave list lives (HR's or the team's). */
  href: string;
  /** How to group staff when checking cover (department name); omit to treat everyone as one group. */
  groupOf?: (e: HrEmployee) => string;
}): Insight[] {
  const out: Insight[] = [];
  const nameOf = (id: string) => employeeName(employees.find((e) => e.id === id));
  const pending = leave.filter((l) => l.status === "pending");
  const soonCut = nextWorkingDays(today, 3, holidays).at(-1)!;
  const urgent = pending.filter((l) => l.startDate <= soonCut);
  if (urgent.length) {
    out.push({
      id: "leave-urgent",
      tone: "critical",
      title: `${plural(urgent.length, "leave request")} ${urgent.length === 1 ? "starts" : "start"} within 3 working days with no decision`,
      detail: names(urgent.map((l) => `${nameOf(l.employeeId)} (${short(l.startDate)})`)),
      href,
      action: "Decide",
    });
  }
  const stale = pending.filter((l) => !urgent.includes(l) && ageDays(l.createdAt, today) > 3);
  if (stale.length) {
    const oldest = Math.max(...stale.map((l) => ageDays(l.createdAt, today)));
    out.push({ id: "leave-stale", tone: "warning", title: `${plural(stale.length, "leave request")} waiting more than 3 days`, detail: `The oldest has waited ${plural(oldest, "day")}.`, href, action: "Review" });
  }
  const stuck = pending.filter((l) => awaitingReliever(l) && l.relieverStatus !== "declined" && ageDays(l.createdAt, today) >= 2);
  if (stuck.length) {
    out.push({ id: "leave-reliever", tone: "warning", title: `${plural(stuck.length, "request")} still waiting for the reliever to confirm`, detail: names(stuck.map((l) => `${nameOf(l.relieverId!)} for ${nameOf(l.employeeId)}`)), href, action: "View" });
  }
  const declined = pending.filter((l) => l.relieverStatus === "declined");
  if (declined.length) {
    out.push({ id: "leave-declined", tone: "info", title: `${plural(declined.length, "reliever")} declined; the applicant must choose someone else`, detail: names(declined.map((l) => nameOf(l.employeeId))), href, action: "View" });
  }
  const returning = leave.filter((l) => l.status === "approved" && l.returnRequest);
  if (returning.length) {
    out.push({ id: "leave-return", tone: "warning", title: `${plural(returning.length, "early return")} to confirm`, detail: names(returning.map((l) => `${nameOf(l.employeeId)} back ${short(l.returnRequest!.resumeDate)}`)), href, action: "Confirm" });
  }

  // Cover: a group of three or more where at least 40% are away on one of the next 10 working days.
  const staff = employees.filter((e) => isCurrentStaff(e));
  const group = groupOf ?? (() => "Your team");
  const sizes = new Map<string, number>();
  for (const e of staff) sizes.set(group(e), (sizes.get(group(e)) ?? 0) + 1);
  const approved = leave.filter((l) => l.status === "approved");
  const thin: { g: string; day: string; off: number; size: number }[] = [];
  for (const [g, size] of sizes) {
    if (!g || size < 3) continue;
    const ids = new Set(staff.filter((e) => group(e) === g).map((e) => e.id));
    for (const day of nextWorkingDays(today, 10, holidays)) {
      const off = new Set(approved.filter((l) => ids.has(l.employeeId) && l.startDate <= day && l.endDate >= day).map((l) => l.employeeId)).size;
      if (off / size >= 0.4) {
        thin.push({ g, day, off, size });
        break;
      }
    }
  }
  if (thin.length) {
    out.push({ id: "leave-cover", tone: "warning", title: `Thin cover coming up in ${plural(thin.length, "team")}`, detail: thin.map((t) => `${t.g}: ${t.off} of ${t.size} away on ${short(t.day)}`).join(" · "), href: "/hrportal/calendar", action: "Calendar" });
  }
  return out;
}

/** Gaps in staff records. */
export function peopleInsights({ employees, today }: { employees: HrEmployee[]; today: string }): Insight[] {
  const out: Insight[] = [];
  const staff = employees.filter((e) => isCurrentStaff(e));
  const noDept = staff.filter((e) => !e.departmentId && !e.department);
  if (noDept.length) out.push({ id: "people-dept", tone: "warning", title: `${plural(noDept.length, "employee")} with no department`, detail: "Their leave requests have no head of department to go to.", href: "/hrportal/hr/employees", action: "Fix" });
  const longProbation = staff.filter((e) => e.status === "probation" && e.startDate && ageDays(e.startDate, today) > 182);
  if (longProbation.length) out.push({ id: "people-probation", tone: "warning", title: `${plural(longProbation.length, "employee")} on probation for over six months`, detail: names(longProbation.map((e) => employeeName(e))), href: "/hrportal/hr/employees?tab=probation", action: "Review" });
  const joining = staff.filter((e) => e.startDate > today && e.startDate <= addDays(today, 14));
  if (joining.length) out.push({ id: "people-joining", tone: "info", title: `${plural(joining.length, "new starter")} in the next two weeks`, detail: names(joining.map((e) => `${employeeName(e)} (${short(e.startDate)})`)), href: "/hrportal/hr/employees", action: "View" });
  return out;
}

/** Staff who can't use the portal yet. */
export function accountInsights({ employees, accounts, today }: { employees: HrEmployee[]; accounts: HrAccount[]; today: string }): Insight[] {
  const out: Insight[] = [];
  const staff = employees.filter((e) => isCurrentStaff(e));
  const withLogin = new Set(accounts.filter((a) => a.active).map((a) => a.employeeId));
  const none = staff.filter((e) => !withLogin.has(e.id));
  if (none.length) out.push({ id: "accounts-none", tone: "info", title: `${plural(none.length, "employee")} without a portal login`, detail: "They can't request leave or see payslips themselves.", href: "/hrportal/hr/accounts", action: "Invite" });
  const unused = accounts.filter((a) => a.active && !a.passwordHash && ageDays(a.createdAt, today) > 7);
  if (unused.length) out.push({ id: "accounts-unused", tone: "warning", title: `${plural(unused.length, "invite")} unused for over a week`, detail: "Send a fresh sign-in link.", href: "/hrportal/hr/accounts", action: "Resend" });
  return out;
}

/** Salaries missing and this month's payroll run. */
export function payrollInsights({ employees, salaries, payslips, today, holidays }: { employees: HrEmployee[]; salaries: HrSalary[]; payslips: HrPayslip[]; today: string; holidays?: ReadonlySet<string> }): Insight[] {
  const out: Insight[] = [];
  const staff = employees.filter((e) => isCurrentStaff(e));
  const paid = new Set(salaries.map((s) => s.employeeId));
  const noSalary = staff.filter((e) => !paid.has(e.id));
  if (noSalary.length) out.push({ id: "payroll-salary", tone: "warning", title: `${plural(noSalary.length, "employee")} with no salary set`, detail: "They won't get a payslip.", href: "/hrportal/payroll/salaries?tab=unset", action: "Set" });
  const month = today.slice(0, 7);
  const run = payslips.filter((p) => p.month === month);
  const drafts = run.filter((p) => p.status === "draft");
  const last = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10);
  let payDay = last;
  while (!isWorkingDay(payDay, holidays)) payDay = addDays(payDay, -1);
  const payDate = run.find((p) => p.payDate)?.payDate ?? payDay;
  const daysToPay = Math.round((at(payDate) - at(today)) / DAY);
  const label = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-15T12:00:00Z`));
  if (!run.length && daysToPay <= 10) {
    out.push({ id: "payroll-run", tone: daysToPay <= 3 ? "critical" : "warning", title: `${label} payroll hasn't been prepared`, detail: daysToPay >= 0 ? `Pay day is ${short(payDate)}, in ${plural(daysToPay, "day")}.` : `Pay day was ${short(payDate)}.`, href: "/hrportal/payroll/runs", action: "Prepare" });
  } else if (drafts.length) {
    out.push({ id: "payroll-drafts", tone: daysToPay <= 2 ? "critical" : "warning", title: `${label}: ${plural(drafts.length, "draft payslip")} to check and publish`, detail: `Pay day is ${short(payDate)}.`, href: `/hrportal/payroll/runs/${month}`, action: "Publish" });
  }
  return out;
}

/** For one person: leave left as the year runs out. (Relief requests have their own panel.) */
export function myInsights({ today, annualLeft, annualName }: { today: string; annualLeft: number | null; annualName: string }): Insight[] {
  const out: Insight[] = [];
  const yearEnd = `${today.slice(0, 4)}-12-31`;
  const weeksLeft = Math.ceil((at(yearEnd) - at(today)) / (7 * DAY));
  if (annualLeft && annualLeft > 0 && weeksLeft <= 12) {
    out.push({ id: "me-annual", tone: "info", title: `${plural(annualLeft, `${annualName} day`)} left, with ${plural(weeksLeft, "week")} of the year to go`, detail: "Check your leave policy for how many days carry forward.", href: "/hrportal/me", action: "Plan leave" });
  }
  return out;
}
