import Link from "next/link";
import { ReceiptText, Search } from "lucide-react";

import { removeSalaryAction, saveSalaryAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { CountTabs } from "@/components/hr/payroll-ui";
import { SalaryFields } from "@/components/hr/payslip";
import { PortalShell } from "@/components/hr/portal-shell";
import { QuickAction } from "@/components/hr/quick-action";
import { Badge, inputClass, PageTitle, Person } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { monthlyPay, naira, payrollRules } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employee salaries" };

type Params = { q?: string; employee?: string; tab?: string };
const TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "unset", label: "Not set" },
];

/** Every current employee's monthly salary; HR and Finance only. */
export default async function SalariesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const ctx = await requireHrPage("payroll.manage");
  const params = await searchParams;
  const [employees, salaries, settingsList] = await Promise.all([readStore("hrEmployees"), readStore("hrSalaries"), readStore("hrPayrollSettings")]);
  const rules = payrollRules(settingsList[0]);
  const staff = employees.filter((e) => isCurrentStaff(e)).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const all = staff.map((e) => {
    const salary = salaries.find((s) => s.employeeId === e.id);
    return { e, salary, pay: salary ? monthlyPay(salary, rules) : null };
  });
  const q = (params.q ?? "").trim().toLowerCase();
  const filtered = all.filter(({ e }) => (!params.employee || e.id === params.employee) && (!q || `${employeeName(e)} ${e.staffNumber} ${e.jobTitle} ${e.department}`.toLowerCase().includes(q)));
  const tab = TABS.some((t) => t.id === params.tab) ? params.tab! : "all";
  const counts = { all: filtered.length, active: filtered.filter((r) => r.salary).length, unset: filtered.filter((r) => !r.salary).length };
  const rows = filtered.filter((r) => tab === "all" || (tab === "active" ? r.salary : !r.salary));
  const base = "/hrportal/payroll/salaries";

  return (
    <PortalShell ctx={ctx} current={base} crumbs={[{ label: "Payroll Management" }, { label: "Employee Salaries" }]}>
      <PageTitle title="Employee Salaries" subtitle="Monthly pay for each current employee. Changes apply to payslips prepared afterwards." />
      <section className="hr-card mb-5">
        <form method="get" action={base} className="flex flex-wrap items-center gap-3 px-4 pb-3 pt-4">
          {params.tab && <input type="hidden" name="tab" value={params.tab} />}
          <div className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={params.q ?? ""} placeholder="Search..." aria-label="Search employees" className={`${inputClass} mt-0 pl-9`} />
          </div>
          <div className="w-full sm:w-56">
            <select name="employee" defaultValue={params.employee ?? ""} aria-label="Employee" className={`${inputClass} mt-0`}>
              <option value="">All Employees</option>
              {staff.map((e) => (
                <option key={e.id} value={e.id}>{employeeName(e)}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-lg border border-admin-border px-3 py-2 text-sm font-medium hover:bg-admin-bg">Filter</button>
        </form>
        <CountTabs base={base} params={params} tabs={TABS} current={tab} counts={counts} />
      </section>
      <section className="hr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">Employee</th>
                <th scope="col" className="px-4 py-3 text-right">Basic Salary</th>
                <th scope="col" className="px-4 py-3 text-right">Gross</th>
                <th scope="col" className="px-4 py-3 text-right">Net</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Updated</th>
                <th scope="col" className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {rows.map(({ e, salary, pay }, i) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 text-admin-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Person name={employeeName(e)} sub={e.staffNumber || [e.jobTitle, e.department].filter(Boolean).join(" · ")} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{salary ? naira(salary.basic) : <span className="text-admin-muted">—</span>}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{pay ? naira(pay.gross) : ""}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{pay ? naira(pay.net) : ""}</td>
                  <td className="px-4 py-3">
                    <Badge status={salary ? "approved" : "pending"} label={salary ? "Active" : "Not set"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-admin-muted">{salary ? `${salary.updatedAt.slice(0, 10)} · ${salary.updatedByName}` : ""}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center justify-center gap-1">
                      {pay && (
                        <Modal label="View breakdown" iconOnly icon="view" title={`Monthly pay: ${employeeName(e)}`}>
                          <dl className="space-y-1 text-sm">
                            {[...pay.earnings.map((l) => ({ ...l, minus: false })), ...pay.deductions.map((l) => ({ ...l, minus: true }))].map((l, k) => (
                              <div key={k} className="flex justify-between gap-4">
                                <dt className="text-admin-muted">{l.name}</dt>
                                <dd className="tabular-nums">{l.minus ? "−" : ""}{naira(l.amount)}</dd>
                              </div>
                            ))}
                            <div className="flex justify-between gap-4 border-t border-admin-border pt-2 font-semibold">
                              <dt>Net pay</dt>
                              <dd className="tabular-nums">{naira(pay.net)}</dd>
                            </div>
                          </dl>
                        </Modal>
                      )}
                      {e.id === ctx.employee.id ? (
                        <span className="px-1 text-xs text-admin-muted">Set by a colleague</span>
                      ) : (
                        <>
                          <Modal label={salary ? "Edit salary" : "Set salary"} iconOnly icon={salary ? "edit" : "plus"} title={`Salary: ${employeeName(e)}`} wide>
                            <ActionForm action={saveSalaryAction} submitLabel="Save salary" className="space-y-4 text-left">
                              <input type="hidden" name="employeeId" value={e.id} />
                              <SalaryFields salary={salary} rules={rules} />
                            </ActionForm>
                          </Modal>
                          {salary && <QuickAction action={removeSalaryAction} fields={{ employeeId: e.id }} kind="delete" label={`Remove ${employeeName(e)}'s salary`} tip="Remove" confirmText={`Remove ${employeeName(e)}'s salary? Their published payslips stay.`} />}
                        </>
                      )}
                      <Link href={`/hrportal/payroll/payslips?employee=${e.id}`} aria-label={`${employeeName(e)}'s payslips`} title="Payslips" className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        <ReceiptText className="h-[18px] w-[18px]" aria-hidden="true" />
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No employees match.</p>}
      </section>
    </PortalShell>
  );
}
