import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, Sparkles } from "lucide-react";

import { BlogFeed } from "@/components/blog/blog-feed";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { MAGAZINE_PDF } from "@/data/magazine-stories";
import { getPublishedPosts } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Success Stories | Life Helpers Initiative",
  description:
    "Real stories of change from LHI's projects: farmers, women entrepreneurs and VSLA groups in Sokoto and Katsina, from the Cultivating Resilience magazine.",
};

export default async function SuccessStoriesPage() {
  const stories = await getPublishedPosts("Success Stories");
  const magazine = (await getPublishedPosts("Magazine"))[0];

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Real People, Real Impact"
        title={
          <>
            Stories of <em className="font-light italic text-primary">Fulfilled Smiles.</em>
          </>
        }
        subtitle="Putting a smile on a face: touching lives, transforming households, impacting communities."
        description="Behind every statistic is a human face. These are the voices of the farmers, mothers and entrepreneurs our projects serve, in their own words."
        image={africanFulfillmentImages.successStoriesHero}
      />

      {magazine && (
        <section className="border-b border-border bg-muted/20 py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border md:col-span-2">
              <Image src={LHI_PHOTOS.farmerWomanHarvest.src} alt={LHI_PHOTOS.farmerWomanHarvest.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover" />
            </div>
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Project Magazine · Vol. 1</p>
              <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">{magazine.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{magazine.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/blog/${magazine.slug}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                  Read the feature
                </Link>
                <a href={MAGAZINE_PDF} download className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card">
                  <Download className="h-4 w-4" /> Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <BlogFeed posts={stories} />

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 fill-primary/20 text-primary" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">Help Us Write the Next Story</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Your support helps families like these move from vulnerability to stability and growth.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/donate" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                Donate Today →
              </Link>
              <Link href="/get-involved" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card">
                Volunteer or Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
