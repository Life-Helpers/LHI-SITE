import Link from "next/link";
import { Info, Search } from "lucide-react";

import { addLeaveAdjustmentAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { BalanceTable } from "@/components/hr/balance-table";
import { AutoSubmitSelect } from "@/components/hr/filters";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { hrefWith } from "@/components/hr/query";
import { Avatar, Field, inputClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
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

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/leave/balances" crumbs={[{ label: "Leave Management", href: "/hrportal/hr/leave" }, { label: "Leave Balances" }]}>
      <PageTitle title="Leave Balances" subtitle="View and manage leave balances." />

      <p role="status" className="mb-5 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>Note:</strong> balances are worked out live from <Link href="/hrportal/hr/leave/types" className="font-semibold underline">leave types</Link>,{" "}
          <Link href="/hrportal/hr/leave/policies" className="font-semibold underline">leave policies</Link>, adjustments and approved or pending leave. New employees, types and policies apply
          straight away; there is nothing to sync.
        </span>
      </p>

      <section className="mb-5 hr-card px-4 py-4">
        <form action="/hrportal/hr/leave/balances" className="flex flex-wrap items-center gap-3" role="search">
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
    </PortalShell>
  );
}
