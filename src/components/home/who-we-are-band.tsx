"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, HeartHandshake, Target } from "lucide-react";

import { Eyebrow } from "@/components/eyebrow";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

interface Panel {
  id: string;
  label: string;
  word: string;
  icon: React.ElementType;
  className: string;
  body: React.ReactNode;
}

/**
 * Vision / Mission / Values as expanding cards: the active card opens wide with its
 * statement, the others collapse to narrow strips with a vertical label.
 */
export function WhoWeAreBand() {
  const { t } = useLocale();
  const w = t.home.whoWeAre;
  const [active, setActive] = useState(0);

  const panels: Panel[] = [
    {
      id: "vision",
      label: w.visionTitle,
      word: "Vision",
      icon: Eye,
      className: "bg-primary text-primary-foreground",
      body: <p className="font-serif-display text-2xl font-light leading-snug sm:text-4xl">{w.visionBody}</p>,
    },
    {
      id: "mission",
      label: w.missionTitle,
      word: "Mission",
      icon: Target,
      className: "bg-accent text-white",
      body: <p className="font-serif-display text-xl font-light leading-snug sm:text-3xl">{w.missionBody}</p>,
    },
    {
      id: "values",
      label: w.valuesTitle,
      word: "Values",
      icon: HeartHandshake,
      className: "bg-[#7d0c10] text-white dark:bg-[#5c090c]",
      body: (
        <ul className="grid gap-3 sm:grid-cols-3">
          {w.values.map((value) => {
            const [name, ...rest] = value.split(/\s[—–-]\s/);
            return (
              <li key={value} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-serif-display text-2xl">{name.trim()}</p>
                {rest.length > 0 && <p className="mt-1 text-sm leading-relaxed text-white/85">{rest.join(" — ").trim()}</p>}
              </li>
            );
          })}
        </ul>
      ),
    },
  ];

  return (
    <section aria-labelledby="who-we-are-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal className="mb-8 flex flex-col gap-2">
        <Eyebrow>{w.eyebrow}</Eyebrow>
        <h2 id="who-we-are-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
          {w.heading}
        </h2>
        <p className="max-w-2xl text-muted-foreground">{w.body}</p>
      </ScrollReveal>

      <div className="flex h-[640px] flex-col gap-2 md:h-[440px] md:flex-row">
        {panels.map((panel, i) => {
          const isActive = i === active;
          const Icon = panel.icon;
          return (
            <div
              key={panel.id}
              id={`who-panel-${panel.id}`}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={panel.label}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const next = (i + 1) % panels.length;
                  setActive(next);
                  document.getElementById(`who-panel-${panels[next].id}`)?.focus();
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const prev = (i - 1 + panels.length) % panels.length;
                  setActive(prev);
                  document.getElementById(`who-panel-${panels[prev].id}`)?.focus();
                }
              }}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-4 focus-visible:ring-ring motion-reduce:transition-none ${panel.className} ${
                isActive ? "grow-[6]" : "grow"
              } basis-0 min-h-16 md:min-w-20`}
            >
              {/* Decorative oversized icon */}
              <Icon
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 opacity-[0.08] transition-opacity duration-500 ${
                  isActive ? "opacity-[0.12]" : ""
                }`}
              />

              <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              {/* Collapsed label */}
              <span
                aria-hidden="true"
                className={`absolute font-extrabold uppercase tracking-[0.2em] transition-opacity duration-300 ${
                  isActive ? "opacity-0" : "opacity-100"
                } left-20 top-1/2 -translate-y-1/2 text-lg md:left-1/2 md:top-auto md:bottom-10 md:-translate-x-1/2 md:translate-y-0 md:text-xl md:[writing-mode:vertical-rl] md:rotate-180`}
              >
                {panel.word}
              </span>

              {/* Expanded content */}
              <div
                className={`absolute inset-0 flex flex-col justify-end gap-5 p-6 transition-all duration-500 sm:p-10 ${
                  isActive ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">{panel.label}</p>
                <h3 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">{panel.word}</h3>
                <div className="max-w-3xl">{panel.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/about"
        className="mt-6 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {w.moreAboutLhi}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}
