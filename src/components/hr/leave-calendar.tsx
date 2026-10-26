import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AutoSubmitSelect } from "@/components/hr/filters";
import { LEAVE_COLOR_STYLE, leaveName, leaveStyle } from "@/components/hr/leave-style";
import { addDays, hrefWith } from "@/components/hr/query";
import { Card, inputClass, Person, todayLagos } from "@/components/hr/ui";
import { employeeName, type HrEmployee, type HrLeaveRequest, type HrLeaveType, isCurrentStaff } from "@/lib/hr/types";

const DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_FMT = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const monthOf = (day: string) => MONTH_FMT.format(new Date(`${day}T12:00:00Z`));
const MAX_ROWS = 40;

/**
 * Week view of leave. Rows are the employees the viewer may see (already filtered on the
 * server); bars cover approved (solid) and pending (dashed) leave.
 */
export function LeaveCalendar({
  employees,
  leave,
  weekStart,
  basePath,
  params,
  personHref,
  leaveTypes,
}: {
  leaveTypes: HrLeaveType[];
  employees: HrEmployee[];
  leave: HrLeaveRequest[];
  weekStart: string;
  basePath: string;
  params: Record<string, string | undefined>;
  personHref?: (employeeId: string) => string | undefined;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = days[6];
  const today = todayLagos();
  const selected = params.employee ?? "";
  const active = employees.filter((e) => isCurrentStaff(e)).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const inWeek = leave.filter((l) => (l.status === "approved" || l.status === "pending") && l.startDate <= weekEnd && l.endDate >= weekStart);
  const onLeave = new Set(inWeek.map((l) => l.employeeId));
  let rows = selected ? active.filter((e) => e.id === selected) : active;
  const trimmed = !selected && rows.length > MAX_ROWS;
  if (trimmed) rows = rows.filter((e) => onLeave.has(e.id));
  const monthLabel = monthOf(weekStart) === monthOf(weekEnd) ? monthOf(weekStart) : `${monthOf(weekStart)} – ${monthOf(weekEnd)}`;
  const prev = hrefWith(basePath, params, { week: addDays(weekStart, -7) });
  const next = hrefWith(basePath, params, { week: addDays(weekStart, 7) });
  const arrow = "flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-admin-card text-admin-text hover:bg-admin-bg";

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={prev} aria-label="Previous week" className={arrow}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="min-w-40 text-center text-lg font-semibold">{monthLabel}</p>
            <Link href={next} aria-label="Next week" className={arrow}>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {(today < weekStart || today > weekEnd) && (
              <Link href={hrefWith(basePath, params, { week: undefined })} className="text-sm font-semibold text-admin-primary hover:underline">
                This week
              </Link>
            )}
          </div>
          {active.length > 1 && (
            <form className="flex items-center gap-2" action={basePath}>
              {Object.entries(params)
                .filter(([k, v]) => v && k !== "employee")
                .map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
              <label htmlFor="calendar-employee" className="text-sm text-admin-muted">
                Employee
              </label>
              <AutoSubmitSelect id="calendar-employee" name="employee" defaultValue={selected} className={`${inputClass} mt-0 max-w-56`}>
                <option value="">All employees</option>
                {active.map((e) => (
                  <option key={e.id} value={e.id}>
                    {employeeName(e)}
                  </option>
                ))}
              </AutoSubmitSelect>
              <noscript>
                <button className="rounded-lg border border-admin-border px-3 py-2 text-sm">Show</button>
              </noscript>
            </form>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="mr-1 font-semibold text-admin-text">Legend:</span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-admin-primary/40 px-2 py-1 text-admin-primary">
            <span className="h-2 w-2 rounded-full border-2 border-admin-primary" aria-hidden="true" /> Today
          </span>
          {leaveTypes
            .filter((t) => t.active)
            .map((t) => (
              <span key={t.id} className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 ${LEAVE_COLOR_STYLE[t.color].pill}`}>
                <span className={`h-2 w-2 rounded-full ${LEAVE_COLOR_STYLE[t.color].dot}`} aria-hidden="true" /> {t.name}
              </span>
            ))}
          <span className="ml-1 inline-flex items-center gap-3 border-l border-admin-border pl-3 text-admin-text">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-7 rounded border-2 border-admin-muted bg-admin-bg" aria-hidden="true" />
              Approved
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-7 rounded border-2 border-dashed border-admin-muted bg-admin-bg" aria-hidden="true" />
              Pending approval
            </span>
          </span>
        </div>
      </Card>

      <Card flush>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]" role="table" aria-label={`Leave for the week of ${weekStart}`}>
            <div role="row" className="grid grid-cols-[240px_repeat(7,minmax(0,1fr))] border-b border-admin-border">
              <div role="columnheader" className="flex items-center px-4 py-3 text-sm font-semibold">
                Employee
              </div>
              {days.map((d, i) => {
                const isToday = d === today;
                return (
                  <div key={d} role="columnheader" className={`relative flex flex-col items-center justify-center border-l border-admin-border py-2 ${isToday ? "bg-admin-primary-soft text-admin-primary" : ""}`}>
                    {i === 0 && (
                      <Link href={prev} aria-label="Previous week" className="absolute left-2 top-1/2 -translate-y-1/2 text-admin-muted hover:text-admin-text">
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                    <span className="text-sm font-semibold">{Number(d.slice(8))}</span>
                    <span className="text-xs text-admin-muted">{DAY[i]}</span>
                    {i === 6 && (
                      <Link href={next} aria-label="Next week" className="absolute right-2 top-1/2 -translate-y-1/2 text-admin-muted hover:text-admin-text">
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            {rows.map((e) => {
              const bars = inWeek.filter((l) => l.employeeId === e.id);
              return (
                <div key={e.id} role="row" className="relative grid h-[68px] grid-cols-[240px_repeat(7,minmax(0,1fr))] border-b border-admin-border last:border-b-0">
                  <div role="rowheader" className="flex items-center px-4">
                    <Person name={employeeName(e)} sub={e.jobTitle || e.department} href={personHref?.(e.id)} />
                  </div>
                  {days.map((d) => (
                    <div key={d} role="cell" className={`border-l border-admin-border ${d === today ? "bg-admin-primary-soft/60" : ""}`} />
                  ))}
                  <div className="pointer-events-none absolute inset-y-1.5 left-[240px] right-0 grid grid-cols-7">
                    {bars.map((l) => {
                      const start = days.findIndex((d) => d >= l.startDate);
                      const from = l.startDate < weekStart ? 0 : start;
                      const to = l.endDate > weekEnd ? 6 : days.findIndex((d) => d === l.endDate);
                      return (
                        <div
                          key={l.id}
                          title={`${leaveName(l.type, leaveTypes)}: ${l.startDate} to ${l.endDate} (${l.status})`}
                          className={`pointer-events-auto mx-1 flex flex-col justify-center overflow-hidden rounded-lg border px-3 ${leaveStyle(l.type, leaveTypes).bar} ${l.status === "pending" ? "border-dashed" : ""}`}
                          style={{ gridColumn: `${from + 1} / ${to + 2}`, gridRow: 1 }}
                        >
                          <span className="truncate text-sm font-semibold">{leaveName(l.type, leaveTypes)}</span>
                          <span className="truncate text-[11px] opacity-80">{l.status === "pending" ? "Pending approval" : `${l.days} working day${l.days === 1 ? "" : "s"}`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {rows.length === 0 && <p className="px-4 py-10 text-center text-sm text-admin-muted">{trimmed ? "Nobody is on leave this week." : "No employees to show."}</p>}
          </div>
        </div>
        {trimmed && <p className="border-t border-admin-border px-4 py-2 text-xs text-admin-muted">Showing staff with leave this week. Choose an employee to see one person.</p>}
      </Card>
    </div>
  );
}
