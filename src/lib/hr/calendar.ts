/**
 * Portal calendar: one list of dated items (HR events, public holidays, leave, birthdays) and the
 * month-grid layout. Callers decide what the viewer may see and pass only that.
 */
import { employeeName, FIXED_PUBLIC_HOLIDAYS, type HrCalendarEvent, type HrEmployee, type HrLeaveRequest, type HrLeaveType } from "@/lib/hr/types";

export type CalendarKind = "meeting" | "holiday" | "leave" | "birthday" | "event";

export interface CalendarItem {
  id: string;
  kind: CalendarKind;
  title: string;
  start: string;
  end: string;
  time?: string;
  detail?: string;
  /** Leave still waiting for approval. */
  pending?: boolean;
  /** An HR event (can be edited or deleted by HR). */
  eventId?: string;
  personId?: string;
}

const DAY = 86_400_000;
export const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => isoDay(Date.parse(`${iso}T12:00:00Z`) + n * DAY);
/** The first working day after leave ending on `end` (skipping weekends and fixed public holidays). */
export function resumptionDate(end: string): string {
  let d = addDays(end, 1);
  for (;;) {
    const wd = new Date(`${d}T12:00:00Z`).getUTCDay();
    if (wd !== 0 && wd !== 6 && !FIXED_PUBLIC_HOLIDAYS.some((h) => h.md === d.slice(5))) return d;
    d = addDays(d, 1);
  }
}
const RESUME = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const backOn = (end: string) => `Back on ${RESUME.format(new Date(`${resumptionDate(end)}T12:00:00Z`))}`;

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Every item that touches [from, to], sorted by start date, then all-day before timed, then title. */
export function calendarItems({
  from,
  to,
  events,
  leave,
  colleagueLeave = [],
  employees,
  types,
  birthdaysOf,
}: {
  from: string;
  to: string;
  events: HrCalendarEvent[];
  /** Leave the viewer may see in full (type and status). */
  leave: HrLeaveRequest[];
  /** Colleagues' leave shown only as "On leave" with the return date (approved leave only). */
  colleagueLeave?: HrLeaveRequest[];
  employees: HrEmployee[];
  types: HrLeaveType[];
  /** People whose birthdays the viewer may see. */
  birthdaysOf: HrEmployee[];
}): CalendarItem[] {
  const items: CalendarItem[] = [];
  const touches = (s: string, e: string) => s <= to && e >= from;
  const years = Array.from({ length: Number(to.slice(0, 4)) - Number(from.slice(0, 4)) + 1 }, (_, i) => Number(from.slice(0, 4)) + i);

  for (const e of events) {
    if (touches(e.startDate, e.endDate)) {
      items.push({ id: `ev-${e.id}`, kind: e.kind, title: e.title, start: e.startDate, end: e.endDate, time: e.time || undefined, detail: [e.location, e.description].filter(Boolean).join(" · ") || undefined, eventId: e.id });
    }
  }
  for (const y of years) {
    for (const h of FIXED_PUBLIC_HOLIDAYS) {
      const d = `${y}-${h.md}`;
      if (touches(d, d)) items.push({ id: `ph-${d}`, kind: "holiday", title: h.title, start: d, end: d, detail: "Public holiday" });
    }
  }
  for (const l of leave) {
    if ((l.status !== "approved" && l.status !== "pending") || !touches(l.startDate, l.endDate)) continue;
    const person = employees.find((e) => e.id === l.employeeId);
    const type = types.find((t) => t.id === l.type)?.name ?? `${l.type} Leave`;
    items.push({
      id: `lv-${l.id}`,
      kind: "leave",
      title: `${employeeName(person)} - ${type}`,
      start: l.startDate,
      end: l.endDate,
      pending: l.status === "pending",
      detail: `${l.days} working day${l.days === 1 ? "" : "s"} · ${backOn(l.endDate)}${l.status === "pending" ? " · pending approval" : ""}`,
      personId: l.employeeId,
    });
  }
  for (const l of colleagueLeave) {
    if (l.status !== "approved" || !touches(l.startDate, l.endDate)) continue;
    const person = employees.find((e) => e.id === l.employeeId);
    items.push({ id: `lv-${l.id}`, kind: "leave", title: `${employeeName(person)} - On leave`, start: l.startDate, end: l.endDate, detail: backOn(l.endDate) });
  }
  for (const p of birthdaysOf) {
    if (!p.dateOfBirth) continue;
    const md = p.dateOfBirth.slice(5, 10);
    for (const y of years) {
      const d = md === "02-29" && !isLeap(y) ? `${y}-02-28` : `${y}-${md}`;
      if (touches(d, d)) items.push({ id: `bd-${p.id}-${y}`, kind: "birthday", title: `${employeeName(p)}'s Birthday`, start: d, end: d, personId: p.id });
    }
  }
  return items.sort((a, b) => a.start.localeCompare(b.start) || Number(Boolean(a.time)) - Number(Boolean(b.time)) || (a.time ?? "").localeCompare(b.time ?? "") || a.title.localeCompare(b.title));
}

/** The Sunday on or before `iso`. */
export const sundayOf = (iso: string) => addDays(iso, -new Date(`${iso}T12:00:00Z`).getUTCDay());

/** The weeks (Sunday first) covering the month of `iso`: 4 to 6 rows of 7 dates. */
export function monthWeeks(iso: string): string[][] {
  const first = `${iso.slice(0, 7)}-01`;
  const last = addDays(`${addDays(first, 32).slice(0, 7)}-01`, -1);
  const weeks: string[][] = [];
  for (let d = sundayOf(first); d <= last; d = addDays(d, 7)) weeks.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)));
  return weeks;
}

export interface WeekSegment {
  item: CalendarItem;
  /** 0-6, the columns this item covers in the week. */
  col: number;
  span: number;
  lane: number;
  /** Starts before / continues after this week. */
  cutStart: boolean;
  cutEnd: boolean;
}

/** Lay items out in one week row: each gets the lowest lane free across the days it covers. */
export function weekSegments(week: string[], items: CalendarItem[]): WeekSegment[] {
  const [first, last] = [week[0], week[6]];
  const inWeek = items
    .filter((i) => i.start <= last && i.end >= first)
    .map((item) => {
      const s = item.start < first ? first : item.start;
      const e = item.end > last ? last : item.end;
      return { item, col: week.indexOf(s), span: week.indexOf(e) - week.indexOf(s) + 1, cutStart: item.start < first, cutEnd: item.end > last };
    })
    .sort((a, b) => a.col - b.col || b.span - a.span);
  const lanes: number[][] = [];
  return inWeek.map((seg) => {
    let lane = lanes.findIndex((used) => used.every((c) => c < seg.col || c >= seg.col + seg.span));
    if (lane === -1) lane = lanes.push([]) - 1;
    for (let c = seg.col; c < seg.col + seg.span; c++) lanes[lane].push(c);
    return { ...seg, lane };
  });
}
