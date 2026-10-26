import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { saveCalendarEventAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { CalendarChip, EventFields } from "@/components/hr/calendar-chip";
import { KIND_STYLE } from "@/components/hr/calendar-style";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { isIsoDate } from "@/components/hr/query";
import { PageTitle, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has, holidayDates, teamOf } from "@/lib/hr/access";
import { addDays, calendarItems, monthWeeks, sundayOf, weekSegments, workingRuns, type CalendarItem, type CalendarKind } from "@/lib/hr/calendar";
import { requireHrPage } from "@/lib/hr/session";
import { isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Calendar" };

const VIEWS = ["month", "week", "day"] as const;
type View = (typeof VIEWS)[number];
const LANES = 3;
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const DAY_LONG = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const DAY_SHORT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const d = (iso: string) => new Date(`${iso}T12:00:00Z`);
const LEGEND: CalendarKind[] = ["meeting", "holiday", "leave", "birthday", "event"];

/**
 * Everyone's calendar: HR meetings, holidays and events, public holidays, and the leave and
 * birthdays this person may already see elsewhere (their own; their team's for managers; all for HR).
 */
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ view?: string; date?: string }> }) {
  const ctx = await requireHrPage("self.view");
  const params = await searchParams;
  const today = todayLagos();
  const view: View = VIEWS.includes(params.view as View) ? (params.view as View) : "month";
  const date = isIsoDate(params.date) ? params.date : today;
  const [events, leave, employees] = await Promise.all([readStore("hrEvents"), readStore("hrLeave"), readStore("hrEmployees")]);
  const p = ctx.permissions;

  // The same visibility as the rest of the portal.
  const seesAllLeave = has(p, "leave.view_all") || has(p, "leave.manage");
  const seesAllPeople = has(p, "employees.view") || has(p, "employees.manage");
  const team = has(p, "team.view") ? teamOf(ctx.employee.id, employees, ctx.departments) : new Set<string>();
  const visibleLeave = leave.filter((l) => seesAllLeave || l.employeeId === ctx.employee.id || team.has(l.employeeId));
  // Everyone also sees who in their own department is away and when they're back (no leave type or reason).
  const deptmates = new Set(employees.filter((e) => ctx.employee.departmentId && e.departmentId === ctx.employee.departmentId && e.id !== ctx.employee.id && isCurrentStaff(e)).map((e) => e.id));
  const fullIds = new Set(visibleLeave.map((l) => l.id));
  const colleagueLeave = leave.filter((l) => deptmates.has(l.employeeId) && !fullIds.has(l.id));
  const birthdaysOf = employees.filter((e) => isCurrentStaff(e) && (seesAllPeople || e.id === ctx.employee.id || team.has(e.id)));
  const canEdit = has(p, "employees.manage");
  const personHref = (id?: string) =>
    !id || id === ctx.employee.id ? (id ? "/hrportal/me" : undefined) : seesAllPeople ? `/hrportal/hr/employees/${id}` : team.has(id) ? `/hrportal/team/${id}` : undefined;

  const weeks = monthWeeks(date);
  const [from, to] = view === "month" ? [weeks[0][0], weeks.at(-1)![6]] : view === "week" ? [sundayOf(date), addDays(sundayOf(date), 6)] : [date, date];
  const holidays = holidayDates(events, Number(from.slice(0, 4)) - 1, Number(to.slice(0, 4)) + 1);
  // Leave is drawn only on working days (it skips weekends and public holidays).
  const items = workingRuns(calendarItems({ from, to, events, leave: visibleLeave, colleagueLeave, employees, types: ctx.leaveTypes, birthdaysOf, holidays }), holidays);
  const upcoming = calendarItems({ from: today, to: addDays(today, 60), events, leave: visibleLeave, colleagueLeave, employees, types: ctx.leaveTypes, birthdaysOf, holidays }).slice(0, 8);
  const monthStart = `${date.slice(0, 7)}-01`;
  const monthItems = calendarItems({ from: monthStart, to: addDays(`${addDays(monthStart, 32).slice(0, 7)}-01`, -1), events, leave: visibleLeave, colleagueLeave, employees, types: ctx.leaveTypes, birthdaysOf, holidays });
  const eventOf = (item: CalendarItem) => (item.eventId ? events.find((e) => e.id === item.eventId) : undefined);
  const chip = (item: CalendarItem, extra: { full?: boolean; cutStart?: boolean; cutEnd?: boolean } = {}) => (
    <CalendarChip item={item} event={eventOf(item)} canEdit={canEdit} personHref={personHref(item.personId)} {...extra} />
  );

  const link = (changes: { view?: View; date?: string }) => {
    const q = new URLSearchParams({ view: changes.view ?? view, date: changes.date ?? date });
    return `/hrportal/calendar?${q}`;
  };
  const step = view === "month" ? (n: number) => `${addDays(`${date.slice(0, 7)}-15`, n * 30).slice(0, 7)}-01` : view === "week" ? (n: number) => addDays(date, n * 7) : (n: number) => addDays(date, n);
  const heading = view === "month" ? MONTH.format(d(date)) : view === "week" ? `${DAY_SHORT.format(d(from))} – ${DAY_SHORT.format(d(to))} ${to.slice(0, 4)}` : DAY_LONG.format(d(date));

  return (
    <PortalShell ctx={ctx} current="/hrportal/calendar" crumbs={[{ label: "Calendar" }]}>
      <PageTitle
        title="Calendar"
        subtitle="Meetings, holidays, leave and birthdays in one place. Colleagues in your department show as on leave, with the day they're back."
        actions={
          canEdit && (
            <Modal label="Add Event" title="Add to the calendar" description="Meetings, holidays and events are shown to all staff." wide>
              <ActionForm action={saveCalendarEventAction} submitLabel="Add to calendar" resetOnSuccess className="space-y-4">
                <EventFields />
              </ActionForm>
            </Modal>
          )
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="hr-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-admin-border bg-admin-bg/60 px-4 py-2.5 text-xs text-admin-muted">
            <span className="font-medium">Legend:</span>
            {LEGEND.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${KIND_STYLE[k].dot}`} aria-hidden="true" />
                {KIND_STYLE[k].label === "Leave" ? "Leaves" : `${KIND_STYLE[k].label}s`}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-5 rounded border border-dashed border-admin-muted" aria-hidden="true" />
              Pending leave
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex overflow-hidden rounded-lg border border-admin-border">
                <Link href={link({ date: step(-1) })} aria-label="Previous" className="px-2.5 py-2 hover:bg-admin-bg">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href={link({ date: step(1) })} aria-label="Next" className="border-l border-admin-border px-2.5 py-2 hover:bg-admin-bg">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </span>
              <Link href={link({ date: today })} className="rounded-lg border border-admin-border px-3 py-2 text-sm font-medium hover:bg-admin-bg">
                Today
              </Link>
            </div>
            <h2 className="order-first w-full text-center text-xl font-semibold sm:order-none sm:w-auto">{heading}</h2>
            <nav aria-label="Calendar view" className="inline-flex overflow-hidden rounded-lg border border-admin-border text-sm">
              {VIEWS.map((v) => (
                <Link
                  key={v}
                  href={link({ view: v })}
                  aria-current={view === v ? "page" : undefined}
                  className={`px-3 py-2 capitalize ${view === v ? "bg-admin-primary font-semibold text-white" : "hover:bg-admin-bg"} ${v !== "month" ? "border-l border-admin-border" : ""}`}
                >
                  {v}
                </Link>
              ))}
            </nav>
          </div>

          {view === "month" && (
            <div className="overflow-x-auto px-4 pb-4">
              <div className="min-w-[700px] overflow-hidden rounded-lg border border-admin-border">
                <div className="grid grid-cols-7 border-b border-admin-border bg-admin-bg/60 text-center text-xs font-semibold">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="py-2">
                      {w}
                    </div>
                  ))}
                </div>
                {weeks.map((week) => {
                  const segs = weekSegments(week, items);
                  const hidden = week.map((day, i) => segs.filter((s) => s.lane >= LANES && s.col <= i && s.col + s.span > i).length);
                  return (
                    <div key={week[0]} className="relative border-b border-admin-border last:border-b-0">
                      <div className="grid grid-cols-7">
                        {week.map((day, i) => (
                          <div key={day} className={`min-h-[7.5rem] border-admin-border p-1.5 text-right ${i ? "border-l" : ""} ${day === today ? "bg-amber-50 dark:bg-amber-500/10" : ""}`}>
                            <Link href={link({ view: "day", date: day })} className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-sm ${day.slice(0, 7) !== date.slice(0, 7) ? "text-admin-muted/60" : ""} ${day === today ? "bg-admin-primary font-semibold text-white" : "hover:bg-admin-bg"}`}>
                              {Number(day.slice(8))}
                            </Link>
                            {hidden[i] > 0 && (
                              <Link href={link({ view: "day", date: day })} className="absolute bottom-1 text-[11px] font-medium text-admin-primary hover:underline" style={{ left: `calc(${(i / 7) * 100}% + 6px)` }}>
                                +{hidden[i]} more
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 top-8 grid grid-cols-7 gap-y-1" style={{ gridAutoRows: "22px" }}>
                        {segs
                          .filter((s) => s.lane < LANES)
                          .map((s) => (
                            <div key={s.item.id} className={`pointer-events-auto ${s.cutStart ? "" : "pl-1"} ${s.cutEnd ? "" : "pr-1"}`} style={{ gridColumn: `${s.col + 1} / span ${s.span}`, gridRow: s.lane + 1 }}>
                              {chip(s.item, { cutStart: s.cutStart, cutEnd: s.cutEnd })}
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "week" && (
            <div className="overflow-x-auto px-4 pb-4">
              <div className="grid min-w-[700px] grid-cols-7 overflow-hidden rounded-lg border border-admin-border">
                {Array.from({ length: 7 }, (_, i) => addDays(from, i)).map((day, i) => {
                  const dayItems = items.filter((it) => it.start <= day && it.end >= day);
                  return (
                    <div key={day} className={`min-h-[22rem] border-admin-border ${i ? "border-l" : ""} ${day === today ? "bg-amber-50 dark:bg-amber-500/10" : ""}`}>
                      <Link href={link({ view: "day", date: day })} className="block border-b border-admin-border bg-admin-bg/60 py-2 text-center text-xs font-semibold hover:text-admin-primary">
                        {WEEKDAYS[i]} {Number(day.slice(8))}
                      </Link>
                      <div className="space-y-1.5 p-1.5">
                        {dayItems.map((it) => (
                          <div key={it.id}>{chip(it, { full: true })}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "day" && (
            <div className="px-4 pb-4">
              <ul className="divide-y divide-admin-border rounded-lg border border-admin-border">
                {items.map((it) => (
                  <li key={it.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="w-14 shrink-0 pt-1 text-xs font-semibold text-admin-muted">{it.time ?? "All day"}</span>
                    <div className="min-w-0 flex-1">{chip(it, { full: true })}</div>
                  </li>
                ))}
              </ul>
              {items.length === 0 && <p className="py-12 text-center text-sm text-admin-muted">Nothing on this day.</p>}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="hr-card overflow-hidden">
            <h2 className="flex items-center gap-2 border-b border-admin-border px-4 py-3 text-sm font-semibold">
              <CalendarDays className="h-4 w-4 text-admin-primary" aria-hidden="true" /> Upcoming Events
            </h2>
            <ul className="divide-y divide-admin-border">
              {upcoming.map((it) => (
                <li key={it.id} className="flex items-start gap-3 px-4 py-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${KIND_STYLE[it.kind].dot}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{it.title}</span>
                    <span className="block text-xs text-admin-muted">
                      {KIND_STYLE[it.kind].label} · {DAY_SHORT.format(d(it.start))}
                      {it.end !== it.start ? ` – ${DAY_SHORT.format(d(it.end))}` : ""}
                      {it.time ? ` · ${it.time}` : ""}
                      {it.pending ? " · pending" : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {upcoming.length === 0 && <p className="px-4 py-8 text-center text-sm text-admin-muted">Nothing in the next 60 days.</p>}
          </section>

          <section className="hr-card overflow-hidden">
            <h2 className="border-b border-admin-border px-4 py-3 text-sm font-semibold">This Month · {MONTH.format(d(date))}</h2>
            <dl className="divide-y divide-admin-border text-sm">
              {LEGEND.map((k) => (
                <div key={k} className="flex items-center justify-between px-4 py-2.5">
                  <dt className="flex items-center gap-2 text-admin-muted">
                    <span className={`h-2.5 w-2.5 rounded-full ${KIND_STYLE[k].dot}`} aria-hidden="true" />
                    {KIND_STYLE[k].label === "Leave" ? "Leaves" : `${KIND_STYLE[k].label}s`}
                  </dt>
                  <dd className="font-semibold tabular-nums">{monthItems.filter((it) => it.kind === k).length}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2.5">
                <dt className="font-medium">Total</dt>
                <dd className="font-semibold tabular-nums">{monthItems.length}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </PortalShell>
  );
}
