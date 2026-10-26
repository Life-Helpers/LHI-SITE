import { describe, expect, it } from "vitest";

import { annualTax, monthlyPay, payrollRules } from "@/lib/hr/payroll";
import { payrollSchedule } from "@/lib/hr/payroll-schedule";
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


describe("LHI payroll schedule", () => {
  // Monthly gross 500,000; rent 1,200,000 a year.
  const salary = { basic: 300_000, housing: 150_000, transport: 50_000, allowances: [], deductions: [], annualRent: 1_200_000 };

  it("takes pension and rent relief off taxable pay, and adds employer pension and NSITF on top", () => {
    const pay = monthlyPay(salary, rules);
    const s = pay.schedule;
    expect(s.beforeTax).toEqual([{ name: "Pension (employee) (8%)", amount: 40_000 }]);
    expect(s.reliefs).toEqual([{ name: "Rent relief (20%, up to 500,000 a year)", amount: 20_000 }]); // 240,000 a year / 12
    expect(s.totalReliefs).toBe(60_000);
    expect(s.taxable).toBe(440_000);
    // 5,280,000 a year: 330,000 + 2,280,000 x 18% = 740,400; / 12 = 61,700.
    expect(s.tax).toEqual([{ name: "PAYE tax", amount: 61_700 }]);
    expect(pay.net).toBe(398_300);
    // Rent relief isn't taken from pay.
    expect(pay.deductions.map((d) => d.name)).toEqual(["Pension (employee) (8%)", "PAYE tax"]);
    expect(s.employer).toEqual([
      { name: "Employer pension (10%)", amount: 50_000 },
      { name: "NSITF contribution (1%)", amount: 5_000 },
    ]);
    expect(s.totalEmolument).toBe(555_000);
  });

  it("takes a penalty off gross before tax, and caps rent relief at ₦500,000 a year", () => {
    const pay = monthlyPay(salary, rules, { penalty: 10_000, penaltyReason: "Absence" });
    expect(pay.schedule.grossAfterPenalty).toBe(490_000);
    expect(pay.deductions[0]).toEqual({ name: "Penalty: Absence", amount: 10_000 });
    expect(pay.schedule.taxable).toBe(430_000);
    expect(pay.schedule.tax[0].amount).toBe(59_900); // (330,000 + 2,160,000 x 18%) / 12
    expect(pay.net).toBe(390_100);
    // NSITF stays on the full gross (5,000); the emolument is what LHI pays: 490,000 + 50,000 + 5,000.
    expect(pay.schedule.employer[1]).toEqual({ name: "NSITF contribution (1%)", amount: 5_000 });
    expect(pay.schedule.totalEmolument).toBe(545_000);
    expect(monthlyPay({ ...salary, annualRent: 3_000_000 }, rules).schedule.reliefs[0].amount).toBeCloseTo(500_000 / 12, 2);
  });

  it("adds the new standard rules once to saved rule lists, and not after", () => {
    const saved = [rules[0], rules[2]];
    expect(payrollRules({ rules: saved }).map((r) => r.id)).toEqual(["pension", "paye", "rent_relief", "employer_pension", "nsitf"]);
    expect(payrollRules({ rules: saved, rulesVersion: 2 }).map((r) => r.id)).toEqual(["pension", "paye"]);
    // A saved NSITF rule on gross moves to gross before any penalty, once.
    const oldNsitf = { ...rules.find((r) => r.id === "nsitf")!, base: "gross" as const };
    expect(payrollRules({ rules: [oldNsitf], rulesVersion: 2 })[0].base).toBe("gross_before_penalty");
    expect(payrollRules({ rules: [oldNsitf], rulesVersion: 3 })[0].base).toBe("gross");
  });

  it("lays the run out in the schedule's columns, with totals", () => {
    const slip = (id: string, name: string, penalty = 0) => ({
      id,
      employeeId: id,
      month: "2026-10",
      status: "draft" as const,
      employee: { name, staffNumber: "", jobTitle: "Officer", department: "", bankName: "", bankAccountEnding: "" },
      ...monthlyPay(salary, rules, { penalty }),
      penalty: penalty || undefined,
      preparedByName: "",
      createdAt: "",
    });
    const { columns, rows, totals } = payrollSchedule([slip("a", "Amina", 10_000), slip("b", "Bello")]);
    expect(columns.map((c) => c.label)).toEqual([
      "Annual Gross",
      "Monthly Gross",
      "Penalty",
      "Monthly Gross After Penalty",
      "Annual Rent Paid",
      "Pension (employee) (8%)",
      "Rent relief (20%, up to 500,000 a year)",
      "Total Reliefs",
      "PAYE tax",
      "Monthly Net Pay",
      "Employer pension (10%)",
      "NSITF contribution (1%)",
      "Total Monthly Emolument",
    ]);
    expect(rows[1].values.annualGross).toBe(6_000_000);
    expect(totals.net).toBe(390_100 + 398_300);
    expect(totals.totalEmolument).toBe(545_000 + 555_000);
  });
});
