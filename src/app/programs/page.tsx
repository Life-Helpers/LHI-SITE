import type { Metadata } from "next";
import Link from "next/link";

import { ProgramCard } from "@/components/program-card";
import { programs } from "@/data/programs";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Life Helpers Initiative's six core thematic operational pillars bringing smiles and fulfillment to vulnerable communities across Nigeria.",
};

export default function ProgramsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Our Thematic Pillars"
        title={
          <>
            Interventions Delivering <em className="font-light italic text-primary">Fulfilled Lives.</em>
          </>
        }
        subtitle="Putting a smile on a face across health, education, livelihoods, agriculture, and protection."
        description="Life Helpers Initiative implements integrated multi-sectoral programs across 11 frontline states in Nigeria, breaking cycles of vulnerability and unlocking human potential with dignity and love."
        image={africanFulfillmentImages.programsHero}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Explore All 6 Pillars
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Active and ongoing field programs. Each program links to its
            audited metrics, target states, and on-the-ground operational model.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        {/* Link to Projects & Interventions */}
        <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Impact Portfolio
            </span>
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              Specific Grants &amp; Field Interventions
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              Explore 18+ active and past interventions implemented with institutional donors like MSH, Save the Children, UNICEF, Plan International, and BMZ Germany.
            </p>
          </div>
          <Link
            href="/interventions/projectandintervention"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <span>View All Interventions &rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
