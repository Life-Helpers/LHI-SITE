"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";

import { AddToCalendar } from "@/components/events/add-to-calendar";
import { countdownLabel, EventDateTile } from "@/components/events/event-date-tile";
import { daysUntil, formatEventDate, monthLabel, OBSERVANCE_AREAS, type CalendarEvent, type ObservanceArea } from "@/data/observances";

const AREA_ORDER = Object.keys(OBSERVANCE_AREAS) as ObservanceArea[];

/** Filterable, month-grouped list of upcoming observance days and LHI events. */
export function EventsCalendar({ events, today }: { events: CalendarEvent[]; today: string }) {
  const [area, setArea] = useState<ObservanceArea | "all">("all");
  const counts = useMemo(() => events.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e.area]: (acc[e.area] ?? 0) + 1 }), {}), [events]);
  const shown = events.filter((e) => area === "all" || e.area === area);
  const months = shown.reduce<{ key: string; label: string; items: CalendarEvent[] }[]>((acc, e) => {
    const start = e.start < today ? today : e.start;
    const key = start.slice(0, 7);
    const label = monthLabel(key);
    const group = acc.find((g) => g.key === key);
    if (group) group.items.push(e);
    else acc.push({ key, label, items: [e] });
    return acc;
  }, []);

  const chip = (value: ObservanceArea | "all", label: string, n: number) => (
    <button
      key={value}
      type="button"
      aria-pressed={area === value}
      onClick={() => setArea(value)}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
        area === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {label} <span className="opacity-70">({n})</span>
    </button>
  );

  return (
    <div>
      <div role="group" aria-label="Filter by thematic area" className="flex flex-wrap gap-2">
        {chip("all", "All", events.length)}
        {AREA_ORDER.filter((a) => counts[a]).map((a) => chip(a, OBSERVANCE_AREAS[a].label, counts[a]))}
      </div>

      <div className="mt-10 space-y-12">
        {months.map((month) => (
          <section key={month.key} aria-labelledby={`m-${month.key}`}>
            <h3 id={`m-${month.key}`} className="border-b border-border pb-3 font-serif-display text-2xl font-light text-foreground">
              {month.label}
            </h3>
            <ul className="mt-2 divide-y divide-border">
              {month.items.map((e) => {
                const days = daysUntil(today, e.start);
                const lhi = e.area === "lhi";
                return (
                  <li
                    key={`${e.id}-${e.start}`}
                    id={e.id}
                    className={`scroll-mt-32 flex flex-col gap-4 py-6 sm:flex-row sm:items-start ${lhi ? "-mx-4 rounded-2xl bg-primary/5 px-4" : ""}`}
                  >
                    <EventDateTile event={e} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${lhi ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {OBSERVANCE_AREAS[e.area].label}
                        </span>
                        {e.kind === "event" && <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">LHI event</span>}
                        <span className={`text-xs font-semibold ${days <= 7 ? "text-primary" : "text-muted-foreground"}`}>{countdownLabel(days)}</span>
                      </div>
                      <h4 className="mt-1.5 text-lg font-semibold leading-snug text-foreground">{e.title}</h4>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatEventDate(e)}
                        {e.by ? ` · ${e.by}` : ""}
                      </p>
                      {(e.time || e.location) && (
                        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {e.time && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {e.time}
                            </span>
                          )}
                          {e.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {e.location}
                            </span>
                          )}
                        </p>
                      )}
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">{e.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <AddToCalendar event={e} />
                        {e.href && !e.href.startsWith(`/events#`) && (
                          <Link href={e.href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                            {e.kind === "event" ? "Details" : lhi ? "Our story" : `Our ${OBSERVANCE_AREAS[e.area].label.toLowerCase()} work`}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
