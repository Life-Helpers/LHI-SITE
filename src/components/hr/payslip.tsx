import Image from "next/image";

import { BASE_LABEL, describeRule, naira, payMonthLabel, ruleApplies } from "@/lib/hr/payroll";
import type { HrPayslip, HrSalary, PayrollRule } from "@/lib/hr/types";
import { Field, inputClass } from "@/components/hr/ui";

/** A payslip laid out for screen and print (the portal's menus are hidden when printing). */
export function PayslipView({ slip, preview = false }: { slip: HrPayslip; /** Worked out from the current salary, not issued. */ preview?: boolean }) {
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
          {preview ? (
            <p className="mt-1 inline-block rounded border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800">PREVIEW: from the current salary</p>
          ) : (
            slip.status === "draft" && <p className="mt-1 inline-block rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">DRAFT: not yet published</p>
          )}
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
export function SalaryFields({ salary, rules }: { salary?: HrSalary; rules: PayrollRule[] }) {
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
      <fieldset>
        <legend className="text-sm font-medium">Taxes and statutory deductions for this person</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {rules
            .filter((r) => r.active)
            .map((r) => (
              <label key={r.id} className="flex items-start gap-2 text-sm">
                <input type="checkbox" name={`apply_${r.id}`} defaultChecked={salary ? ruleApplies(r, salary) : r.defaultOn} className="mt-1" />
                <span>
                  {r.name}
                  <span className="block text-xs text-admin-muted">{describeRule(r)}</span>
                </span>
              </label>
            ))}
        </div>
      </fieldset>
      <p className="text-xs text-admin-muted">Rates are set under Taxes &amp; deductions on the Payroll page.</p>
    </div>
  );
}

/** Fields for one tax or statutory deduction. */
export function RuleFields({ rule }: { rule?: PayrollRule }) {
  const bands = [...(rule?.bands ?? []), ...Array.from({ length: Math.max(0, 8 - (rule?.bands.length ?? 0)) }, () => null)];
  return (
    <div className="space-y-4">
      {rule && <input type="hidden" name="ruleId" value={rule.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required maxLength={60} defaultValue={rule?.name} placeholder="e.g. Development levy" className={inputClass} />
        </Field>
        <Field label="Worked out as">
          <select name="method" defaultValue={rule?.method ?? "percent"} className={inputClass}>
            <option value="percent">A percentage</option>
            <option value="fixed">A fixed amount a month</option>
            <option value="bands">Yearly bands (like PAYE)</option>
          </select>
        </Field>
        <Field label="Percentage (%)" hint="For a percentage.">
          <input name="rate" type="number" min={0} max={100} step="0.01" defaultValue={rule?.method === "percent" ? rule.rate : ""} className={inputClass} />
        </Field>
        <Field label="Amount (₦ a month)" hint="For a fixed amount.">
          <input name="amount" type="number" min={0} step="0.01" defaultValue={rule?.method === "fixed" ? rule.amount : ""} className={inputClass} />
        </Field>
        <Field label="Worked out on" hint="For a percentage or bands. Taxable pay is gross less the items taken off before tax.">
          <select name="base" defaultValue={rule?.base ?? "taxable"} className={inputClass}>
            {(Object.keys(BASE_LABEL) as (keyof typeof BASE_LABEL)[]).map((b) => (
              <option key={b} value={b}>
                {BASE_LABEL[b].charAt(0).toUpperCase() + BASE_LABEL[b].slice(1)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Yearly bands (only for &quot;Yearly bands&quot;)</legend>
        <p className="text-xs text-admin-muted">Each band runs from the previous band&apos;s limit up to its own. Leave the last band&apos;s limit blank.</p>
        {bands.map((b, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
            <input name={`band_upTo_${i}`} type="number" min={0} defaultValue={b?.upTo ?? ""} placeholder={b ? "and above" : "Up to (₦ a year)"} aria-label={`Band ${i + 1} up to`} className={`${inputClass} mt-0`} />
            <input name={`band_rate_${i}`} type="number" min={0} max={100} step="0.01" defaultValue={b?.rate ?? ""} placeholder="Rate %" aria-label={`Band ${i + 1} rate`} className={`${inputClass} mt-0`} />
          </div>
        ))}
      </fieldset>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="beforeTax" defaultChecked={rule?.beforeTax ?? false} /> Taken off before tax (like pension)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="defaultOn" defaultChecked={rule?.defaultOn ?? true} /> Applies to everyone unless unticked for a person
        </label>
        {rule && (
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked={rule.active} /> In use
          </label>
        )}
      </div>
    </div>
  );
}

