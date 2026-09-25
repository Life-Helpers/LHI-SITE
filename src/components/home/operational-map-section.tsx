import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ParallaxBackground } from "@/components/effects/parallax-background";
import { OperationalMap } from "@/components/operational-map";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { toMapProjects } from "@/data/operational-states";
import { getInterventions, getStates } from "@/lib/cms/content";

export async function OperationalMapSection() {
  const [states, interventions] = await Promise.all([
    getStates(),
    getInterventions(),
  ]);
  return (
    <ParallaxBackground
      src={LHI_PHOTOS.partnersLogoWall.src}
      opacity={0.35} mouse
      className="border-y border-border bg-background"
    >
      <section
        aria-labelledby="operational-map-heading"
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl rounded-3xl border border-white/60 bg-white/85 p-6 shadow-xl backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-black/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                — Where we work
              </p>
              <h2
                id="operational-map-heading"
                className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl"
              >
                Our operational{" "}
                <em className="italic text-primary">footprint.</em>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Explore the 11 frontline states where LHI delivers health,
                education, protection, livelihood and food-security programmes.
                Select a state to see the interventions, donor partners and
                reach on the ground.
              </p>
            </div>
            <Link
              href="/interventions/projectandintervention"
              className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/85 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground backdrop-blur hover:bg-card md:self-auto"
            >
              All interventions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <OperationalMap
            glass
            states={states}
            interventions={toMapProjects(interventions)}
          />
        </div>
      </section>
    </ParallaxBackground>
  );
}
