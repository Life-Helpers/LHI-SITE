import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Eye, FileDown } from "lucide-react";

import { discardPayslipDraftsAction, publishPayslipsAction, setPayslipPenaltyAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { hrefWith } from "@/components/hr/query";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, Field, inputClass, outlineButtonClass, PageTitle, Person } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { naira, payMonthLabel } from "@/lib/hr/payroll";
import { has } from "@/lib/hr/access";
import { payrollSchedule } from "@/lib/hr/payroll-schedule";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payroll run" };

export default async function PayrollRunPage({ params, searchParams }: { params: Promise<{ month: string }>; searchParams: Promise<{ view?: string }> }) {
  const ctx = await requireHrPage(["payroll.runs", "payroll.payslips.view"]);
  const { month } = await params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) notFound();
  const slips = (await readStore("hrPayslips")).filter((p) => p.month === month).sort((a, b) => a.employee.name.localeCompare(b.employee.name));
  const drafts = slips.filter((p) => p.status === "draft").length;
  const canRun = has(ctx.permissions, "payroll.runs");
  // Running payroll shows totals; each person's pay needs "See everyone's payslips".
  const canSeeSlips = has(ctx.permissions, "payroll.payslips.view");
  const view = (await searchParams).view === "schedule" ? "schedule" : "payslips";
  const base = `/hrportal/payroll/runs/${month}`;
  const total = (f: (p: (typeof slips)[number]) => number) => naira(slips.reduce((n, p) => n + f(p), 0));

  return (
    <PortalShell ctx={ctx} current="/hrportal/payroll/runs" crumbs={[{ label: "Payroll Management" }, { label: "Payroll Runs", href: "/hrportal/payroll/runs" }, { label: payMonthLabel(month) }]}>
      <PageTitle
        title={`${payMonthLabel(month)} Payroll`}
        subtitle={`${slips.length - drafts} published, ${drafts} draft${drafts === 1 ? "" : "s"}. Gross ${total((p) => p.gross)} · deductions ${total((p) => p.totalDeductions)} · net ${total((p) => p.net)}.`}
        actions={
          <>
            {canSeeSlips && (
              <a href={`/hrportal/payroll/runs/${month}/export`} className={outlineButtonClass}>
                <FileDown className="h-4 w-4" aria-hidden="true" /> Export schedule (CSV)
              </a>
            )}
            <Link href="/hrportal/payroll/runs" className={outlineButtonClass}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
            </Link>
          </>
        }
      />
      {canRun && drafts > 0 && (
        <div className="mb-5 flex flex-wrap items-start gap-3">
          <ActionForm action={publishPayslipsAction} submitLabel={`Publish ${drafts} draft${drafts === 1 ? "" : "s"}`} confirmText={`Publish ${drafts} payslip${drafts === 1 ? "" : "s"} for ${payMonthLabel(month)}? Staff will see them, and they can't be changed afterwards.`}>
            <input type="hidden" name="month" value={month} />
          </ActionForm>
          <ActionForm action={discardPayslipDraftsAction} submitLabel="Discard drafts" danger confirmText="Discard this month's drafts?">
            <input type="hidden" name="month" value={month} />
          </ActionForm>
        </div>
      )}
      {canSeeSlips && (
        <nav aria-label="View" className="mb-4 flex gap-1 border-b border-admin-border">
          {(
            [
              ["payslips", "Payslips"],
              ["schedule", "Payroll schedule"],
            ] as const
          ).map(([id, label]) => (
            <Link
              key={id}
              href={hrefWith(base, {}, { view: id === "payslips" ? undefined : id })}
              aria-current={view === id ? "page" : undefined}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium ${view === id ? "border-admin-primary text-admin-primary" : "border-transparent text-admin-muted hover:text-admin-text"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
      {canSeeSlips && view === "schedule" ? (
        <ScheduleTable slips={slips} />
      ) : !canSeeSlips ? (
        <section className="hr-card px-5 py-8 text-sm text-admin-muted">
          {slips.length} payslip{slips.length === 1 ? "" : "s"} in this run. Your access shows the run&apos;s totals only, not what each person is paid.
        </section>
      ) : (
        <section className="hr-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                  <th scope="col" className="px-4 py-3">Employee</th>
                  <th scope="col" className="px-4 py-3 text-right">Gross</th>
                  <th scope="col" className="px-4 py-3 text-right">Deductions</th>
                  <th scope="col" className="px-4 py-3 text-right">Net</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {slips.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <Person name={p.employee.name} sub={p.employee.staffNumber || p.employee.jobTitle} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{naira(p.gross)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{naira(p.totalDeductions)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{naira(p.net)}</td>
                    <td className="px-4 py-3">
                      <Badge status={p.status === "published" ? "approved" : "pending"} label={p.status === "published" ? "Published" : "Draft"} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {canRun && p.status === "draft" && p.employeeId !== ctx.employee.id && (
                        <Modal label={p.penalty ? `Penalty: ${naira(p.penalty)}` : "Add penalty"} iconOnly icon="edit" title={`Penalty: ${p.employee.name}, ${payMonthLabel(month)}`} description="Taken off this month's gross before tax. Enter 0 to clear it.">
                          <ActionForm action={setPayslipPenaltyAction} submitLabel="Save penalty" className="space-y-4 text-left">
                            <input type="hidden" name="payslipId" value={p.id} />
                            <Field label="Penalty (₦)">
                              <input name="penalty" type="number" min={0} step="0.01" defaultValue={p.penalty ?? 0} className={inputClass} />
                            </Field>
                            <Field label="Reason" hint="Shown on the payslip, e.g. Unauthorised absence (2 days).">
                              <input name="penaltyReason" maxLength={80} defaultValue={p.penaltyReason} className={inputClass} />
                            </Field>
                          </ActionForm>
                        </Modal>
                      )}
                      <Link href={`/hrportal/payslips/${p.id}`} aria-label={`View ${p.employee.name}'s payslip`} className="inline-flex rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                      </Link>
                      <a href={`/hrportal/payslips/${p.id}/pdf`} download aria-label={`Download ${p.employee.name}'s payslip as PDF`} className="inline-flex rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        <Download className="h-[18px] w-[18px]" aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {slips.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No payslips for this month.</p>}
        </section>
      )}
    </PortalShell>
  );
}

/** The run as LHI's payroll schedule: one row per person, totals at the bottom. */
function ScheduleTable({ slips }: { slips: Parameters<typeof payrollSchedule>[0] }) {
  const { columns, rows, totals } = payrollSchedule(slips);
  const cell = (n: number) => (n ? naira(n) : "–");
  return (
    <section className="hr-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] text-left text-xs">
          <thead>
            <tr className="bg-admin-bg font-semibold text-admin-muted">
              <th scope="col" className="sticky left-0 bg-admin-bg px-3 py-3">Staff Name</th>
              <th scope="col" className="px-3 py-3">Position</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="px-3 py-3 text-right">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {rows.map((r) => (
              <tr key={r.payslipId}>
                <th scope="row" className="sticky left-0 whitespace-nowrap bg-admin-card px-3 py-2.5 font-medium">{r.name}</th>
                <td className="whitespace-nowrap px-3 py-2.5 text-admin-muted">{r.position || "—"}</td>
                {columns.map((c) => (
                  <td key={c.key} className={`whitespace-nowrap px-3 py-2.5 text-right tabular-nums ${c.key === "net" || c.key === "totalEmolument" ? "font-semibold" : ""}`}>
                    {cell(r.values[c.key] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-admin-bg font-semibold">
              <th scope="row" className="sticky left-0 bg-admin-bg px-3 py-3">Total</th>
              <td />
              {columns.map((c) => (
                <td key={c.key} className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                  {cell(totals[c.key])}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No payslips for this month.</p>}
    </section>
  );
}
