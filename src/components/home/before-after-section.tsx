"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";

import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";

/**
 * "Before & After" stories. Every before/after statement is taken from LHI's project
 * magazines and newsletter; the photo is the person or place in the story. The
 * "before" side uses a real earlier photo when we have one, otherwise the same photo faded.
 */
const STORIES: {
  id: string;
  name: string;
  place: string;
  photo: LhiPhotoKey;
  /** A real photo from before the support; when missing, the "before" side shows the main photo faded. */
  beforePhoto?: LhiPhotoKey;
  before: { title: string; text: string };
  after: { title: string; text: string };
  href: string;
}[] = [
  {
    id: "jafaro",
    name: "Jafaro Baro",
    place: "Katsina LGA, Katsina State",
    photo: "jafaroCabbage",
    beforePhoto: "jafaroFieldBefore",
    before: { title: "One harvest, low prices", text: "Poor seeds took 80 days to mature; his cabbages sold for ₦175–₦200 each." },
    after: {
      title: "Two harvests, three times the price",
      text: "Improved seeds mature in 60 days, and his cabbages now sell for ₦500–₦600 each. “Now there is no day I return home without money in my hand.”",
    },
    href: "/blog/jafaro-harvesting-prosperity-twice-a-year",
  },
  {
    id: "murja",
    name: "Murja Yari",
    place: "Katsina State",
    photo: "murja",
    before: { title: "Eight years of struggle", text: "Widowed with 11 children and no income: “There were times when we spent up to five days without anything to eat.”" },
    after: {
      title: "A food business that runs all day",
      text: "She invested her ₦75,000 WFP cash transfer in food supplies, sells from morning until evening and saves weekly with a VSLA.",
    },
    href: "/blog/murja-eight-years-of-struggle-to-renewed-hope",
  },
  {
    id: "saudatu",
    name: "Saudatu Aliyu, 14",
    place: "Wurno LGA, Sokoto State",
    photo: "saudatu",
    before: { title: "Out of school", text: "Only her eldest sibling had ever attended school; Saudatu spent her days helping at the market." },
    after: {
      title: "Back in class, dreaming of medicine",
      text: "Enrolled through the EU/UNICEF ABEP, she walks to school with her friends. “Ilmi shi ne hasken rayuwa” (Education is the light of life).",
    },
    href: "/blog/saudatu-a-bag-a-dream",
  },
  {
    id: "arajana",
    name: "Arajana Suleiman, 70",
    place: "Batagarawa, Katsina State",
    photo: "arajana",
    before: { title: "Cut off from her farm", text: "Insecurity kept her from her farmland, and she struggled with stress and high blood pressure." },
    after: {
      title: "Purpose and better health",
      text: "At the Gidan Arziki centre she works, earns and learns. “Before, the process was very tedious. Now with the machine, we finish in minutes.”",
    },
    href: "/blog/arajana-finding-purpose-at-70",
  },
  {
    id: "azima",
    name: "Azima Bello",
    place: "Zamfara State",
    photo: "azima",
    before: { title: "A child bride at fifteen", text: "Forced into marriage at fifteen, she returned home broken and without hope." },
    after: {
      title: "A skilled apprentice and saver",
      text: "Through the UNICEF Early Child Marriage project she found a safe space, learned tailoring and is saving for her own sewing machine.",
    },
    href: "/blog/azima-future-stitched-with-hope",
  },
];

export function BeforeAfterSection() {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const story = STORIES[active];
  const photo = LHI_PHOTOS[story.photo];
  const beforePhoto = story.beforePhoto ? LHI_PHOTOS[story.beforePhoto] : null;

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
            <Image key={`after-${story.id}`} src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            <span className="absolute bottom-5 right-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow sm:bottom-7 sm:right-7">
              Now
            </span>

            {/* Before (an earlier photo, or the same photo faded), clipped to the slider position */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} aria-hidden="true">
              {beforePhoto ? (
                <Image key={`before-${story.id}`} src={beforePhoto.src} alt="" fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
              ) : (
                <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover grayscale sepia-[.35] brightness-[.55] contrast-[.9]" />
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
                <p className="mt-1 font-semibold text-foreground">{story.before.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{story.before.text}</p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Now</p>
                <p className="mt-1 font-semibold text-foreground">{story.after.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{story.after.text}</p>
              </div>
            </div>
            <Link href={story.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Read {story.name.split(",")[0]}&apos;s story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
