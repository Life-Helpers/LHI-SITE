import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { emergencies } from "@/data/emergencies";
import { impactReports } from "@/data/impact-reports";
import { getInterventions, getPublishedPosts } from "@/lib/cms/content";
import { programs } from "@/data/programs";
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
    "/news-updates",
    "/events",
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

  const programRoutes = programs.map((program) => ({
    url: `${siteConfig.url}/${program.id}`,
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

  return [...staticRoutes, ...programRoutes, ...emergencyRoutes, ...impactRoutes, ...interventionRoutes, ...postRoutes];
}
