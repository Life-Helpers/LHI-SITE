import Image from "next/image";

import { naira, payMonthLabel } from "@/lib/hr/payroll";
import type { HrPayslip, HrSalary } from "@/lib/hr/types";
import { Field, inputClass } from "@/components/hr/ui";

/** A payslip laid out for screen and print (the portal's menus are hidden when printing). */
export function PayslipView({ slip }: { slip: HrPayslip }) {
  const rows = Math.max(slip.earnings.length, slip.deductions.length);
  return (
    <article className="hr-card mx-auto max-w-3xl p-6 print:border-0 print:shadow-none sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-admin-border pb-5">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Life Helpers Initiative" width={140} height={40} className="h-10 w-auto" />
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Payslip</h2>
          <p className="text-sm text-admin-muted">{payMonthLabel(slip.month)}</p>
          {slip.status === "draft" && <p className="mt-1 inline-block rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">DRAFT: not yet published</p>}
        </div>
      </header>
      <dl className="grid gap-x-6 gap-y-2 border-b border-admin-border py-5 text-sm sm:grid-cols-2">
        {(
          [
            ["Employee", slip.employee.name],
            ["Staff number", slip.employee.staffNumber || "—"],
            ["Job title", slip.employee.jobTitle || "—"],
            ["Department", slip.employee.department || "—"],
            ["Bank", slip.employee.bankName || "—"],
            ["Account", slip.employee.bankAccountEnding ? `••••••${slip.employee.bankAccountEnding}` : "—"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 sm:block">
            <dt className="text-admin-muted">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <table className="mt-5 w-full text-sm">
        <thead>
          <tr className="bg-admin-bg text-left text-xs font-semibold text-admin-muted print:bg-transparent">
            <th scope="col" className="px-3 py-2">Earnings</th>
            <th scope="col" className="px-3 py-2 text-right">Amount</th>
            <th scope="col" className="border-l border-admin-border px-3 py-2">Deductions</th>
            <th scope="col" className="px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border">
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              <td className="px-3 py-2">{slip.earnings[i]?.name}</td>
              <td className="px-3 py-2 text-right tabular-nums">{slip.earnings[i] ? naira(slip.earnings[i].amount) : ""}</td>
              <td className="border-l border-admin-border px-3 py-2">{slip.deductions[i]?.name}</td>
              <td className="px-3 py-2 text-right tabular-nums">{slip.deductions[i] ? naira(slip.deductions[i].amount) : ""}</td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="px-3 py-2">Gross pay</td>
            <td className="px-3 py-2 text-right tabular-nums">{naira(slip.gross)}</td>
            <td className="border-l border-admin-border px-3 py-2">Total deductions</td>
            <td className="px-3 py-2 text-right tabular-nums">{naira(slip.totalDeductions)}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-5 flex items-center justify-between rounded-lg bg-admin-primary-soft px-4 py-3 print:border print:border-admin-border">
        <span className="font-semibold">Net pay</span>
        <span className="text-xl font-bold tabular-nums">{naira(slip.net)}</span>
      </div>
      <p className="mt-6 text-xs text-admin-muted">
        Prepared by {slip.preparedByName}
        {slip.publishedAt ? ` · issued ${slip.publishedAt.slice(0, 10)}` : ""}. Life Helpers Initiative. This payslip is confidential.
      </p>
    </article>
  );
}

/** Salary form fields (amounts in naira a month). */
export function SalaryFields({ salary }: { salary?: HrSalary }) {
  const extra = (prefix: "allowance" | "deduction", lines: { name: string; amount: number }[] = []) =>
    Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="grid grid-cols-[minmax(0,1fr)_9rem] gap-2">
        <input name={`${prefix}_name_${i}`} defaultValue={lines[i]?.name} placeholder={prefix === "allowance" ? "e.g. Field allowance" : "e.g. Staff loan"} aria-label={`${prefix} ${i + 1} name`} className={`${inputClass} mt-0`} />
        <input name={`${prefix}_amount_${i}`} type="number" min={0} step="0.01" defaultValue={lines[i]?.amount} placeholder="0" aria-label={`${prefix} ${i + 1} amount`} className={`${inputClass} mt-0`} />
      </div>
    ));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Basic (₦ a month)">
          <input name="basic" type="number" min={0} step="0.01" required defaultValue={salary?.basic} className={inputClass} />
        </Field>
        <Field label="Housing (₦)">
          <input name="housing" type="number" min={0} step="0.01" defaultValue={salary?.housing ?? 0} className={inputClass} />
        </Field>
        <Field label="Transport (₦)">
          <input name="transport" type="number" min={0} step="0.01" defaultValue={salary?.transport ?? 0} className={inputClass} />
        </Field>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Other monthly allowances (optional)</legend>
        {extra("allowance", salary?.allowances)}
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Other monthly deductions (optional)</legend>
        {extra("deduction", salary?.deductions)}
      </fieldset>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="pension" defaultChecked={salary?.pension ?? true} /> Deduct employee pension
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nhf" defaultChecked={salary?.nhf ?? false} /> Deduct National Housing Fund
        </label>
      </div>
      <p className="text-xs text-admin-muted">PAYE tax is worked out from the payroll rates below.</p>
    </div>
  );
}
