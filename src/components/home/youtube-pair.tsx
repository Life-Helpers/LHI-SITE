"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";

import { SOCIAL_ACCOUNTS, SocialIcon } from "@/components/social-links";

const YOUTUBE = SOCIAL_ACCOUNTS.find((a) => a.name === "YouTube")!;

export interface YoutubeVideo {
  id: string;
  title: string;
  /** Poster image; defaults to YouTube's thumbnail. */
  poster?: string;
}

/** A click-to-play YouTube video: the player and YouTube's scripts only load when a visitor presses play. */
function VideoCard({ label, video }: { label: string; video: YoutubeVideo }) {
  const [playing, setPlaying] = useState(false);
  const poster = video.poster ?? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  return (
    <figure className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full" aria-label={`Play: ${video.title}`}>
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              unoptimized={poster.startsWith("http")}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-[0_0_0_10px_rgba(255,0,0,0.2)] transition-transform duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5 fill-current" aria-hidden="true" />
            </span>
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur">
              {label}
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF0000] text-white">
          <SocialIcon path={YOUTUBE.path} className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">{video.title}</span>
          <span className="block text-xs text-white/60">{YOUTUBE.handle}</span>
        </span>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Watch on YouTube (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}

/** Two videos from the LHI YouTube channel: the newest upload and a recommended one. */
export function YoutubePair({ latest, recommended }: { latest: YoutubeVideo | null; recommended: YoutubeVideo }) {
  return (
    <div className="mt-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 font-serif-display text-3xl font-light text-white">
          <SocialIcon path={YOUTUBE.path} className="h-6 w-6 text-[#FF0000]" /> Watch on YouTube
        </h3>
        <a
          href={YOUTUBE.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#FF0000] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-[#d90000]"
        >
          Subscribe <ExternalLink className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {latest ? (
          <VideoCard label="Latest video" video={latest} />
        ) : (
          <a
            href={YOUTUBE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex aspect-video flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center backdrop-blur transition-colors hover:border-white/30"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF0000] text-white transition-transform group-hover:scale-110">
              <SocialIcon path={YOUTUBE.path} className="h-7 w-7" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">Latest video</span>
            <span className="font-serif-display text-2xl font-light text-white">See our newest uploads on {YOUTUBE.handle}</span>
          </a>
        )}
        <VideoCard label="Recommended" video={recommended} />
      </div>
    </div>
  );
}
