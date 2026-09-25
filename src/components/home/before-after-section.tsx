"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";

import type { CmsBeforeAfter } from "@/lib/cms/types";
import { isUnoptimized } from "@/lib/image";

/**
 * "Before & After" stories from Admin → Before & After. The "before" side is shown in black
 * and white: a real earlier photo when there is one, otherwise the same photo.
 */

export function BeforeAfterSection({ stories: STORIES }: { stories: CmsBeforeAfter[] }) {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const story = STORIES[active] ?? STORIES[0];
  if (!story) return null;

  return (
    <section aria-labelledby="before-after-heading" className="border-t border-border/70 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Before &amp; After</p>
            <h2 id="before-after-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl lg:text-5xl">
              The difference, <em className="italic text-primary">in their words.</em>
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Drag the slider to see life before LHI&apos;s support and now. Every statement comes from our project magazines and newsletter.
            </p>
          </div>
          <div role="tablist" aria-label="Choose a story" className="flex flex-wrap gap-2">
            {STORIES.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                type="button"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setPosition(50);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  i === active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {s.name.split(",")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="relative aspect-[4/3] select-none overflow-hidden rounded-3xl border border-border bg-muted lg:col-span-3">
            {/* After (full colour) */}
            <Image key={`after-${story.id}`} src={story.photo} alt={story.photoAlt} unoptimized={isUnoptimized(story.photo)} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            <span className="absolute bottom-5 right-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow sm:bottom-7 sm:right-7">
              Now
            </span>

            {/* Before (black and white), clipped to the slider position */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} aria-hidden="true">
              {story.beforePhoto ? (
                <Image key={`before-${story.id}`} src={story.beforePhoto} alt="" unoptimized={isUnoptimized(story.beforePhoto)} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover grayscale" />
              ) : (
                <Image src={story.photo} alt="" unoptimized={isUnoptimized(story.photo)} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover grayscale" />
              )}
              <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground shadow sm:bottom-7 sm:left-7">
                Before
              </span>
            </div>

            {/* Divider handle */}
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ left: `${position}%` }} aria-hidden="true">
              <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                <MoveHorizontal className="h-5 w-5" />
              </span>
            </div>
            <label className="sr-only" htmlFor="before-after-range">
              Compare before and now for {story.name}
            </label>
            <input
              id="before-after-range"
              type="range"
              min={0}
              max={100}
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              aria-valuetext={position > 50 ? "Showing mostly before" : "Showing mostly now"}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <div className="flex flex-col justify-center lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{story.place}</p>
            <h3 className="mt-1 font-serif-display text-3xl font-light text-foreground">{story.name}</h3>
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Before</p>
                <p className="mt-1 font-semibold text-foreground">{story.beforeTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{story.beforeText}</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Now</p>
                <p className="mt-1 font-semibold text-foreground">{story.afterTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{story.afterText}</p>
              </div>
            </div>
            <Link href={story.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              {story.linkLabel || <>Read {story.name.split(",")[0]}&apos;s story</>} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
