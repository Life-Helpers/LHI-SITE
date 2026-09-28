"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

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
    <section
      aria-labelledby="philosophy-heading"
      className="relative overflow-hidden bg-gradient-to-br from-[#a80f14] via-primary to-accent text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#f5a524]/30 blur-3xl" />
      <ScrollReveal>
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h2 id="philosophy-heading" className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/85">
            <span className="h-px w-8 bg-white/70" aria-hidden="true" />
            {p.heading}
            <span className="h-px w-8 bg-white/70" aria-hidden="true" />
          </h2>
          <blockquote className="mt-8">
            <p className="font-serif-display text-3xl font-light leading-tight text-balance text-white sm:text-5xl">{p.quote}</p>
            <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 font-serif-display text-4xl font-light italic text-[#ffe2b8] sm:text-6xl lg:text-7xl">
              {p.highlight}
              <WinkingSmiley className="h-10 w-10 shrink-0 sm:h-14 sm:w-14" />
            </p>
          </blockquote>
        </div>
      </ScrollReveal>
    </section>
  );
}
