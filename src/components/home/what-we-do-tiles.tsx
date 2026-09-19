import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { whatWeDoCards } from "@/components/nav-data";

export function WhatWeDoTiles() {
  return (
    <section
      aria-labelledby="what-we-do-heading"
      className="border-t border-border bg-muted/40"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h2
            id="what-we-do-heading"
            className="text-2xl font-bold tracking-tight"
          >
            What We Do
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Six connected focus areas, delivered across 11 states.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whatWeDoCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-center gap-4 rounded-md border border-border bg-card p-4 hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
                <card.icon
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="font-semibold group-hover:text-primary">
                  {card.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/programs"
          className="mt-6 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          View all programs
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
