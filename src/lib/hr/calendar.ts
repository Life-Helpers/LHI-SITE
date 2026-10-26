/**
 * Portal calendar: one list of dated items (HR events, public holidays, leave, birthdays) and the
 * month-grid layout. Callers decide what the viewer may see and pass only that.
 */
import { holidayDates, isWorkingDay } from "@/lib/hr/access";
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
  /** The calendar event behind this item (HR's or a manager's). */
  eventId?: string;
  /** e.g. "Repeats weekly until 31 Dec 2026". */
  repeatLabel?: string;
  /** For a repeating entry: the occurrence's original start date in the series. */
  occurrenceDate?: string;
  /** This occurrence was changed on its own. */
  overridden?: boolean;
  personId?: string;
}

const DAY = 86_400_000;
export const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => isoDay(Date.parse(`${iso}T12:00:00Z`) + n * DAY);
/** The first working day after leave ending on `end` (skipping weekends and public holidays). */
export function resumptionDate(end: string, holidays: ReadonlySet<string> = holidayDates([], Number(end.slice(0, 4)), Number(end.slice(0, 4)) + 1)): string {
  let d = addDays(end, 1);
  while (!isWorkingDay(d, holidays)) d = addDays(d, 1);
  return d;
}
const RESUME = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const backOn = (end: string, holidays?: ReadonlySet<string>) => `Back on ${RESUME.format(new Date(`${resumptionDate(end, holidays)}T12:00:00Z`))}`;

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const REPEAT_LABEL = { daily: "every working day", weekly: "weekly", monthly: "monthly" } as const;
const MAX_OCCURRENCES = 800;

const lastDayOf = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/**
 * The dates an event happens on within [from, to]. Each occurrence keeps the event's length.
 * Daily repeats on working days (Monday to Friday); weekly on the same weekday; monthly on the
 * same date (or the month's last day when it's shorter).
 */
export function occurrences(
  e: Pick<HrCalendarEvent, "startDate" | "endDate" | "repeat" | "repeatUntil" | "skipDates" | "overrides">,
  from: string,
  to: string,
): { start: string; end: string }[] {
  // Skipped and individually changed occurrences are left out here (changed ones are added separately).
  const out0 = seriesDates(e, from, to);
  const removed = new Set([...(e.skipDates ?? []), ...(e.overrides ?? []).map((o) => o.date)]);
  return out0.filter((o) => !removed.has(o.start));
}

/** Is `date` the start of an occurrence in the series (ignoring skips and changes)? */
export const isOccurrence = (e: Pick<HrCalendarEvent, "startDate" | "endDate" | "repeat" | "repeatUntil">, date: string) => seriesDates(e, date, date).some((o) => o.start === date);

function seriesDates(e: Pick<HrCalendarEvent, "startDate" | "endDate" | "repeat" | "repeatUntil">, from: string, to: string): { start: string; end: string }[] {
  const length = Math.round((Date.parse(`${e.endDate}T12:00:00Z`) - Date.parse(`${e.startDate}T12:00:00Z`)) / DAY);
  const until = e.repeat && e.repeat !== "none" ? (e.repeatUntil && e.repeatUntil < to ? e.repeatUntil : to) : e.startDate;
  const out: { start: string; end: string }[] = [];
  const push = (start: string) => {
    const end = addDays(start, length);
    if (start <= to && end >= from) out.push({ start, end });
  };
  if (!e.repeat || e.repeat === "none") {
    push(e.startDate);
    return out;
  }
  if (e.repeat === "monthly") {
    const [y, m, d] = e.startDate.split("-").map(Number);
    for (let i = 0; i < MAX_OCCURRENCES; i++) {
      const yy = y + Math.floor((m - 1 + i) / 12);
      const mm = ((m - 1 + i) % 12) + 1;
      const start = `${yy}-${String(mm).padStart(2, "0")}-${String(Math.min(d, lastDayOf(yy, mm))).padStart(2, "0")}`;
      if (start > until) break;
      push(start);
    }
    return out;
  }
  const step = e.repeat === "weekly" ? 7 : 1;
  // Jump close to the window rather than walking from a start date years back.
  let start = e.startDate;
  const behind = Math.floor((Date.parse(`${from}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) / DAY) - length - 7;
  if (behind > 0) start = addDays(start, Math.floor(behind / step) * step);
  for (let i = 0; i < MAX_OCCURRENCES && start <= until; i++, start = addDays(start, step)) {
    const wd = new Date(`${start}T12:00:00Z`).getUTCDay();
    if (e.repeat === "daily" && (wd === 0 || wd === 6)) continue;
    push(start);
  }
  return out;
}

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
  holidays,
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
  /** Public holidays, for return dates (defaults to the fixed-date ones). */
  holidays?: ReadonlySet<string>;
}): CalendarItem[] {
  const items: CalendarItem[] = [];
  const touches = (s: string, e: string) => s <= to && e >= from;
  const years = Array.from({ length: Number(to.slice(0, 4)) - Number(from.slice(0, 4)) + 1 }, (_, i) => Number(from.slice(0, 4)) + i);

  for (const e of events) {
    const detail = [e.location, e.description].filter(Boolean).join(" · ") || undefined;
    const repeatLabel = e.repeat && e.repeat !== "none" ? `Repeats ${REPEAT_LABEL[e.repeat]}${e.repeatUntil ? ` until ${RESUME.format(new Date(`${e.repeatUntil}T12:00:00Z`))}` : ""}` : undefined;
    const repeating = Boolean(repeatLabel);
    for (const o of occurrences(e, from, to)) {
      items.push({ id: `ev-${e.id}-${o.start}`, kind: e.kind, title: e.title, start: o.start, end: o.end, time: e.time || undefined, detail, eventId: e.id, repeatLabel, ...(repeating ? { occurrenceDate: o.start } : {}) });
    }
    for (const o of e.overrides ?? []) {
      if (!touches(o.startDate, o.endDate)) continue;
      items.push({
        id: `ev-${e.id}-o-${o.date}`,
        kind: e.kind,
        title: o.title,
        start: o.startDate,
        end: o.endDate,
        time: o.time || undefined,
        detail: [o.location, o.description].filter(Boolean).join(" · ") || undefined,
        eventId: e.id,
        repeatLabel,
        occurrenceDate: o.date,
        overridden: true,
      });
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
      detail: `${l.days} working day${l.days === 1 ? "" : "s"} · ${backOn(l.endDate, holidays)}${l.status === "pending" ? " · pending approval" : ""}`,
      personId: l.employeeId,
    });
  }
  for (const l of colleagueLeave) {
    if (l.status !== "approved" || !touches(l.startDate, l.endDate)) continue;
    const person = employees.find((e) => e.id === l.employeeId);
    items.push({ id: `lv-${l.id}`, kind: "leave", title: `${employeeName(person)} - On leave`, start: l.startDate, end: l.endDate, detail: backOn(l.endDate, holidays) });
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

/**
 * Leave only covers working days, so on the calendar it's drawn as separate runs that skip
 * weekends and public holidays. Other items are returned as they are.
 */
export function workingRuns(items: CalendarItem[], holidays: ReadonlySet<string>): CalendarItem[] {
  return items.flatMap((item) => {
    if (item.kind !== "leave") return [item];
    const runs: CalendarItem[] = [];
    let runStart: string | null = null;
    for (let d = item.start; d <= addDays(item.end, 1); d = addDays(d, 1)) {
      const working = d <= item.end && isWorkingDay(d, holidays);
      if (working && runStart === null) runStart = d;
      if (!working && runStart !== null) {
        runs.push({ ...item, id: `${item.id}-${runs.length}`, start: runStart, end: addDays(d, -1) });
        runStart = null;
      }
    }
    return runs;
  });
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
