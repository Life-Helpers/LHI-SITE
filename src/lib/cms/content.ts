import "server-only";

import { getPillarRef, type InterventionProject } from "@/data/interventions-data";
import { readSettings, readStore } from "@/lib/cms/store";
import type { CmsIntervention } from "@/lib/cms/types";

export function hydrateIntervention(item: CmsIntervention): InterventionProject {
  const { imageSrc, imageAlt, imageCaption, thematicIds, gallery, youtubeId, ...rest } = item;
  return {
    ...rest,
    image: { src: imageSrc, alt: imageAlt, caption: imageCaption },
    thematicAreas: thematicIds.map(getPillarRef),
    gallery: gallery.map((src) => ({ src, alt: `${item.shortTitle} field photo`, caption: item.shortTitle })),
    youtubeId: /^[\w-]{6,20}$/.test(youtubeId ?? "") ? youtubeId : undefined,
  };
}

export async function getInterventions(): Promise<InterventionProject[]> {
  return (await readStore("interventions")).map(hydrateIntervention);
}

export async function getIntervention(id: string) {
  return (await getInterventions()).find((p) => p.id === id);
}

export function getStates() {
  return readStore("states");
}

export async function getPartners() {
  return (await readStore("partners")).filter((p) => p.visible).sort((a, b) => a.order - b.order);
}

export function getDocuments() {
  return readStore("documents");
}

export async function getPublishedPosts(category?: string) {
  const today = new Date().toISOString().slice(0, 10);
  return (await readStore("posts"))
    .filter((p) => p.status === "published" && p.date <= today && (!category || p.category === category))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string) {
  return (await getPublishedPosts()).find((p) => p.slug === slug);
}

export function getSettings() {
  return readSettings();
}
