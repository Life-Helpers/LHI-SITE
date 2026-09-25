"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar, Newspaper } from "lucide-react";

import { useLocale } from "@/i18n/locale-context";
import { isUnoptimized } from "@/lib/image";

export interface LatestPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Same text on the server and in every browser (Intl output differs between engines). */
const dateLabel = (iso: string, style: "long" | "short" = "short") => {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const day = d.getUTCDate();
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return style === "long" ? `${DAYS[d.getUTCDay()]} ${day} ${month} ${year}` : `${day} ${month.slice(0, 3)} ${year}`;
};

/**
 * "Latest from LHI" as a newspaper front page: a masthead with the date line, section
 * tabs, a lead story with a drop cap, a numbered column of headlines, and two "notices"
 * pointing to the events calendar and the blog.
 */
export function LatestFromLHI({ posts, today }: { posts: LatestPost[]; today: string }) {
  const { t } = useLocale();
  const l = t.home.latest;
  const sections = ["All", ...[...new Set(posts.map((p) => p.category))].slice(0, 4)];
  const [section, setSection] = useState("All");
  const list = (section === "All" ? posts : posts.filter((p) => p.category === section)).slice(0, 5);
  const [lead, ...rest] = list;

  return (
    <section aria-labelledby="latest-heading" className="bg-[#fbf7f0] py-20 text-[#1d1512] dark:bg-[#17110f] dark:text-[#f3ebe0] sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Masthead */}
        <header className="border-b-4 border-double border-current pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/30 pb-2 text-[10px] font-semibold uppercase tracking-[0.3em] opacity-70 sm:text-[11px]">
            <span>{dateLabel(today, "long")}</span>
            <span>Since 2004</span>
          </div>
          <h2 id="latest-heading" className="mt-4 text-center font-serif-display text-5xl font-light leading-none tracking-tight text-primary sm:text-7xl lg:text-8xl">
            {l.heading}
          </h2>
          <p className="mt-3 text-center font-serif-display text-lg italic opacity-75 sm:text-xl">{l.subtitle}</p>
        </header>

        {/* Section tabs */}
        <nav aria-label="Sections" className="flex gap-1 overflow-x-auto border-b border-current/20 py-2">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={section === s}
              onClick={() => setSection(s)}
              className={`shrink-0 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
                section === s ? "bg-[#1d1512] text-[#fbf7f0] dark:bg-[#f3ebe0] dark:text-[#17110f]" : "opacity-60 hover:opacity-100"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        {lead && (
          <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-12 lg:gap-0">
            {/* Lead story */}
            <article className="lg:col-span-7 lg:pr-8">
              <Link href={`/blog/${lead.slug}`} className="group block">
                {lead.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={lead.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 640px, 100vw"
                      unoptimized={isUnoptimized(lead.image)}
                      className="object-cover grayscale-[60%] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                    <span className="absolute left-0 top-0 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground">
                      {lead.category}
                    </span>
                  </div>
                )}
                <h3 className="mt-5 font-serif-display text-3xl font-normal leading-tight decoration-primary decoration-2 underline-offset-4 group-hover:underline sm:text-4xl">
                  {lead.title}
                </h3>
              </Link>
              <p className="mt-4 text-[15px] leading-relaxed opacity-85 first-letter:float-left first-letter:mr-2 first-letter:font-serif-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-primary">
                {lead.excerpt}
              </p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
                LHI Communications · <time dateTime={lead.date}>{dateLabel(lead.date)}</time>
              </p>
            </article>

            {/* Headlines column */}
            <div className="lg:col-span-5 lg:border-l lg:border-current/20 lg:pl-8">
              <p className="border-b border-current pb-2 text-[11px] font-bold uppercase tracking-[0.3em]">Also in this edition</p>
              <ol className="divide-y divide-current/15">
                {rest.map((p, i) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 py-4">
                      <span className="font-serif-display text-4xl font-light leading-none text-primary/70 tabular-nums">{String(i + 2).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{p.category}</span>
                        <span className="mt-1 block font-serif-display text-xl leading-snug group-hover:underline">{p.title}</span>
                        <time dateTime={p.date} className="mt-1 block text-xs opacity-60">
                          {dateLabel(p.date)}
                        </time>
                      </span>
                      {p.image && (
                        <span className="relative mt-1 hidden h-16 w-16 overflow-hidden sm:block">
                          <Image src={p.image} alt="" fill sizes="64px" unoptimized={isUnoptimized(p.image)} className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Notices */}
        <div className="mt-10 grid grid-cols-1 gap-4 border-t-4 border-double border-current pt-6 sm:grid-cols-2">
          {[
            { icon: Calendar, title: l.eventsTitle, note: l.eventsNote, cta: l.eventsCta, href: "/events" },
            { icon: Newspaper, title: l.blogTitle, note: l.blogNote, cta: l.blogCta, href: "/blog" },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group flex items-start gap-4 border border-current/25 p-5 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <n.icon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.25em]">{n.title}</span>
                <span className="mt-1 block text-sm opacity-80">{n.note}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                  {n.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
