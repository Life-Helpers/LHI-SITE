import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  Layers,
  Radio,
  Sliders,
  Sparkles,
  Volume2,
} from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { WomenSituationRoomPlayer } from "@/components/audio/women-situation-room-player";
import { BeforeAfterGallery } from "@/components/transformations/before-after-gallery";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Multimedia & Radio Broadcast Audio Hub | Life Helpers Initiative",
  description:
    "Explore LHI's Multimedia Hub: Embedded Women Situation Room audio player for weekly radio broadcasts in Hausa, Kanuri, and English, plus interactive Before-and-After visual comparison sliders.",
  keywords: [
    "Multimedia hub LHI",
    "Women Situation Room podcast",
    "before and after visual sliders",
    "humanitarian audio player Nigeria",
    "Hausa radio broadcast",
    "community transformation sliders",
  ],
  openGraph: {
    title: "Multimedia & Radio Broadcast Audio Hub | Life Helpers Initiative",
    description:
      "Interactive audio hub with the Women Situation Room podcast and before-and-after visual sliders demonstrating community transformation.",
    type: "website",
  },
};

export default function MultimediaPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero Banner */}
      <PageHeroBanner
        eyebrow="— Multimedia &amp; Field Evidence"
        title={
          <>
            Multimedia &amp; Radio <em className="font-light italic text-primary">Audio Hub.</em>
          </>
        }
        subtitle="Immersive audio broadcasts, podcasts in 3 languages, and interactive before-and-after visual comparisons."
        description="Experience the sights and sounds of transformative change. Stream our weekly Women Situation Room radio broadcasts across Northern Nigeria and slide through interactive visual evidence of restored farmlands, clean solar boreholes, and modern health facilities."
        image={africanFulfillmentImages.radioHero}
      />

      {/* Quick Jump Bar */}
      <div className="border-b border-border bg-card/60 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="#audio-player-section"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <Volume2 size={14} />
              <span>Women Situation Room Podcast</span>
            </a>
            <a
              href="#before-after-section"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Sliders size={14} className="text-primary" />
              <span>Before &amp; After Visual Sliders</span>
            </a>
            <Link
              href="/radio-story"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 font-semibold text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
            >
              <Headphones size={14} className="text-primary" />
              <span>Listener Stories</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 1: Women Situation Room Audio Player */}
      <section id="audio-player-section" className="py-14 sm:py-20 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Radio size={14} />
              <span>Flagship Podcast &middot; Hausa, Kanuri &amp; English</span>
            </div>
            <h2 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl lg:text-4xl">
              The Women Situation Room <em className="font-light italic text-primary">Audio Hub</em>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              Stream weekly episodes on maternal nutrition, SGBV legal recourse, farmer-herder mediation, girl-child literacy, and civic participation with multilingual transcripts and emergency hotlines.
            </p>
          </div>

          <WomenSituationRoomPlayer />
        </div>
      </section>

      {/* SECTION 2: Before-and-After Visual Sliders */}
      <section
        id="before-after-section"
        className="border-t border-border bg-muted/20 py-14 sm:py-20 scroll-mt-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BeforeAfterGallery showHeading={true} />
        </div>
      </section>

      {/* Bottom Cross-Navigation & Action Banner */}
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Support Community Transformations Across Nigeria
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every clean water borehole, irrigated field, and radio broadcast is powered by compassionate partnerships. Help us expand to more communities in need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>Donate to Support Field Projects</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/interventions/projectandintervention"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Layers size={14} />
              <span>Explore All Interventions</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
