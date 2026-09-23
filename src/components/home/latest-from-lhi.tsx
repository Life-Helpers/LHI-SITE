"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

export function LatestFromLHI() {
  const { t } = useLocale();

  const columns = [
    {
      icon: Calendar,
      title: t.home.latest.eventsTitle,
      href: "/events",
      note: t.home.latest.eventsNote,
      cta: t.home.latest.eventsCta,
    },
    {
      icon: Newspaper,
      title: t.home.latest.blogTitle,
      href: "/blog",
      note: t.home.latest.blogNote,
      cta: t.home.latest.blogCta,
    },
  ];

  return (
    <section
      aria-labelledby="latest-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
    >
      <ScrollReveal className="mb-8 flex flex-col gap-2">
        <h2 id="latest-heading" className="font-serif-display text-3xl font-light sm:text-4xl">
          {t.home.latest.heading}
        </h2>
        <p className="max-w-xl text-muted-foreground">{t.home.latest.subtitle}</p>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {columns.map((column, i) => (
          <ScrollReveal key={column.href} delay={i * 100}>
            <div
              aria-label={column.title}
              className="glass-surface flex h-full flex-col gap-3 border-dashed p-6 transition-all duration-400 hover:-translate-y-2 hover:scale-[1.02] hover:border-accent"
            >
              <column.icon
                className="h-5 w-5 text-accent"
                aria-hidden="true"
              />
              <h3 className="font-semibold">{column.title}</h3>
              <p className="text-sm text-muted-foreground">{column.note}</p>
              <Link
                href={column.href}
                className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {column.cta}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
