/**
 * Payroll arithmetic: a monthly payslip from a salary and the payroll rules (taxes and statutory
 * deductions Finance can add and edit). Pure functions, so the Payroll page, the published
 * payslips and the tests all agree.
 */
import { DEFAULT_PAYROLL_RULES, type HrPayrollSettings, type HrSalary, type PayBase, type PayLine, type PayrollRule } from "@/lib/hr/types";

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
  if (settings?.rules) return settings.rules;
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
  gross: "gross pay",
  taxable: "taxable pay",
};

/** "8% of basic + housing + transport", "₦5,000.00 a month", "Yearly bands on taxable pay". */
export function describeRule(rule: PayrollRule): string {
  if (rule.method === "fixed") return `${naira(rule.amount)} a month`;
  if (rule.method === "percent") return `${rule.rate}% of ${BASE_LABEL[rule.base]}`;
  return `Yearly bands on ${BASE_LABEL[rule.base]} (${rule.bands.length} band${rule.bands.length === 1 ? "" : "s"})`;
}

export interface PayBreakdown {
  earnings: PayLine[];
  deductions: PayLine[];
  gross: number;
  totalDeductions: number;
  net: number;
}

/**
 * One month's pay. Items taken off before tax are worked out first (on basic, basic + housing +
 * transport, or gross) and reduce taxable pay; the rest follow, including bands worked out on the
 * year and divided by 12. Then the person's own regular deductions.
 */
export function monthlyPay(salary: Omit<HrSalary, "employeeId" | "updatedAt" | "updatedByName">, rules: PayrollRule[]): PayBreakdown {
  const earnings: PayLine[] = [
    { name: "Basic salary", amount: salary.basic },
    { name: "Housing allowance", amount: salary.housing },
    { name: "Transport allowance", amount: salary.transport },
    ...salary.allowances,
  ].filter((l) => l.amount > 0);
  const gross = kobo(earnings.reduce((n, l) => n + l.amount, 0));
  const bases: Record<Exclude<PayBase, "taxable">, number> = { basic: salary.basic, basic_housing_transport: salary.basic + salary.housing + salary.transport, gross };
  const applying = rules.filter((r) => ruleApplies(r, salary));
  const amountOf = (r: PayrollRule, taxable: number) => {
    const base = r.base === "taxable" ? taxable : bases[r.base];
    if (r.method === "fixed") return r.amount;
    if (r.method === "percent") return (base * r.rate) / 100;
    return annualTax(Math.max(0, base) * 12, r.bands) / 12;
  };
  const amounts = new Map<string, number>();
  // Before-tax items can't depend on taxable pay (that would be circular).
  for (const r of applying.filter((r) => r.beforeTax && r.base !== "taxable")) amounts.set(r.id, kobo(amountOf(r, 0)));
  const taxable = Math.max(0, gross - [...amounts.values()].reduce((n, a) => n + a, 0));
  for (const r of applying.filter((r) => !amounts.has(r.id))) amounts.set(r.id, kobo(amountOf(r, taxable)));
  const deductions: PayLine[] = [
    ...applying.map((r) => ({ name: r.method === "percent" ? `${r.name} (${r.rate}%)` : r.name, amount: amounts.get(r.id) ?? 0 })),
    ...salary.deductions,
  ].filter((l) => l.amount > 0);
  const totalDeductions = kobo(deductions.reduce((n, l) => n + l.amount, 0));
  return { earnings, deductions, gross, totalDeductions, net: kobo(gross - totalDeductions) };
}

const NAIRA = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 });
export const naira = (n: number) => NAIRA.format(n);

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
export const payMonthLabel = (ym: string) => MONTH.format(new Date(`${ym}-15T12:00:00Z`));
