import { toIcs } from "@/lib/calendar";
import { getCalendarEvent } from "@/lib/cms/content";

export const revalidate = 3600;

/** A single event or observance day as an .ics file ("Add to calendar" → Apple / other). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getCalendarEvent(id);
  if (!event) return new Response("Not found", { status: 404 });
  return new Response(toIcs([event], event.title), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.id.slice(0, 60)}.ics"`,
    },
  });
}
