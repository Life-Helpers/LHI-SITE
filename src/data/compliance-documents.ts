import { siteConfig } from "@/config/site";

export type ComplianceCategory =
  | "Organisational documents"
  | "Registration & tax"
  | "Financial accountability"
  | "Safeguarding & integrity";

export interface ComplianceDocument {
  id: string;
  title: string;
  category: ComplianceCategory;
  description: string;
  /**
   * Public path of the file (e.g. "/documents/cac-certificate.pdf" placed in /public/documents).
   * Leave undefined until the certified copy is uploaded; the portal then offers "Request a copy".
   */
  file?: string;
  /** Internal page to link instead of a file. */
  href?: string;
}

export const COMPLIANCE_DOCUMENTS: ComplianceDocument[] = [
  {
    id: "organisational-profile",
    title: "Organisational Profile",
    category: "Organisational documents",
    description: "Who we are, leadership, strategies, thematic focus, offices and project experience.",
    file: "/documents/lhi-organisational-profile.pdf",
  },
  {
    id: "strategic-plan-2026-2030",
    title: "Strategic Plan 2026–2030",
    category: "Organisational documents",
    description: "Goal, expected results, key strategies, theory of change and institutional capacity plan.",
    file: "/documents/lhi-strategic-plan-2026-2030.pdf",
  },
  {
    id: "project-magazine-vol-1",
    title: "Project Magazine: Cultivating Resilience, Vol. 1",
    category: "Organisational documents",
    description: "The FCDO/WFP Resilience Building and Smallholder Farmers Support Project, Sept 2025 – Feb 2026.",
    file: "/documents/cultivating-resilience-magazine-vol-1.pdf",
  },
  {
    id: "cac-certificate",
    title: "CAC Certificate of Incorporation",
    category: "Registration & tax",
    description: `Registered with the Corporate Affairs Commission of Nigeria as an incorporated trustee (${siteConfig.cacRegistration}).`,
  },
  {
    id: "tax-clearance",
    title: "Tax Clearance Certificate",
    category: "Registration & tax",
    description: "Current tax clearance certificate confirming LHI's compliance with Nigerian tax obligations.",
  },
  {
    id: "audited-financials",
    title: "Audited Financial Statements",
    category: "Financial accountability",
    description: "Independently audited financial statements for the last three financial years.",
  },
  {
    id: "annual-reports",
    title: "Annual & Impact Reports",
    category: "Financial accountability",
    description: "Programme results, strategic indicators and institutional reporting.",
    href: "/impact",
  },
  {
    id: "psea-policy",
    title: "PSEA Policy",
    category: "Safeguarding & integrity",
    description: "Prevention of Sexual Exploitation and Abuse policy, reporting channels and investigation procedures.",
  },
  {
    id: "child-safeguarding",
    title: "Child Safeguarding Policy",
    category: "Safeguarding & integrity",
    description:
      "Principles, code of conduct, reporting flow, case management, disciplinary committee and prevention measures protecting children and vulnerable adults.",
    file: "/documents/lhi-child-safeguarding-policy.pdf",
  },
  {
    id: "anti-fraud",
    title: "Anti-Fraud & Anti-Corruption Policy",
    category: "Safeguarding & integrity",
    description: "Zero-tolerance commitments, internal controls and whistle-blowing procedures.",
  },
];
