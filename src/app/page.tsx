import { HeroSlider } from "@/components/home/hero-slider";
import { StatsSection } from "@/components/home/stats-section";
import { WhoWeAreBand } from "@/components/home/who-we-are-band";
import { WhatWeDoTiles } from "@/components/home/what-we-do-tiles";
import { BeforeAfterSection } from "@/components/home/before-after-section";
import { OperationalMapSection } from "@/components/home/operational-map-section";
import { LatestFromLHI } from "@/components/home/latest-from-lhi";
import { RadioBanner } from "@/components/home/radio-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SocialFeedsSection } from "@/components/home/social-feeds-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";
import { FeatureStory } from "@/components/home/feature-story";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { getCalendarEvents, getEpisodes, getInterventions, getPartners, getPublishedPosts, getSettings, todayInLagos } from "@/lib/cms/content";
import { toRadioEpisode } from "@/lib/radio";

/** Content comes from the admin CMS; saves refresh it instantly, this is a safety net. */
export const revalidate = 300;

export default async function Home() {
  const [partners, settings, posts, interventions, episodes, events] = await Promise.all([
    getPartners(),
    getSettings(),
    getPublishedPosts(),
    getInterventions(),
    getEpisodes(),
    getCalendarEvents(120),
  ]);
  const projectCounts: Record<string, number> = {};
  for (const project of interventions) {
    for (const area of project.thematicAreas) projectCounts[area.id] = (projectCounts[area.id] ?? 0) + 1;
  }
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <HeroSlider />
      <StatsSection />
      <WhoWeAreBand />
      <FeatureStory feature={settings.homeFeature} />
      <WhatWeDoTiles projectCounts={projectCounts} />
      <BeforeAfterSection />
      <OperationalMapSection />
      <UpcomingEvents events={events.slice(0, 5)} today={todayInLagos()} />
      <LatestFromLHI />
      <RadioBanner episodes={episodes.slice(0, 12).map(toRadioEpisode)} />
      <TestimonialsSection />
      <SocialFeedsSection posts={posts.slice(0, 4)} />
      <PartnersStrip partners={partners} />
      <PhilosophyQuote />
      <NewsletterSubscribe />
    </main>
  );
}
