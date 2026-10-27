/**
 * Leave balances for many people at once, as a table HR can print or download: one row per
 * employee, with either one leave type in full detail or every type side by side.
 */
import { balanceFor, type BalanceRow } from "@/lib/hr/leave-balance";
import { employeeName, type HrEmployee, type HrLeaveAdjustment, type HrLeavePolicy, type HrLeaveRequest, type HrLeaveType } from "@/lib/hr/types";

export interface BalanceSheetRow {
  employee: HrEmployee;
  /** By leave type id. */
  balances: Map<string, BalanceRow>;
}

/** Columns for one leave type shown in full. */
export const DETAIL_COLUMNS = [
  { key: "entitlement", label: "Allowance" },
  { key: "carried", label: "Carried forward" },
  { key: "adjusted", label: "Adjusted" },
  { key: "total", label: "Total" },
  { key: "used", label: "Used" },
  { key: "pending", label: "Pending" },
  { key: "available", label: "Left" },
] as const;

export function balanceSheet(
  staff: HrEmployee[],
  year: number,
  types: HrLeaveType[],
  policies: HrLeavePolicy[],
  leave: HrLeaveRequest[],
  adjustments: HrLeaveAdjustment[],
): BalanceSheetRow[] {
  return staff.map((employee) => ({
    employee,
    balances: new Map(balanceFor(employee, year, types, policies, leave, adjustments).map((r) => [r.type.id, r])),
  }));
}

const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** One cell in the all-types view: "3 of 5 left" (or "0 of 5 left, 2 over"); unlimited types show days used. */
export function summaryCell(r: BalanceRow | undefined): string {
  if (!r) return "–";
  if (r.total === null) return r.used ? `${n(r.used)} used` : "No limit";
  const left = r.available ?? 0;
  return left < 0 ? `0 of ${n(r.total)} left, ${n(-left)} over` : `${n(left)} of ${n(r.total)} left`;
}

/** One cell in the single-type view. */
export function detailCell(r: BalanceRow | undefined, key: (typeof DETAIL_COLUMNS)[number]["key"]): string {
  if (!r) return "–";
  const v = r[key];
  if (v === null) return key === "used" || key === "pending" ? "0" : "No limit";
  if (key === "available" && v < 0) return `0 (${n(-v)} over)`;
  return n(v);
}

/** The rows as CSV cells: the chosen type in detail, or every type's summary. */
export function balanceSheetCsv(rows: BalanceSheetRow[], types: HrLeaveType[], detail: HrLeaveType | undefined): { head: string[]; body: string[][] } {
  const who = (e: HrEmployee) => [employeeName(e), e.staffNumber, e.department, e.jobTitle];
  if (detail) {
    return {
      head: ["Employee", "Staff number", "Department", "Job title", ...DETAIL_COLUMNS.map((c) => `${detail.name}: ${c.label}`)],
      body: rows.map((r) => [...who(r.employee), ...DETAIL_COLUMNS.map((c) => detailCell(r.balances.get(detail.id), c.key))]),
    };
  }
  return {
    head: ["Employee", "Staff number", "Department", "Job title", ...types.map((t) => t.name)],
    body: rows.map((r) => [...who(r.employee), ...types.map((t) => summaryCell(r.balances.get(t.id)))]),
  };
}
