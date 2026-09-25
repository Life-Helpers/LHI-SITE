import "server-only";

import {
  compareEvents,
  OBSERVANCE_AREAS,
  upcomingObservances,
  type CalendarEvent,
  type Observance,
  type ObservanceArea,
} from "@/data/observances";
import type { HeroSlideItem } from "@/data/african-fulfillment-images";
import type { FaqItem } from "@/data/faqs";
import type { Emergency, EmergencyAlert, ImpactReport, Program } from "@/types/content";
import { siteDataFrom, type SiteData } from "@/lib/site-data";
import { THEMATIC_AREA_IDS } from "@/data/thematic-areas";
import { paragraphs, parseStats } from "@/lib/cms/text";

export { paragraphs, parseStats };
import { getPillarRef, type InterventionProject } from "@/data/interventions-data";
import { MAGAZINES, type Magazine } from "@/data/magazines";
import { readSettings, readStore } from "@/lib/cms/store";
import type { HistoryMilestone } from "@/data/history-timeline";
import type { TeamGroup } from "@/data/team";
import type { CmsEmergency, CmsIntervention, CmsMilestone } from "@/lib/cms/types";

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

/** Upcoming observance days plus published LHI events, soonest first. */
export async function getCalendarEvents(days = 366): Promise<CalendarEvent[]> {
  const today = todayInLagos();
  const events: CalendarEvent[] = (await readStore("events"))
    .filter((e) => e.status === "published" && e.startDate && (e.endDate || e.startDate) >= today)
    .map((e) => ({
      id: e.id,
      title: e.title,
      start: e.startDate,
      end: e.endDate && e.endDate >= e.startDate ? e.endDate : e.startDate,
      area: (e.area in OBSERVANCE_AREAS ? e.area : "lhi") as ObservanceArea,
      description: e.summary,
      location: e.location || undefined,
      time: e.time || undefined,
      href: e.link || `/events#${e.id}`,
      yearly: false,
      kind: "event",
    }));
  const observances: Observance[] = (await readStore("observances"))
    .filter((o) => o.status === "published" && o.month >= 1 && o.month <= 12 && o.day >= 1 && o.day <= 31)
    .map((o) => ({
      id: o.id,
      title: o.title,
      month: o.month,
      day: o.day,
      ...(o.endMonth && o.endDay ? { endMonth: o.endMonth, endDay: o.endDay } : {}),
      area: (o.area in OBSERVANCE_AREAS ? o.area : "humanitarian") as ObservanceArea,
      by: o.by,
      description: o.description,
    }));
  return [...events, ...upcomingObservances(today, days, observances)].sort(compareEvents);
}

/** One calendar entry by id: an LHI event, or the next occurrence of an observance day. */
export async function getCalendarEvent(id: string): Promise<CalendarEvent | undefined> {
  return (await getCalendarEvents(400)).find((e) => e.id === id);
}

/** Uploaded (published) magazines first, newest first, then the built-in editions. */
export async function getAllMagazines(): Promise<Magazine[]> {
  const uploaded = (await readStore("magazines"))
    .filter((m) => m.status === "published")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(
      (m): Magazine => ({
        slug: m.slug,
        title: m.title,
        kind: m.kind,
        period: m.period,
        description: m.description,
        pages: m.pages,
        pdf: m.pdf,
        story: m.story || `/project-magazines/${m.slug}`,
        partners: m.partners,
        pagePrefix: `/media/mag-${m.slug}-`,
      }),
    );
  return [...uploaded, ...MAGAZINES.filter((m) => !uploaded.some((u) => u.slug === m.slug))];
}

export async function getAnyMagazine(slug: string) {
  return (await getAllMagazines()).find((m) => m.slug === slug);
}

/** Published history milestones, in road order, shaped for the road-map timeline. */
export async function getMilestones(): Promise<HistoryMilestone[]> {
  return (await readStore("milestones"))
    .filter((m) => m.status === "published")
    .sort((a, b) => a.order - b.order)
    .map(toHistoryMilestone);
}

export function toHistoryMilestone(m: CmsMilestone): HistoryMilestone {
  const photos = m.photos.map((src, i) => ({ src, alt: m.photoAlts[i] || `${m.title} (${m.year})`, label: m.photoLabels[i] || undefined }));
  return {
    year: m.year,
    title: m.title,
    location: m.location || undefined,
    summary: m.summary,
    states: m.states.length ? m.states : undefined,
    media: m.showLogos
      ? { kind: "logos", caption: m.caption || undefined }
      : photos.length
        ? { kind: "photos", photos, caption: m.caption || undefined }
        : undefined,
  };
}

/** Published members of one team group, in display order. */
export async function getTeam(group: TeamGroup) {
  return (await readStore("team")).filter((t) => t.group === group && t.status === "published").sort((a, b) => a.order - b.order);
}

/* ---------------------------------------------- Phase 2: content moved out of the code */

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** Contact details, social accounts and impact figures from Admin → Settings. */
export async function getSiteData(): Promise<SiteData> {
  return siteDataFrom(await readSettings());
}

export async function getHeroSlides(): Promise<HeroSlideItem[]> {
  return (await readStore("heroSlides"))
    .filter((h) => h.status === "published" && h.image)
    .sort(byOrder)
    .map((h) => ({
      id: h.id,
      src: h.image,
      alt: h.imageAlt,
      eyebrow: h.eyebrow,
      prefix: h.prefix,
      highlight: h.highlight,
      suffix: h.suffix,
      body: h.body,
      caption: h.caption,
      tag: h.tag,
      mottoBadge: h.mottoBadge,
      primaryCta: { label: h.primaryLabel, href: h.primaryHref },
      secondaryCta: { label: h.secondaryLabel, href: h.secondaryHref },
    }));
}

export async function getTestimonials() {
  return (await readStore("testimonials")).filter((t) => t.status === "published").sort(byOrder);
}

export async function getBeforeAfterStories() {
  return (await readStore("beforeAfter")).filter((b) => b.status === "published" && b.photo).sort(byOrder);
}

export async function getImpactReports(): Promise<ImpactReport[]> {
  return (await readStore("impactReports"))
    .filter((r) => r.status === "published")
    .sort(byOrder)
    .map((r) => ({
      id: r.id,
      title: r.title,
      period: r.period,
      publishedAt: r.publishedAt,
      summary: r.summary,
      description: paragraphs(r.description),
      stats: parseStats(r.stats),
      relatedProgramIds: r.relatedProgramIds,
      image: r.image || undefined,
      imageAlt: r.imageAlt || undefined,
    }));
}

export async function getImpactReport(id: string) {
  return (await getImpactReports()).find((r) => r.id === id);
}

function toEmergency(e: CmsEmergency): Emergency {
  return {
    id: e.id,
    title: e.title,
    region: e.region,
    status: e.status === "resolved" ? "resolved" : "active",
    severity: e.severity === "critical" ? "critical" : "warning",
    summary: e.summary,
    description: paragraphs(e.description),
    declaredAt: e.declaredAt,
    stats: parseStats(e.stats),
    relatedProgramIds: e.relatedProgramIds,
  };
}

/** Active and resolved emergencies (drafts are hidden). */
export async function getEmergencies(): Promise<Emergency[]> {
  return (await readStore("emergencies")).filter((e) => e.status !== "draft").map(toEmergency);
}

export async function getEmergency(id: string) {
  return (await getEmergencies()).find((e) => e.id === id);
}

/** Banners for active emergencies whose editors switched the alert on; critical ones first. */
export async function getActiveAlerts(): Promise<EmergencyAlert[]> {
  return (await readStore("emergencies"))
    .filter((e) => e.status === "active" && e.showAlert)
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "critical" ? -1 : 1))
    .map((e) => ({
      id: e.id,
      severity: e.severity === "critical" ? "critical" : "warning",
      message: e.alertMessage || `${e.title}: ${e.summary}`,
      ctaLabel: e.alertCtaLabel || "Read more",
      href: `/emergencies/${e.id}`,
    }));
}

/** The six thematic area pages, in their fixed order. */
export async function getPrograms(): Promise<Program[]> {
  const stored = await readStore("thematicAreas");
  return THEMATIC_AREA_IDS.flatMap((id) => {
    const a = stored.find((x) => x.id === id);
    if (!a) return [];
    const stats = parseStats(a.stats);
    return [
      {
        id: a.id,
        name: a.name,
        region: a.region,
        status: "active" as const,
        summary: a.summary,
        description: paragraphs(a.description),
        metricLabel: a.metricLabel,
        metricValue: a.metricValue,
        stats,
        featured: true,
        image: a.image || undefined,
        imageAlt: a.imageAlt || undefined,
      },
    ];
  });
}

export async function getProgram(id: string) {
  return (await getPrograms()).find((p) => p.id === id);
}

export async function getFaqs(): Promise<FaqItem[]> {
  return (await readStore("faqs"))
    .filter((f) => f.status === "published" && f.question && f.answer)
    .sort(byOrder)
    .map((f) => ({ id: f.id, category: f.category, question: f.question, answer: f.answer, tags: f.tags, featured: f.featured }));
}
