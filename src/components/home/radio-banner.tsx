"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Radio } from "lucide-react";

import { Eyebrow } from "@/components/eyebrow";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
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
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-medium">
              <CalendarClock className="h-4 w-4" /> Every Tuesday, 11:00 AM – 12:00 PM · Royal FM 101.5
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/radio"
                className="group inline-flex items-center gap-1.5 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:scale-105"
              >
                {episodes.length > 0 ? "All episodes" : t.home.radio.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="pt-12 lg:pt-0">
            <RetroRadio radio={radio} total={episodes.length} />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
