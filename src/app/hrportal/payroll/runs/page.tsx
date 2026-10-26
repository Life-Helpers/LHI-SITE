import Link from "next/link";
import { CalendarDays, Eye, FileDown, Search } from "lucide-react";

import { preparePayslipsAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { InsightsPanel } from "@/components/hr/insights-panel";
import { Modal } from "@/components/hr/modal";
import { CountTabs, MonthStrip } from "@/components/hr/payroll-ui";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, Field, inputClass, Notice, PageTitle, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { naira, payMonthLabel } from "@/lib/hr/payroll";
import { has, holidayDates } from "@/lib/hr/access";
import { payrollInsights } from "@/lib/hr/insights";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payroll runs" };

type Params = { denied?: string; year?: string; month?: string; q?: string; tab?: string };
const TABS = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "completed", label: "Completed" },
];

/** One run per month: prepare drafts, check them, publish. */
export default async function PayrollRunsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const ctx = await requireHrPage(["payroll.runs", "payroll.payslips.view"]);
  const params = await searchParams;
  const today = todayLagos();
  const year = /^\d{4}$/.test(params.year ?? "") ? Number(params.year) : Number(today.slice(0, 4));
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") && params.month!.startsWith(String(year)) ? params.month : undefined;
  const [slips, employees, salaries, events] = await Promise.all([readStore("hrPayslips"), readStore("hrEmployees"), readStore("hrSalaries"), readStore("hrEvents")]);
  const canRun = has(ctx.permissions, "payroll.runs");
  const canSeeSlips = has(ctx.permissions, "payroll.payslips.view");
  const insights = payrollInsights({
    employees,
    salaries,
    payslips: slips,
    today,
    holidays: holidayDates(events, Number(today.slice(0, 4))),
    can: { salaries: has(ctx.permissions, "payroll.salaries.view"), runs: canRun },
  });
  const runs = [...new Set(slips.map((p) => p.month))].sort().reverse().map((m) => {
    const inRun = slips.filter((p) => p.month === m);
    const drafts = inRun.filter((p) => p.status === "draft").length;
    const last = new Date(Date.UTC(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0)).toISOString().slice(0, 10);
    return {
      month: m,
      title: `${payMonthLabel(m)} Payroll`,
      from: `${m}-01`,
      to: last,
      payDate: inRun.find((p) => p.payDate)?.payDate ?? last,
      employees: inRun.length,
      gross: inRun.reduce((n, p) => n + p.gross, 0),
      net: inRun.reduce((n, p) => n + p.net, 0),
      status: drafts ? "draft" : "completed",
      drafts,
    };
  });
  const q = (params.q ?? "").trim().toLowerCase();
  const inYear = runs.filter((r) => r.month.startsWith(String(year)) && (!month || r.month === month) && (!q || r.title.toLowerCase().includes(q)));
  const tab = TABS.some((t) => t.id === params.tab) ? params.tab! : "all";
  const counts = { all: inYear.length, draft: inYear.filter((r) => r.status === "draft").length, completed: inYear.filter((r) => r.status === "completed").length };
  const rows = inYear.filter((r) => tab === "all" || r.status === tab);
  const base = "/hrportal/payroll/runs";
  const p = params as Record<string, string | undefined>;

  return (
    <PortalShell ctx={ctx} current={base} crumbs={[{ label: "Payroll Management" }, { label: "Payroll Runs" }]}>
      {params.denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle
        title="Payroll Runs"
        subtitle="Process and manage payroll runs for each pay period."
        actions={
          canRun && (
            <Modal label="Add Payroll Run" title="Add a payroll run" description="Draft payslips are made for every current employee with a salary. Check them, then publish.">
              <ActionForm action={preparePayslipsAction} submitLabel="Prepare payslips" className="space-y-4">
                <Field label="Month">
                  <input name="month" type="month" required defaultValue={today.slice(0, 7)} className={inputClass} />
                </Field>
                <Field label="Pay date (optional)" hint="Leave blank for the month's last working day.">
                  <input name="payDate" type="date" className={inputClass} />
                </Field>
              </ActionForm>
            </Modal>
          )
        }
      />
      {insights.length > 0 && (
        <div className="mb-5">
          <InsightsPanel items={insights} />
        </div>
      )}
      <MonthStrip base={base} params={p} year={year} month={month} marked={runs.map((r) => r.month)} />
      <section className="hr-card mb-5">
        <form method="get" action={base} className="flex flex-wrap items-center gap-3 px-4 pb-3 pt-4">
          <input type="hidden" name="year" value={year} />
          {month && <input type="hidden" name="month" value={month} />}
          <div className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={params.q ?? ""} placeholder="Search..." aria-label="Search payroll runs" className={`${inputClass} mt-0 pl-9`} />
          </div>
        </form>
        <CountTabs base={base} params={p} tabs={TABS} current={tab} counts={counts} />
      </section>
      <section className="hr-card overflow-hidden">
        <p className="px-4 pt-3 text-xs text-admin-muted sm:hidden">Swipe sideways to see every column.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">Title</th>
                <th scope="col" className="px-4 py-3">Frequency</th>
                <th scope="col" className="px-4 py-3">Pay Period</th>
                <th scope="col" className="px-4 py-3">Pay Date</th>
                <th scope="col" className="px-4 py-3 text-right">Employees</th>
                <th scope="col" className="px-4 py-3 text-right">Gross Pay</th>
                <th scope="col" className="px-4 py-3 text-right">Net Pay</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {rows.map((r, i) => (
                <tr key={r.month}>
                  <td className="px-4 py-3 text-admin-muted">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300">Monthly</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-admin-muted">
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{r.from}</span>
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{r.to}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-admin-muted">{r.payDate}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.employees}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-admin-success">{naira(r.gross)}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{naira(r.net)}</td>
                  <td className="px-4 py-3">
                    <Badge status={r.status === "completed" ? "approved" : "pending"} label={r.status === "completed" ? "Completed" : `Draft (${r.drafts})`} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center justify-center gap-1">
                      <Link href={`${base}/${r.month}`} aria-label={`View ${r.title}`} title="View" className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                      </Link>
                      {canSeeSlips && (
                        <a href={`${base}/${r.month}/export`} aria-label={`Export ${r.title}`} title="Export (CSV)" className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                          <FileDown className="h-[18px] w-[18px]" aria-hidden="true" />
                        </a>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No payroll runs here yet.{canRun ? " Use Add Payroll Run to prepare one." : ""}</p>}
      </section>
    </PortalShell>
  );
}
