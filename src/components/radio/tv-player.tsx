"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Play, Tv } from "lucide-react";

import type { TvProgramme } from "@/data/broadcasts";

/** A TV programme recording from YouTube. The player (and YouTube's scripts) only load on play. */
export function TvPlayer({ programme }: { programme: TvProgramme }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${programme.youtubeId}?autoplay=1&rel=0`}
            title={`${programme.project}: ${programme.name} (${programme.channel})`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play ${programme.name}`}>
            <Image
              src={`https://i.ytimg.com/vi/${programme.youtubeId}/hqdefault.jpg`}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 720px, 100vw"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_10px_rgba(220,38,38,0.25)] transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5 fill-current" aria-hidden="true" />
            </span>
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
              <Tv className="h-3.5 w-3.5" aria-hidden="true" /> {programme.channel.split(" ")[0]} TV
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 p-5">
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{programme.project}</span>
          <span className="block font-serif-display text-2xl font-light text-foreground">{programme.name}</span>
          <span className="block text-xs text-muted-foreground">
            {programme.channel} · {programme.partners}
          </span>
        </span>
        <a href={programme.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          Watch on YouTube <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
