import Link from "next/link";
import { Banknote, Calculator, ReceiptText, Users } from "lucide-react";

import { preparePayslipsAction, savePayrollSettingsAction, saveSalaryAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { SalaryFields } from "@/components/hr/payslip";
import { PortalShell } from "@/components/hr/portal-shell";
import { Card, Field, inputClass, Notice, PageTitle, Person, TintStat, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { monthlyPay, naira, payMonthLabel } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";
import { DEFAULT_PAYROLL_SETTINGS, employeeName, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payroll" };

/** Salaries and monthly payslips: HR and Finance only. */
export default async function PayrollPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage("payroll.manage");
  const { denied } = await searchParams;
  const [employees, salaries, settingsList, payslips] = await Promise.all([readStore("hrEmployees"), readStore("hrSalaries"), readStore("hrPayrollSettings"), readStore("hrPayslips")]);
  const settings = settingsList[0] ?? DEFAULT_PAYROLL_SETTINGS;
  const staff = employees.filter((e) => isCurrentStaff(e)).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const rows = staff.map((e) => {
    const salary = salaries.find((s) => s.employeeId === e.id);
    return { e, salary, pay: salary ? monthlyPay(salary, settings) : null };
  });
  const withPay = rows.filter((r) => r.pay);
  const sum = (f: (p: NonNullable<(typeof rows)[number]["pay"]>) => number) => withPay.reduce((n, r) => n + f(r.pay!), 0);
  const months = [...new Set(payslips.map((p) => p.month))].sort().reverse();
  const thisMonth = todayLagos().slice(0, 7);
  const bands = [...settings.taxBands, ...Array.from({ length: Math.max(0, 8 - settings.taxBands.length) }, () => null)];

  return (
    <PortalShell ctx={ctx} current="/hrportal/payroll" crumbs={[{ label: "Payroll" }]}>
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="Payroll" subtitle="Set salaries and issue monthly payslips. Only HR and Finance see this page; each person sees only their own payslips." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TintStat tint="blue" icon={Users} label="Salaries set" value={`${withPay.length} of ${staff.length}`} note={staff.length - withPay.length ? `${staff.length - withPay.length} current staff still need one` : "Everyone has a salary"} />
        <TintStat tint="green" icon={Banknote} label="Gross pay a month" value={naira(sum((p) => p.gross))} />
        <TintStat tint="amber" icon={Calculator} label="PAYE a month" value={naira(sum((p) => p.deductions.find((d) => d.name === "PAYE tax")?.amount ?? 0))} />
        <TintStat tint="teal" icon={ReceiptText} label="Net pay a month" value={naira(sum((p) => p.net))} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card title="Salaries" subtitle="Monthly amounts. Changes apply to payslips prepared afterwards." flush>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                  <th scope="col" className="px-4 py-3">Employee</th>
                  <th scope="col" className="px-4 py-3 text-right">Gross</th>
                  <th scope="col" className="px-4 py-3 text-right">Deductions</th>
                  <th scope="col" className="px-4 py-3 text-right">Net</th>
                  <th scope="col" className="px-4 py-3">Updated</th>
                  <th scope="col" className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {rows.map(({ e, salary, pay }) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3">
                      <Person name={employeeName(e)} sub={[e.jobTitle, e.department].filter(Boolean).join(" · ")} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{pay ? naira(pay.gross) : <span className="text-admin-muted">Not set</span>}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{pay ? naira(pay.totalDeductions) : ""}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{pay ? naira(pay.net) : ""}</td>
                    <td className="px-4 py-3 text-xs text-admin-muted">{salary ? `${salary.updatedAt.slice(0, 10)} by ${salary.updatedByName}` : ""}</td>
                    <td className="px-4 py-3 text-center">
                      {e.id === ctx.employee.id ? (
                        <span className="text-xs text-admin-muted">Set by a colleague</span>
                      ) : (
                        <Modal label={salary ? "Edit salary" : "Set salary"} iconOnly icon={salary ? "edit" : "plus"} title={`Salary: ${employeeName(e)}`} wide>
                          <ActionForm action={saveSalaryAction} submitLabel="Save salary" className="space-y-4 text-left">
                            <input type="hidden" name="employeeId" value={e.id} />
                            <SalaryFields salary={salary} />
                          </ActionForm>
                        </Modal>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No current staff yet.</p>}
        </Card>

        <div className="space-y-6">
          <Card title="Monthly payslips" subtitle="Prepare drafts, check them, then publish.">
            <ActionForm action={preparePayslipsAction} submitLabel="Prepare payslips" className="space-y-3">
              <Field label="Month" hint="Drafts are replaced each time; published payslips never change.">
                <input name="month" type="month" required defaultValue={thisMonth} className={inputClass} />
              </Field>
            </ActionForm>
            <ul className="mt-5 divide-y divide-admin-border border-t border-admin-border">
              {months.map((m) => {
                const inMonth = payslips.filter((p) => p.month === m);
                const drafts = inMonth.filter((p) => p.status === "draft").length;
                return (
                  <li key={m}>
                    <Link href={`/hrportal/payroll/${m}`} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-admin-primary">
                      <span className="font-medium">{payMonthLabel(m)}</span>
                      <span className="text-xs text-admin-muted">
                        {inMonth.length - drafts} published{drafts ? ` · ${drafts} draft${drafts === 1 ? "" : "s"}` : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {months.length === 0 && <p className="pt-4 text-sm text-admin-muted">No payslips yet.</p>}
          </Card>

          <Card title="Payroll rates" subtitle={settings.updatedAt ? `Last changed ${settings.updatedAt.slice(0, 10)} by ${settings.updatedByName}` : "Starting rates: please confirm them with your tax adviser."}>
            <Modal label="Edit rates" outline icon="edit" title="Payroll rates" description="PAYE bands are yearly amounts in naira. Pension and NHF are taken off before tax." wide>
              <ActionForm action={savePayrollSettingsAction} submitLabel="Save rates" className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Employee pension (%)">
                    <input name="pensionRate" type="number" min={0} max={100} step="0.01" defaultValue={settings.pensionRate} className={inputClass} />
                  </Field>
                  <Field label="National Housing Fund (% of basic)">
                    <input name="nhfRate" type="number" min={0} max={100} step="0.01" defaultValue={settings.nhfRate} className={inputClass} />
                  </Field>
                </div>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">PAYE bands (yearly taxable income)</legend>
                  <p className="text-xs text-admin-muted">Each band runs from the previous band&apos;s limit up to its own. Leave the last band&apos;s limit blank.</p>
                  {bands.map((b, i) => (
                    <div key={i} className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
                      <input name={`band_upTo_${i}`} type="number" min={0} defaultValue={b?.upTo ?? ""} placeholder={b ? "and above" : "Up to (₦)"} aria-label={`Band ${i + 1} up to`} className={`${inputClass} mt-0`} />
                      <input name={`band_rate_${i}`} type="number" min={0} max={100} step="0.01" defaultValue={b?.rate ?? ""} placeholder="Rate %" aria-label={`Band ${i + 1} rate`} className={`${inputClass} mt-0`} />
                    </div>
                  ))}
                </fieldset>
              </ActionForm>
            </Modal>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-admin-muted">Pension (employee)</dt>
                <dd>{settings.pensionRate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-admin-muted">NHF</dt>
                <dd>{settings.nhfRate}% of basic</dd>
              </div>
              {settings.taxBands.map((b, i) => (
                <div key={i} className="flex justify-between">
                  <dt className="text-admin-muted">{b.upTo === null ? `Above ${naira(settings.taxBands[i - 1]?.upTo ?? 0)}` : `Up to ${naira(b.upTo)}`}</dt>
                  <dd>{b.rate}%</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
