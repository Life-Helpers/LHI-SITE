import type { Metadata } from "next";

import { EmergencyCard } from "@/components/emergency-card";
import { emergencies } from "@/data/emergencies";

export const metadata: Metadata = {
  title: "Emergencies",
  description:
    "Active and past crisis responses coordinated by Life Helpers Initiative.",
};

export default function EmergenciesPage() {
  const active = emergencies.filter((e) => e.status === "active");
  const resolved = emergencies.filter((e) => e.status === "resolved");

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Emergencies</h1>
          <p className="max-w-2xl text-muted-foreground">
            Crisis declarations that trigger a coordinated field response,
            from initial deployment through resolution.
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
