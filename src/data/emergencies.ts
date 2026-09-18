import type { Emergency } from "@/types/content";

/**
 * Placeholder emergency catalog backing /emergencies and /emergencies/[id].
 * The "demo-regional-flood-response-2026" id must match the alert entry in
 * src/config/alerts.ts — that's what the sitewide crisis banner links to.
 */
export const emergencies: Emergency[] = [
  {
    id: "demo-regional-flood-response-2026",
    title: "Regional Flood Response",
    region: "East Africa",
    status: "active",
    severity: "critical",
    summary:
      "Placeholder: Field teams are deploying emergency shelter and clean water after severe regional flooding.",
    description: [
      "Placeholder copy: Sustained heavy rainfall has displaced tens of thousands of people across low-lying communities, cutting off access to clean water and damaging local health infrastructure.",
      "Placeholder copy: Field teams are on the ground distributing emergency shelter kits, purifying water, and running mobile health clinics for displaced families.",
    ],
    declaredAt: "January 2026",
    stats: [
      { label: "People displaced (est.)", value: "62,000" },
      { label: "Field teams deployed", value: "8" },
      { label: "Shelter kits distributed", value: "3,100" },
    ],
    relatedProgramIds: ["demo-clean-water-access", "demo-emergency-shelter"],
  },
  {
    id: "demo-coastal-storm-recovery-2025",
    title: "Coastal Storm Recovery",
    region: "Central America",
    status: "resolved",
    severity: "warning",
    summary:
      "Placeholder: Recovery and rebuilding support following a major coastal storm.",
    description: [
      "Placeholder copy: A major coastal storm damaged housing and infrastructure across several coastal communities in late 2025.",
      "Placeholder copy: The emergency phase concluded in early 2026; recovery work continues through the Emergency Shelter program.",
    ],
    declaredAt: "November 2025",
    stats: [
      { label: "Families supported", value: "9,400" },
      { label: "Response duration", value: "11 weeks" },
    ],
    relatedProgramIds: ["demo-emergency-shelter"],
  },
];
