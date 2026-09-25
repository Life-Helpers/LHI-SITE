"use client";

import Link from "next/link";
import { ArrowUpRight, Quote, Star } from "lucide-react";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import type { Testimonial } from "@/data/testimonials";
import { useLocale } from "@/i18n/locale-context";


const initials = (name: string) =>
  name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !/^(Engr|Alhaji|Dr|Mr|Mrs)\.?$/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

function Stars() {
  return (
    <span className="flex gap-0.5 text-[#f5a524]" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}

/** Quotes from Admin → Testimonials, each linking to the full story. */
export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useLocale();
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-14 flex flex-col items-center gap-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— In their own words</p>
          <h2 id="testimonials-heading" className="font-serif-display text-3xl font-light sm:text-5xl">
            {t.home.testimonials.heading}
          </h2>
          <p className="max-w-xl text-muted-foreground">{t.home.testimonials.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4 xl:gap-6">
          {testimonials.map((item, i) => (
            <figure key={item.name} className={`group relative ${i % 2 === 1 ? "xl:-translate-y-6" : ""}`}>
              {/* Offset colour layer behind the card */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 translate-x-2 translate-y-2 rotate-[1.5deg] rounded-[1.75rem] bg-gradient-to-br ${item.tone} opacity-90 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 group-hover:rotate-[2.5deg]`}
              />
              <div className="relative flex h-full flex-col rounded-[1.75rem] border border-border bg-background p-7 pt-10 shadow-lg">
                <span
                  className={`absolute -top-6 left-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-lg`}
                  aria-hidden="true"
                >
                  <Quote className="h-5 w-5 fill-current" />
                </span>
                <Stars />
                <blockquote className="mt-4 flex-1 font-serif-display text-base italic leading-relaxed sm:text-lg text-foreground">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-dashed border-border pt-5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.tone} text-sm font-bold text-white`}
                    aria-hidden="true"
                  >
                    {initials(item.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{item.name}</span>
                    <span className="block text-xs text-muted-foreground">{item.role}</span>
                  </span>
                  <Link
                    href={item.href}
                    aria-label={`Read the story: ${item.name}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
