"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  LayoutGrid,
  Loader2,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from "lucide-react";

import { playFlipSound } from "@/components/magazines/flip-sound";
import { pageImage, PROGRESS_KEY, type Magazine } from "@/data/magazines";

type PageFlipInstance = import("page-flip/dist/js/page-flip.module.js").PageFlip;

const SOUND_KEY = "lhi_flip_sound";

const PAGE_W = 550;
/** Pages either side of the open spread whose images are loaded; the rest wait until the reader gets near. */
const PRELOAD = 3;
const PAGE_H = 778; // A4 portrait

/** Heyzine-style flipbook: realistic page curl, flip sound, thumbnails, fullscreen and keyboard control. */
export function Flipbook({ magazine }: { magazine: Magazine }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlipInstance | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const soundRef = useRef(true);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [sound, setSound] = useState(true);
  const [thumbs, setThumbs] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const total = magazine.pages;

  useEffect(() => {
    try {
      const off = localStorage.getItem(SOUND_KEY) === "off";
      soundRef.current = !off;
      setSound(!off);
    } catch {
      /* default: sound on */
    }
  }, []);

  useEffect(() => {
    const host = bookRef.current;
    if (!host) return;
    let cancelled = false;
    let instance: PageFlipInstance | null = null;

    // Pages are built outside React so the library can own and move these nodes.
    const book = document.createElement("div");
    host.appendChild(book);
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= total; i++) {
      const el = document.createElement("div");
      el.className = "flipbook-page";
      if (i === 1 || i === total) el.dataset.density = "hard";
      const img = document.createElement("img");
      // The page-flip library lays out every page, so native lazy loading would fetch them all:
      // sources are assigned only around the open page (see the effect below).
      img.dataset.src = pageImage(magazine, i);
      img.alt = `${magazine.title}, page ${i}`;
      img.decoding = "async";
      img.draggable = false;
      el.appendChild(img);
      book.appendChild(el);
      images.push(img);
    }
    imagesRef.current = images;

    import("page-flip/dist/js/page-flip.module.js").then(({ PageFlip }) => {
      if (cancelled) return;
      instance = new PageFlip(book, {
        width: PAGE_W,
        height: PAGE_H,
        size: "stretch",
        minWidth: 240,
        maxWidth: 900,
        minHeight: 340,
        maxHeight: 1273,
        showCover: true,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: 850,
        usePortrait: true,
        mobileScrollSupport: false,
        showPageCorners: true,
      });
      instance.loadFromHTML(book.querySelectorAll<HTMLElement>(".flipbook-page"));
      const start = Number(new URLSearchParams(window.location.search).get("page"));
      if (Number.isInteger(start) && start > 1 && start <= total) {
        instance.turnToPage(start - 1);
        setPage(start - 1);
      }
      instance.on("flip", (e) => {
        const index = Number(e.data);
        setPage(index);
        try {
          const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") as Record<string, { page: number; total: number; at: number }>;
          all[magazine.slug] = { page: index + 1, total, at: Date.now() };
          localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
        } catch {
          /* progress is a convenience only */
        }
      });
      instance.on("changeOrientation", (e) => setPortrait(e.data === "portrait"));
      instance.on("changeState", (e) => {
        if (e.data === "flipping" && soundRef.current) playFlipSound();
      });
      flipRef.current = instance;
      setPortrait(instance.getOrientation() === "portrait");
      setReady(true);
    });

    return () => {
      cancelled = true;
      flipRef.current = null;
      try {
        instance?.destroy();
      } catch {
        /* already torn down */
      }
      host.innerHTML = "";
    };
  }, [magazine, total]);

  // Load the open spread and a few pages either side of it.
  useEffect(() => {
    const images = imagesRef.current;
    const from = Math.max(0, page - PRELOAD);
    const to = Math.min(images.length - 1, page + PRELOAD + 1);
    for (let i = from; i <= to; i++) {
      const img = images[i];
      if (img && !img.getAttribute("src") && img.dataset.src) img.src = img.dataset.src;
    }
  }, [page, ready]);

  const next = useCallback(() => flipRef.current?.flipNext(), []);
  const prev = useCallback(() => flipRef.current?.flipPrev(), []);
  const goTo = useCallback((i: number) => {
    flipRef.current?.flip(i);
    setThumbs(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleSound() {
    const nextSound = !sound;
    setSound(nextSound);
    soundRef.current = nextSound;
    try {
      localStorage.setItem(SOUND_KEY, nextSound ? "on" : "off");
    } catch {
      /* not remembered */
    }
    if (nextSound) playFlipSound(0.4);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.();
  }

  const spread = !portrait && page > 0 && page < total - 1;
  // In a two-page spread the last left-hand page already shows the final page.
  const atEnd = page >= total - 1 || (spread && page + 1 >= total - 1);
  const label = spread ? `Pages ${page + 1}–${Math.min(page + 2, total)}` : `Page ${page + 1}`;
  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div
      ref={stageRef}
      className={`relative flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_center,#4a1416_0%,#1c0a0b_70%)] ${
        fullscreen ? "h-screen" : "rounded-none sm:rounded-3xl"
      }`}
    >
      <div className="relative flex flex-1 items-center justify-center px-12 py-6 sm:px-20">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="sr-only">Loading magazine</span>
          </div>
        )}
        <div
          ref={bookRef}
          className={`flipbook w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          // Fit the whole book (and the toolbar) on screen: width follows the available height.
          style={{
            maxWidth: portrait
              ? `min(560px, calc((100svh - ${fullscreen ? 7 : 17}rem) * ${PAGE_W / PAGE_H}))`
              : `min(1120px, calc((100svh - ${fullscreen ? 7 : 17}rem) * ${(2 * PAGE_W) / PAGE_H}))`,
          }}
          aria-label={`${magazine.title}: use the arrow keys or the buttons to turn pages`}
        />
        <button type="button" onClick={prev} disabled={page === 0} aria-label="Previous page" className={`${btn} absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 bg-black/30 sm:left-5`}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={next}
          disabled={atEnd}
          aria-label="Next page"
          className={`${btn} absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 bg-black/30 sm:right-5`}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {thumbs && (
        <div className="border-t border-white/10 bg-black/40 px-4 py-3">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: total }, (_, i) => (
              <li key={i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`block overflow-hidden rounded-md border-2 ${
                    i === page || (spread && i === page + 1) ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={pageImage(magazine, i + 1)} alt="" width={68} height={96} sizes="68px" className="h-24 w-[68px] object-cover" />
                </button>
                <span className="mt-1 block text-center text-[10px] text-white/60">{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-black/30 px-3 py-2 text-white sm:px-5">
        <div className="flex items-center">
          <button type="button" onClick={() => goTo(0)} disabled={page === 0} aria-label="First page" className={btn}>
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={prev} disabled={page === 0} aria-label="Previous page" className={btn}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[7.5rem] text-center text-sm tabular-nums" aria-live="polite">
            {label} <span className="text-white/50">/ {total}</span>
          </span>
          <button type="button" onClick={next} disabled={atEnd} aria-label="Next page" className={btn}>
            <ChevronRight className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => goTo(total - 1)} disabled={atEnd} aria-label="Last page" className={btn}>
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center">
          <button type="button" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Mute page-turn sound" : "Turn on page-turn sound"} title="Page-turn sound" className={btn}>
            {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => setThumbs((v) => !v)} aria-pressed={thumbs} aria-label="Show all pages" title="All pages" className={btn}>
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Full screen"} title="Full screen" className={btn}>
            {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <a href={magazine.pdf} download data-title={magazine.title} aria-label="Download PDF" title="Download PDF" className={btn}>
            <Download className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
