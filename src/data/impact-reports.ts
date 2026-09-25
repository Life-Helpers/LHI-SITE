import type { ImpactReport } from "@/types/content";
import { LHI_PHOTOS } from "./lhi-photos";

/**
 * First-run impact reports for Admin → Impact Reports: real, cumulative organisation-wide
 * figures from LHI's own content brief.
 */
export const impactReports: ImpactReport[] = [
  {
    id: "cumulative-impact",
    title: "Cumulative Impact Since 2004",
    period: "October 2004 – present",
    publishedAt: "based on LHI's most recent organizational figures",
    summary:
      "Two decades of grassroots and humanitarian service across 11 Nigerian states.",
    description: [
      "Life Helpers Initiative (LHI) was established on October 1, 2004, initially founded as the Beulah Project supporting children at the orphanage in Sokoto. Over more than two decades of grassroots and humanitarian service, LHI has grown into a national non-governmental, not-for-profit organization operating across 11 states in Nigeria.",
      "These figures are cumulative organization-wide totals rather than a per-project or per-year breakdown — a real audited annual report with a full financial and per-program split would replace this page once available.",
    ],
    stats: [
      { label: "Individuals reached", value: "1.5M+" },
      { label: "Households reached", value: "400,000+" },
      { label: "Projects completed", value: "45+" },
      { label: "States active", value: "11" },
      { label: "Full-time staff", value: "350+" },
      { label: "Trained volunteers", value: "700+" },
    ],
    relatedProgramIds: [
      "health",
      "education",
      "livelihood",
      "food-security",
      "social-inclusion",
      "protection",
    ],
    image: LHI_PHOTOS.beneficiaryRegistration.src,
    imageAlt: LHI_PHOTOS.beneficiaryRegistration.alt,
  },
];
