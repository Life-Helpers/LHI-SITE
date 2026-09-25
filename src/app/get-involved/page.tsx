import type { Metadata } from "next";

import { GetInvolvedView } from "@/components/get-involved/get-involved-view";
import { siteConfig } from "@/config/site";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { getPublicJobs } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Volunteer & Get Involved",
  description:
    "Volunteer, donate, partner, or advocate with Life Helpers Initiative across 11 states in Nigeria. Community health outreach, education, emergency food security, and protection.",
  keywords: [
    "Volunteer Nigeria",
    "Humanitarian Volunteer Sokoto",
    "NGO Partnership Nigeria",
    "Get Involved Life Helpers Initiative",
    "Community Health Outreach",
    "Emergency Relief Volunteer",
  ],
  openGraph: {
    title: "Volunteer & Get Involved | Life Helpers Initiative",
    description:
      "This mission takes all of us. Choose your path to support life-saving humanitarian work and grassroots community development.",
    images: [LHI_PHOTOS.annualExhibition.src],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Volunteer & Get Involved",
  description:
    "Ways to volunteer, partner, donate, or advocate with Life Helpers Initiative across 11 operational states in Nigeria.",
  publisher: {
    "@type": "NGO",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default async function GetInvolvedPage() {
  const { open } = await getPublicJobs();
  const openings = open
    .filter((j) => j.employmentType === "Volunteer")
    .map(({ id, title, location, deadline }) => ({ id, title, location, deadline }));
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GetInvolvedView openings={openings} />
    </main>
  );
}

