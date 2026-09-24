import type { FulfillmentImage } from "@/data/african-fulfillment-images";
import type { InterventionProject } from "@/data/interventions-data";

/**
 * Project photo first, then its own gallery (deduplicated). Thematic-area hero photos are
 * no longer appended: they made the same picture repeat across every project in an area.
 */
export function getInterventionGallery(project: InterventionProject): FulfillmentImage[] {
  const candidates: FulfillmentImage[] = [project.image, ...(project.gallery ?? [])];
  const seen = new Set<string>();
  return candidates.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
