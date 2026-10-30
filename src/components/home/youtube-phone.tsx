"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export interface PhoneVideo {
  id: string;
  title: string;
}

/**
 * LHI's YouTube videos inside the home page phone (used when the Facebook timeline is off). The
 * player and YouTube's scripts only load when a visitor presses play; the list switches videos.
 */
export function YoutubePhone({ videos }: { videos: PhoneVideo[] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const video = videos[current];
  const pick = (i: number) => {
    setCurrent(i);
    setPlaying(true);
  };

  return (
    <div className="flex h-[560px] flex-col bg-white text-neutral-900" data-youtube-phone>
      <div className="relative aspect-video w-full shrink-0 bg-black">
        {playing ? (
          <iframe
            key={video.id}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`Play: ${video.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail */}
            <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg transition-transform group-hover:scale-105">
                <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="line-clamp-2 px-4 pt-3 text-sm font-semibold leading-snug">{video.title}</p>
      {videos.length > 1 && (
        <>
          <p className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">More videos</p>
          <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-4">
            {videos.map((v, i) =>
              i === current ? null : (
                <li key={v.id}>
                  <button type="button" onClick={() => pick(i)} className="flex w-full items-center gap-3 rounded-xl p-1.5 text-left hover:bg-neutral-100">
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail */}
                      <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                      <Play className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-black/70 p-0.5 text-white" aria-hidden="true" />
                    </span>
                    <span className="line-clamp-3 text-xs font-medium leading-snug">{v.title}</span>
                  </button>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
}
