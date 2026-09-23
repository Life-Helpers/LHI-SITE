import type { Metadata } from "next";

import { EmergencyCard } from "@/components/emergency-card";
import { emergencies } from "@/data/emergencies";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Emergencies",
  description:
    "Active and past crisis responses coordinated by Life Helpers Initiative bringing relief, dignity, and smiles in challenging times.",
};

export default function EmergenciesPage() {
  const active = emergencies.filter((e) => e.status === "active");
  const resolved = emergencies.filter((e) => e.status === "resolved");

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Rapid Humanitarian Response"
        title={
          <>
            Emergency Relief &amp; <em className="font-light italic text-primary">Restoration.</em>
          </>
        }
        subtitle="Restoring dignity and bringing smiles back to displaced and crisis-affected families."
        description="Life Helpers Initiative deploys rapid multi-sectoral emergency assistance within 48 hours of crisis declarations. From cholera outbreaks to flood displacements and armed conflict response, our rapid teams provide lifesaving water, medical supplies, child-friendly spaces, and unconditional cash transfers."
        image={africanFulfillmentImages.emergenciesHero}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Crisis Declarations &amp; Deployments
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Crisis declarations that trigger a coordinated field response,
            from initial rapid assessment through community stabilization and resolution.
          </p>
        </div>

        {active.length > 0 && (
          <section aria-labelledby="active-heading" className="mb-12">
            <h2 id="active-heading" className="mb-4 text-xl font-semibold">
              Active
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((emergency) => (
                <EmergencyCard key={emergency.id} emergency={emergency} />
              ))}
            </div>
          </section>
        )}

        {resolved.length > 0 && (
          <section aria-labelledby="resolved-heading">
            <h2 id="resolved-heading" className="mb-4 text-xl font-semibold">
              Resolved
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resolved.map((emergency) => (
                <EmergencyCard key={emergency.id} emergency={emergency} />
              ))}
            </div>
          </section>
        )}

        {emergencies.length === 0 && (
          <p className="text-muted-foreground">
            There are no declared emergencies at this time.
          </p>
        )}
      </div>
    </main>
  );
}
