import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { RoadmapTimeline } from "@/components/history/roadmap-timeline";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { HISTORY_MILESTONES } from "@/data/history-timeline";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  alternates: { canonical: "/our-history" },
  title: "Our History",
  description:
    "The journey of Life Helpers Initiative: from the Beulah Project in 2004 to a national humanitarian and development organization operating across 11 states in Nigeria.",
};

export default function OurHistoryPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Our Journey (2004 – Present)"
        title={
          <>
            Two decades of <em className="font-light italic text-primary">compassionate impact.</em>
          </>
        }
        subtitle="Putting smiles on faces across Nigeria for over 20 years."
        description="What began on October 1, 2004 as the Beulah Project, supporting children at an orphanage in Sokoto, has matured into a premier national NGO delivering lifesaving relief, sustainable healthcare, education, and economic empowerment across 11 Nigerian states."
        image={africanFulfillmentImages.historyHero}
      />

      {/* Core Numbers */}
      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">2004</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Founding Year</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">11</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Operational States</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">350+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Full-time Staff</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">20+ Yrs</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Grassroots Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Road map of milestones */}
      <section aria-labelledby="journey-heading" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— The road so far</p>
            <h2 id="journey-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              Our journey, <em className="font-light italic text-primary">one milestone at a time.</em>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              From a passion project in Sokoto to a national organisation in 11 states. Archive photos are dated by the banners and captions in them.
            </p>
          </div>
          <RoadmapTimeline milestones={HISTORY_MILESTONES} />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-accent fill-accent" />
            <h2 className="mt-4 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              &ldquo;Putting a smile on a face&rdquo;
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Touching lives, transforming households, and impacting communities.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/our-strategies"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Our Strategic Approach →
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
