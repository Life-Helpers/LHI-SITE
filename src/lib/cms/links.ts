import { PROJECT_STORIES } from "@/data/project-stories";
import type { CmsIntervention, CmsPartner, CmsPost } from "@/lib/cms/types";

/**
 * Links between content records, stored by id: a post lists the projects it is about,
 * a project lists its partners. Records saved before these links existed fall back to
 * the original mappings (the project → stories list and the donor line) until an editor saves them.
 */

const LEGACY_PROJECTS_BY_SLUG: Record<string, string[]> = {};
for (const [projectId, slugs] of Object.entries(PROJECT_STORIES)) {
  for (const slug of slugs) (LEGACY_PROJECTS_BY_SLUG[slug] ??= []).push(projectId);
}

/** Projects a post is about. */
export function postProjects(post: Pick<CmsPost, "slug" | "projects">): string[] {
  return post.projects ?? LEGACY_PROJECTS_BY_SLUG[post.slug] ?? [];
}

/** Position of a post in a project's original story list, to keep the curated order first. */
export function legacyStoryRank(projectId: string, slug: string) {
  const index = PROJECT_STORIES[projectId]?.indexOf(slug) ?? -1;
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Partner names and acronyms that identify each partner in a project's donor line. */
function partnerAliases(p: Pick<CmsPartner, "name" | "shortName" | "acronym">) {
  const acronyms = p.acronym
    .split("/")
    .map((a) => a.trim())
    // Acronyms such as "WFP", "EU" or "KfW": no spaces and at least two capitals.
    .filter((a) => a.length >= 2 && !/\s/.test(a) && (a.match(/[A-Z]/g)?.length ?? 0) >= 2);
  return [p.name, p.shortName, ...acronyms].filter(Boolean);
}

/** Partner ids whose name or acronym appears in a donor line such as "FCDO / World Food Programme (WFP)". */
export function matchPartnersByDonor(donor: string, partners: Pick<CmsPartner, "id" | "name" | "shortName" | "acronym">[]) {
  return partners
    .filter((p) => partnerAliases(p).some((alias) => new RegExp(`(^|[^A-Za-z])${escape(alias)}([^A-Za-z]|$)`).test(donor)))
    .map((p) => p.id);
}

/** Partners linked to a project. */
export function projectPartnerIds(project: Pick<CmsIntervention, "donor" | "partnerIds">, partners: Pick<CmsPartner, "id" | "name" | "shortName" | "acronym">[]) {
  return project.partnerIds ?? matchPartnersByDonor(project.donor, partners);
}
