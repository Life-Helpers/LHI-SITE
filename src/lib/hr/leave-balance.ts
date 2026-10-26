/**
 * Leave balances, worked out live from leave types, policies, adjustments and the leave
 * requests themselves, so they are always current (nothing to re-sync).
 */
import type { HrEmployee, HrLeaveAdjustment, HrLeavePolicy, HrLeaveRequest, HrLeaveType } from "@/lib/hr/types";

type Who = Pick<HrEmployee, "departmentId" | "employmentType">;

/** The policy for this person and leave type: department beats employment type beats all staff. */
export function policyFor(employee: Who, typeId: string, policies: HrLeavePolicy[]): HrLeavePolicy | undefined {
  const mine = policies.filter((p) => p.active && p.typeId === typeId);
  return (
    mine.find((p) => p.scope === "department" && p.scopeValue && p.scopeValue === employee.departmentId) ??
    mine.find((p) => p.scope === "employmentType" && p.scopeValue && p.scopeValue === employee.employmentType) ??
    mine.find((p) => p.scope === "all")
  );
}

/** Days a year of this leave type for this person, or null when the type isn't limited. */
export function entitlementFor(employee: Who, type: HrLeaveType, policies: HrLeavePolicy[]): number | null {
  const policy = policyFor(employee, type.id, policies);
  return policy ? policy.days : type.defaultDays;
}

/** Does a request of this type need someone to approve it? (Yes unless its policy says not.) */
export function approvalRequired(employee: Who, typeId: string, policies: HrLeavePolicy[]): boolean {
  return policyFor(employee, typeId, policies)?.approvalRequired ?? true;
}

function taken(employeeId: string, typeId: string, year: number, leave: HrLeaveRequest[]) {
  const rows = leave.filter((l) => l.employeeId === employeeId && l.type === typeId && l.startDate.startsWith(`${year}-`));
  return {
    approved: rows.filter((l) => l.status === "approved").reduce((n, l) => n + l.days, 0),
    pending: rows.filter((l) => l.status === "pending").reduce((n, l) => n + l.days, 0),
  };
}

const adjusted = (employeeId: string, typeId: string, year: number, adjustments: HrLeaveAdjustment[]) =>
  adjustments.filter((a) => a.employeeId === employeeId && a.typeId === typeId && a.year === year).reduce((n, a) => n + a.days, 0);

export interface BalanceRow {
  type: HrLeaveType;
  /** Yearly allowance from policy or type default; null = not limited. */
  entitlement: number | null;
  carried: number;
  adjusted: number;
  /** Allowance + carried + adjustments; null = not limited. */
  total: number | null;
  /** Approved days. */
  used: number;
  pending: number;
  /** Total − used − pending; null = not limited. */
  available: number | null;
}

/** One person's balances for a year: every active type, plus retired types they used that year. */
export function balanceFor(
  employee: HrEmployee,
  year: number,
  types: HrLeaveType[],
  policies: HrLeavePolicy[],
  leave: HrLeaveRequest[],
  adjustments: HrLeaveAdjustment[],
): BalanceRow[] {
  return types
    .map((type) => {
      const entitlement = entitlementFor(employee, type, policies);
      const carryCap = policyFor(employee, type.id, policies)?.carryForward ?? 0;
      const { approved, pending } = taken(employee.id, type.id, year, leave);
      const adj = adjusted(employee.id, type.id, year, adjustments);
      let carried = 0;
      if (entitlement !== null && carryCap > 0) {
        const prev = taken(employee.id, type.id, year - 1, leave);
        const prevLeft = entitlement + adjusted(employee.id, type.id, year - 1, adjustments) - prev.approved;
        carried = Math.max(0, Math.min(carryCap, prevLeft));
      }
      const total = entitlement === null ? null : entitlement + carried + adj;
      return { type, entitlement, carried, adjusted: adj, total, used: approved, pending, available: total === null ? null : total - approved - pending };
    })
    .filter((r) => r.type.active || r.used > 0 || r.pending > 0);
}

/** Can this person take `days` more of this type? Unlimited types always can. */
export function withinBalance(row: BalanceRow | undefined, days: number) {
  return !row || row.available === null || days <= row.available;
}
