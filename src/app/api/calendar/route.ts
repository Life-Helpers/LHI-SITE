import { toIcs } from "@/lib/calendar";
import { getCalendarEvents } from "@/lib/cms/content";

export const revalidate = 3600;

/**
 * The whole LHI calendar as an iCalendar feed. Subscribe with webcal://…/api/calendar so
 * observance days and new LHI events appear in Google, Apple or Outlook calendars automatically.
 */
export async function GET() {
  const events = await getCalendarEvents(366);
  // One entry per observance (it repeats yearly), plus every upcoming LHI event.
  const seen = new Set<string>();
  const unique = events.filter((e) => (e.yearly ? !seen.has(e.id) && seen.add(e.id) : true));
  return new Response(toIcs(unique), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="lhi-calendar.ics"',
    },
  });
}
