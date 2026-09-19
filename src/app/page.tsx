import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/program-card";
import { programs } from "@/data/programs";

const stats = [
  { label: "States active", value: "11" },
  { label: "Individuals reached", value: "1.5M+" },
  { label: "Households reached", value: "400,000+" },
  { label: "Years of service", value: "20+" },
];

export default function Home() {
  const featuredPrograms = programs.filter((program) => program.featured);

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Life Helpers Initiative &middot; Sokoto, Nigeria
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Health, education, and livelihood programs across Northern
            Nigeria.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Since 2004, LHI has combined development programming, emergency
            humanitarian relief, and disaster risk reduction across 11
            states — touching lives, transforming households, impacting
            communities.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/donate">
                Donate now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/programs">See our programs</Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-border">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="focus-areas-heading"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
      >
        <div className="mb-8 flex flex-col gap-2">
          <h2
            id="focus-areas-heading"
            className="text-2xl font-bold tracking-tight"
          >
            Our Focus Areas
          </h2>
          <p className="max-w-xl text-muted-foreground">
            LHI&apos;s programs are delivered across health, education,
            livelihoods, agriculture, and protection — connected, not
            siloed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            View all programs
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
