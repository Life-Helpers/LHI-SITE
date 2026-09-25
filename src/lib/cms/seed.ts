import "server-only";

import { COMPLIANCE_DOCUMENTS } from "@/data/compliance-documents";
import { INTERVENTIONS_DATA } from "@/data/interventions-data";
import { NIDAKE_KIT } from "@/data/nidake";
import { OPERATIONAL_STATES } from "@/data/operational-states";
import { PARTNERS_DATA } from "@/data/partners-data";
import { siteConfig } from "@/config/site";
import { MAGAZINE_POSTS } from "@/data/magazine-stories";
import { BULLETIN_POSTS } from "@/data/bulletin-stories";
import { PUBLICATION_POSTS } from "@/data/publication-stories";
import { PHOTO_STORY_POSTS } from "@/data/photo-stories";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { HISTORY_MILESTONES } from "@/data/history-timeline";
import { TEAM_MEMBERS } from "@/data/team";
import { heroChildSlides } from "@/data/african-fulfillment-images";
import { TESTIMONIALS } from "@/data/testimonials";
import { BEFORE_AFTER_STORIES } from "@/data/before-after";
import { impactReports } from "@/data/impact-reports";
import { emergencies } from "@/data/emergencies";
import { programs } from "@/data/programs";
import { FAQ_DATA } from "@/data/faqs";
import { OBSERVANCES } from "@/data/observances";
import { slugify } from "@/lib/cms/schema";
import { DEFAULT_SITE_DATA } from "@/lib/site-data";
import { matchPartnersByDonor, postProjects } from "@/lib/cms/links";
import type { CmsSettings } from "@/lib/cms/schema";
import type {
  CmsBeforeAfter,
  CmsDocument,
  CmsEmergency,
  CmsFaq,
  CmsHeroSlide,
  CmsImpactReport,
  CmsIntervention,
  CmsMilestone,
  CmsObservance,
  CmsPartner,
  CmsPost,
  CmsState,
  CmsTeamMember,
  CmsTestimonial,
  CmsThematicArea,
} from "@/lib/cms/types";

const statLines = (stats: { label: string; value: string }[]) => stats.map((st) => `${st.label} | ${st.value}`);

export function seedHeroSlides(): CmsHeroSlide[] {
  return heroChildSlides.map((h, i) => ({
    id: h.id,
    image: h.src,
    imageAlt: h.alt,
    eyebrow: h.eyebrow,
    prefix: h.prefix,
    highlight: h.highlight,
    suffix: h.suffix,
    body: h.body,
    caption: h.caption,
    tag: h.tag,
    mottoBadge: h.mottoBadge,
    primaryLabel: h.primaryCta.label,
    primaryHref: h.primaryCta.href,
    secondaryLabel: h.secondaryCta.label,
    secondaryHref: h.secondaryCta.href,
    order: (i + 1) * 10,
    status: "published",
  }));
}

export function seedTestimonials(): CmsTestimonial[] {
  return TESTIMONIALS.map((t, i) => ({ id: slugify(t.name), ...t, order: (i + 1) * 10, status: "published" }));
}

export function seedBeforeAfter(): CmsBeforeAfter[] {
  return BEFORE_AFTER_STORIES.map((b, i) => ({
    id: b.id,
    name: b.name,
    place: b.place,
    photo: LHI_PHOTOS[b.photo].src,
    photoAlt: LHI_PHOTOS[b.photo].alt,
    beforePhoto: b.beforePhoto ? LHI_PHOTOS[b.beforePhoto].src : "",
    beforeTitle: b.before.title,
    beforeText: b.before.text,
    afterTitle: b.after.title,
    afterText: b.after.text,
    href: b.href,
    linkLabel: b.id === "noma" ? "Read the hub's story" : "",
    order: (i + 1) * 10,
    status: "published",
  }));
}

export function seedImpactReports(): CmsImpactReport[] {
  return impactReports.map((r, i) => ({
    id: r.id,
    title: r.title,
    period: r.period,
    publishedAt: r.publishedAt,
    summary: r.summary,
    description: r.description.join("\n\n"),
    stats: statLines(r.stats),
    relatedProgramIds: [...r.relatedProgramIds],
    image: r.image ?? "",
    imageAlt: r.imageAlt ?? "",
    order: (i + 1) * 10,
    status: "published",
  }));
}

export function seedEmergencies(): CmsEmergency[] {
  return emergencies.map((e) => ({
    id: e.id,
    title: e.title,
    region: e.region,
    status: e.status,
    severity: e.severity,
    summary: e.summary,
    description: e.description.join("\n\n"),
    declaredAt: e.declaredAt,
    stats: statLines(e.stats),
    relatedProgramIds: [...e.relatedProgramIds],
    showAlert: false,
    alertMessage: "",
    alertCtaLabel: "",
  }));
}

export function seedThematicAreas(): CmsThematicArea[] {
  return programs.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    summary: p.summary,
    description: p.description.join("\n\n"),
    metricLabel: p.metricLabel,
    metricValue: p.metricValue,
    stats: statLines(p.stats),
    image: p.image ?? "",
    imageAlt: p.imageAlt ?? "",
  }));
}

export function seedFaqs(): CmsFaq[] {
  return FAQ_DATA.map((f, i) => ({
    id: f.id,
    category: f.category,
    question: f.question,
    answer: f.answer,
    tags: [...(f.tags ?? [])],
    featured: Boolean(f.featured),
    order: (i + 1) * 10,
    status: "published",
  }));
}

export function seedObservances(): CmsObservance[] {
  return OBSERVANCES.map((o) => ({
    id: o.id,
    title: o.title,
    month: o.month,
    day: o.day,
    endMonth: o.endMonth ?? 0,
    endDay: o.endDay ?? 0,
    area: o.area,
    by: o.by,
    description: o.description,
    status: "published",
  }));
}

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
    partnerIds: matchPartnersByDonor(rest.donor, PARTNERS_DATA),
  }));
}

export function seedMilestones(): CmsMilestone[] {
  return HISTORY_MILESTONES.map((m, index) => {
    const photos = m.media?.kind === "photos" ? m.media.photos : [];
    return {
      id: slugify(`${m.year}-${m.title}`),
      year: m.year,
      title: m.title,
      location: m.location ?? "",
      summary: m.summary,
      photos: photos.map((p) => p.src),
      photoAlts: photos.map((p) => p.alt),
      photoLabels: photos.some((p) => p.label) ? photos.map((p) => p.label ?? "") : [],
      caption: m.media?.caption ?? "",
      showLogos: m.media?.kind === "logos",
      states: m.states ?? [],
      order: (index + 1) * 10,
      status: "published",
    };
  });
}

export function seedTeam(): CmsTeamMember[] {
  return structuredClone(TEAM_MEMBERS);
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
  return [...PUBLICATION_POSTS, ...MAGAZINE_POSTS, ...BULLETIN_POSTS, ...PHOTO_STORY_POSTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({ ...post, tags: [...post.tags], projects: postProjects(post) }));
}

export function seedSettings(): CmsSettings {
  return {
    homeText: {},
    homeFeature: {
      enabled: true,
      eyebrow: "Feature story · Cultivating Resilience",
      title: "Saving a family business",
      excerpt:
        "With ₦75,000 in livelihood support from the FCDO/WFP resilience project, delivered with LHI, cap-washer Mustafa Almajiri in Batagarawa diversified into selling caps and turned a failing shop into a growing enterprise.",
      image: LHI_PHOTOS.mustafa.src,
      linkLabel: "Read Mustafa's story",
      linkHref: "/blog/mustafa-saving-a-family-business",
    },
    nidake: {
      costNgn: NIDAKE_KIT.costNgn,
      yearsOfDignity: NIDAKE_KIT.yearsOfDignity,
      schoolDaysSaved: NIDAKE_KIT.schoolDaysSaved,
    },
    contact: { ...DEFAULT_SITE_DATA.contact },
    social: { ...DEFAULT_SITE_DATA.social },
    stats: {
      peopleReached: DEFAULT_SITE_DATA.stats.peopleReached,
      households: DEFAULT_SITE_DATA.stats.households,
      projects: DEFAULT_SITE_DATA.stats.projects,
      staff: DEFAULT_SITE_DATA.stats.staff,
      volunteers: DEFAULT_SITE_DATA.stats.volunteers,
      grants: DEFAULT_SITE_DATA.stats.grants,
    },
    donations: {
      bankDetails: "",
    },
    engagement: {
      autoApproveComments: false,
      alertEmail: siteConfig.contact.email,
    },
  };
}
