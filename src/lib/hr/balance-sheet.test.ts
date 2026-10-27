import { describe, expect, it } from "vitest";

import { balanceSheetCsv, detailCell, summaryCell } from "@/lib/hr/balance-sheet";
import type { BalanceRow } from "@/lib/hr/leave-balance";
import type { HrEmployee, HrLeaveType } from "@/lib/hr/types";

const annual = { id: "Annual", name: "Annual Leave" } as HrLeaveType;
const sick = { id: "Sick", name: "Sick Leave" } as HrLeaveType;
const row = (type: HrLeaveType, total: number | null, used: number, pending = 0): BalanceRow => ({
  type,
  entitlement: total,
  carried: 0,
  adjusted: 0,
  total,
  used,
  pending,
  available: total === null ? null : total - used - pending,
});

describe("leave balance table", () => {
  it("summarises each type as days left of the total, never below zero", () => {
    expect(summaryCell(row(annual, 20, 5, 2))).toBe("13 of 20 left");
    expect(summaryCell(row(annual, 5, 7))).toBe("0 of 5 left, 2 over");
    expect(summaryCell(row(sick, null, 3))).toBe("3 used");
    expect(summaryCell(row(sick, null, 0))).toBe("No limit");
    expect(summaryCell(undefined)).toBe("–");
  });

  it("shows one type in detail, and the same figures in the CSV", () => {
    expect(detailCell(row(annual, 5, 7), "available")).toBe("0 (2 over)");
    expect(detailCell(row(sick, null, 3), "total")).toBe("No limit");
    const employee = { id: "e", firstName: "Amina", lastName: "Bello", staffNumber: "LHI-1", department: "Programmes", jobTitle: "Officer" } as HrEmployee;
    const rows = [{ employee, balances: new Map([["Annual", row(annual, 20, 5, 2)]]) }];
    const detail = balanceSheetCsv(rows, [annual, sick], annual);
    expect(detail.head.slice(-2)).toEqual(["Annual Leave: Pending", "Annual Leave: Left"]);
    expect(detail.body[0]).toEqual(["Amina Bello", "LHI-1", "Programmes", "Officer", "20", "0", "0", "20", "5", "2", "13"]);
    expect(balanceSheetCsv(rows, [annual, sick], undefined).body[0].slice(-2)).toEqual(["13 of 20 left", "–"]);
  });
});
