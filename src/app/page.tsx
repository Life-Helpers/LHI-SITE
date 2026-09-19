import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhoWeAreBand } from "@/components/home/who-we-are-band";
import { WhatWeDoTiles } from "@/components/home/what-we-do-tiles";
import { LatestFromLHI } from "@/components/home/latest-from-lhi";
import { RadioBanner } from "@/components/home/radio-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";

const stats = [
  { label: "States active", value: "11" },
  { label: "Individuals reached", value: "1.5M+" },
  { label: "Households reached", value: "400,000+" },
  { label: "Years of service", value: "20+" },
];

export default function Home() {
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

      <WhoWeAreBand />
      <WhatWeDoTiles />
      <LatestFromLHI />
      <RadioBanner />
      <TestimonialsSection />
      <PartnersStrip />
      <PhilosophyQuote />
      <NewsletterSubscribe />
    </main>
  );
}
