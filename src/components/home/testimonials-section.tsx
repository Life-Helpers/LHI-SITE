"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Quote, Star } from "lucide-react";

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

/**
 * Quotes from Admin → Testimonials as frosted-glass cards on lined paper. The cards sit on a
 * row that slides sideways as the visitor scrolls down the page (and back as they scroll up):
 * the section pins to the screen until the last card has passed. Without JavaScript, or for
 * reduced motion, the row is an ordinary swipeable strip.
 */
export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  /** Sideways distance in px, once scroll-linking is on. */
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let span = 0;
    let frame = 0;
    const render = () => {
      frame = 0;
      const progress = span > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / span)) : 0;
      track.style.transform = `translate3d(${(-progress * span).toFixed(1)}px, 0, 0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(3)})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const measure = () => {
      span = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setDistance(span);
      schedule();
    };
    // Tabbing to a card that is off to the side scrolls the page until it is in view.
    const onFocus = (e: FocusEvent) => {
      viewport.scrollLeft = 0;
      const card = (e.target as HTMLElement).closest("li");
      if (!card || span === 0) return;
      const target = Math.min(span, Math.max(0, card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2));
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + target, behavior: "instant" });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    window.addEventListener("scroll", schedule, { passive: true });
    track.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      track.removeEventListener("focusin", onFocus);
      cancelAnimationFrame(frame);
      track.style.transform = "";
    };
  }, []);

  if (testimonials.length === 0) return null;
  const linked = distance !== null && distance > 0;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="relative bg-[#fcfbf6] dark:bg-[#0f1116]"
      style={linked ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={`${linked ? "sticky top-0 flex h-svh flex-col justify-center" : "py-20 sm:py-24"} isolate overflow-hidden`}>
        {/* Hand-drawn blue lined paper, half transparent */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[url('/images/textures/blue-lined-paper.webp')] bg-cover bg-center opacity-50 dark:opacity-15"
        />
        <div aria-hidden="true" className="absolute -left-24 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-24 bottom-10 -z-10 h-80 w-80 rounded-full bg-[#3b82f6]/15 blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— In their own words</p>
              <h2 id="testimonials-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-5xl">
                {t.home.testimonials.heading}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{t.home.testimonials.subtitle}</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {testimonials.length} voices · {linked ? "scroll to read" : "swipe to read"}
            </p>
          </div>
        </div>

        <div
          ref={viewportRef}
          className={`mt-8 w-full sm:mt-10 ${linked ? "overflow-x-clip" : "snap-x snap-mandatory overflow-x-auto pb-4"}`}
        >
          <ul
            ref={trackRef}
            aria-label={t.home.testimonials.heading}
            className="flex w-max gap-5 px-4 py-6 will-change-transform sm:gap-6 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          >
            {testimonials.map((item) => (
              <li key={item.name} className="w-[82vw] max-w-[380px] shrink-0 snap-start">
                <figure className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/45 p-7 shadow-[0_20px_50px_-20px_rgba(30,41,59,0.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 dark:border-white/15 dark:bg-white/[0.07]">
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.tone}`} />
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-lg`}
                      aria-hidden="true"
                    >
                      <Quote className="h-5 w-5 fill-current" />
                    </span>
                    <Stars />
                  </div>
                  <blockquote className="mt-5 flex-1 font-serif-display text-lg italic leading-relaxed text-foreground">“{item.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-dashed border-foreground/15 pt-5">
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
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-white/50 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground dark:bg-white/10"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        {linked && (
          <div className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
            <div className="h-1 w-40 overflow-hidden rounded-full bg-foreground/10">
              <span ref={barRef} className="block h-full origin-left scale-x-0 rounded-full bg-primary" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
