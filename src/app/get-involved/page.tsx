import type { Metadata } from "next";

import { GetInvolvedView } from "@/components/get-involved/get-involved-view";
import { siteConfig } from "@/config/site";

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
    images: ["https://images.pexels.com/photos/6647020/pexels-photo-6647020.jpeg"],
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

export default function GetInvolvedPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GetInvolvedView />
    </main>
  );
}

