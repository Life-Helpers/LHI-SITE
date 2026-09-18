import type { Program } from "@/types/content";

/** Placeholder program data for the homepage impact module. */
export const featuredPrograms: Program[] = [
  {
    id: "demo-clean-water-access",
    name: "Clean Water Access",
    region: "East Africa",
    summary:
      "Placeholder: Well construction and water purification for displaced communities.",
    metricLabel: "People reached",
    metricValue: "48,200",
    href: "/programs/demo-clean-water-access",
  },
  {
    id: "demo-mobile-health-clinics",
    name: "Mobile Health Clinics",
    region: "South Asia",
    summary:
      "Placeholder: Rapid-deployment clinics providing primary care in crisis zones.",
    metricLabel: "Patients treated",
    metricValue: "112,000",
    href: "/programs/demo-mobile-health-clinics",
  },
  {
    id: "demo-emergency-shelter",
    name: "Emergency Shelter",
    region: "Central America",
    summary:
      "Placeholder: Transitional housing and relief supplies after natural disasters.",
    metricLabel: "Families housed",
    metricValue: "9,400",
    href: "/programs/demo-emergency-shelter",
  },
];
