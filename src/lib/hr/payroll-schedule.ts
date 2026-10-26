/**
 * LHI's monthly payroll schedule: one row per person, in the columns Finance uses
 * (Staff Name, Position, Annual Gross ... Total Monthly Emolument), with a totals row.
 * Column headings for pension, reliefs, PAYE and employer contributions come from the
 * payroll rules, so a new levy or relief gets its own column.
 */
import type { HrPayslip, PayLine, PaySchedule } from "@/lib/hr/types";

export interface ScheduleColumn {
  key: string;
  label: string;
}
export interface ScheduleRow {
  payslipId: string;
  name: string;
  position: string;
  values: Record<string, number>;
}

/** The schedule figures, worked out for payslips made before they were stored. */
export function scheduleOf(slip: HrPayslip): PaySchedule {
  if (slip.schedule) return { ...slip.schedule, own: slip.schedule.own ?? [] };
  return { grossAfterPenalty: slip.gross, annualRent: 0, beforeTax: [], reliefs: [], totalReliefs: 0, taxable: slip.gross, tax: [], other: [], own: slip.deductions, employer: [], totalEmolument: slip.gross };
}

const sum = (lines: PayLine[]) => lines.reduce((n, l) => n + l.amount, 0);

export function payrollSchedule(slips: HrPayslip[]): { columns: ScheduleColumn[]; rows: ScheduleRow[]; totals: Record<string, number> } {
  const sched = new Map(slips.map((s) => [s.id, scheduleOf(s)]));
  // Columns for each named line, in the order they first appear.
  const named = (pick: (x: PaySchedule) => PayLine[], prefix: string) => {
    const names: string[] = [];
    for (const s of sched.values()) for (const l of pick(s)) if (!names.includes(l.name)) names.push(l.name);
    return names.map((n) => ({ key: `${prefix}:${n}`, label: n }));
  };
  const anyPenalty = slips.some((s) => (s.penalty ?? 0) > 0);
  const anyOwn = [...sched.values()].some((s) => s.own.length > 0);
  const columns: ScheduleColumn[] = [
    { key: "annualGross", label: "Annual Gross" },
    { key: "monthlyGross", label: "Monthly Gross" },
    ...(anyPenalty ? [{ key: "penalty", label: "Penalty" }] : []),
    { key: "grossAfterPenalty", label: "Monthly Gross After Penalty" },
    { key: "annualRent", label: "Annual Rent Paid" },
    ...named((x) => x.beforeTax, "before"),
    ...named((x) => x.reliefs, "relief"),
    { key: "totalReliefs", label: "Total Reliefs" },
    ...named((x) => x.tax, "tax"),
    ...named((x) => x.other, "other"),
    ...(anyOwn ? [{ key: "own", label: "Other Deductions" }] : []),
    { key: "net", label: "Monthly Net Pay" },
    ...named((x) => x.employer, "employer"),
    { key: "totalEmolument", label: "Total Monthly Emolument" },
  ];
  const rows: ScheduleRow[] = slips.map((slip) => {
    const x = sched.get(slip.id)!;
    const values: Record<string, number> = {
      annualGross: slip.gross * 12,
      monthlyGross: slip.gross,
      penalty: slip.penalty ?? 0,
      grossAfterPenalty: x.grossAfterPenalty,
      annualRent: x.annualRent,
      totalReliefs: x.totalReliefs,
      own: sum(x.own),
      net: slip.net,
      totalEmolument: x.totalEmolument,
    };
    for (const [prefix, lines] of [["before", x.beforeTax], ["relief", x.reliefs], ["tax", x.tax], ["other", x.other], ["employer", x.employer]] as const) {
      for (const l of lines) values[`${prefix}:${l.name}`] = (values[`${prefix}:${l.name}`] ?? 0) + l.amount;
    }
    return { payslipId: slip.id, name: slip.employee.name, position: slip.employee.jobTitle, values };
  });
  const totals = Object.fromEntries(columns.map((c) => [c.key, Math.round(rows.reduce((n, r) => n + (r.values[c.key] ?? 0), 0) * 100) / 100]));
  return { columns, rows, totals };
}
