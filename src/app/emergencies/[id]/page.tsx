import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/program-card";
import { emergencies } from "@/data/emergencies";
import { programs } from "@/data/programs";

function getEmergency(id: string) {
  return emergencies.find((emergency) => emergency.id === id);
}

export function generateStaticParams() {
  return emergencies.map((emergency) => ({ id: emergency.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const emergency = getEmergency(id);
  if (!emergency) return {};
  return {
    title: emergency.title,
    description: emergency.summary,
    alternates: { canonical: `/emergencies/${id}` },
  };
}

export default async function EmergencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const emergency = getEmergency(id);
  if (!emergency) notFound();

  const relatedPrograms = programs.filter((program) =>
    emergency.relatedProgramIds.includes(program.id),
  );

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/emergencies"
          className="mb-6 inline-flex items-center gap-1 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All emergencies
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {emergency.region}
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              emergency.status === "active"
                ? "bg-alert text-alert-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {emergency.status === "active" ? "Active" : "Resolved"}
          </span>
        </div>

        <h1 className="font-serif-display mt-2 text-3xl font-light sm:text-4xl">
          {emergency.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Declared {emergency.declaredAt}
        </p>

        <div className="mt-8 flex flex-col gap-4 text-muted-foreground">
          {emergency.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {emergency.stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {emergency.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-border p-4"
              >
                <dt className="text-sm text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="text-xl font-bold text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 border-t border-border pt-8">
          <Button asChild size="lg">
            <Link href="/donate">Support this response</Link>
          </Button>
        </div>

        {relatedPrograms.length > 0 && (
          <section aria-labelledby="related-programs-heading" className="mt-14">
            <h2
              id="related-programs-heading"
              className="mb-4 text-xl font-semibold"
            >
              Responding programs
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
