import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Program } from "@/types/content";

export function ProgramDetail({ program }: { program: Program }) {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/programs"
          className="mb-6 inline-flex items-center gap-1 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All programs
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {program.region}
          </div>
          {program.status === "completed" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Completed
            </span>
          )}
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {program.name}
        </h1>

        <div className="mt-8 flex flex-col gap-4 text-muted-foreground">
          {program.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border p-4">
            <dt className="text-sm text-muted-foreground">
              {program.metricLabel}
            </dt>
            <dd className="text-xl font-bold text-primary">
              {program.metricValue}
            </dd>
          </div>
          {program.stats.map((stat) => (
            <div key={stat.label} className="rounded-md border border-border p-4">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="text-xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 border-t border-border pt-8">
          <Button asChild size="lg">
            <Link href="/donate">Support this work</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
