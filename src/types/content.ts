export type AlertSeverity = "critical" | "warning";

export type EmergencyAlert = {
  id: string;
  severity: AlertSeverity;
  message: string;
  ctaLabel: string;
  href: string;
};

export type Program = {
  id: string;
  name: string;
  region: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  href: string;
};
