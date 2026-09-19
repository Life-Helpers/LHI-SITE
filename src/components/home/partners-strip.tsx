"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

const partners = [
  "UNICEF",
  "Plan International",
  "Nigeria Humanitarian Fund (NHF)",
  "ActionAid",
  "BMZ (German Development)",
  "Global Affairs Canada",
  "KfW Development Bank",
  "USAID",
  "World Food Programme (WFP)",
  "UK FCDO",
  "European Union (EU)",
  "UNDP",
  "Save the Children",
  "International Rescue Committee (IRC)",
];

export function PartnersStrip() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="partners-heading"
      className="border-t border-border/60"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <ScrollReveal className="mb-6 flex flex-col gap-2">
          <h2
            id="partners-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {t.home.partners.heading}
          </h2>
          <p className="max-w-xl text-muted-foreground">
            {t.home.partners.subtitle}
          </p>
        </ScrollReveal>

        {/*
          Real partner names, sourced from LHI's own organizational
          content — rendered as text wordmarks rather than logo images,
          since we don't have licensed logo assets for these organizations.
        */}
        <ScrollReveal>
          <ul className="flex flex-wrap gap-3">
            {partners.map((partner) => (
              <li
                key={partner}
                className="glass-surface rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {partner}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
