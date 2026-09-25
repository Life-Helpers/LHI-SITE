import type { ThematicPillarId } from "@/data/interventions-data";

/**
 * One published story per thematic area for the home page feature carousel.
 * Each slug must match a published post; missing or unpublished ones are skipped.
 */
export const FEATURED_STORY_BY_AREA: { area: ThematicPillarId; slug: string }[] = [
  { area: "livelihood", slug: "mustafa-saving-a-family-business" },
  { area: "education", slug: "nasiru-from-wheelbarrow-to-classroom" },
  { area: "health", slug: "rejoice-transforming-lives-through-nutrition" },
  { area: "food-security", slug: "karba-four-cobs-on-one-stalk" },
  { area: "social-inclusion", slug: "arajana-finding-purpose-at-70" },
  { area: "protection", slug: "healing-homes-zamfara-resilience" },
];
