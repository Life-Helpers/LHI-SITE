"use client";

import { HeroSlider } from "@/components/home/hero-slider";
import { StatsSection } from "@/components/home/stats-section";
import { WhoWeAreBand } from "@/components/home/who-we-are-band";
import { WhatWeDoTiles } from "@/components/home/what-we-do-tiles";
import { LatestFromLHI } from "@/components/home/latest-from-lhi";
import { RadioBanner } from "@/components/home/radio-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SocialFeedsSection } from "@/components/home/social-feeds-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <HeroSlider />
      <StatsSection />
      <WhoWeAreBand />
      <WhatWeDoTiles />
      <LatestFromLHI />
      <RadioBanner />
      <TestimonialsSection />
      <SocialFeedsSection />
      <PartnersStrip />
      <PhilosophyQuote />
      <NewsletterSubscribe />
    </main>
  );
}
