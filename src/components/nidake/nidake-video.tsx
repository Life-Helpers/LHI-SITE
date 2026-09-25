"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";


const VIDEO_ID = "45HZKC19AxY";
const POSTER = { src: "/images/lhi/nidake-poster.jpg" };

/** Click-to-play YouTube video: the player (and YouTube's scripts) only load when a visitor presses play. */
export function NidakeVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section aria-labelledby="nidake-video-heading" className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Watch</p>
          <h2 id="nidake-video-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            NIDAKE <em className="font-light italic text-primary">on video.</em>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">See NIDAKE reusable sanitary pads and the women and girls they serve.</p>
        </div>

        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-3xl border border-border bg-black shadow-xl">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title="NIDAKE video"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label="Play the NIDAKE video">
              {/* The NIDAKE poster fills the 16:9 frame. */}
              <Image
                src={POSTER.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute bottom-5 left-5 flex h-16 w-16 sm:bottom-8 sm:left-8 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl ring-8 ring-white/20 transition-transform group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-primary hover:underline">
            Watch on YouTube
          </a>
        </p>
      </div>
    </section>
  );
}
