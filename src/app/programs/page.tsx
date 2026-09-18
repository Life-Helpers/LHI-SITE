import type { Metadata } from "next";

import { ProgramCard } from "@/components/program-card";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Field programs currently run by Life Helpers Initiative, organized by region.",
};

export default function ProgramsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="max-w-2xl text-muted-foreground">
            Active and completed field programs. Each program links to its
            audited metrics and a summary of how it operates.
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
