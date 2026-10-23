import { describe, expect, it } from "vitest";

import { balanceFor, entitlementFor, withinBalance } from "@/lib/hr/leave-balance";
import { DEFAULT_LEAVE_TYPES, type HrEmployee, type HrLeaveAdjustment, type HrLeavePolicy, type HrLeaveRequest, type HrLeaveType } from "@/lib/hr/types";

const person = (opts: Partial<HrEmployee> = {}): HrEmployee =>
  ({ id: "p1", firstName: "A", lastName: "B", status: "active", departmentId: "prog", employmentType: "Full-time", ...opts }) as HrEmployee;
const types: HrLeaveType[] = DEFAULT_LEAVE_TYPES.map((t) => (t.id === "Annual" ? { ...t, carryOver: true } : t));
const annual = types.find((t) => t.id === "Annual")!;
const sick = types.find((t) => t.id === "Sick")!;
const policy = (p: Partial<HrLeavePolicy>): HrLeavePolicy => ({
  id: p.id ?? "x",
  name: "",
  description: "",
  scope: "all",
  scopeValue: "",
  entitlements: {},
  carryOverMax: 0,
  active: true,
  createdAt: "",
  updatedAt: "",
  ...p,
});
const leave = (type: string, start: string, days: number, status: HrLeaveRequest["status"] = "approved"): HrLeaveRequest => ({
  id: `${type}${start}`,
  employeeId: "p1",
  type,
  startDate: start,
  endDate: start,
  days,
  reason: "",
  status,
  createdAt: "",
});

describe("leave allowances", () => {
  it("use the type's default, then the most specific matching policy", () => {
    expect(entitlementFor(person(), annual, [])).toBe(20);
    expect(entitlementFor(person(), sick, [])).toBeNull();
    const policies = [
      policy({ id: "all", entitlements: { Annual: 21, Sick: 10 } }),
      policy({ id: "ft", scope: "employmentType", scopeValue: "Full-time", entitlements: { Annual: 22 } }),
      policy({ id: "dept", scope: "department", scopeValue: "prog", entitlements: { Annual: 25 } }),
      policy({ id: "off", scope: "department", scopeValue: "prog", entitlements: { Annual: 99 }, active: false }),
    ];
    expect(entitlementFor(person(), annual, policies)).toBe(25);
    expect(entitlementFor(person({ departmentId: "fin" }), annual, policies)).toBe(22);
    expect(entitlementFor(person({ departmentId: "fin", employmentType: "Consultancy" }), annual, policies)).toBe(21);
    // A type the specific policies don't mention falls through to the broader one.
    expect(entitlementFor(person(), sick, policies)).toBe(10);
  });
});

describe("balances", () => {
  it("count approved as used, pending as reserved, and add adjustments", () => {
    const adjustments: HrLeaveAdjustment[] = [{ id: "a", employeeId: "p1", typeId: "Annual", year: 2026, days: 2, reason: "weekend work", byName: "HR", at: "" }];
    const rows = balanceFor(person(), 2026, types, [], [leave("Annual", "2026-03-02", 5), leave("Annual", "2026-11-02", 3, "pending"), leave("Annual", "2026-04-01", 4, "rejected")], adjustments);
    expect(rows.find((r) => r.type.id === "Annual")).toMatchObject({ entitlement: 20, adjusted: 2, total: 22, used: 5, pending: 3, available: 14 });
  });

  it("carry unused days into the next year up to the policy limit", () => {
    const policies = [policy({ carryOverMax: 5 })];
    const rows = balanceFor(person(), 2027, types, policies, [leave("Annual", "2026-03-02", 12)], []);
    expect(rows.find((r) => r.type.id === "Annual")).toMatchObject({ carried: 5, total: 25 });
    const noCap = balanceFor(person(), 2027, types, [], [leave("Annual", "2026-03-02", 12)], []);
    expect(noCap.find((r) => r.type.id === "Annual")!.carried).toBe(0);
  });

  it("don't limit types without an allowance, and hide retired unused types", () => {
    const retired = types.map((t) => (t.id === "Study" ? { ...t, active: false } : t));
    const rows = balanceFor(person(), 2026, retired, [], [leave("Sick", "2026-02-02", 30)], []);
    const sickRow = rows.find((r) => r.type.id === "Sick")!;
    expect(sickRow.available).toBeNull();
    expect(withinBalance(sickRow, 100)).toBe(true);
    expect(rows.some((r) => r.type.id === "Study")).toBe(false);
  });

  it("refuse requests beyond what's left", () => {
    const row = balanceFor(person(), 2026, types, [], [leave("Annual", "2026-03-02", 18)], []).find((r) => r.type.id === "Annual");
    expect(withinBalance(row, 2)).toBe(true);
    expect(withinBalance(row, 3)).toBe(false);
  });
});
