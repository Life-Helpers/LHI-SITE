"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Eyebrow } from "@/components/eyebrow";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

export function WhoWeAreBand() {
  const { t } = useLocale();
  const values = t.home.whoWeAre.values;

  return (
    <section
      aria-labelledby="who-we-are-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
    >
      <ScrollReveal className="mb-8 flex flex-col gap-2">
        <Eyebrow>{t.home.whoWeAre.eyebrow}</Eyebrow>
        <h2 id="who-we-are-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.home.whoWeAre.heading}
        </h2>
        <p className="max-w-2xl text-muted-foreground">{t.home.whoWeAre.body}</p>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { title: t.home.whoWeAre.visionTitle, body: t.home.whoWeAre.visionBody },
          { title: t.home.whoWeAre.missionTitle, body: t.home.whoWeAre.missionBody },
        ].map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 100}>
            <article
              aria-label={item.title}
              className="glass-surface h-full p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          </ScrollReveal>
        ))}
        <ScrollReveal delay={200}>
          <article
            aria-label={t.home.whoWeAre.valuesTitle}
            className="glass-surface h-full p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            <h3 className="font-semibold">{t.home.whoWeAre.valuesTitle}</h3>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              {values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </article>
        </ScrollReveal>
      </div>

      <Link
        href="/about"
        className="mt-6 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {t.home.whoWeAre.moreAboutLhi}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}
