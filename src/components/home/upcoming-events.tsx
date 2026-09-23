import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AddToCalendar } from "@/components/events/add-to-calendar";
import { countdownLabel, EventDateTile } from "@/components/events/event-date-tile";
import { daysUntil, formatEventDate, OBSERVANCE_AREAS, type CalendarEvent } from "@/data/observances";

/** Home page: the next event or observance day, with the few after it. */
export function UpcomingEvents({ events, today }: { events: CalendarEvent[]; today: string }) {
  const [next, ...rest] = events;
  if (!next) return null;
  const lhi = next.area === "lhi";

  return (
    <section aria-labelledby="upcoming-heading" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Upcoming</p>
          <h2 id="upcoming-heading" className="mt-2 font-serif-display text-3xl font-light sm:text-4xl">
            Days we mark together
          </h2>
        </div>
        <Link href="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Full events calendar <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <article
          className={`relative overflow-hidden rounded-3xl p-7 sm:p-9 lg:col-span-3 ${
            lhi ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"
          }`}
        >
          <div className="flex items-start gap-5">
            <EventDateTile event={next} size="lg" className={lhi ? "border-white/40 bg-white text-primary" : ""} />
            <div className="min-w-0">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${lhi ? "text-white/85" : "text-accent"}`}>
                {countdownLabel(daysUntil(today, next.start))} · {OBSERVANCE_AREAS[next.area].label}
              </p>
              <h3 className="mt-2 font-serif-display text-3xl font-light leading-tight sm:text-4xl">{next.title}</h3>
              <p className={`mt-1 text-sm ${lhi ? "text-white/85" : "text-muted-foreground"}`}>{formatEventDate(next)}</p>
            </div>
          </div>
          <p className={`mt-5 max-w-xl leading-relaxed ${lhi ? "text-white/90" : "text-foreground/80"}`}>{next.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AddToCalendar event={next} variant={lhi ? "light" : "solid"} />
            <Link href={`/events#${next.id}`} className={`text-sm font-semibold hover:underline ${lhi ? "text-white" : "text-primary"}`}>
              Learn more →
            </Link>
          </div>
        </article>

        <ul className="flex flex-col divide-y divide-border rounded-3xl border border-border bg-card lg:col-span-2">
          {rest.slice(0, 4).map((e) => (
            <li key={`${e.id}-${e.start}`} className="flex items-center gap-4 p-4">
              <EventDateTile event={e} />
              <div className="min-w-0 flex-1">
                <Link href={`/events#${e.id}`} className="font-semibold leading-snug text-foreground hover:text-primary">
                  {e.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {OBSERVANCE_AREAS[e.area].label} · {countdownLabel(daysUntil(today, e.start))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
