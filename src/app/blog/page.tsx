import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { BlogFeed } from "@/components/blog/blog-feed";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { getPublishedPosts } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "LHI Field Blog",
  description:
    "Field reflections, humanitarian insights, and development research authored by Life Helpers Initiative technical advisors and community practitioners.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Practitioner Insights & Field Dispatch"
        title={
          <>
            LHI <em className="font-light italic text-primary">Field Blog.</em>
          </>
        }
        subtitle="Stories of transformation, resilience, and fulfilled smiles from frontline communities."
        description="Read critical perspectives, operational lessons, and evidence-based field analyses directly from our frontline humanitarian specialists and community health champions across Nigeria."
        image={africanFulfillmentImages.blogHero}
      />

      {/* Blog Posts Grid with Dynamic CMS Integration */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <BlogFeed posts={posts} />

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <BookOpen className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Contribute or Inquire About Research
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Are you an academic researcher, monitoring specialist, or development partner interested in collaborating on field research?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Contact Research Team
              </Link>
              <Link
                href="/interventions/projectandintervention"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                All Projects &amp; Interventions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
