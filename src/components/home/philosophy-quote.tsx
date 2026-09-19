"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

export function PhilosophyQuote() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="philosophy-heading"
      className="border-t border-border/60"
    >
      <ScrollReveal>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 id="philosophy-heading" className="sr-only">
            {t.home.philosophy.heading}
          </h2>
          <blockquote className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t.home.philosophy.quote}
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">
            {t.home.philosophy.attribution}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
