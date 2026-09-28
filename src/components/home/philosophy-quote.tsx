"use client";

import { Dancing_Script } from "next/font/google";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

const script = Dancing_Script({ subsets: ["latin"], weight: ["500", "700"], display: "swap", preload: false });

/** A smiley that winks every few seconds (still for reduced motion). */
function WinkingSmiley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`wink-face ${className}`} role="img" aria-label="winking smiley">
      <circle cx="32" cy="32" r="29" fill="#fcc21b" stroke="#e8a50a" strokeWidth="2" />
      <ellipse cx="22" cy="25" rx="4" ry="6" fill="#2f2f2f" />
      <ellipse className="wink-eye" cx="42" cy="25" rx="4" ry="6" fill="#2f2f2f" />
      <path d="M17 38c4 9 11 13 15 13s11-4 15-13" fill="none" stroke="#2f2f2f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="14" cy="36" r="4" fill="#f59e8b" opacity="0.6" />
      <circle cx="50" cy="36" r="4" fill="#f59e8b" opacity="0.6" />
    </svg>
  );
}

export function PhilosophyQuote() {
  const { t } = useLocale();
  const p = t.home.philosophy;

  return (
    <section aria-labelledby="philosophy-heading" className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <ScrollReveal>
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h2 id="philosophy-heading" className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {p.heading}
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
          </h2>
          <blockquote className={`mt-8 ${script.className}`}>
            <p className="text-4xl font-medium leading-tight text-balance text-foreground sm:text-6xl lg:text-7xl">{p.quote}</p>
            <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-5xl font-bold text-primary sm:text-7xl lg:text-8xl">
              {p.highlight}
              <WinkingSmiley className="h-12 w-12 shrink-0 sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
            </p>
          </blockquote>
        </div>
      </ScrollReveal>
    </section>
  );
}
