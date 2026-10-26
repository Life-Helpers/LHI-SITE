import { describe, expect, it } from "vitest";

import { annualTax, monthlyPay } from "@/lib/hr/payroll";
import { DEFAULT_PAYROLL_SETTINGS } from "@/lib/hr/types";

const bands = DEFAULT_PAYROLL_SETTINGS.taxBands;

describe("PAYE", () => {
  it("taxes each band at its own rate", () => {
    expect(annualTax(800_000, bands)).toBe(0);
    expect(annualTax(3_000_000, bands)).toBe(2_200_000 * 0.15);
    expect(annualTax(12_000_000, bands)).toBeCloseTo(330_000 + 9_000_000 * 0.18);
    expect(annualTax(60_000_000, bands)).toBeCloseTo(330_000 + 1_620_000 + 2_730_000 + 5_750_000 + 10_000_000 * 0.25);
  });
});

describe("monthly pay", () => {
  const salary = { basic: 300_000, housing: 150_000, transport: 50_000, allowances: [{ name: "Field allowance", amount: 20_000 }], deductions: [{ name: "Staff loan", amount: 10_000 }], pension: true, nhf: true };

  it("adds earnings and takes pension, NHF, PAYE and other deductions", () => {
    const pay = monthlyPay(salary, DEFAULT_PAYROLL_SETTINGS);
    expect(pay.gross).toBe(520_000);
    const line = (name: string) => pay.deductions.find((d) => d.name.startsWith(name))?.amount;
    expect(line("Pension")).toBe(40_000); // 8% of 500,000
    expect(line("National Housing Fund")).toBe(7_500); // 2.5% of 300,000
    // Taxable a year: (520,000 - 40,000 - 7,500) x 12 = 5,670,000.
    expect(line("PAYE")).toBeCloseTo((330_000 + 2_670_000 * 0.18) / 12, 2);
    expect(line("Staff loan")).toBe(10_000);
    expect(pay.net).toBeCloseTo(pay.gross - pay.totalDeductions, 2);
  });

  it("leaves out pension and NHF when they don't apply, and zero lines", () => {
    const pay = monthlyPay({ ...salary, pension: false, nhf: false, transport: 0, allowances: [], deductions: [] }, DEFAULT_PAYROLL_SETTINGS);
    expect(pay.earnings.map((e) => e.name)).toEqual(["Basic salary", "Housing allowance"]);
    expect(pay.deductions.map((d) => d.name)).toEqual(["PAYE tax"]);
  });
});
