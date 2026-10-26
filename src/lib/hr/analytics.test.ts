import { describe, expect, it } from "vitest";

import {
  absenceForecast,
  absenceRate,
  approvalRate,
  averageDecisionDays,
  countBy,
  foldOther,
  headcountByMonth,
  hiresByMonth,
  lastMonths,
  leaveDaysByMonth,
  leaversByMonth,
  tenureBands,
  turnoverRate,
} from "@/lib/hr/analytics";
import { DEFAULT_LEAVE_TYPES, type HrEmployee, type HrLeaveRequest } from "@/lib/hr/types";

const person = (id: string, opts: Partial<HrEmployee> = {}): HrEmployee =>
  ({ id, firstName: id, lastName: "", status: "active", startDate: "2024-01-15", createdAt: "2024-01-15T00:00:00Z", updatedAt: "2024-01-15T00:00:00Z", department: "", location: "", ...opts }) as HrEmployee;
const leave = (employeeId: string, type: string, start: string, end: string, days: number, status: HrLeaveRequest["status"] = "approved", extra: Partial<HrLeaveRequest> = {}): HrLeaveRequest => ({
  id: `${employeeId}${start}${type}`,
  employeeId,
  type,
  startDate: start,
  endDate: end,
  days,
  reason: "",
  status,
  createdAt: `${start}T00:00:00Z`,
  ...extra,
});

describe("workforce analytics", () => {
  it("lists the last months oldest first, across a year boundary", () => {
    expect(lastMonths("2026-02-10", 4)).toEqual(["2025-11", "2025-12", "2026-01", "2026-02"]);
  });

  it("counts headcount, starters and leavers by month", () => {
    const staff = [
      person("a"),
      person("b", { startDate: "2026-03-02" }),
      person("c", { status: "left", updatedAt: "2026-04-20T09:00:00Z" }),
    ];
    const months = ["2026-02", "2026-03", "2026-04", "2026-05"];
    expect(headcountByMonth(staff, months)).toEqual([2, 3, 2, 2]);
    expect(hiresByMonth(staff, months)).toEqual([0, 1, 0, 0]);
    expect(leaversByMonth(staff, months)).toEqual([0, 0, 1, 0]);
    expect(turnoverRate(staff, months)).toBeCloseTo((1 / 2.25) * 100);
  });

  it("groups length of service and folds long breakdowns into Other", () => {
    const bands = tenureBands([person("a", { startDate: "2026-01-05" }), person("b", { startDate: "2023-06-01" }), person("c", { startDate: "2015-01-01" })], "2026-10-26");
    expect(bands.map((b) => b.value)).toEqual([1, 0, 1, 1]);
    const rows = countBy([1, 2, 3, 4, 5, 6].map((n) => ({ k: `D${n}` })), (r) => r.k);
    expect(foldOther(rows, 4)).toHaveLength(4);
    expect(foldOther(rows, 4)[3]).toEqual({ label: "Other (3)", value: 3 });
    expect(countBy([{ k: "" }], (r) => r.k)[0].label).toBe("Not recorded");
  });
});

describe("leave analytics", () => {
  it("adds approved days by month and type, leaving out unused types", () => {
    const rows = [leave("a", "Annual", "2026-03-02", "2026-03-06", 5), leave("a", "Sick", "2026-04-01", "2026-04-01", 1), leave("a", "Annual", "2026-04-06", "2026-04-07", 2, "pending")];
    const series = leaveDaysByMonth(rows, ["2026-03", "2026-04"], DEFAULT_LEAVE_TYPES);
    expect(series.map((s) => [s.type.id, s.values])).toEqual([
      ["Annual", [5, 0]],
      ["Sick", [0, 1]],
    ]);
  });

  it("works out approval rate and decision time, ignoring automatic approvals", () => {
    const rows = [
      leave("a", "Annual", "2026-03-02", "2026-03-02", 1, "approved", { decidedAt: "2026-03-04T00:00:00Z", decidedByAccountId: "m" }),
      leave("b", "Annual", "2026-03-02", "2026-03-02", 1, "rejected", { decidedAt: "2026-03-02T00:00:00Z", decidedByAccountId: "m" }),
      leave("c", "Sick", "2026-03-02", "2026-03-02", 1, "approved", { decidedAt: "2026-03-02T00:00:00Z", decidedByAccountId: "policy" }),
      leave("d", "Annual", "2026-03-02", "2026-03-02", 1, "pending"),
    ];
    expect(approvalRate(rows)).toBeCloseTo((2 / 3) * 100);
    expect(averageDecisionDays(rows)).toBe(1);
    expect(approvalRate([])).toBeNull();
  });

  it("measures absence against working days available this year", () => {
    const staff = [person("a", { startDate: "2020-01-01" })];
    // 1 to 13 January 2026 has 9 working days; 2 of them were leave.
    expect(absenceRate([leave("a", "Annual", "2026-01-05", "2026-01-06", 2)], staff, "2026-01-13")).toBeCloseTo((2 / 9) * 100);
    expect(absenceRate([], [], "2026-01-13")).toBeNull();
  });

  it("forecasts who is off on each coming working day", () => {
    const f = absenceForecast([leave("a", "Annual", "2026-10-26", "2026-10-27", 2), leave("b", "Annual", "2026-10-27", "2026-10-27", 1)], "2026-10-24", 3);
    expect(f).toEqual([
      { date: "2026-10-26", value: 1 },
      { date: "2026-10-27", value: 2 },
      { date: "2026-10-28", value: 0 },
    ]);
  });
});
