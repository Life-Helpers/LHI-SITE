/**
 * Dashboard analytics: pure functions over employee and leave records, so every figure on
 * the HR dashboard, Reports, My team and My record is worked out the same way.
 */
import { workingDays } from "@/lib/hr/access";
import { isCurrentStaff, type HrEmployee, type HrLeaveRequest, type HrLeaveType } from "@/lib/hr/types";

const DAY = 86_400_000;
const at = (iso: string) => Date.parse(`${iso.slice(0, 10)}T12:00:00Z`);

/** The last `n` calendar months up to and including today's, oldest first, as "YYYY-MM". */
export function lastMonths(today: string, n = 12): string[] {
  const [y, m] = today.split("-").map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (n - 1 - i), 1));
    return d.toISOString().slice(0, 7);
  });
}

const MONTH_LABEL = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
export const monthLabel = (ym: string) => MONTH_LABEL.format(new Date(`${ym}-15T12:00:00Z`));
export const monthYearLabel = (ym: string) => MONTH_YEAR.format(new Date(`${ym}-15T12:00:00Z`));

const monthEnd = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
};

/** When someone joined: their start date, or when their record was created. */
const joined = (e: HrEmployee) => (e.startDate || e.createdAt).slice(0, 10);
/** When a former employee's record last changed: the best date we have for when they left. */
const leftOn = (e: HrEmployee) => (isCurrentStaff(e) ? null : e.updatedAt.slice(0, 10));

/** Staff on the books at the end of each month. Leavers count until their record was marked. */
export function headcountByMonth(employees: HrEmployee[], months: string[]): number[] {
  return months.map((ym) => {
    const end = monthEnd(ym);
    return employees.filter((e) => joined(e) <= end && (leftOn(e) === null || leftOn(e)! > end)).length;
  });
}

/** New starters per month (by start date). */
export function hiresByMonth(employees: HrEmployee[], months: string[]): number[] {
  return months.map((ym) => employees.filter((e) => e.startDate.startsWith(ym)).length);
}

/** Staff recorded as inactive or terminated per month. */
export function leaversByMonth(employees: HrEmployee[], months: string[]): number[] {
  return months.map((ym) => employees.filter((e) => leftOn(e)?.startsWith(ym)).length);
}

/** Leavers in the period divided by average headcount, as a percentage. */
export function turnoverRate(employees: HrEmployee[], months: string[]): number | null {
  const heads = headcountByMonth(employees, months);
  const average = heads.reduce((n, h) => n + h, 0) / Math.max(1, heads.length);
  const leavers = leaversByMonth(employees, months).reduce((n, h) => n + h, 0);
  return average > 0 ? (leavers / average) * 100 : null;
}

/** Years of service per current employee. */
export function tenureYears(e: HrEmployee, today: string) {
  return Math.max(0, (at(today) - at(joined(e))) / (365.25 * DAY));
}

export const TENURE_BANDS = ["Under 1 year", "1–3 years", "3–5 years", "5+ years"] as const;

export function tenureBands(active: HrEmployee[], today: string): { label: string; value: number }[] {
  const counts = [0, 0, 0, 0];
  for (const e of active) {
    const y = tenureYears(e, today);
    counts[y < 1 ? 0 : y < 3 ? 1 : y < 5 ? 2 : 3] += 1;
  }
  return TENURE_BANDS.map((label, i) => ({ label, value: counts[i] }));
}

/** Count rows by a key, biggest first; blanks become "Not recorded". */
export function countBy<T>(rows: T[], key: (r: T) => string | undefined): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = key(r)?.trim() || "Not recorded";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

/** Keep the biggest `max - 1` rows and fold the rest into "Other". */
export function foldOther(rows: { label: string; value: number }[], max = 8) {
  if (rows.length <= max) return rows;
  const kept = rows.slice(0, max - 1);
  return [...kept, { label: `Other (${rows.length - kept.length})`, value: rows.slice(max - 1).reduce((n, r) => n + r.value, 0) }];
}

/** Approved working days of leave per month and leave type (counted in the month the leave starts). */
export function leaveDaysByMonth(leave: HrLeaveRequest[], months: string[], types: HrLeaveType[]) {
  const approved = leave.filter((l) => l.status === "approved");
  return types
    .map((t) => ({ type: t, values: months.map((ym) => approved.filter((l) => l.type === t.id && l.startDate.startsWith(ym)).reduce((n, l) => n + l.days, 0)) }))
    .filter((s) => s.values.some((v) => v > 0));
}

export const LEAVE_STATUSES = ["approved", "pending", "rejected", "cancelled"] as const;

export function statusCounts(leave: HrLeaveRequest[]) {
  return LEAVE_STATUSES.map((status) => ({ status, value: leave.filter((l) => l.status === status).length }));
}

/** Share of decided requests that were approved, as a percentage. */
export function approvalRate(leave: HrLeaveRequest[]): number | null {
  const decided = leave.filter((l) => l.status === "approved" || l.status === "rejected");
  return decided.length ? (decided.filter((l) => l.status === "approved").length / decided.length) * 100 : null;
}

/** Average days from request to decision, for requests someone decided (not automatic approvals). */
export function averageDecisionDays(leave: HrLeaveRequest[]): number | null {
  const decided = leave.filter((l) => l.decidedAt && l.decidedByAccountId && !["policy", "sample"].includes(l.decidedByAccountId));
  if (!decided.length) return null;
  return decided.reduce((n, l) => n + Math.max(0, (Date.parse(l.decidedAt!) - Date.parse(l.createdAt)) / DAY), 0) / decided.length;
}

/**
 * Absence rate: approved leave days taken so far this year as a share of the working days
 * available to current staff so far this year.
 */
export function absenceRate(leave: HrLeaveRequest[], active: HrEmployee[], today: string): number | null {
  const yearStart = `${today.slice(0, 4)}-01-01`;
  const ids = new Set(active.map((e) => e.id));
  let available = 0;
  for (const e of active) {
    const from = joined(e) > yearStart ? joined(e) : yearStart;
    if (from <= today) available += workingDays(from, today);
  }
  if (!available) return null;
  let taken = 0;
  for (const l of leave) {
    if (l.status !== "approved" || !ids.has(l.employeeId) || l.endDate < yearStart || l.startDate > today) continue;
    taken += workingDays(l.startDate < yearStart ? yearStart : l.startDate, l.endDate > today ? today : l.endDate);
  }
  return (taken / available) * 100;
}

/** Approved or pending leave starting in the next `days` days, as working days per employee. */
export function upcomingLeave(leave: HrLeaveRequest[], today: string, days = 30) {
  const until = new Date(at(today) + days * DAY).toISOString().slice(0, 10);
  return leave.filter((l) => (l.status === "approved" || l.status === "pending") && l.endDate >= today && l.startDate <= until);
}

/** Who is off on each working day in the next `days` days (for the absence forecast). */
export function absenceForecast(leave: HrLeaveRequest[], today: string, days = 14) {
  const out: { date: string; value: number }[] = [];
  for (let i = 0; out.length < days && i < days * 2; i++) {
    const d = new Date(at(today) + i * DAY);
    if (d.getUTCDay() === 0 || d.getUTCDay() === 6) continue;
    const iso = d.toISOString().slice(0, 10);
    out.push({ date: iso, value: new Set(leave.filter((l) => l.status === "approved" && l.startDate <= iso && l.endDate >= iso).map((l) => l.employeeId)).size });
  }
  return out;
}

export const pct = (v: number | null, digits = 1) => (v === null ? "—" : `${v.toFixed(digits).replace(/\.0$/, "")}%`);
export const num = (v: number | null, digits = 1) => (v === null ? "—" : v.toFixed(digits).replace(/\.0$/, ""));
