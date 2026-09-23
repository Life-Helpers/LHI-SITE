import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Heart, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { NidakeImpactCalculator } from "@/components/nidake/impact-calculator";
import { donateHrefForKits } from "@/data/nidake";
import { getSettings } from "@/lib/cms/content";

export const revalidate = 300;
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "NIDAKE Enterprise | Life Helpers Initiative",
  description:
    "NIDAKE ('Me & You') is LHI's social enterprise producing affordable, reusable, and eco-friendly sanitary pads to eradicate period poverty and empower women.",
};

export default async function NidakePage() {
  const { nidake } = await getSettings();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Social Enterprise & Menstrual Equity"
        title={
          <>
            NIDAKE: <em className="font-light italic text-primary">Me &amp; You.</em>
          </>
        }
        subtitle="Dignity, sustainability, and empowerment putting a smile on every woman and girl."
        description="In Hausa, 'NIDAKE' translates to 'Me & You' — encapsulating our belief that menstrual health is a shared human responsibility. NIDAKE is a mission-driven social enterprise founded by Life Helpers Initiative (LHI) to combat period poverty by producing high-quality, reusable, and eco-friendly sanitary pads while training vulnerable women as vocational producers."
        image={africanFulfillmentImages.nidakeHero}
      />

      {/* 4 Pillars */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Core Design Philosophy
            </p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              The Four Pillars of NIDAKE
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Affordable</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Costs up to 80% less over time than disposable single-use pads, eliminating economic stress for low-income households.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Accessible</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Distributed directly into rural classrooms, IDP camps, and primary healthcare centers where commercial supply chains fail.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Sustainable</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                100% biodegradable, hypoallergenic fabrics that reduce plastic waste and environmental pollution in fragile ecosystems.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Reusable</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Engineered with multi-layer absorbent cores and leak-proof backing, washable, with each kit lasting up to three years.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NidakeImpactCalculator kit={nidake} />

      {/* Dual Impact: Health & Livelihoods */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Keeping Girls in School
              </span>
              <h2 className="font-serif-display text-3xl font-light text-foreground">
                Ending Period Absenteeism
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In many rural northern communities, girls miss 4 to 5 school days every month during their menstruation cycle due to lack of supplies and fear of humiliation.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                By pairing NIDAKE reusable pad kits with Menstrual Hygiene Management (MHM) workshops, LHI has helped over 25,000 adolescent girls maintain continuous school attendance and complete their basic education.
              </p>
              <div className="pt-2 space-y-2 text-xs text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Comprehensive Menstrual Hygiene education in over 180 schools.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Dismantling cultural stigmas and taboos through community dialogues.</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Local Women Enterprise
              </span>
              <h3 className="font-serif-display text-2xl font-light text-foreground">
                Tailoring &amp; Micro-Enterprise
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                NIDAKE pads are not imported. They are manufactured locally by trained vulnerable women, young mothers, and women living with disabilities.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Each artisan is trained in industrial cutting, stitching, quality assurance, and packaging. They earn sustainable living wages that feed their households and fund their children&apos;s schooling.
              </p>
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs text-primary font-medium">
                Over 120 women trained and employed across our tailoring production hubs in Sokoto and Maiduguri.
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-primary/20 bg-muted/40 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-accent fill-accent" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Sponsor a NIDAKE Dignity Kit
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              A single NIDAKE kit provides a girl with washable pads, sanitary soap, and an underwear pack: {nidake.yearsOfDignity} years of menstrual dignity and around {nidake.schoolDaysSaved} school days she no longer misses.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={donateHrefForKits(1, nidake.costUsd)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Donate a Dignity Kit →
              </Link>
              <Link
                href="/education"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                Explore Education Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
