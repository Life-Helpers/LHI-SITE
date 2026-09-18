export type AlertSeverity = "critical" | "warning";

export type EmergencyAlert = {
  id: string;
  severity: AlertSeverity;
  message: string;
  ctaLabel: string;
  href: string;
};

export type EmergencyStatus = "active" | "resolved";

export type Emergency = {
  /** URL slug, used to build /emergencies/[id]. Alert banners reference this via href. */
  id: string;
  title: string;
  region: string;
  status: EmergencyStatus;
  severity: AlertSeverity;
  /** Short blurb for cards. */
  summary: string;
  /** Full body copy for the emergency detail page, one entry per paragraph. */
  description: string[];
  /** e.g. "January 2026" */
  declaredAt: string;
  stats: { label: string; value: string }[];
  /** Program ids (see Program["id"]) responding to this emergency. */
  relatedProgramIds: string[];
};

export type ProgramStatus = "active" | "completed";

export type Program = {
  /** URL slug, used to build /programs/[id] */
  id: string;
  name: string;
  region: string;
  status: ProgramStatus;
  /** Short blurb for cards. */
  summary: string;
  /** Full body copy for the program detail page, one entry per paragraph. */
  description: string[];
  metricLabel: string;
  metricValue: string;
  /** Additional stats shown on the detail page. */
  stats: { label: string; value: string }[];
  /** Whether this shows in the homepage impact module. */
  featured: boolean;
};

export type ImpactReport = {
  /** URL slug, used to build /impact/[id] */
  id: string;
  title: string;
  /** e.g. "January–December 2025" */
  period: string;
  /** e.g. "March 2026" */
  publishedAt: string;
  summary: string;
  /** Full body copy for the report detail page, one entry per paragraph. */
  description: string[];
  stats: { label: string; value: string }[];
  /** Program ids (see Program["id"]) covered by this report. */
  relatedProgramIds: string[];
};
