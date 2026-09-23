"use client";

import { Smile } from "lucide-react";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

export function PhilosophyQuote() {
  const { t } = useLocale();
  const p = t.home.philosophy;

  return (
    <section aria-labelledby="philosophy-heading" className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <ScrollReveal>
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h2 id="philosophy-heading" className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {p.heading}
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
          </h2>
          <blockquote className="mt-8">
            <p className="font-serif-display text-3xl font-light leading-tight text-balance text-foreground sm:text-5xl">{p.quote}</p>
            <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 font-serif-display text-4xl font-light italic text-primary sm:text-6xl lg:text-7xl">
              {p.highlight}
              <Smile className="h-10 w-10 shrink-0 motion-safe:animate-[bounce_2.4s_ease-in-out_infinite] sm:h-14 sm:w-14" aria-hidden="true" />
            </p>
          </blockquote>
          <p className="mt-8 text-sm text-muted-foreground">{p.attribution}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
