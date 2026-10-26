/**
 * Payroll arithmetic: a monthly payslip from a salary and the payroll rules (taxes and statutory
 * deductions Finance can add and edit). Pure functions, so the Payroll page, the published
 * payslips and the tests all agree.
 */
import { DEFAULT_PAYROLL_RULES, PAYROLL_RULES_VERSION, RULES_ADDED_IN_V2, type HrPayrollSettings, type HrSalary, type PayBase, type PayLine, type PayrollRule, type PaySchedule } from "@/lib/hr/types";

/** Round to kobo. */
export const kobo = (n: number) => Math.round(n * 100) / 100;

/** Yearly tax on `amount` naira, band by band. */
export function annualTax(amount: number, bands: PayrollRule["bands"]): number {
  let tax = 0;
  let lower = 0;
  for (const band of bands) {
    if (amount <= lower) break;
    const upper = band.upTo ?? Infinity;
    tax += (Math.min(amount, upper) - lower) * (band.rate / 100);
    lower = upper;
  }
  return tax;
}

/** The rules in force, turning older stored rates (pension %, NHF %, PAYE bands) into rules. */
export function payrollRules(settings: Partial<HrPayrollSettings> | undefined): PayrollRule[] {
  if (settings?.rules) {
    // Saved before rent relief and the employer contributions existed: add them once.
    const version = settings.rulesVersion ?? 1;
    if (version >= PAYROLL_RULES_VERSION) return settings.rules;
    const have = new Set(settings.rules.map((r) => r.id));
    const added = version < 2 ? DEFAULT_PAYROLL_RULES.filter((r) => RULES_ADDED_IN_V2.includes(r.id) && !have.has(r.id)) : [];
    // Version 3: NSITF moved to gross before any penalty.
    return [...settings.rules, ...added].map((r) => (r.id === "nsitf" && r.base === "gross" ? { ...r, base: "gross_before_penalty" as const } : r));
  }
  if (!settings || (settings.pensionRate === undefined && !settings.taxBands)) return DEFAULT_PAYROLL_RULES;
  return DEFAULT_PAYROLL_RULES.map((r) =>
    r.id === "pension" && settings.pensionRate !== undefined
      ? { ...r, rate: settings.pensionRate }
      : r.id === "nhf" && settings.nhfRate !== undefined
        ? { ...r, rate: settings.nhfRate }
        : r.id === "paye" && settings.taxBands
          ? { ...r, bands: settings.taxBands }
          : r,
  );
}

/** Does this rule apply to this person? Their own setting, else the older pension/NHF flags, else the rule's default. */
export function ruleApplies(rule: PayrollRule, salary: Pick<HrSalary, "applies" | "pension" | "nhf">): boolean {
  if (!rule.active) return false;
  const own = salary.applies?.[rule.id];
  if (own !== undefined) return own;
  if (rule.id === "pension" && salary.pension !== undefined) return salary.pension;
  if (rule.id === "nhf" && salary.nhf !== undefined) return salary.nhf;
  return rule.defaultOn;
}

export const BASE_LABEL: Record<PayBase, string> = {
  basic: "basic",
  basic_housing_transport: "basic + housing + transport",
  gross: "gross pay (after any penalty)",
  gross_before_penalty: "gross pay before any penalty",
  taxable: "taxable pay",
  annual_rent: "yearly rent paid",
};

export const KIND_LABEL: Record<NonNullable<PayrollRule["kind"]>, string> = {
  deduction: "Deducted from pay",
  relief: "Tax relief (lowers taxable pay only)",
  employer: "Paid by LHI (employer contribution)",
};

/** "8% of basic + housing + transport", "₦5,000.00 a month", "Yearly bands on taxable pay". */
export function describeRule(rule: PayrollRule): string {
  const cap = rule.cap ? `, up to ${naira(rule.cap)} a year` : "";
  if (rule.method === "fixed") return `${naira(rule.amount)} a month${cap}`;
  if (rule.method === "percent") return `${rule.rate}% of ${BASE_LABEL[rule.base]}${cap}`;
  return `Yearly bands on ${BASE_LABEL[rule.base]} (${rule.bands.length} band${rule.bands.length === 1 ? "" : "s"})`;
}

export interface PayBreakdown {
  earnings: PayLine[];
  /** Taken from pay, including any penalty. */
  deductions: PayLine[];
  gross: number;
  totalDeductions: number;
  net: number;
  schedule: PaySchedule;
}

/**
 * One month's pay, in the order of LHI's payroll schedule:
 * 1. gross, less any penalty for the month;
 * 2. items taken off before tax (e.g. employee pension) and reliefs (e.g. rent relief: 20% of
 *    yearly rent, up to the cap) lower taxable pay; reliefs aren't taken from pay;
 * 3. the other items, including PAYE worked out on the year and divided by 12, then the
 *    person's own regular deductions;
 * 4. employer contributions (e.g. employer pension, NSITF) are worked out but paid by LHI on top.
 */
export function monthlyPay(
  salary: Omit<HrSalary, "employeeId" | "updatedAt" | "updatedByName">,
  rules: PayrollRule[],
  { penalty = 0, penaltyReason = "" }: { penalty?: number; penaltyReason?: string } = {},
): PayBreakdown {
  const earnings: PayLine[] = [
    { name: "Basic salary", amount: salary.basic },
    { name: "Housing allowance", amount: salary.housing },
    { name: "Transport allowance", amount: salary.transport },
    ...salary.allowances,
  ].filter((l) => l.amount > 0);
  const gross = kobo(earnings.reduce((n, l) => n + l.amount, 0));
  const fine = kobo(Math.min(Math.max(0, penalty), gross));
  const grossAfterPenalty = kobo(gross - fine);
  const annualRent = Math.max(0, salary.annualRent ?? 0);
  const bases: Record<Exclude<PayBase, "taxable">, number> = {
    basic: salary.basic,
    basic_housing_transport: salary.basic + salary.housing + salary.transport,
    gross: grossAfterPenalty,
    gross_before_penalty: gross,
    annual_rent: annualRent / 12,
  };
  const applying = rules.filter((r) => ruleApplies(r, salary));
  const kind = (r: PayrollRule) => r.kind ?? "deduction";
  const amountOf = (r: PayrollRule, taxable: number) => {
    const base = r.base === "taxable" ? taxable : bases[r.base];
    const monthly = r.method === "fixed" ? r.amount : r.method === "percent" ? (base * r.rate) / 100 : annualTax(Math.max(0, base) * 12, r.bands) / 12;
    return kobo(r.cap ? Math.min(monthly, r.cap / 12) : monthly);
  };
  // The cap is part of the name ("Rent relief (20%, up to 500,000 a year)") so the label is true when it applies.
  const capNote = (r: PayrollRule) => (r.cap ? `, up to ${new Intl.NumberFormat("en-NG").format(r.cap)} a year` : "");
  const line = (r: PayrollRule, amount: number): PayLine => ({ name: r.method === "percent" ? `${r.name} (${r.rate}%${capNote(r)})` : r.name, amount });
  // Before-tax items and reliefs can't depend on taxable pay (that would be circular).
  const early = (r: PayrollRule) => r.base !== "taxable" && ((kind(r) === "deduction" && r.beforeTax) || kind(r) === "relief");
  const amounts = new Map<string, number>();
  for (const r of applying.filter(early)) amounts.set(r.id, amountOf(r, 0));
  const sum = (lines: PayLine[]) => kobo(lines.reduce((n, l) => n + l.amount, 0));
  const beforeTax = applying.filter((r) => kind(r) === "deduction" && amounts.has(r.id)).map((r) => line(r, amounts.get(r.id)!));
  const reliefs = applying.filter((r) => kind(r) === "relief" && amounts.has(r.id)).map((r) => line(r, amounts.get(r.id)!));
  const taxable = kobo(Math.max(0, grossAfterPenalty - sum(beforeTax) - sum(reliefs)));
  for (const r of applying.filter((r) => !amounts.has(r.id) && kind(r) !== "relief")) amounts.set(r.id, amountOf(r, taxable));
  const later = applying.filter((r) => kind(r) === "deduction" && !(r.beforeTax && r.base !== "taxable"));
  const tax = later.filter((r) => r.method === "bands").map((r) => line(r, amounts.get(r.id)!));
  const other = later.filter((r) => r.method !== "bands").map((r) => line(r, amounts.get(r.id)!));
  const employer = applying.filter((r) => kind(r) === "employer").map((r) => line(r, amounts.get(r.id)!));
  const positive = (lines: PayLine[]) => lines.filter((l) => l.amount > 0);
  // Payslip order: penalty, then the rules as listed, then the person's own deductions.
  const deductions = positive([
    ...(fine ? [{ name: penaltyReason ? `Penalty: ${penaltyReason}` : "Penalty", amount: fine }] : []),
    ...applying.filter((r) => kind(r) === "deduction").map((r) => line(r, amounts.get(r.id) ?? 0)),
    ...salary.deductions,
  ]);
  const totalDeductions = sum(deductions);
  return {
    earnings,
    deductions,
    gross,
    totalDeductions,
    net: kobo(gross - totalDeductions),
    schedule: {
      grossAfterPenalty,
      annualRent,
      beforeTax: positive(beforeTax),
      reliefs: positive(reliefs),
      totalReliefs: kobo(sum(beforeTax) + sum(reliefs)),
      taxable,
      tax: positive(tax),
      other: positive(other),
      own: positive(salary.deductions),
      employer: positive(employer),
      totalEmolument: kobo(grossAfterPenalty + sum(employer)),
    },
  };
}

const NAIRA = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 });
export const naira = (n: number) => NAIRA.format(n);

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
export const payMonthLabel = (ym: string) => MONTH.format(new Date(`${ym}-15T12:00:00Z`));
