import type { Metadata } from "next";

import { ProgramCard } from "@/components/program-card";
import { programs } from "@/data/programs";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Programs | Life Helpers Initiative",
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
          <h2 className="font-serif-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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
      </div>
    </main>
  );
}
