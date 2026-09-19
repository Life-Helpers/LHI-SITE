"use client";

import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

import { Eyebrow } from "@/components/eyebrow";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

export function RadioBanner() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="radio-heading"
      className="border-t border-border/60 bg-gradient-to-br from-primary to-accent"
    >
      <ScrollReveal>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Radio
              className="mt-1 h-8 w-8 shrink-0 text-primary-foreground"
              aria-hidden="true"
            />
            <div>
              <Eyebrow className="text-primary-foreground">
                {t.home.radio.eyebrow}
              </Eyebrow>
              <h2
                id="radio-heading"
                className="mt-1 text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl"
              >
                {t.home.radio.heading}
              </h2>
              <p className="mt-2 max-w-xl text-primary-foreground">
                {t.home.radio.body}
              </p>
            </div>
          </div>

          <Link
            href="/radio"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-105 hover:bg-background/90 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t.home.radio.cta}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
