import "server-only";

import { COMPLIANCE_DOCUMENTS } from "@/data/compliance-documents";
import { INTERVENTIONS_DATA } from "@/data/interventions-data";
import { NIDAKE_KIT } from "@/data/nidake";
import { OPERATIONAL_STATES } from "@/data/operational-states";
import { PARTNERS_DATA } from "@/data/partners-data";
import { siteConfig } from "@/config/site";
import { initialBlogPosts } from "@/lib/cms-crm-store";
import type { CmsSettings } from "@/lib/cms/schema";
import type { CmsDocument, CmsIntervention, CmsPartner, CmsPost, CmsState } from "@/lib/cms/types";

/** First-run content, taken from the site's original static data files. */
export function seedInterventions(): CmsIntervention[] {
  return INTERVENTIONS_DATA.map(({ image, thematicAreas, ...rest }) => ({
    ...rest,
    imageSrc: image.src,
    imageAlt: image.alt,
    imageCaption: image.caption,
    thematicIds: thematicAreas.map((t) => t.id),
    gallery: rest.gallery?.map((g) => g.src) ?? [],
    youtubeId: rest.youtubeId ?? "",
    featured: Boolean(rest.featured),
  }));
}

export function seedStates(): CmsState[] {
  return OPERATIONAL_STATES.map((s) => ({ ...s, office: s.office ?? "" }));
}

export function seedPartners(): CmsPartner[] {
  return PARTNERS_DATA.map((p, index) => ({
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    acronym: p.acronym,
    category: p.category,
    countryOrOrigin: p.countryOrOrigin,
    establishedYear: p.establishedYear,
    partnershipSince: p.partnershipSince,
    priorityFocus: p.priorityFocus,
    description: p.description,
    jointPrograms: p.jointPrograms,
    targetStates: p.targetStates,
    statsHeadline: p.statsHeadline,
    statsValue: p.statsValue,
    websiteUrl: p.websiteUrl,
    logoUrl: "",
    visible: true,
    order: index + 1,
  }));
}

export function seedDocuments(): CmsDocument[] {
  return COMPLIANCE_DOCUMENTS.map((d) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    description: d.description,
    file: d.file ?? "",
    href: d.href ?? "",
  }));
}

export function seedPosts(): CmsPost[] {
  return initialBlogPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    category: "Field Blog",
    date: p.date,
    featuredImage: p.featuredImage,
    status: p.status.toLowerCase() === "published" ? "published" : "draft",
    tags: Array.from(new Set([p.category, ...p.tags])),
    featured: Boolean(p.featured),
    authorId: "",
    updatedAt: p.updatedAt ?? p.date,
  }));
}

export function seedSettings(): CmsSettings {
  return {
    homeFeature: {
      enabled: false,
      eyebrow: "Feature story",
      title: "",
      excerpt: "",
      image: "",
      linkLabel: "Read the story",
      linkHref: "/success-stories",
    },
    nidake: {
      costUsd: NIDAKE_KIT.costUsd,
      yearsOfDignity: NIDAKE_KIT.yearsOfDignity,
      schoolDaysSaved: NIDAKE_KIT.schoolDaysSaved,
    },
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
    },
  };
}
