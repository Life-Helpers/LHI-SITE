"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { isUnoptimized } from "@/lib/image";

export interface FeatureSlide {
  area: string;
  areaName: string;
  areaHref: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
  linkLabel: string;
}

const INTERVAL_MS = 7000;

/** Feature story carousel: one story per thematic area, advancing left to right. */
export function FeatureStory({ slides }: { slides: FeatureSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (!playing || paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, playing, paused, count, go]);

  if (!count) return null;

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-labelledby="feature-story-heading"
      className="relative overflow-hidden py-16 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Feature stories</p>
            <h2 id="feature-story-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              One story from every <em className="italic text-primary">thematic area</em>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause the stories" : "Play the stories"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous story"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next story"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Track: slides are laid out right-to-left so advancing moves the story left to right. */}
        <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
          <div
            className="flex flex-row-reverse transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <article
                key={slide.href}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${slide.areaName}`}
                aria-hidden={i !== index}
                inert={i !== index}
                className="grid w-full shrink-0 grid-cols-1 lg:grid-cols-2"
              >
                <div className="relative aspect-[4/3] bg-muted lg:aspect-auto lg:min-h-[440px]">
                  <Image
                    src={slide.image}
                    unoptimized={isUnoptimized(slide.image)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                    {slide.areaName}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Feature story · {slide.areaName}</p>
                  <h3 className="mt-3 font-serif-display text-2xl font-light leading-tight text-foreground sm:text-4xl">{slide.title}</h3>
                  {slide.excerpt && <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{slide.excerpt}</p>}
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      {slide.linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link href={slide.areaHref} className="text-xs font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline">
                      More on {slide.areaName}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {/* Autoplay progress */}
          {playing && !paused && count > 1 && (
            <span
              key={index}
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-1 bg-primary motion-safe:animate-[story-progress_7s_linear_forwards] motion-reduce:hidden"
            />
          )}
        </div>

        <div role="tablist" aria-label="Choose a thematic area" className="mt-6 flex flex-wrap justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.href}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => go(i)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                i === index ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {slide.areaName}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
