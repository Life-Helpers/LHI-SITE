import { siteConfig } from "@/config/site";

export type ComplianceCategory = "Registration & tax" | "Financial accountability" | "Safeguarding & integrity";

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
    description: "Standards of conduct, safe-recruitment practice and referral pathways protecting children in every programme.",
  },
  {
    id: "anti-fraud",
    title: "Anti-Fraud & Anti-Corruption Policy",
    category: "Safeguarding & integrity",
    description: "Zero-tolerance commitments, internal controls and whistle-blowing procedures.",
  },
];
