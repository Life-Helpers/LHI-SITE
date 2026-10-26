import Link from "next/link";
import { Download, Eye, Search } from "lucide-react";

import { CountTabs, MonthStrip } from "@/components/hr/payroll-ui";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, inputClass, Notice, PageTitle, Person, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { naira } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payslips" };

type Params = { denied?: string; year?: string; month?: string; q?: string; employee?: string; tab?: string };
const TABS = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "viewed", label: "Viewed" },
];

/** Every payslip, for HR and Finance. */
export default async function AdminPayslipsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const ctx = await requireHrPage("payroll.payslips.view");
  const params = await searchParams;
  const year = /^\d{4}$/.test(params.year ?? "") ? Number(params.year) : Number(todayLagos().slice(0, 4));
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") && params.month!.startsWith(String(year)) ? params.month : undefined;
  const [slips, employees] = await Promise.all([readStore("hrPayslips"), readStore("hrEmployees")]);
  const q = (params.q ?? "").trim().toLowerCase();
  const filtered = slips
    .filter((p) => p.month.startsWith(String(year)) && (!month || p.month === month) && (!params.employee || p.employeeId === params.employee) && (!q || `${p.employee.name} ${p.employee.staffNumber}`.toLowerCase().includes(q)))
    .sort((a, b) => b.month.localeCompare(a.month) || a.employee.name.localeCompare(b.employee.name));
  const status = (p: (typeof slips)[number]) => (p.status === "draft" ? "draft" : p.viewedAt ? "viewed" : "published");
  const tab = TABS.some((t) => t.id === params.tab) ? params.tab! : "all";
  const counts = Object.fromEntries(TABS.map((t) => [t.id, t.id === "all" ? filtered.length : filtered.filter((p) => status(p) === t.id).length]));
  const rows = filtered.filter((p) => tab === "all" || status(p) === tab);
  const people = employees.filter((e) => slips.some((p) => p.employeeId === e.id)).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const base = "/hrportal/payroll/payslips";
  const p = params as Record<string, string | undefined>;

  return (
    <PortalShell ctx={ctx} current={base} crumbs={[{ label: "Payroll Management" }, { label: "Payslips" }]}>
      {params.denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="Payslips" subtitle="Payslips for every employee. Staff see their own once published." />
      <MonthStrip base={base} params={p} year={year} month={month} marked={[...new Set(slips.map((s) => s.month))]} />
      <section className="hr-card mb-5">
        <form method="get" action={base} className="flex flex-wrap items-center gap-3 px-4 pb-3 pt-4">
          {month && <input type="hidden" name="month" value={month} />}
          {params.tab && <input type="hidden" name="tab" value={params.tab} />}
          <div className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={params.q ?? ""} placeholder="Search..." aria-label="Search payslips" className={`${inputClass} mt-0 pl-9`} />
          </div>
          <div className="w-full sm:w-56">
            <select name="year" defaultValue={year} aria-label="Year" className={`${inputClass} mt-0`}>
              {Array.from({ length: 6 }, (_, i) => Number(todayLagos().slice(0, 4)) + 1 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-56">
            <select name="employee" defaultValue={params.employee ?? ""} aria-label="Employee" className={`${inputClass} mt-0`}>
              <option value="">All Employees</option>
              {people.map((e) => (
                <option key={e.id} value={e.id}>{employeeName(e)}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-lg border border-admin-border px-3 py-2 text-sm font-medium hover:bg-admin-bg">Filter</button>
        </form>
        <CountTabs base={base} params={p} tabs={TABS} current={tab} counts={counts} />
      </section>
      <section className="hr-card overflow-hidden">
        <p className="px-4 pt-3 text-xs text-admin-muted sm:hidden">Swipe sideways to see every column.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">Employee</th>
                <th scope="col" className="px-4 py-3">Pay Date</th>
                <th scope="col" className="px-4 py-3 text-right">Net Pay</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Generated On</th>
                <th scope="col" className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {rows.map((s, i) => {
                const st = status(s);
                return (
                  <tr key={s.id}>
                    <td className="px-4 py-3 text-admin-muted">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Person name={s.employee.name} sub={s.employee.staffNumber || s.employee.jobTitle} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-admin-muted">{s.payDate ?? s.month}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{naira(s.net)}</td>
                    <td className="px-4 py-3">
                      <Badge status={st === "draft" ? "pending" : "approved"} label={st === "draft" ? "Draft" : st === "viewed" ? "Viewed" : "Published"} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-admin-muted">{(s.publishedAt ?? s.createdAt).slice(0, 10)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/hrportal/payslips/${s.id}`} aria-label={`View ${s.employee.name}'s payslip`} className="inline-flex rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                      </Link>
                      <a href={`/hrportal/payslips/${s.id}/pdf`} download aria-label={`Download ${s.employee.name}'s payslip as PDF`} className="inline-flex rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        <Download className="h-[18px] w-[18px]" aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No payslips match.</p>}
      </section>
    </PortalShell>
  );
}
