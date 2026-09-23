"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Languages, Mic2, Pause, Play, Radio as RadioIcon, Search, Tag, Users } from "lucide-react";

import { RetroRadio } from "@/components/radio/retro-radio";
import { useRadio, type RadioEpisode } from "@/components/radio/use-radio";

const fmtDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function RadioStation({ episodes }: { episodes: RadioEpisode[] }) {
  const radio = useRadio(episodes);
  const [programme, setProgramme] = useState("All");
  const [language, setLanguage] = useState("All");
  const [query, setQuery] = useState("");

  // Open a shared link like /radio#episode-slug on that episode.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const i = episodes.findIndex((e) => e.id === id);
    if (i >= 0) {
      radio.select(i);
      document.getElementById(`episode-${id}`)?.scrollIntoView({ block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes]);

  const programmes = useMemo(() => ["All", ...Array.from(new Set(episodes.map((e) => e.programme)))], [episodes]);
  const languages = useMemo(() => ["All", ...Array.from(new Set(episodes.map((e) => e.language)))], [episodes]);
  const q = query.trim().toLowerCase();
  const visible = episodes
    .map((e, i) => ({ e, i }))
    .filter(
      ({ e }) =>
        (programme === "All" || e.programme === programme) &&
        (language === "All" || e.language === language) &&
        (!q || [e.title, e.summary, ...e.topics, ...e.guests].some((v) => v.toLowerCase().includes(q))),
    );
  const current = radio.current;

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#6d0f13_0%,#2a0a0b_55%,#140606_100%)] pb-20 pt-32 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.5px)", backgroundSize: "20px 20px" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em]">
              <RadioIcon className="h-3.5 w-3.5" /> LHI Radio
            </p>
            <h1 className="mt-4 font-serif-display text-4xl font-light leading-tight sm:text-6xl">
              Voices that <em className="italic text-[#ffb347]">change lives.</em>
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80">
              Listen again to LHI&apos;s radio programmes: health, education, livelihood, agriculture and gender equity, with questions and feedback from
              communities across Sokoto State.
            </p>
            {current ? (
              <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ffb347]">{radio.playing ? "Now playing" : "Selected episode"}</p>
                <h2 className="mt-1 text-xl font-semibold">{current.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-white/75">{current.summary}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70">
                  <li className="inline-flex items-center gap-1"><Mic2 className="h-3.5 w-3.5" /> {current.programme}</li>
                  <li className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {fmtDate(current.date)}</li>
                  <li className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> {current.language}</li>
                  {current.guests.length > 0 && (
                    <li className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {current.guests.join(", ")}</li>
                  )}
                </ul>
              </div>
            ) : (
              <p className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
                Recordings will appear here soon. Meanwhile, tune in live every Tuesday, 11:00 AM – 12:00 PM on Radio Nigeria Royal FM 101.5, Sokoto.
              </p>
            )}
          </div>
          <div className="pt-14 lg:pt-0">
            <RetroRadio radio={radio} total={episodes.length} size="large" />
          </div>
        </div>
      </section>

      <section id="episodes" className="py-16 md:py-20" aria-labelledby="episodes-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Listen again</p>
              <h2 id="episodes-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                Episodes
              </h2>
            </div>
            {episodes.length > 0 && (
              <label className="relative block sm:w-72">
                <span className="sr-only">Search episodes</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics, guests…"
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </label>
            )}
          </div>

          {episodes.length > 0 && (programmes.length > 2 || languages.length > 2) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {programmes.length > 2 &&
                programmes.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProgramme(p)}
                    aria-pressed={programme === p}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${programme === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                  >
                    {p}
                  </button>
                ))}
              {languages.length > 2 && (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Language"
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l === "All" ? "All languages" : l}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {episodes.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center">
              <RadioIcon className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 font-semibold text-foreground">No recordings published yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Episodes uploaded by the LHI team will be listed here.</p>
            </div>
          ) : (
            <ol className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              {visible.map(({ e, i }) => {
                const active = i === radio.index;
                const isPlaying = active && radio.playing;
                return (
                  <li key={e.id} id={`episode-${e.id}`} className={`flex gap-4 p-4 sm:p-5 ${active ? "bg-primary/5" : ""}`}>
                    <button
                      type="button"
                      onClick={() => (active ? radio.toggle() : radio.play(i))}
                      aria-label={isPlaying ? `Pause ${e.title}` : `Play ${e.title}`}
                      className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white ${active ? "bg-primary" : "bg-foreground/80 hover:bg-primary"}`}
                    >
                      {e.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
                      )}
                      <span className="relative">{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}</span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{e.programme}</p>
                      <h3 className={`mt-0.5 font-semibold ${active ? "text-primary" : "text-foreground"}`}>{e.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.summary}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {fmtDate(e.date)}</span>
                        <span className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> {e.language}</span>
                        {e.duration && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.duration}</span>}
                        {e.topics.slice(0, 3).map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5"><Tag className="h-3 w-3" /> {t}</span>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
              {visible.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">No episodes match your search.</li>}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
