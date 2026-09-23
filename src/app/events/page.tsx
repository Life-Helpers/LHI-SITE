import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Download, Rss } from "lucide-react";

import { BlogFeed } from "@/components/blog/blog-feed";
import { AddToCalendar } from "@/components/events/add-to-calendar";
import { countdownLabel, EventDateTile } from "@/components/events/event-date-tile";
import { EventsCalendar } from "@/components/events/events-calendar";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { siteConfig } from "@/config/site";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { daysUntil, formatEventDate, OBSERVANCE_AREAS } from "@/data/observances";
import { getCalendarEvents, getPublishedPosts, todayInLagos } from "@/lib/cms/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events & Observance Days",
  description:
    "Upcoming LHI events, the LHI anniversary (1 October) and the international days for health, education, livelihoods, food security, social inclusion, protection and humanitarian action. Add any of them to your calendar.",
};

export default async function EventsPage() {
  const today = todayInLagos();
  // 364 days so each yearly observance appears once.
  const [events, posts] = await Promise.all([getCalendarEvents(364), getPublishedPosts()]);
  const next = events[0];
  const reports = posts.filter((p) => p.category === "Events").slice(0, 4);
  const feedUrl = `${siteConfig.url.replace(/\/$/, "")}/api/calendar`;
  const webcal = feedUrl.replace(/^https?:/, "webcal:");

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Events & Updates"
        title={
          <>
            Events &amp; <em className="font-light italic text-primary">Observance Days.</em>
          </>
        }
        subtitle="The days that matter to the communities we serve, and the moments we mark together."
        description="LHI events and the international days behind our six thematic areas and humanitarian work. Add any of them to your calendar, or subscribe to the whole calendar."
        image={{ ...LHI_PHOTOS.activismMarch, tag: "16 Days of Activism march, Sokoto" }}
      />

      {next && (
        <section aria-labelledby="next-heading" className="border-b border-border bg-muted/20 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Next up · {countdownLabel(daysUntil(today, next.start))}</p>
            <div className="mt-5 flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
              <EventDateTile event={next} size="lg" />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{OBSERVANCE_AREAS[next.area].label}</span>
                <h2 id="next-heading" className="mt-1 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                  {next.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{formatEventDate(next)}</p>
                <p className="mt-3 max-w-2xl text-foreground/80">{next.description}</p>
              </div>
              <AddToCalendar event={next} variant="solid" className="self-start sm:self-center" />
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— The year ahead</p>
            <h2 className="mt-2 mb-8 font-serif-display text-3xl font-light text-foreground sm:text-4xl">Upcoming days &amp; events</h2>
            <EventsCalendar events={events} today={today} />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <CalendarDays size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif-display text-xl font-medium text-foreground">Subscribe to the LHI calendar</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every observance day and new LHI event, kept up to date in your own calendar app.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                  >
                    <Rss className="h-3.5 w-3.5" aria-hidden="true" /> Google Calendar
                  </a>
                  <a
                    href={webcal}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:border-primary hover:text-primary"
                  >
                    <Rss className="h-3.5 w-3.5" aria-hidden="true" /> Apple / Outlook
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- calendar file, not a page */}
                  <a
                    href="/api/calendar"
                    download="lhi-calendar.ics"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:border-primary hover:text-primary"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download .ics
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Mark a day with us</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Planning an activity for one of these days in your community, school or organisation? We would love to partner with you.
                </p>
                <Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                  Contact the team →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {reports.length > 0 && (
        <section className="border-t border-border bg-muted/20 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— From past events</p>
            <h2 className="mt-2 mb-8 font-serif-display text-3xl font-light text-foreground sm:text-4xl">Event reports</h2>
            <BlogFeed posts={reports} />
          </div>
        </section>
      )}
    </main>
  );
}
