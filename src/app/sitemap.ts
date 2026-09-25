import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { THEMATIC_AREA_IDS } from "@/data/thematic-areas";
import { getEmergencies, getImpactReports, getInterventions, getPublicJobs, getPublicTenders, getPublishedPosts } from "@/lib/cms/content";
import { COURSES } from "@/data/training/courses";
import { MAGAZINES } from "@/data/magazines";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/programs",
    "/emergencies",
    "/impact",
    "/about",
    "/contact",
    "/donate",
    "/get-involved",
    "/privacy",
    "/terms",
    "/our-history",
    "/our-commitment",
    "/our-strategies",
    "/nidake",
    "/board-of-trustees",
    "/management-team",
    "/blog",
    "/success-stories",
    "/events",
    "/feedback",
    "/faq",
    "/fact-sheet",
    "/brochure",
    "/interventions/projectandintervention",
    "/partner-portal",
    "/careers",
    "/project-magazines",
    "/radio",
    ...MAGAZINES.map((m) => `/project-magazines/${m.slug}`),
    "/procurement",
    "/get-involved/training",
    ...COURSES.map((c) => `/get-involved/training/${c.id}`),
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "weekly" as const,
  }));

  const [emergencies, impactReports] = await Promise.all([getEmergencies(), getImpactReports()]);
  const programRoutes = THEMATIC_AREA_IDS.map((id) => ({
    url: `${siteConfig.url}/${id}`,
    changeFrequency: "monthly" as const,
  }));

  const emergencyRoutes = emergencies.map((emergency) => ({
    url: `${siteConfig.url}/emergencies/${emergency.id}`,
    changeFrequency: "daily" as const,
  }));

  const impactRoutes = impactReports.map((report) => ({
    url: `${siteConfig.url}/impact/${report.id}`,
    changeFrequency: "yearly" as const,
  }));

  const interventionRoutes = (await getInterventions()).map((project) => ({
    url: `${siteConfig.url}/interventions/${project.id}`,
    changeFrequency: "monthly" as const,
  }));

  const postRoutes = (await getPublishedPosts()).map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
  }));

  const [jobs, tenders] = await Promise.all([getPublicJobs(), getPublicTenders()]);
  const jobRoutes = jobs.open.map((job) => ({ url: `${siteConfig.url}/careers/${job.id}`, changeFrequency: "weekly" as const }));
  const tenderRoutes = tenders.open.map((tender) => ({ url: `${siteConfig.url}/procurement/${tender.id}`, changeFrequency: "weekly" as const }));

  return [...staticRoutes, ...programRoutes, ...emergencyRoutes, ...impactRoutes, ...interventionRoutes, ...postRoutes, ...jobRoutes, ...tenderRoutes];
}
