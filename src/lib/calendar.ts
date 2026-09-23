import { siteConfig } from "@/config/site";
import type { CalendarEvent } from "@/data/observances";

/** "Add to calendar" helpers for all-day events: Google, Outlook and iCalendar (.ics). */

const compact = (d: string) => d.replace(/-/g, "");

/** Calendars treat the end of an all-day event as exclusive. */
function dayAfter(d: string) {
  const date = new Date(`${d}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

const absolute = (href?: string) => (!href ? siteConfig.url : href.startsWith("http") ? href : `${siteConfig.url.replace(/\/$/, "")}${href}`);

function details(e: CalendarEvent) {
  return [e.description, e.by ? `Observed by: ${e.by}` : "", `More: ${absolute(e.href)}`, `— ${siteConfig.name}`].filter(Boolean).join("\n\n");
}

const calendarTitle = (e: CalendarEvent) => (e.yearly && e.recurringTitle) || e.title;

export function googleCalendarUrl(e: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendarTitle(e),
    dates: `${compact(e.start)}/${compact(dayAfter(e.end))}`,
    details: details(e),
    ...(e.location ? { location: e.location } : {}),
    ...(e.yearly ? { recur: "RRULE:FREQ=YEARLY" } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(e: CalendarEvent) {
  const params = new URLSearchParams({
    allday: "true",
    subject: calendarTitle(e),
    startdt: e.start,
    enddt: dayAfter(e.end),
    body: details(e),
    ...(e.location ? { location: e.location } : {}),
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params}`;
}

export const icsPath = (id: string) => `/api/calendar/${encodeURIComponent(id)}`;

const escapeText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Fold content lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let size = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += ch;
    size += n;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function toIcs(events: CalendarEvent[], name = `${siteConfig.name} — observance days & events`) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const host = new URL(siteConfig.url).hostname;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${siteConfig.name}//Events//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    "X-WR-TIMEZONE:Africa/Lagos",
    ...events.flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${e.id}${e.yearly ? "" : `-${e.start}`}@${host}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.start)}`,
      `DTEND;VALUE=DATE:${compact(dayAfter(e.end))}`,
      ...(e.yearly ? ["RRULE:FREQ=YEARLY"] : []),
      `SUMMARY:${escapeText(calendarTitle(e))}`,
      `DESCRIPTION:${escapeText(details(e))}`,
      `URL:${absolute(e.href)}`,
      ...(e.location ? [`LOCATION:${escapeText(e.location)}`] : []),
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
