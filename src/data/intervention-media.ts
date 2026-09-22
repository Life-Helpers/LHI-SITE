import { africanFulfillmentImages, type FulfillmentImage } from "@/data/african-fulfillment-images";
import type { InterventionProject, ThematicPillarId } from "@/data/interventions-data";

const PILLAR_IMAGES: Record<ThematicPillarId, FulfillmentImage> = {
  health: africanFulfillmentImages.healthHero,
  education: africanFulfillmentImages.educationHero,
  livelihood: africanFulfillmentImages.livelihoodHero,
  "food-security": africanFulfillmentImages.foodSecurityHero,
  "social-inclusion": africanFulfillmentImages.socialInclusionHero,
  protection: africanFulfillmentImages.protectionHero,
};

/** Project photo first, then its own gallery, then one image per thematic pillar (deduplicated). */
export function getInterventionGallery(project: InterventionProject): FulfillmentImage[] {
  const candidates: FulfillmentImage[] = [
    project.image,
    ...(project.gallery ?? []),
    ...project.thematicAreas.map((t) => PILLAR_IMAGES[t.id]),
  ];
  const seen = new Set<string>();
  return candidates.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
