import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featuredPrograms } from "@/data/programs";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Life Helpers Initiative
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Rapid crisis response, delivered where it&apos;s needed most.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            We mobilize field teams, medical care, and emergency supplies for
            communities facing humanitarian crises — and report our impact
            openly.
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
      </section>

      <section
        aria-labelledby="impact-heading"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
      >
        <div className="mb-8 flex flex-col gap-2">
          <h2 id="impact-heading" className="text-2xl font-bold tracking-tight">
            Program impact
          </h2>
          <p className="max-w-xl text-muted-foreground">
            A snapshot of field programs currently reaching communities in
            need. Full figures are published in our audited impact reports.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {program.region}
                </div>
                <CardTitle>{program.name}</CardTitle>
                <CardDescription>{program.summary}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-2xl font-bold text-primary">
                  {program.metricValue}
                </p>
                <p className="text-sm text-muted-foreground">
                  {program.metricLabel}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={program.href}
                  className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
