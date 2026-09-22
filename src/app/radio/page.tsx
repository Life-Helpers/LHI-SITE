import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, Mic2, Radio, Sparkles, Volume2 } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { WomenSituationRoomPlayer } from "@/components/audio/women-situation-room-player";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Multimedia & Radio Broadcast Audio Hub | The Women Situation Room",
  description:
    "Listen to weekly peace, maternal health, girl-child education, and human rights radio broadcasts in Hausa, Kanuri, and English reaching 2.5M+ listeners across Northern Nigeria.",
  keywords: [
    "Women Situation Room podcast",
    "radio broadcasts Hausa",
    "Kanuri peacebuilding audio",
    "maternal health radio Nigeria",
    "LHI multimedia hub",
    "Sokoto radio advocacy",
  ],
  openGraph: {
    title: "Multimedia & Radio Broadcast Audio Hub | Life Helpers Initiative",
    description:
      "Embedded audio player for weekly peace, maternal health, and human rights radio broadcasts in Hausa, Kanuri, and English.",
    type: "website",
  },
};

export default function RadioAdvocacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Airwaves of Change & Hope"
        title={
          <>
            Multimedia &amp; Radio <em className="font-light italic text-primary">Audio Hub.</em>
          </>
        }
        subtitle="The Women Situation Room: broadcasting peace, maternal health, and human rights across 11 states."
        description="Where internet penetration is minimal and terrain restricts travel, radio remains the most powerful voice of hope and empowerment. Explore our weekly flagship radio broadcasts in Hausa, Kanuri, and English, reaching over 2.5 million rural listeners every week."
        image={africanFulfillmentImages.radioHero}
      />

      {/* Broadcast Reach Metrics */}
      <section className="border-b border-border bg-card/50 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">2.5M+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Weekly Listeners</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">3</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Languages (Hausa, Kanuri, Eng)</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">11</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">States Covered</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">200+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Syndicated Episodes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Podcast / Audio Player Hub Section */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Volume2 size={14} />
              <span>Interactive Player &middot; Listen in Hausa, Kanuri &amp; English</span>
            </div>
            <h2 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl lg:text-4xl">
              Women Situation Room <em className="font-light italic text-primary">Podcast Player</em>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              Select any episode below to listen to full broadcast discussions, read multilingual transcripts, and access verified survivor helplines.
            </p>
          </div>

          <WomenSituationRoomPlayer />
        </div>
      </section>

      {/* Visual Transformation Link Section */}
      <section className="border-t border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles size={14} />
                <span>Visual Transformation Sliders</span>
              </div>
              <h3 className="font-serif-display text-xl font-bold text-foreground sm:text-2xl">
                Explore Before &amp; After Community Evidence
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Compare interactive sliders showing irrigated dry-season farmlands, solar-rehabilitated boreholes, and upgraded maternal clinics.
              </p>
            </div>
            <Link
              href="/multimedia"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>View Interactive Sliders</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call-to-Action for Media Partners & Radio Stations */}
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Radio className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Sponsor or Syndicate Our Radio Broadcasts
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Are you a radio station program director, community broadcaster, or institutional donor wishing to syndicate the Women Situation Room in your LGA?
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Mic2 size={14} />
              <span>Partner with Media Team</span>
            </Link>
            <Link
              href="/radio-story"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Headphones size={14} />
              <span>Read Listener Stories</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
