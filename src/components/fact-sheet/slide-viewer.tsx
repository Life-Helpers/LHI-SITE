"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

/** Slide viewer for a photo presentation: arrows, keyboard, thumbnails and full screen. */
export function SlideViewer({ slides, label }: { slides: { src: string; caption: string }[]; label: string }) {
  const [index, setIndex] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  const slide = slides[index];
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="rounded-3xl border border-border bg-card p-3 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-4"
    >
      <div ref={frame} className="relative overflow-hidden rounded-2xl bg-black">
        <div className="relative aspect-video">
          <Image src={slide.src} alt={slide.caption} fill sizes="(min-width: 1024px) 900px, 100vw" className="object-contain" priority={index === 0} />
        </div>
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => (document.fullscreenElement ? document.exitFullscreen() : frame.current?.requestFullscreen?.())}
          aria-label="Full screen"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-start justify-between gap-4 px-1 pt-3">
        <p className="text-sm text-foreground" aria-live="polite">
          {slide.caption}
        </p>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {index + 1} / {slides.length}
        </span>
      </div>
      <div ref={strip} className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            data-i={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}: ${s.caption}`}
            aria-current={i === index}
            className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <Image src={s.src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
