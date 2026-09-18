export type AlertSeverity = "critical" | "warning";

export type EmergencyAlert = {
  id: string;
  severity: AlertSeverity;
  message: string;
  ctaLabel: string;
  href: string;
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
