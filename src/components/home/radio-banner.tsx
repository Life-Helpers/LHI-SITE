"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Radio, Tv } from "lucide-react";

import { Eyebrow } from "@/components/eyebrow";
import { RADIO_PROGRAMMES, TV_PROGRAMMES } from "@/data/broadcasts";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TiltCard } from "@/components/effects/tilt-card";
import { RetroRadio } from "@/components/radio/retro-radio";
import { useRadio, type RadioEpisode } from "@/components/radio/use-radio";
import { useLocale } from "@/i18n/locale-context";

export function RadioBanner({ episodes }: { episodes: RadioEpisode[] }) {
  const { t } = useLocale();
  const radio = useRadio(episodes);

  return (
    <section aria-labelledby="radio-heading" className="relative overflow-hidden border-t border-border/60 bg-gradient-to-br from-primary to-accent">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.5px)", backgroundSize: "18px 18px" }}
        aria-hidden="true"
      />
      <ScrollReveal>
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="text-primary-foreground">
            <div className="flex items-center gap-3">
              <Radio className="h-7 w-7" aria-hidden="true" />
              <Eyebrow className="text-primary-foreground">{t.home.radio.eyebrow}</Eyebrow>
            </div>
            <h2 id="radio-heading" className="font-serif-display mt-3 text-3xl font-light sm:text-4xl">
              {t.home.radio.heading}
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/90">{t.home.radio.body}</p>
            <ul className="mt-5 space-y-2">
              {RADIO_PROGRAMMES.map((p) => (
                <li key={p.id} className="flex items-start gap-2 rounded-2xl bg-black/20 px-4 py-2 text-sm">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">{p.name}{p.alias ? ` (${p.alias})` : ""}</span> · {p.schedule} · {p.station}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-2 rounded-2xl bg-black/20 px-4 py-2 text-sm">
                <Tv className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">On TV:</span> {TV_PROGRAMMES.map((tv) => `${tv.name} (${tv.project}) on NTA`).join(", ")}
                </span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/radio"
                className="group inline-flex items-center gap-1.5 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:scale-105"
              >
                {episodes.length > 0 ? "Episodes, radio & TV" : t.home.radio.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="pt-12 lg:pt-0">
            <TiltCard>
              <RetroRadio radio={radio} total={episodes.length} />
            </TiltCard>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
