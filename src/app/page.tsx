import { HeroSlider } from "@/components/home/hero-slider";
import { StatsSection } from "@/components/home/stats-section";
import { WhoWeAreBand } from "@/components/home/who-we-are-band";
import { WhatWeDoTiles } from "@/components/home/what-we-do-tiles";
import { OperationalMapSection } from "@/components/home/operational-map-section";
import { LatestFromLHI } from "@/components/home/latest-from-lhi";
import { RadioBanner } from "@/components/home/radio-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SocialFeedsSection } from "@/components/home/social-feeds-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";
import { FeatureStory } from "@/components/home/feature-story";
import { getPartners, getSettings } from "@/lib/cms/content";

/** Content comes from the admin CMS; saves refresh it instantly, this is a safety net. */
export const revalidate = 300;

export default async function Home() {
  const [partners, settings] = await Promise.all([getPartners(), getSettings()]);
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <HeroSlider />
      <StatsSection />
      <WhoWeAreBand />
      <FeatureStory feature={settings.homeFeature} />
      <WhatWeDoTiles />
      <OperationalMapSection />
      <LatestFromLHI />
      <RadioBanner />
      <TestimonialsSection />
      <SocialFeedsSection />
      <PartnersStrip partners={partners} />
      <PhilosophyQuote />
      <NewsletterSubscribe />
    </main>
  );
}
