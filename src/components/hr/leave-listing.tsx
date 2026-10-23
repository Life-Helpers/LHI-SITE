import Link from "next/link";
import { ChevronsUpDown, ChevronDown, ChevronUp, Eye, Search } from "lucide-react";

import { cancelMyLeaveAction, decideLeaveAction } from "@/app/hrportal/actions";
import { AutoSubmitSelect } from "@/components/hr/filters";
import { LEAVE_STYLE, leaveLabel } from "@/components/hr/leave-style";
import { hrefWith } from "@/components/hr/query";
import { QuickAction } from "@/components/hr/quick-action";
import { Badge, fmtDate, inputClass, Person } from "@/components/hr/ui";
import { employeeName, LEAVE_TYPES, type HrEmployee, type HrLeaveRequest } from "@/lib/hr/types";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
] as const;
const PER_PAGE = [10, 25, 50];
const SORTS = { start: "startDate", end: "endDate", applied: "createdAt" } as const;

export type LeaveParams = Record<"tab" | "q" | "emp" | "type" | "sort" | "dir" | "page" | "per", string | undefined> & Record<string, string | undefined>;

/**
 * Leave applications table with status tabs, search, filters, sortable dates and paging.
 * `rows` must already be limited to what the viewer may see; the action icons are shown only
 * where the server-side rules allow, and the actions check again when used.
 */
export function LeaveListing({
  rows,
  employees,
  basePath,
  params,
  showEmployee = true,
  canDecide,
  canCancel,
  viewHref,
}: {
  rows: HrLeaveRequest[];
  employees: HrEmployee[];
  basePath: string;
  params: LeaveParams;
  showEmployee?: boolean;
  canDecide?: (l: HrLeaveRequest) => boolean;
  canCancel?: (l: HrLeaveRequest) => boolean;
  viewHref?: (employeeId: string) => string | undefined;
}) {
  const tab = TABS.some((t) => t.id === params.tab) ? params.tab! : "pending";
  const per = PER_PAGE.includes(Number(params.per)) ? Number(params.per) : 10;
  const sortKey = (params.sort && params.sort in SORTS ? params.sort : "applied") as keyof typeof SORTS;
  const dir = params.dir === "asc" ? "asc" : "desc";
  const q = (params.q ?? "").trim().toLowerCase();
  const byId = new Map(employees.map((e) => [e.id, e]));
  const people = [...new Set(rows.map((r) => r.employeeId))].map((id) => byId.get(id)).filter((e): e is HrEmployee => Boolean(e)).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));

  const filtered = rows.filter((l) => {
    if (params.emp && l.employeeId !== params.emp) return false;
    if (params.type && l.type !== params.type) return false;
    if (q) {
      const e = byId.get(l.employeeId);
      if (![employeeName(e), e?.email ?? "", l.type, l.reason].some((v) => v.toLowerCase().includes(q))) return false;
    }
    return true;
  });
  const counts = Object.fromEntries(TABS.map((t) => [t.id, t.id === "all" ? filtered.length : filtered.filter((l) => l.status === t.id).length]));
  const inTab = filtered
    .filter((l) => tab === "all" || l.status === tab)
    .sort((a, b) => {
      const f = SORTS[sortKey];
      return (dir === "asc" ? 1 : -1) * a[f].localeCompare(b[f]);
    });
  const pages = Math.max(1, Math.ceil(inTab.length / per));
  const page = Math.min(pages, Math.max(1, Number(params.page) || 1));
  const shown = inTab.slice((page - 1) * per, page * per);
  const link = (changes: Record<string, string | number | undefined>) => hrefWith(basePath, params, changes);

  const sortHeader = (key: keyof typeof SORTS, label: string) => {
    const activeSort = sortKey === key;
    const Icon = !activeSort ? ChevronsUpDown : dir === "asc" ? ChevronUp : ChevronDown;
    return (
      <Link href={link({ sort: key, dir: activeSort && dir === "desc" ? "asc" : "desc", page: undefined })} className="inline-flex items-center gap-1 hover:text-admin-text" aria-label={`Sort by ${label}`}>
        {label} <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    );
  };

  return (
    <section className="overflow-hidden rounded-xl border border-admin-border bg-admin-card">
      <nav aria-label="Leave status" className="flex overflow-x-auto border-b border-admin-border px-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={link({ tab: t.id, page: undefined })}
            aria-current={tab === t.id ? "page" : undefined}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${tab === t.id ? "border-admin-primary text-admin-primary" : "border-transparent text-admin-muted hover:text-admin-text"}`}
          >
            {t.label} Leaves <span className="ml-1 rounded-full bg-admin-bg px-1.5 py-0.5 text-[11px] text-admin-muted">{counts[t.id]}</span>
          </Link>
        ))}
      </nav>

      <form action={basePath} className="flex flex-wrap items-center gap-3 px-4 py-4" role="search">
        {Object.entries(params)
          .filter(([k, v]) => v && !["q", "emp", "type", "page"].includes(k))
          .map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        <span className="relative w-full max-w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search…" aria-label="Search leave" className={`${inputClass} mt-0 max-w-64 pl-9`} />
        </span>
        {showEmployee && people.length > 1 && (
          <AutoSubmitSelect name="emp" defaultValue={params.emp ?? ""} aria-label="Employee" className={`${inputClass} mt-0 max-w-48`}>
            <option value="">All Employees</option>
            {people.map((e) => (
              <option key={e.id} value={e.id}>
                {employeeName(e)}
              </option>
            ))}
          </AutoSubmitSelect>
        )}
        <AutoSubmitSelect name="type" defaultValue={params.type ?? ""} aria-label="Leave type" className={`${inputClass} mt-0 max-w-48`}>
          <option value="">All Leave Types</option>
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>
              {leaveLabel(t)}
            </option>
          ))}
        </AutoSubmitSelect>
        <button className="ml-auto rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-bg">Filter</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
              <th scope="col" className="px-4 py-3">#</th>
              {showEmployee && <th scope="col" className="px-4 py-3">Employee</th>}
              <th scope="col" className="px-4 py-3">Leave Type</th>
              <th scope="col" className="px-4 py-3">{sortHeader("start", "Start Date")}</th>
              <th scope="col" className="px-4 py-3">{sortHeader("end", "End Date")}</th>
              <th scope="col" className="px-4 py-3">Days</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">{sortHeader("applied", "Applied On")}</th>
              <th scope="col" className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {shown.map((l, i) => {
              const e = byId.get(l.employeeId);
              const view = viewHref?.(l.employeeId);
              return (
                <tr key={l.id} className="hover:bg-admin-bg/60">
                  <td className="px-4 py-3 text-admin-muted">{(page - 1) * per + i + 1}</td>
                  {showEmployee && (
                    <td className="px-4 py-3">
                      <Person name={employeeName(e)} sub={e?.email || e?.jobTitle} />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${LEAVE_STYLE[l.type].dot}`} aria-hidden="true" />
                      {leaveLabel(l.type)}
                    </span>
                    {l.reason && <span className="mt-0.5 block max-w-[220px] truncate text-xs text-admin-muted" title={l.reason}>{l.reason}</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{l.startDate}</td>
                  <td className="whitespace-nowrap px-4 py-3">{l.endDate}</td>
                  <td className="px-4 py-3">{l.days}</td>
                  <td className="px-4 py-3">
                    <Badge status={l.status} />
                    {l.decidedByName && (
                      <span className="mt-0.5 block text-[11px] text-admin-muted" title={l.decisionNote || undefined}>
                        by {l.decidedByName}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{fmtDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center justify-center gap-1">
                      {view && (
                        <Link href={view} title="View employee" aria-label={`View ${employeeName(e)}`} className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                          <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                        </Link>
                      )}
                      {canDecide?.(l) && (
                        <>
                          <QuickAction action={decideLeaveAction} kind="approve" label={`Approve ${employeeName(e)}'s leave`} fields={{ leaveId: l.id, decision: "approve" }} />
                          <QuickAction action={decideLeaveAction} kind="reject" label={`Reject ${employeeName(e)}'s leave`} fields={{ leaveId: l.id, decision: "reject" }} askNote="Reason for rejecting (optional):" />
                        </>
                      )}
                      {canCancel?.(l) && <QuickAction action={cancelMyLeaveAction} kind="cancel" label="Cancel this request" fields={{ leaveId: l.id }} confirmText="Cancel this leave request?" />}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="px-4 py-10 text-center text-sm text-admin-muted">No leave applications here.</p>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border px-4 py-3 text-sm">
        <p className="text-admin-muted">
          {inTab.length === 0 ? "No results" : `Showing ${(page - 1) * per + 1} to ${Math.min(page * per, inTab.length)} of ${inTab.length} results`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <form action={basePath} className="flex items-center gap-2">
            {Object.entries(params)
              .filter(([k, v]) => v && !["per", "page"].includes(k))
              .map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
            <label htmlFor="leave-per-page" className="whitespace-nowrap text-xs text-admin-muted">
              Rows per page:
            </label>
            <AutoSubmitSelect id="leave-per-page" name="per" defaultValue={String(per)} className={`${inputClass} mt-0 max-w-20 py-1.5`}>
              {PER_PAGE.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </AutoSubmitSelect>
          </form>
          <PageLink href={page > 1 ? link({ page: page - 1 }) : undefined}>« Previous</PageLink>
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
            .map((n) => (
              <PageLink key={n} href={link({ page: n })} current={n === page}>
                {n}
              </PageLink>
            ))}
          <PageLink href={page < pages ? link({ page: page + 1 }) : undefined}>Next »</PageLink>
        </div>
      </div>
    </section>
  );
}

function PageLink({ href, current, children }: { href?: string; current?: boolean; children: React.ReactNode }) {
  const cls = "min-w-9 rounded-lg border px-3 py-1.5 text-center text-sm";
  if (!href) return <span className={`${cls} border-admin-border text-admin-muted opacity-60`}>{children}</span>;
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`${cls} ${current ? "border-admin-primary bg-admin-primary text-white" : "border-admin-border hover:bg-admin-bg"}`}>
      {children}
    </Link>
  );
}
