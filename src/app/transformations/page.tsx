import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { BeforeAfterGallery } from "@/components/transformations/before-after-gallery";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Before & After Visual Transformations | Life Helpers Initiative",
  description:
    "Interactive comparison sliders showing community transformations across Nigeria: dry-season irrigated farmland vs. barren land, solar boreholes, upgraded clinics, and learning centers.",
  keywords: [
    "Before and after sliders",
    "community transformation Nigeria",
    "solar borehole rehabilitation",
    "dry season irrigation Jere Borno",
    "maternal health clinic upgrade Sokoto",
  ],
};

export default function TransformationsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Visual Proof of Progress"
        title={
          <>
            Community <em className="font-light italic text-primary">Transformations.</em>
          </>
        }
        subtitle="Before & After: Tangible evidence of lives touched, households transformed, and communities impacted."
        description="See the visible contrast of sustainable humanitarian interventions. Use our interactive comparison sliders to examine real community transformation across agriculture, clean water, healthcare, and education."
        image={africanFulfillmentImages.impactHero}
      />

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BeforeAfterGallery showHeading={false} />
        </div>
      </section>

      <section className="border-t border-border bg-card py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Want to Transform Another Community?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground">
            Partner with Life Helpers Initiative to bring solar water, climate-smart irrigation, and medical care to vulnerable rural wards.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <span>Donate Now</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/interventions/projectandintervention"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
            >
              <Layers size={14} />
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
