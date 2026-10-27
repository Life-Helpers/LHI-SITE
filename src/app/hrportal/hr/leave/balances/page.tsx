import Link from "next/link";
import { FileDown, Info, LayoutGrid, Search, Table2 } from "lucide-react";

import { addLeaveAdjustmentAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { BalanceTable } from "@/components/hr/balance-table";
import { AutoSubmitSelect } from "@/components/hr/filters";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { PrintButton } from "@/components/hr/print-button";
import { hrefWith } from "@/components/hr/query";
import { Avatar, Field, fmtDate, inputClass, outlineButtonClass, PageTitle, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { balanceSheet, DETAIL_COLUMNS, detailCell, summaryCell } from "@/lib/hr/balance-sheet";
import { balanceFor } from "@/lib/hr/leave-balance";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave balances" };

const PER = 12;

export default async function LeaveBalancesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage(["leave.view_all", "leave.manage"]);
  const params = await searchParams;
  const thisYear = new Date().getFullYear();
  const year = Number(params.year) >= 2000 && Number(params.year) <= 2100 ? Number(params.year) : thisYear;
  const [employees, leave, policies, adjustments] = await Promise.all([
    readStore("hrEmployees"),
    readStore("hrLeave"),
    readStore("hrLeavePolicies"),
    readStore("hrLeaveAdjustments"),
  ]);
  const canManage = has(ctx.permissions, "leave.manage");
  const staff = employees.filter(isCurrentStaff).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const q = (params.q ?? "").trim().toLowerCase();
  const rows = staff.filter((e) => (!params.emp || e.id === params.emp) && (!q || [employeeName(e), e.staffNumber, e.department, e.jobTitle].some((v) => v.toLowerCase().includes(q))));
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const page = Math.min(pages, Math.max(1, Number(params.page) || 1));
  const shown = rows.slice((page - 1) * PER, page * PER);
  const years = [...new Set([thisYear - 1, thisYear, thisYear + 1, ...leave.map((l) => Number(l.startDate.slice(0, 4)))])].filter(Boolean).sort((a, b) => b - a);
  const limitedTypes = ctx.leaveTypes.filter((t) => t.active);
  const link = (changes: Record<string, string | number | undefined>) => hrefWith("/hrportal/hr/leave/balances", params, changes);
  // Table view: every matching employee on one page, to print or download.
  const view = params.view === "table" ? "table" : "cards";
  const allTypes = params.type === "all";
  const detailType = allTypes ? undefined : (ctx.leaveTypes.find((t) => t.id === params.type) ?? ctx.leaveTypes.find((t) => t.id === "Annual" && t.active) ?? limitedTypes[0]);
  const exportHref = hrefWith("/hrportal/hr/leave/balances/export", {}, { year, q: params.q, emp: params.emp, type: allTypes ? "all" : detailType?.id });

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/leave/balances" crumbs={[{ label: "Leave Management", href: "/hrportal/hr/leave" }, { label: "Leave Balances" }]}>
      <div className="print:hidden">
        <PageTitle
          title="Leave Balances"
          subtitle="View and manage leave balances."
          actions={
            <nav aria-label="Layout" className="inline-flex rounded-lg border border-admin-border bg-admin-card p-0.5">
              {(
                [
                  ["cards", "Cards", LayoutGrid],
                  ["table", "Table", Table2],
                ] as const
              ).map(([id, label, Icon]) => (
                <Link
                  key={id}
                  href={link({ view: id === "cards" ? undefined : id, page: undefined })}
                  aria-current={view === id ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${view === id ? "bg-admin-primary text-white" : "text-admin-muted hover:text-admin-text"}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
          }
        />
      </div>

      <p role="status" className="mb-5 flex items-start gap-2 rounded-lg border border-amber-300 print:hidden bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>Note:</strong> balances are worked out live from <Link href="/hrportal/hr/leave/types" className="font-semibold underline">leave types</Link>,{" "}
          <Link href="/hrportal/hr/leave/policies" className="font-semibold underline">leave policies</Link>, adjustments and approved or pending leave. New employees, types and policies apply
          straight away; there is nothing to sync.
        </span>
      </p>

      <section className="mb-5 hr-card px-4 py-4 print:hidden">
        <form action="/hrportal/hr/leave/balances" className="flex flex-wrap items-center gap-3" role="search">
          {view === "table" && <input type="hidden" name="view" value="table" />}
          <span className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={params.q ?? ""} placeholder="Search…" aria-label="Search employees" className={`${inputClass} mt-0 pl-9`} />
          </span>
          <AutoSubmitSelect name="emp" defaultValue={params.emp ?? ""} aria-label="Employee" className={`${inputClass} mt-0 max-w-56`}>
            <option value="">All Employees</option>
            {staff.map((e) => (
              <option key={e.id} value={e.id}>
                {employeeName(e)}
              </option>
            ))}
          </AutoSubmitSelect>
          {view === "table" && (
            <AutoSubmitSelect name="type" defaultValue={allTypes ? "all" : detailType?.id ?? "all"} aria-label="Leave type" className={`${inputClass} mt-0 max-w-56`}>
              <option value="all">All leave types (summary)</option>
              {limitedTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (in detail)
                </option>
              ))}
            </AutoSubmitSelect>
          )}
          <AutoSubmitSelect name="year" defaultValue={String(year)} aria-label="Year" className={`${inputClass} mt-0 max-w-36`}>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </AutoSubmitSelect>
          <button className="ml-auto rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-bg">Filter</button>
        </form>
        <p className="mt-3">
          <span className="rounded-md border border-admin-border px-2 py-0.5 text-xs">Year: {year}</span>
        </p>
      </section>

      {view === "table" ? (
        <BalanceSheetTable
          rows={balanceSheet(rows, year, ctx.leaveTypes, policies, leave, adjustments)}
          year={year}
          types={limitedTypes}
          detail={detailType}
          exportHref={exportHref}
          printedBy={ctx.displayName}
          filtered={Boolean(q || params.emp)}
        />
      ) : (
      <>
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {shown.map((e) => (
          <section key={e.id} className="hr-card flex min-w-0 flex-col p-4">
            <div className="flex items-center justify-between gap-3 border-b border-admin-border pb-4">
              <span className="flex min-w-0 items-center gap-3">
                <Avatar name={employeeName(e)} size="lg" square />
                <span className="min-w-0">
                  <Link href={`/hrportal/hr/employees/${e.id}?tab=leave`} className="block truncate text-base font-semibold hover:text-admin-primary">
                    {employeeName(e)}
                  </Link>
                  <span className="block truncate text-xs text-admin-muted">{e.staffNumber || e.department || e.jobTitle || "—"}</span>
                </span>
              </span>
              {canManage && e.id !== ctx.employee.id && (
                <Modal label="Adjust" outline title={`Adjust ${employeeName(e)}'s balance`} description="Add days (e.g. for work on a rest day) or remove them, with a reason. Kept in the audit trail.">
                  <ActionForm action={addLeaveAdjustmentAction} submitLabel="Save adjustment" resetOnSuccess className="space-y-3">
                    <input type="hidden" name="employeeId" value={e.id} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Leave type">
                        <select name="typeId" required className={inputClass}>
                          {limitedTypes.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Year">
                        <input name="year" type="number" defaultValue={year} min={2000} max={2100} required className={inputClass} />
                      </Field>
                    </div>
                    <Field label="Days" hint="Use a negative number to remove days, e.g. -2.">
                      <input name="days" type="number" step="0.5" required className={inputClass} />
                    </Field>
                    <Field label="Reason">
                      <input name="reason" required maxLength={300} className={inputClass} />
                    </Field>
                  </ActionForm>
                </Modal>
              )}
            </div>
            <div className="hr-scroll mt-3 max-h-64 overflow-y-auto overflow-x-hidden pr-1">
              <BalanceTable rows={balanceFor(e, year, ctx.leaveTypes, policies, leave, adjustments)} />
            </div>
          </section>
        ))}
      </div>
      {shown.length === 0 && <p className="py-10 text-center text-sm text-admin-muted">No employees match.</p>}

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-admin-muted">
            Showing {(page - 1) * PER + 1} to {Math.min(page * PER, rows.length)} of {rows.length} employees
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={link({ page: page - 1 })} className="rounded-lg border border-admin-border px-3 py-1.5 hover:bg-admin-bg">
                « Previous
              </Link>
            )}
            {page < pages && (
              <Link href={link({ page: page + 1 })} className="rounded-lg border border-admin-border px-3 py-1.5 hover:bg-admin-bg">
                Next »
              </Link>
            )}
          </div>
        </div>
      )}
      </>
      )}
    </PortalShell>
  );
}

/**
 * Leave balances as one printable table: a heading and the date for the printout, a row per
 * employee, and a line for HR to sign. Landscape A4 when printed.
 */
function BalanceSheetTable({
  rows,
  year,
  types,
  detail,
  exportHref,
  printedBy,
  filtered,
}: {
  rows: ReturnType<typeof balanceSheet>;
  year: number;
  types: { id: string; name: string }[];
  detail: { id: string; name: string } | undefined;
  exportHref: string;
  printedBy: string;
  filtered: boolean;
}) {
  return (
    <section className="hr-card overflow-hidden print:border-0 print:shadow-none">
      <style>{"@media print { @page { size: A4 landscape; margin: 12mm } }"}</style>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-admin-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">
            Leave balances {year}: {detail ? detail.name : "all leave types"}
          </h2>
          <p className="text-xs text-admin-muted">
            Life Helpers Initiative · {rows.length} employee{rows.length === 1 ? "" : "s"}
            {filtered ? " (filtered)" : ""} · as at {fmtDate(todayLagos())}. Days are working days; pending requests count as taken.
          </p>
        </div>
        <span className="flex flex-wrap gap-2 print:hidden">
          <a href={exportHref} className={outlineButtonClass}>
            <FileDown className="h-4 w-4" aria-hidden="true" /> Download CSV
          </a>
          <PrintButton label="Print" />
        </span>
      </div>
      <p className="px-5 pt-3 text-xs text-admin-muted sm:hidden print:hidden">Swipe sideways to see every column.</p>
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full min-w-[720px] text-left text-sm print:min-w-0 print:text-[10pt]">
          <thead>
            <tr className="bg-admin-bg text-xs font-semibold text-admin-muted print:bg-transparent">
              <th scope="col" className="px-4 py-3">#</th>
              <th scope="col" className="px-4 py-3">Employee</th>
              <th scope="col" className="px-4 py-3">Department</th>
              {detail
                ? DETAIL_COLUMNS.map((c) => (
                    <th key={c.key} scope="col" className="px-3 py-3 text-right">
                      {c.label}
                    </th>
                  ))
                : types.map((t) => (
                    <th key={t.id} scope="col" className="px-3 py-3 text-right">
                      {t.name}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {rows.map((r, i) => (
              <tr key={r.employee.id} className="break-inside-avoid">
                <td className="px-4 py-2.5 text-admin-muted">{i + 1}</td>
                <td className="px-4 py-2.5">
                  <span className="block font-medium">{employeeName(r.employee)}</span>
                  {r.employee.staffNumber && <span className="block text-xs text-admin-muted">{r.employee.staffNumber}</span>}
                </td>
                <td className="px-4 py-2.5 text-admin-muted">{r.employee.department || "—"}</td>
                {detail
                  ? DETAIL_COLUMNS.map((c) => {
                      const v = detailCell(r.balances.get(detail.id), c.key);
                      return (
                        <td key={c.key} className={`whitespace-nowrap px-3 py-2.5 text-right tabular-nums ${c.key === "available" ? `font-semibold ${v.startsWith("0 (") ? "text-admin-danger" : ""}` : ""}`}>
                          {v}
                        </td>
                      );
                    })
                  : types.map((t) => {
                      const v = summaryCell(r.balances.get(t.id));
                      return (
                        <td key={t.id} className={`whitespace-nowrap px-3 py-2.5 text-right tabular-nums ${v.includes("over") ? "text-admin-danger" : ""}`}>
                          {v}
                        </td>
                      );
                    })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No employees match.</p>}
      {/* Only on paper: who printed it, and space to sign. */}
      <div className="hidden px-5 pb-2 pt-8 text-xs print:flex print:justify-between">
        <span>Printed by {printedBy} on {fmtDate(todayLagos())}</span>
        <span>Checked by (HR): ______________________ Date: ____________</span>
      </div>
    </section>
  );
}
