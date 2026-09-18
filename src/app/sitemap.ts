import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { emergencies } from "@/data/emergencies";
import { impactReports } from "@/data/impact-reports";
import { programs } from "@/data/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/programs",
    "/emergencies",
    "/impact",
    "/about",
    "/contact",
    "/donate",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "weekly" as const,
  }));

  const programRoutes = programs.map((program) => ({
    url: `${siteConfig.url}/programs/${program.id}`,
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

  return [...staticRoutes, ...programRoutes, ...emergencyRoutes, ...impactRoutes];
}
