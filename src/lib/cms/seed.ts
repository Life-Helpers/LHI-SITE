import "server-only";

import { COMPLIANCE_DOCUMENTS } from "@/data/compliance-documents";
import { INTERVENTIONS_DATA } from "@/data/interventions-data";
import { NIDAKE_KIT } from "@/data/nidake";
import { OPERATIONAL_STATES } from "@/data/operational-states";
import { PARTNERS_DATA } from "@/data/partners-data";
import { siteConfig } from "@/config/site";
import { MAGAZINE_POSTS } from "@/data/magazine-stories";
import { LHI_PHOTOS } from "@/data/lhi-photos";
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
  return MAGAZINE_POSTS.map((post) => ({ ...post, tags: [...post.tags] }));
}

export function seedSettings(): CmsSettings {
  return {
    homeFeature: {
      enabled: true,
      eyebrow: "Feature story · Cultivating Resilience",
      title: "From eight years of struggle to renewed hope",
      excerpt:
        "Widowed and raising 11 children in Katsina, Murja Yari invested her ₦75,000 WFP cash transfer, delivered with LHI, into a food business that now runs from morning until evening. Hers is one of the stories from our new project magazine on the FCDO/WFP resilience project reaching 5,700 households in Sokoto and Katsina.",
      image: LHI_PHOTOS.murja.src,
      linkLabel: "Read Murja's story",
      linkHref: "/blog/murja-eight-years-of-struggle-to-renewed-hope",
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
