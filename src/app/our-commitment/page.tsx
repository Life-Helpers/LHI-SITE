import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Heart,
  Lock,
  Scale,
  ShieldAlert,
  Users,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Our Commitment | Life Helpers Initiative",
  description:
    "Life Helpers Initiative's core values of Love, Honesty, and Inclusion, accompanied by our strict PSEA safeguarding policies, accountability standards, and Disability Fund.",
};

export default function OurCommitmentPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Values &amp; Accountability"
        title={
          <>
            Our Institutional <em className="font-light italic text-primary">Commitment.</em>
          </>
        }
        subtitle="Anchored in Love, Honesty, and Inclusion to bring smiles and fulfilled lives to all."
        description="Life Helpers Initiative operates under an uncompromising moral and ethical code. Everything we do is anchored in our vision of 'A more fulfilled life for everyone' and guided by our founding values of Love, Honesty, and Inclusion, with strict zero-tolerance safeguarding standards."
        image={africanFulfillmentImages.commitmentHero}
      />

      {/* Core Values Triad */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              The Guiding Compass
            </p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              Our Three Core Values
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Heart className="h-7 w-7 fill-primary/20" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Love</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Characterized by a warm and friendly atmosphere, genuine kind gestures, deep empathy, and communal togetherness in every community we enter.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Honesty</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Emphasizing total openness, forthrightness, zero tolerance for deceit, and strictly aligning our words with measurable actions and fiscal truth.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40 hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Inclusion</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ensuring universal access for all marginalized people, tearing down discriminatory barriers, and providing equal opportunities for staff, clients, and partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safeguarding & PSEA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-7 w-7 text-primary" />
              <h3 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
                Protection Against Sexual Exploitation and Abuse (PSEA)
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              LHI enforces an absolute zero-tolerance policy against sexual exploitation, abuse, child labor, and sexual harassment. Every employee, vendor, consultant, and volunteer signs our mandatory Safeguarding Code of Conduct prior to deployment.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>Confidential, survivor-centered reporting channels and legal support.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>Independent internal audit and compliance investigations within 48 hours.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>Mandatory child safeguarding background checks for all field personnel.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>Anonymous community whistleblowing boxes and dedicated helpline.</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${siteConfig.contact.feedbackEmail}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Confidential Safeguarding Report
              </a>
              <span className="text-xs text-muted-foreground">
                Direct to: {siteConfig.contact.feedbackEmail}
              </span>
            </div>
          </div>

          {/* Dedicated Disability Fund */}
          <div className="mt-12 rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="flex items-center gap-3">
              <Scale className="h-7 w-7 text-accent" />
              <h3 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
                The LHI Disability Fund
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Recognizing the disproportionate hurdles faced by Persons Living with Disabilities (PLWD) in emergency and underserved settings, LHI established a dedicated <strong>Disability Fund</strong>. The fund provides direct financial aid, mobility and assistive devices (wheelchairs, crutches, hearing aids, braille slates), and emergency healthcare subsidies to guarantee that no one is left behind.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent/90"
              >
                Support the Disability Fund →
              </Link>
              <Link
                href="/social-inclusion"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
              >
                Learn About Social Inclusion
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
