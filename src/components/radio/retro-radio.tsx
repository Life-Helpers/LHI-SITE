"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, Radio as RadioIcon, SkipBack, SkipForward } from "lucide-react";

import { formatTime, nextBroadcast, type useRadio } from "@/components/radio/use-radio";

type Radio = ReturnType<typeof useRadio>;

/** Knob you can drag (up/right = louder), scroll, or use with arrow keys. */
function VolumeKnob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const start = useRef<{ y: number; x: number; v: number } | null>(null);
  const angle = -135 + value * 270;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        role="slider"
        tabIndex={0}
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(value + 0.05);
          if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(value - 0.05);
        }}
        onWheel={(e) => onChange(value - Math.sign(e.deltaY) * 0.05)}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          start.current = { y: e.clientY, x: e.clientX, v: value };
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          const d = (start.current.y - e.clientY + (e.clientX - start.current.x)) / 150;
          onChange(start.current.v + d);
        }}
        onPointerUp={() => (start.current = null)}
        className="relative h-14 w-14 cursor-grab touch-none rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4e3c6,#b8925c_60%,#6b4e2a)] shadow-[inset_0_-3px_6px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:cursor-grabbing"
      >
        <span className="absolute inset-1.5 rounded-full border border-black/20" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="absolute left-1/2 top-0.5 h-3 w-1 -translate-x-1/2 rounded-full bg-[#3a2410]" />
        </span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#f4e3c6]/70">Volume</span>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  if (!now) return null;
  const { live, start } = nextBroadcast(now);
  if (live) return <span className="text-emerald-300">On air now · Royal FM 101.5</span>;
  const mins = Math.max(0, Math.round((start.getTime() - now.getTime()) / 60000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return (
    <span>
      Next live show in {d > 0 ? `${d}d ` : ""}
      {h}h {m}m · Tue 11:00
    </span>
  );
}

/**
 * Vintage tabletop radio: speaker grille that pulses while playing, tuning dial whose needle
 * moves across episodes, an amber display, transport buttons and a volume knob.
 */
export function RetroRadio({ radio, total, size = "compact" }: { radio: Radio; total: number; size?: "compact" | "large" }) {
  const { current, playing, loading, time, duration, index } = radio;
  const progress = duration ? (time / duration) * 100 : 0;
  const needle = total > 1 ? 8 + (index / (total - 1)) * 84 : 50;
  const large = size === "large";

  return (
    <div className={`relative mx-auto w-full ${large ? "max-w-3xl" : "max-w-xl"}`}>
      {/* Antenna */}
      <div className="pointer-events-none absolute -top-16 right-10 h-20 w-1 origin-bottom rotate-[28deg] rounded-full bg-gradient-to-t from-zinc-500 to-zinc-200" aria-hidden="true">
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-300" />
      </div>

      <div className="relative rounded-[2rem] bg-[linear-gradient(160deg,#9b1b1f,#6d0f13_55%,#4a090c)] p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.15)] sm:p-4">
        <div className="rounded-[1.5rem] border border-black/30 bg-[linear-gradient(180deg,#2a1a12,#1b100b)] p-4 sm:p-5">
          <div className={`grid gap-4 ${large ? "sm:grid-cols-[1fr_1.35fr]" : "sm:grid-cols-[1fr_1.4fr]"}`}>
            {/* Speaker grille */}
            <div className="relative hidden overflow-hidden rounded-2xl bg-[#140b07] p-3 sm:block">
              <div
                className={`h-full min-h-32 w-full rounded-xl ${playing ? "radio-grille-playing" : ""}`}
                style={{
                  backgroundImage: "radial-gradient(circle, #6b4a2c 1.6px, transparent 1.8px)",
                  backgroundSize: "9px 9px",
                }}
                aria-hidden="true"
              />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#140b07] px-2 font-serif-display text-sm italic text-[#e9c98f]/80">Life Helpers</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Tuning dial */}
              <div className="relative h-10 overflow-hidden rounded-lg bg-[linear-gradient(180deg,#f7e6c4,#e6c88e)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]" aria-hidden="true">
                <div className="absolute inset-x-3 top-1.5 flex justify-between font-mono text-[9px] font-bold text-[#5a3b18]">
                  {[88, 92, 96, 100, 104, 108].map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
                <div className="absolute inset-x-3 bottom-1.5 h-2 bg-[repeating-linear-gradient(90deg,#5a3b18_0_1px,transparent_1px_6px)] opacity-70" />
                <div className="absolute inset-y-0 w-0.5 bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.8)] transition-[left] duration-700" style={{ left: `${needle}%` }} />
              </div>

              {/* Display */}
              <div className="rounded-lg border border-black/40 bg-[#0d1a0f] px-3 py-2 font-mono text-[#ffb347] shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-red-950"}`} />
                    {playing ? "On air" : "Stand by"}
                  </span>
                  <span className="truncate pl-2 text-[#ffb347]/70">{current?.programme ?? "WeSpeak (Muyi Magana)"}</span>
                </div>
                <div className="radio-marquee mt-1 overflow-hidden whitespace-nowrap text-sm" title={current?.title}>
                  <span className={current && current.title.length > 34 ? "radio-marquee-text" : ""}>{current ? current.title : "Recordings coming soon"}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#ffb347]/70">
                  <span>
                    {formatTime(time)} / {duration ? formatTime(duration) : current?.duration || "--:--"}
                  </span>
                  {playing ? (
                    <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((b) => (
                        <span key={b} className="radio-eq-bar w-1 bg-[#ffb347]" style={{ animationDelay: `${b * 0.12}s` }} />
                      ))}
                    </span>
                  ) : (
                    <Countdown />
                  )}
                </div>
                {/* Progress / seek */}
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={1}
                  value={Math.min(time, duration || 0)}
                  onChange={(e) => radio.seek(Number(e.target.value))}
                  disabled={!duration}
                  aria-label="Seek"
                  className="radio-seek mt-2 w-full"
                  style={{ ["--p" as string]: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={radio.prev}
                    disabled={!current}
                    aria-label="Previous episode"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a2416] text-[#f4e3c6] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] hover:bg-[#4a2f1d] disabled:opacity-40"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={radio.toggle}
                    disabled={!current}
                    aria-label={playing ? "Pause" : "Play"}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff5a5f,#d11a20_60%,#8e0c10)] text-white shadow-[0_6px_14px_rgba(0,0,0,0.5),inset_0_-3px_0_rgba(0,0,0,0.3)] transition-transform hover:scale-105 disabled:opacity-40"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
                  </button>
                  <button
                    type="button"
                    onClick={radio.next}
                    disabled={total < 2}
                    aria-label="Next episode"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a2416] text-[#f4e3c6] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] hover:bg-[#4a2f1d] disabled:opacity-40"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
                <VolumeKnob value={radio.volume} onChange={radio.setVolume} />
              </div>
              {radio.error && <p className="text-xs text-red-300">{radio.error}</p>}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4d9a8]/80">
          <span className="flex items-center gap-1.5">
            <RadioIcon className="h-3.5 w-3.5" /> Voices of the People
          </span>
          <span>{total > 0 ? `Episode ${index + 1} of ${total}` : "Royal FM 101.5"}</span>
        </div>
      </div>
      {/* Feet */}
      <div className="mx-auto flex max-w-[80%] justify-between" aria-hidden="true">
        <span className="h-2 w-10 rounded-b-lg bg-[#3a0a0c]" />
        <span className="h-2 w-10 rounded-b-lg bg-[#3a0a0c]" />
      </div>
    </div>
  );
}
