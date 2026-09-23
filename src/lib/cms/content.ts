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

const byDeadline = <T extends { deadline: string; postedDate: string }>(a: T, b: T) =>
  b.postedDate.localeCompare(a.postedDate) || a.deadline.localeCompare(b.deadline);

/** Today in Nigeria (WAT), so a deadline stays open until the end of that local day. */
export function todayInLagos() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
}

/** Public vacancies: open ones first, then recently closed (for reference). */
export async function getPublicJobs() {
  const today = todayInLagos();
  const jobs = (await readStore("jobs")).filter((j) => j.status !== "draft").sort(byDeadline);
  const isOpen = (j: (typeof jobs)[number]) => j.status === "open" && j.deadline >= today;
  return { open: jobs.filter(isOpen), closed: jobs.filter((j) => !isOpen(j)).slice(0, 10), isOpen };
}

export async function getJob(id: string) {
  const job = (await readStore("jobs")).find((j) => j.id === id && j.status !== "draft");
  if (!job) return undefined;
  return { job, open: job.status === "open" && job.deadline >= todayInLagos() };
}

export async function getPublicTenders() {
  const today = todayInLagos();
  const tenders = (await readStore("tenders")).filter((t) => t.status !== "draft").sort(byDeadline);
  const isOpen = (t: (typeof tenders)[number]) => t.status === "open" && t.deadline >= today;
  return { open: tenders.filter(isOpen), past: tenders.filter((t) => !isOpen(t)).slice(0, 20) };
}

export async function getTender(id: string) {
  const tender = (await readStore("tenders")).find((t) => t.id === id && t.status !== "draft");
  if (!tender) return undefined;
  return { tender, open: tender.status === "open" && tender.deadline >= todayInLagos() };
}

/** Published radio episodes, featured first, then newest. */
export async function getEpisodes() {
  const today = todayInLagos();
  return (await readStore("episodes"))
    .filter((e) => e.status === "published" && e.audio && e.date <= today)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));
}
