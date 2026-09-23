"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

import type { FulfillmentImage } from "@/data/african-fulfillment-images";
import { isUnoptimized } from "@/lib/image";

interface FieldGalleryProps {
  images: FulfillmentImage[];
  youtubeId?: string;
  title: string;
}

export function FieldGallery({ images, youtubeId, title }: FieldGalleryProps) {
  const slideCount = images.length + (youtubeId ? 1 : 0);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + slideCount) % slideCount),
    [slideCount],
  );

  if (slideCount === 0) return null;

  const isVideo = youtubeId && index === images.length;
  const current = images[index];

  return (
    <div
      className="rounded-3xl border border-border bg-card p-2 shadow-sm"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} field gallery`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
        {isVideo ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title={`${title} field video`}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <Image
              key={current.src}
              src={current.src}
              unoptimized={isUnoptimized(current.src)}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 800px, 100vw"
              referrerPolicy="no-referrer"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12">
              <p className="text-xs text-white/90 sm:text-sm">{current.caption}</p>
            </div>
          </>
        )}

        {slideCount > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 text-foreground shadow backdrop-blur hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 text-foreground shadow backdrop-blur hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] text-white">
              {index + 1} / {slideCount}
            </span>
          </>
        )}
      </div>

      {slideCount > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto p-1">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" unoptimized={isUnoptimized(img.src)} referrerPolicy="no-referrer" className="object-cover" />
            </button>
          ))}
          {youtubeId && (
            <button
              type="button"
              onClick={() => setIndex(images.length)}
              aria-label="Play field video"
              aria-current={isVideo ? true : undefined}
              className={`flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border-2 bg-muted transition ${
                isVideo ? "border-primary" : "border-transparent"
              }`}
            >
              <PlayCircle className="h-6 w-6 text-primary" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
