import type { ImpactReport } from "@/types/content";

/** Placeholder impact report catalog backing /impact and /impact/[id]. */
export const impactReports: ImpactReport[] = [
  {
    id: "fy2025",
    title: "FY2025 Impact Report",
    period: "January–December 2025",
    publishedAt: "March 2026",
    summary:
      "Placeholder: Full-year results across all active field programs and emergency responses.",
    description: [
      "Placeholder copy: This report summarizes program reach, spending, and outcomes across all field operations for the 2025 fiscal year.",
      "Placeholder copy: Figures shown here are illustrative scaffold data, not real audited results — replace with the actual audited financials before publishing.",
    ],
    stats: [
      { label: "People reached", value: "205,000" },
      { label: "Program spending ratio", value: "84%" },
      { label: "Countries active", value: "6" },
      { label: "Total raised", value: "$12.4M" },
    ],
    relatedProgramIds: [
      "demo-clean-water-access",
      "demo-mobile-health-clinics",
      "demo-emergency-shelter",
      "demo-school-feeding",
    ],
  },
  {
    id: "fy2024",
    title: "FY2024 Impact Report",
    period: "January–December 2024",
    publishedAt: "March 2025",
    summary:
      "Placeholder: Full-year results across all active field programs and emergency responses.",
    description: [
      "Placeholder copy: This report summarizes program reach, spending, and outcomes across all field operations for the 2024 fiscal year.",
      "Placeholder copy: Figures shown here are illustrative scaffold data, not real audited results — replace with the actual audited financials before publishing.",
    ],
    stats: [
      { label: "People reached", value: "168,500" },
      { label: "Program spending ratio", value: "82%" },
      { label: "Countries active", value: "5" },
      { label: "Total raised", value: "$9.8M" },
    ],
    relatedProgramIds: ["demo-winter-relief", "demo-emergency-shelter"],
  },
];
