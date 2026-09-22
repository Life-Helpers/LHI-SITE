"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronsLeftRight, Eye, Sparkles } from "lucide-react";

export interface BeforeAfterSliderProps {
  beforeImage: string;
  beforeAlt: string;
  beforeLabel?: string;
  beforeTag?: string;
  afterImage: string;
  afterAlt: string;
  afterLabel?: string;
  afterTag?: string;
  aspectRatio?: "16/9" | "4/3" | "16/10" | "21/9";
  className?: string;
  initialPosition?: number; // 0 to 100
  title?: string;
  caption?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  beforeAlt,
  beforeLabel = "Before",
  beforeTag,
  afterImage,
  afterAlt,
  afterLabel = "After",
  afterTag,
  aspectRatio = "16/10",
  className = "",
  initialPosition = 50,
  title,
  caption,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(Math.round(percentage));
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      setSliderPosition(0);
    } else if (e.key === "End") {
      setSliderPosition(100);
    }
  };

  const aspectClass =
    aspectRatio === "16/9"
      ? "aspect-[16/9]"
      : aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "21/9"
      ? "aspect-[21/9]"
      : "aspect-[16/10]";

  return (
    <div className={`group select-none ${className}`}>
      {/* Title & Preset Controls */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {title && (
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
              {title}
            </h4>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto text-xs">
          <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() => setSliderPosition(0)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
              sliderPosition === 0
                ? "bg-amber-500 text-white shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
            title="View 100% Before"
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(50)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
              sliderPosition === 50
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
            title="Split view 50/50"
          >
            Split 50%
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(100)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
              sliderPosition === 100
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
            title="View 100% After"
          >
            After
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Viewport */}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-2xl border border-border shadow-md cursor-ew-resize bg-muted ${aspectClass}`}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        tabIndex={0}
        role="slider"
        aria-label="Before and after transformation slider"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${sliderPosition}% transformed view`}
        onKeyDown={handleKeyDown}
      >
        {/* Layer 1: BEFORE Image (Full background) */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 1000px, 100vw"
            referrerPolicy="no-referrer"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Layer 2: AFTER Image (Clipped dynamically by slider position) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
          }}
        >
          <Image
            src={afterImage}
            alt={afterAlt}
            fill
            sizes="(min-width: 1024px) 1000px, 100vw"
            referrerPolicy="no-referrer"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* Labels Overlay */}
        {/* Before Badge (Pinned to top-left) */}
        <div
          className="absolute top-4 left-4 z-10 transition-opacity duration-200"
          style={{
            opacity: sliderPosition < 15 ? 0.3 : 1,
          }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold tracking-wider text-amber-300 backdrop-blur-md shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>{beforeLabel}</span>
            {beforeTag && (
              <span className="hidden sm:inline text-[10px] text-white/80 font-normal">
                · {beforeTag}
              </span>
            )}
          </div>
        </div>

        {/* After Badge (Pinned to top-right) */}
        <div
          className="absolute top-4 right-4 z-10 transition-opacity duration-200"
          style={{
            opacity: sliderPosition > 85 ? 0.3 : 1,
          }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-emerald-950/80 px-3 py-1 text-xs font-bold tracking-wider text-emerald-300 backdrop-blur-md shadow-xs">
            <Sparkles size={12} className="text-emerald-400" />
            <span>{afterLabel}</span>
            {afterTag && (
              <span className="hidden sm:inline text-[10px] text-white/80 font-normal">
                · {afterTag}
              </span>
            )}
          </div>
        </div>

        {/* Vertical Divider Line with Draggable Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          style={{
            left: `${sliderPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          {/* Draggable Circle Handle */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-2xl transition-transform ${
              isDragging ? "scale-115 ring-4 ring-primary/40" : "hover:scale-110"
            }`}
          >
            <ChevronsLeftRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>

        {/* Bottom Helper Hint */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-white/90">
          <span className="flex items-center gap-1 drop-shadow-sm font-medium">
            <Eye size={12} />
            <span>Drag slider horizontally or use left/right arrow keys</span>
          </span>
          <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] backdrop-blur-md border border-white/10 font-mono">
            {sliderPosition}%
          </span>
        </div>
      </div>

      {/* Caption or Context Summary */}
      {caption && (
        <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  );
}
