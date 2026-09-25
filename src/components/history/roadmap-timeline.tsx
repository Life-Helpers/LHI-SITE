"use client";

import Image from "next/image";
import { ArrowRight, Flag, MapPin, Navigation } from "lucide-react";
import { MotionConfig, motion } from "motion/react";

import { HISTORY_START, OLD_LOGO, type HistoryMilestone, type HistoryPhoto } from "@/data/history-timeline";

import { StatePinMap } from "./state-pin-map";

/**
 * "Our History" as a road-map journey: a winding road runs down the middle, each
 * milestone is a stop on it. Photos sit on the left, the year on the road, and the
 * title and story on the right. On small screens the road runs down the left edge.
 */
export function RoadmapTimeline({ milestones }: { milestones: HistoryMilestone[] }) {
  // States reached before each stop, so its map can shade the journey so far.
  const reached: string[] = [];
  const earlierStates = milestones.map((m) => {
    const before = [...reached];
    reached.push(...(m.states ?? []));
    return before;
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <RoadEnd kind="start" />
        <ol className="relative">
          {milestones.map((m, i) => (
            <Stop key={`${m.year}-${m.title}`} milestone={m} index={i} earlier={earlierStates[i]} />
          ))}
        </ol>
        <RoadEnd kind="end" />
      </div>
    </MotionConfig>
  );
}

/** One winding road segment; alternate segments bend left and right so the road snakes down the page. */
function RoadSegment({ bend }: { bend: "left" | "right" }) {
  const cx = bend === "left" ? 8 : 92;
  const d = `M50 0 C ${cx} 30, ${cx} 70, 50 100`;
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" className="stroke-muted-foreground/25" strokeWidth={34} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      <path d={d} fill="none" className="stroke-slate-700 dark:stroke-slate-600" strokeWidth={28} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#fde68a" strokeWidth={2} strokeDasharray="10 12" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function StraightRoad() {
  return (
    <div className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 rounded-full bg-slate-700 ring-[3px] ring-muted-foreground/20 dark:bg-slate-600" aria-hidden="true">
      <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,#fde68a_0_10px,transparent_10px_22px)]" />
    </div>
  );
}

function YearMarker({ year }: { year: string }) {
  const long = year.length > 4;
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative z-10 flex flex-col items-center"
    >
      <span
        className={`flex items-center justify-center rounded-2xl border-4 border-background bg-primary font-serif-display font-medium text-primary-foreground shadow-lg ring-2 ring-primary/30 ${
          long ? "h-14 px-3 text-base" : "h-16 w-16 text-xl sm:h-[72px] sm:w-[72px] sm:text-2xl"
        }`}
      >
        {year}
      </span>
      <span className="-mt-1 h-3 w-3 rotate-45 bg-primary" aria-hidden="true" />
    </motion.div>
  );
}

function Stop({ milestone: m, index, earlier }: { milestone: HistoryMilestone; index: number; earlier: string[] }) {
  const bend = index % 2 === 0 ? "right" : "left";
  return (
    <li className="relative">
      {/* Desktop: photo | road + year | story */}
      <div className="hidden min-h-[300px] grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] items-center gap-6 py-6 lg:grid">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Media milestone={m} earlier={earlier} />
        </motion.div>
        <div className="relative flex h-full items-center justify-center self-stretch">
          <div className="absolute -inset-y-6 inset-x-0">
            <RoadSegment bend={bend} />
          </div>
          <YearMarker year={m.year} />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <Story milestone={m} />
        </motion.div>
      </div>

      {/* Mobile and tablet: road on the left, content on the right */}
      <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 py-5 lg:hidden">
        <div className="relative flex justify-center">
          <div className="absolute -inset-y-5 inset-x-0">
            <StraightRoad />
          </div>
          <div className="sticky top-24 h-fit pt-1">
            <YearMarker year={m.year} />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4"
        >
          {(m.media || m.states) && <Media milestone={m} earlier={earlier} />}
          <Story milestone={m} />
        </motion.div>
      </div>
    </li>
  );
}

function Story({ milestone: m }: { milestone: HistoryMilestone }) {
  return (
    <div>
      {m.location && (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          <MapPin size={12} aria-hidden="true" />
          {m.location}
        </span>
      )}
      <h3 className="mt-2 font-serif-display text-2xl font-light leading-snug text-foreground sm:text-[1.7rem]">{m.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{m.summary}</p>
    </div>
  );
}

function Media({ milestone: m, earlier }: { milestone: HistoryMilestone; earlier: string[] }) {
  const media = m.media;
  if (!media) {
    if (m.states) {
      // A state expansion without photos: the map, with a pin on the new state(s).
      return (
        <figure className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-4 sm:p-5">
          <StatePinMap states={m.states} earlier={earlier} />
          <figcaption className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {m.location}
          </figcaption>
        </figure>
      );
    }
    // A road sign for milestones without photos.
    return (
      <div className="relative mx-auto flex aspect-[16/9] w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 text-center">
        <span className="pointer-events-none absolute -right-2 -top-6 font-serif-display text-[7rem] font-light leading-none text-primary/10" aria-hidden="true">
          {m.year.slice(0, 4)}
        </span>
        <Navigation className="h-7 w-7 text-primary" aria-hidden="true" />
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">Milestone</p>
        <p className="mt-1 text-sm font-medium text-foreground">{m.location ?? m.title}</p>
      </div>
    );
  }

  if (media.kind === "logos") {
    return (
      <figure className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl bg-muted sm:h-32 sm:w-32">
              <Image src={OLD_LOGO.src} alt={OLD_LOGO.alt} fill sizes="128px" className="object-contain" />
            </div>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Until 2019</p>
          </div>
          <ArrowRight className="h-7 w-7 shrink-0 text-primary" aria-hidden="true" />
          <div className="text-center">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-muted sm:h-32 sm:w-32">
              <Image src="/icon.png" alt="Life Helpers Initiative's current logo: Life Helpers in orange and red, with a smiling i" fill sizes="128px" className="object-cover" />
            </div>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-primary">2019 – today</p>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure>
      <div className="relative">
        <PhotoGrid photos={media.photos} />
        {m.states && (
          // Map inset: where this milestone happened.
          <div className="pointer-events-none absolute right-2 top-2 w-[30%] min-w-[96px] max-w-[150px] rounded-xl bg-background/90 p-1.5 shadow-lg ring-1 ring-border backdrop-blur-sm">
            <StatePinMap states={m.states} earlier={earlier} compact />
          </div>
        )}
      </div>
      {media.caption && <figcaption className="mt-2 text-xs italic text-muted-foreground">{media.caption}</figcaption>}
    </figure>
  );
}

function PhotoGrid({ photos }: { photos: HistoryPhoto[] }) {
  const n = photos.length;
  return (
    <div className={`grid gap-2 ${n > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
      {photos.map((p, i) => {
        const wide = n === 1 || (n === 3 && i === 0);
        return (
          <a
            key={p.src}
            href={p.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open photo: ${p.label ?? p.alt}`}
            className={`group relative block overflow-hidden rounded-2xl bg-muted shadow-sm ${
              n === 3 && i === 0 ? "col-span-2 aspect-[16/9]" : n === 1 ? "aspect-[16/10]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes={wide ? "(min-width: 1024px) 480px, 90vw" : "(min-width: 1024px) 240px, 45vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {p.label && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-medium leading-snug text-white sm:text-xs">
                {p.label}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}

function RoadEnd({ kind }: { kind: "start" | "end" }) {
  const start = kind === "start";
  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] lg:gap-6">
      {start ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="col-span-2 self-center lg:col-span-1"
        >
          <PhotoGrid photos={HISTORY_START.photos} />
        </motion.div>
      ) : (
        <div className="hidden lg:block" />
      )}
      <div className="flex flex-col items-center justify-end">
        {!start && <div className="h-8 w-7 rounded-b-full bg-slate-700 dark:bg-slate-600" aria-hidden="true" />}
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold lg:px-4 uppercase tracking-[0.2em] shadow-md ${
            start ? "bg-foreground text-background" : "bg-accent text-accent-foreground"
          }`}
        >
          {start ? <Flag className="h-3.5 w-3.5" aria-hidden="true" /> : <Navigation className="h-3.5 w-3.5" aria-hidden="true" />}
          <span className="sr-only lg:not-sr-only">{start ? "Start" : "The road ahead"}</span>
        </span>
        {start && <div className="h-8 w-7 rounded-t-full bg-slate-700 dark:bg-slate-600" aria-hidden="true" />}
      </div>
      {start ? (
        <div className="self-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            <MapPin size={12} aria-hidden="true" />
            {HISTORY_START.date}
          </span>
          <h3 className="mt-2 font-serif-display text-2xl font-light leading-snug text-foreground sm:text-[1.7rem]">{HISTORY_START.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{HISTORY_START.summary}</p>
        </div>
      ) : (
        <p className="self-center text-sm text-muted-foreground lg:col-start-3">More lives to touch, more smiles to put on faces.</p>
      )}
    </div>
  );
}
