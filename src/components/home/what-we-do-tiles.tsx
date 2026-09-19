"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLocalizedNav } from "@/components/nav-data";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

export function WhatWeDoTiles() {
  const { t } = useLocale();
  const { whatWeDoCards } = useLocalizedNav();

  return (
    <section
      aria-labelledby="what-we-do-heading"
      className="border-t border-border/60"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal className="mb-8 flex flex-col gap-2">
          <h2
            id="what-we-do-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {t.home.whatWeDo.heading}
          </h2>
          <p className="max-w-xl text-muted-foreground">
            {t.home.whatWeDo.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whatWeDoCards.map((card, i) => (
            <ScrollReveal key={card.href} delay={i * 60}>
              <Link
                href={card.href}
                aria-label={`${card.label}: ${card.description}`}
                className="group flex h-full items-center gap-4 rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <card.icon
                    className="h-6 w-6 text-primary-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary">
                    {card.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <Link
          href="/programs"
          className="mt-6 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {t.home.whatWeDo.viewAllPrograms}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
