import type { EmergencyAlert } from "@/types/content";

/**
 * Global crisis banner feed. Add/remove/reorder entries here to activate or
 * clear alerts sitewide — the banner renders nothing when this is empty.
 * The first "critical" entry wins the banner's visual treatment.
 */
export const activeAlerts: EmergencyAlert[] = [
  {
    id: "demo-regional-flood-response-2026",
    severity: "critical",
    message:
      "Placeholder: Regional flood response is active. Field teams are deploying emergency shelter and clean water.",
    ctaLabel: "View response",
    href: "/emergencies/demo-regional-flood-response-2026",
  },
];
