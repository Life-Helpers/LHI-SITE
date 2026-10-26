/**
 * Payroll arithmetic: a monthly payslip from a salary and the payroll rates. Pure functions, so
 * the Payroll page, the published payslips and the tests all agree.
 */
import type { HrPayrollSettings, HrSalary, PayLine } from "@/lib/hr/types";

/** Round to kobo. */
export const kobo = (n: number) => Math.round(n * 100) / 100;

/** Annual PAYE on `taxable` naira, band by band. */
export function annualTax(taxable: number, bands: HrPayrollSettings["taxBands"]): number {
  let tax = 0;
  let lower = 0;
  for (const band of bands) {
    if (taxable <= lower) break;
    const upper = band.upTo ?? Infinity;
    tax += (Math.min(taxable, upper) - lower) * (band.rate / 100);
    lower = upper;
  }
  return tax;
}

export interface PayBreakdown {
  earnings: PayLine[];
  deductions: PayLine[];
  gross: number;
  totalDeductions: number;
  net: number;
}

/**
 * One month's pay. Pension is a share of basic + housing + transport; NHF a share of basic. PAYE
 * is worked out on the year (gross less pension and NHF, which are tax-free) and divided by 12.
 */
export function monthlyPay(salary: Omit<HrSalary, "employeeId" | "updatedAt" | "updatedByName">, settings: Pick<HrPayrollSettings, "pensionRate" | "nhfRate" | "taxBands">): PayBreakdown {
  const earnings: PayLine[] = [
    { name: "Basic salary", amount: salary.basic },
    { name: "Housing allowance", amount: salary.housing },
    { name: "Transport allowance", amount: salary.transport },
    ...salary.allowances,
  ].filter((l) => l.amount > 0);
  const gross = kobo(earnings.reduce((n, l) => n + l.amount, 0));
  const pension = salary.pension ? kobo(((salary.basic + salary.housing + salary.transport) * settings.pensionRate) / 100) : 0;
  const nhf = salary.nhf ? kobo((salary.basic * settings.nhfRate) / 100) : 0;
  const paye = kobo(annualTax(Math.max(0, (gross - pension - nhf) * 12), settings.taxBands) / 12);
  const deductions: PayLine[] = [
    { name: "PAYE tax", amount: paye },
    { name: `Pension (employee, ${settings.pensionRate}%)`, amount: pension },
    { name: `National Housing Fund (${settings.nhfRate}%)`, amount: nhf },
    ...salary.deductions,
  ].filter((l) => l.amount > 0);
  const totalDeductions = kobo(deductions.reduce((n, l) => n + l.amount, 0));
  return { earnings, deductions, gross, totalDeductions, net: kobo(gross - totalDeductions) };
}

const NAIRA = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 });
export const naira = (n: number) => NAIRA.format(n);

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
export const payMonthLabel = (ym: string) => MONTH.format(new Date(`${ym}-15T12:00:00Z`));
