import type { Metadata } from "next";

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
import { PartnersStrip, type PartnerProjects } from "@/components/home/partners-strip";
import { projectPartnerIds } from "@/lib/cms/links";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";
import { FeatureStory, type FeatureSlide } from "@/components/home/feature-story";
import { FEATURED_STORY_BY_AREA } from "@/data/featured-stories";
import { THEMATIC_PILLARS } from "@/data/interventions-data";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { getCalendarEvents, getEpisodes, getInterventions, getPartners, getPublishedPosts, getSettings, todayInLagos } from "@/lib/cms/content";
import { toRadioEpisode } from "@/lib/radio";
import { HomeTextOverrides } from "@/i18n/locale-context";

export const metadata: Metadata = { alternates: { canonical: "/" } };

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
  const partnerProjects: PartnerProjects = {};
  for (const project of interventions) {
    for (const partnerId of projectPartnerIds(project, partners)) {
      (partnerProjects[partnerId] ??= []).push({ id: project.id, title: project.shortTitle });
    }
  }
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const featureSlides: FeatureSlide[] = FEATURED_STORY_BY_AREA.flatMap(({ area, slug }) => {
    const post = bySlug.get(slug);
    if (!post || !post.featuredImage) return [];
    const theme = THEMATIC_PILLARS[area];
    return [{ area, areaName: theme.name, areaHref: theme.href, title: post.title, excerpt: post.excerpt, image: post.featuredImage, href: `/blog/${post.slug}`, linkLabel: "Read the story" }];
  });
  // The editor-managed feature (Admin → Settings) leads when it points somewhere the carousel doesn't already cover.
  const feature = settings.homeFeature;
  if (feature.enabled && feature.title && feature.image && !featureSlides.some((s) => s.href === feature.linkHref)) {
    featureSlides.unshift({
      area: "feature",
      areaName: feature.eyebrow.replace(/^Feature story\s*·\s*/i, "") || "Feature",
      areaHref: feature.linkHref || "/blog",
      title: feature.title,
      excerpt: feature.excerpt,
      image: feature.image,
      href: feature.linkHref || "/blog",
      linkLabel: feature.linkLabel || "Read more",
    });
  }
  return (
    <HomeTextOverrides text={settings.homeText}>
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
        <HeroSlider />
        <StatsSection />
        <WhoWeAreBand />
        <WhatWeDoTiles projectCounts={projectCounts} />
        <FeatureStory slides={featureSlides} />
        <BeforeAfterSection />
        <div className="defer-render">
          <OperationalMapSection />
        </div>
        <UpcomingEvents events={events.slice(0, 5)} today={todayInLagos()} />
        <div className="defer-render">
          <LatestFromLHI />
        </div>
        <div className="defer-render">
          <RadioBanner episodes={episodes.slice(0, 12).map(toRadioEpisode)} />
        </div>
        <div className="defer-render">
          <TestimonialsSection />
        </div>
        <div className="defer-render">
          <SocialFeedsSection posts={posts.slice(0, 4)} />
        </div>
        <div className="defer-render">
          <PartnersStrip partners={partners} projects={partnerProjects} />
        </div>
        <PhilosophyQuote />
        <NewsletterSubscribe />
      </main>
    </HomeTextOverrides>
  );
}
