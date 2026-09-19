import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, Mic2 } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Radio Advocacy: Women Situation Room | Life Helpers Initiative",
  description:
    "The Women Situation Room is LHI's flagship weekly radio program broadcasting women's civic rights, maternal health, and peacebuilding to millions in Northern Nigeria.",
};

const broadcastTracks = [
  {
    title: "Overcoming Gender-Based Violence (GBV) & Accessing Survivor Support",
    language: "Hausa & Kanuri",
    frequency: "Weekly Syndicate across 6 Stations",
    theme: "Survivor Rights & Legal Recourse",
    description:
      "Explains legal protections, confidentiality rights, and step-by-step guidance on reaching LHI's confidential protection hubs, SARC centers, and community desks.",
  },
  {
    title: "Maternal Nutrition, Exclusive Breastfeeding & Tom Brown Prep",
    language: "Hausa & Fulfulde",
    frequency: "Weekly Healthcare Hour",
    theme: "Child Survival & Nutrition",
    description:
      "A clinical nutritionist discusses practical, low-cost recipes combining locally harvested soybeans, groundnuts, and guinea corn to prevent childhood wasting.",
  },
  {
    title: "The Power of Girls' Education: Community Mothers' Dialogue",
    language: "Hausa & English",
    frequency: "Bi-Weekly Educational Panel",
    theme: "Girl-Child Retention & Leadership",
    description:
      "Interviews traditional leaders, Islamic scholars, and rural Mothers' Association leaders addressing why educating daughters builds stronger, more resilient families.",
  },
  {
    title: "Peacebuilding, Dispute Mediation & Community Cohesion",
    language: "Hausa, Kanuri, & Fulfulde",
    frequency: "Community Cohesion Special",
    theme: "Grassroots Peacebuilding",
    description:
      "Facilitates inter-community dialogue between pastoralist and farming communities, sharing traditional and non-violent dispute resolution mechanisms.",
  },
];

export default function RadioAdvocacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Airwaves of Change & Hope"
        title={
          <>
            The Women <em className="font-light italic text-primary">Situation Room.</em>
          </>
        }
        subtitle="Strategic radio advocacy putting a smile on listeners across hard-to-reach communities."
        description="Where internet penetration is minimal and terrain restricts travel, radio remains the most powerful voice of hope and empowerment. LHI's weekly flagship radio program educates over 2.5 million listeners weekly on women's civic rights, maternal health, girl-child retention, and peacebuilding."
        image={africanFulfillmentImages.radioHero}
      />

      {/* Broadcast Reach Metrics */}
      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">2.5M+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Weekly Listeners</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">4</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Broadcast Languages</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">11</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">States Covered</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">200+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Episodes Aired</p>
            </div>
          </div>
        </div>
      </section>

      {/* Broadcast Themes & Tracks */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              Core Program Strands
            </p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              Featured Episodes &amp; Thematic Series
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {broadcastTracks.map((track) => (
              <div
                key={track.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 sm:p-8"
              >
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mic2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {track.theme}
                    </span>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      {track.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Languages: <strong>{track.language}</strong></span>
                  <span>·</span>
                  <span>{track.frequency}</span>
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {track.description}
                </p>

                <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-primary font-medium">
                    <Headphones size={14} /> Community Radio Service
                  </span>
                  <Link href="/radio-story" className="font-semibold text-primary hover:underline">
                    Read Radio Stories →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <h3 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Sponsor or Broadcast Our Advocacy Programs
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Are you a radio station manager, community partner, or donor interested in expanding the reach of the Women Situation Room?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Partner with Media Team
              </Link>
              <Link
                href="/social-inclusion"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                Social Inclusion Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
