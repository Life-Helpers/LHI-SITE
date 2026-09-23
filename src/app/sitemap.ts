import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { emergencies } from "@/data/emergencies";
import { impactReports } from "@/data/impact-reports";
import { getInterventions, getPublishedPosts } from "@/lib/cms/content";
import { programs } from "@/data/programs";
import { COURSES } from "@/data/training/courses";

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
    "/news-updates",
    "/radio",
    "/radio-story",
    "/interventions/projectandintervention",
    "/partner-portal",
    "/careers",
    "/procurement",
    "/get-involved/training",
    ...COURSES.flatMap((c) => [`/get-involved/training/${c.id}`, ...c.lessons.map((l) => `/get-involved/training/${c.id}/${l.id}`)]),
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
