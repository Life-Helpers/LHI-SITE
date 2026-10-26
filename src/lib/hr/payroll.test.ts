import { describe, expect, it } from "vitest";

import { annualTax, monthlyPay, payrollRules } from "@/lib/hr/payroll";
import { DEFAULT_PAYROLL_RULES, NTA_2025_BANDS, type PayrollRule } from "@/lib/hr/types";

const bands = NTA_2025_BANDS;
const rules = DEFAULT_PAYROLL_RULES;

describe("PAYE", () => {
  it("taxes each band at its own rate", () => {
    expect(annualTax(800_000, bands)).toBe(0);
    expect(annualTax(3_000_000, bands)).toBe(2_200_000 * 0.15);
    expect(annualTax(12_000_000, bands)).toBeCloseTo(330_000 + 9_000_000 * 0.18);
    expect(annualTax(60_000_000, bands)).toBeCloseTo(330_000 + 1_620_000 + 2_730_000 + 5_750_000 + 10_000_000 * 0.25);
  });
});

describe("monthly pay", () => {
  const salary = { basic: 300_000, housing: 150_000, transport: 50_000, allowances: [{ name: "Field allowance", amount: 20_000 }], deductions: [{ name: "Staff loan", amount: 10_000 }] };

  it("adds earnings and takes pension, NHF, PAYE and other deductions", () => {
    const pay = monthlyPay({ ...salary, applies: { nhf: true } }, rules);
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
    const pay = monthlyPay({ ...salary, applies: { pension: false, nhf: false }, transport: 0, allowances: [], deductions: [] }, rules);
    expect(pay.earnings.map((e) => e.name)).toEqual(["Basic salary", "Housing allowance"]);
    expect(pay.deductions.map((d) => d.name)).toEqual(["PAYE tax"]);
  });
});

describe("editable taxes and deductions", () => {
  const salary = { basic: 300_000, housing: 150_000, transport: 50_000, allowances: [], deductions: [] };
  const levy: PayrollRule = { id: "levy", name: "Development levy", method: "fixed", rate: 0, amount: 2_000, base: "gross", bands: [], beforeTax: false, defaultOn: true, active: true };

  it("adds a new tax for everyone, and leaves it off for people unticked or when switched off", () => {
    const withLevy = [...rules, levy];
    expect(monthlyPay(salary, withLevy).deductions.find((d) => d.name === "Development levy")?.amount).toBe(2_000);
    expect(monthlyPay({ ...salary, applies: { levy: false } }, withLevy).deductions.some((d) => d.name === "Development levy")).toBe(false);
    expect(monthlyPay(salary, [...rules, { ...levy, active: false }]).deductions.some((d) => d.name === "Development levy")).toBe(false);
  });

  it("takes before-tax items off taxable pay, and uses edited PAYE bands", () => {
    const relief: PayrollRule = { ...levy, id: "relief", name: "Life assurance", method: "percent", rate: 10, base: "gross", beforeTax: true };
    const flatTax = rules.map((r) => (r.id === "paye" ? { ...r, bands: [{ upTo: null, rate: 10 }] } : r));
    const pay = monthlyPay(salary, [...flatTax, relief]);
    // Taxable: 500,000 - pension 40,000 - relief 50,000 = 410,000; 10% = 41,000.
    expect(pay.deductions.find((d) => d.name === "PAYE tax")?.amount).toBe(41_000);
  });

  it("reads older saved rates as rules", () => {
    const old = payrollRules({ pensionRate: 10, nhfRate: 2.5, taxBands: [{ upTo: null, rate: 7 }] });
    expect(old.find((r) => r.id === "pension")?.rate).toBe(10);
    expect(old.find((r) => r.id === "paye")?.bands).toEqual([{ upTo: null, rate: 7 }]);
  });
});

