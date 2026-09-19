import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Heart, Lock, Users } from "lucide-react";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "About Us | Life Helpers Initiative",
  description:
    "Learn about Life Helpers Initiative (LHI) — our history since 2004, mission, vision, core values of Love, Honesty, and Inclusion, and operations across 11 states in Nigeria.",
};

const partners = [
  "UNICEF Nigeria",
  "Plan International",
  "ActionAid Nigeria",
  "Nigeria Humanitarian Fund (NHF / UN OCHA)",
  "BMZ (German Federal Ministry for Economic Cooperation and Development)",
  "KfW Development Bank",
  "Global Affairs Canada",
  "Federal Ministry of Health (FMOH)",
  "State Primary Healthcare Development Agencies (SPHCDA)",
  "Child Protection Area of Responsibility (CP AoR)",
];

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Who We Are"
        title={
          <>
            About Life Helpers <em className="font-light italic text-primary">Initiative.</em>
          </>
        }
        subtitle="&ldquo;Putting a smile on a face&rdquo; — touching lives, transforming households, impacting communities."
        description="Life Helpers Initiative (LHI) is an indigenous, non-governmental, and not-for-profit humanitarian and development organization established in 2004 in Sokoto State, Nigeria. We work tirelessly to maximize opportunities that empower marginalized populations across 11 frontline states."
        image={africanFulfillmentImages.aboutHero}
      />

      {/* Vision & Mission Banner */}
      <section className="border-b border-border bg-background py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Our Vision
              </span>
              <p className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
                &ldquo;{siteConfig.vision}&rdquo;
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A world where every vulnerable child, woman, and youth enjoys dignity, universal protection, and equitable access to healthcare, education, and sustainable livelihoods.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Our Mission
              </span>
              <p className="mt-3 font-serif-display text-xl font-light text-foreground sm:text-2xl">
                &ldquo;{siteConfig.mission}&rdquo;
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Delivering community-anchored humanitarian relief, resilient primary healthcare, child protection, girl-child schooling, and climate-smart livelihoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Organizational DNA
            </p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              Our Three Core Values
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Heart className="h-7 w-7 fill-primary/20" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Love</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Reflected in a warm, welcoming environment, sincere kind gestures, empathy for the vulnerable, and harmonious togetherness.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Honesty</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Practicing absolute openness, forthrightness, and guaranteeing that our words perfectly match our actions and fiscal stewardship.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Inclusion</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Guaranteeing universal access for all marginalized groups, championing disability access through our Disability Fund, and equal opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Footprint */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                Origin & Growth
              </p>
              <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">
                From Beulah Projects in 2004 to a National Leader
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Life Helpers Initiative originated on October 1, 2004 as Beulah Projects, assisting orphans and vulnerable children in Sokoto through inclusive funfairs and emotional safe spaces. In 2006, expanding community health and education emergencies required structural formalization.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                In September 2007, the organization was formally registered with Nigeria&apos;s Corporate Affairs Commission ({siteConfig.cacRegistration}). Since then, LHI has strategically expanded into Kebbi (2013), Zamfara (2015), Borno, Yobe, and Adamawa (2017), Bauchi (2020), Ebonyi and Abuja (2021), Plateau (2022), and Katsina (2023).
              </p>
              <div className="mt-6">
                <Link
                  href="/our-history"
                  className="inline-flex items-center gap-2 font-medium text-primary hover:underline text-sm"
                >
                  Read our full chronological history →
                </Link>
              </div>

              {/* Heritage Image */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted/40 p-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={africanFulfillmentImages.aboutHeritage.src}
                    alt={africanFulfillmentImages.aboutHeritage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <p className="text-[11px] font-medium text-white/95 leading-tight">
                      &ldquo;{africanFulfillmentImages.aboutHeritage.caption}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="font-serif-display text-xl font-bold text-foreground">
                Current Operational Footprint
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Active field operations in 11 states, coordinating over 350 full-time staff and hundreds of community volunteers.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                {siteConfig.operationalStates.map((st) => (
                  <li key={st} className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Headquarters: Sokoto State</span>
                <Link href="/contact" className="font-semibold text-primary hover:underline">
                  View All 3 Offices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partners */}
      <section className="border-t border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Trusted Institutional Partners & Donors
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              We partner with global bodies, bilateral donors, and government ministries to deliver verifiable, high-impact programs.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner}
                className="flex items-center justify-center rounded-xl border border-border bg-card p-4 text-center text-xs font-semibold text-foreground shadow-xs"
              >
                {partner}
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/board-of-trustees"
              className="rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
            >
              Board of Trustees
            </Link>
            <Link
              href="/management-team"
              className="rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
            >
              Management Team
            </Link>
            <Link
              href="/our-commitment"
              className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Our Commitments & PSEA
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
