import type { Program } from "@/types/content";

/** Placeholder program catalog backing /programs and /programs/[id]. */
export const programs: Program[] = [
  {
    id: "demo-clean-water-access",
    name: "Clean Water Access",
    region: "East Africa",
    status: "active",
    summary:
      "Placeholder: Well construction and water purification for displaced communities.",
    description: [
      "Placeholder copy: This program installs boreholes, protected wells, and household water purification units in communities affected by displacement and drought.",
      "Placeholder copy: Field teams work with local water authorities to ensure each installation is maintained after handoff, pairing infrastructure with hygiene education.",
    ],
    metricLabel: "People reached",
    metricValue: "48,200",
    stats: [
      { label: "Wells built", value: "112" },
      { label: "Communities served", value: "34" },
      { label: "Active since", value: "2021" },
    ],
    featured: true,
  },
  {
    id: "demo-mobile-health-clinics",
    name: "Mobile Health Clinics",
    region: "South Asia",
    status: "active",
    summary:
      "Placeholder: Rapid-deployment clinics providing primary care in crisis zones.",
    description: [
      "Placeholder copy: Mobile clinics bring primary care, maternal health services, and vaccinations to communities cut off from fixed medical facilities.",
      "Placeholder copy: Each unit is staffed by a rotating team of local and international medical volunteers and can be repositioned within 48 hours of a new needs assessment.",
    ],
    metricLabel: "Patients treated",
    metricValue: "112,000",
    stats: [
      { label: "Active clinics", value: "18" },
      { label: "Clinical staff", value: "64" },
      { label: "Active since", value: "2019" },
    ],
    featured: true,
  },
  {
    id: "demo-emergency-shelter",
    name: "Emergency Shelter",
    region: "Central America",
    status: "active",
    summary:
      "Placeholder: Transitional housing and relief supplies after natural disasters.",
    description: [
      "Placeholder copy: This program provides transitional shelter kits, blankets, and relief supplies to families displaced by hurricanes and flooding.",
      "Placeholder copy: Shelter kits are pre-positioned in regional warehouses so distribution can begin within 72 hours of a disaster declaration.",
    ],
    metricLabel: "Families housed",
    metricValue: "9,400",
    stats: [
      { label: "Shelter kits distributed", value: "9,400" },
      { label: "Regional warehouses", value: "6" },
      { label: "Active since", value: "2022" },
    ],
    featured: true,
  },
  {
    id: "demo-school-feeding",
    name: "School Feeding Program",
    region: "West Africa",
    status: "active",
    summary:
      "Placeholder: Daily meals and nutrition monitoring for children in crisis-affected schools.",
    description: [
      "Placeholder copy: Daily meals keep children enrolled in school during food insecurity crises, paired with growth monitoring for early malnutrition detection.",
      "Placeholder copy: Meals are sourced from local producers where possible to support regional agricultural recovery alongside the direct nutrition benefit.",
    ],
    metricLabel: "Children fed daily",
    metricValue: "26,500",
    stats: [
      { label: "Schools supported", value: "88" },
      { label: "Meals served to date", value: "4.1M" },
      { label: "Active since", value: "2020" },
    ],
    featured: false,
  },
  {
    id: "demo-winter-relief",
    name: "Winter Relief",
    region: "Eastern Europe",
    status: "completed",
    summary:
      "Placeholder: Seasonal heating fuel and cold-weather supplies for displaced families.",
    description: [
      "Placeholder copy: This seasonal program distributed heating fuel, insulated tents, and cold-weather clothing to displaced families through the winter months.",
      "Placeholder copy: The program concluded at the end of the 2024–2025 winter season; a successor program is under evaluation for the next cold season.",
    ],
    metricLabel: "Families supported",
    metricValue: "5,100",
    stats: [
      { label: "Distribution sites", value: "12" },
      { label: "Season", value: "2024–2025" },
    ],
    featured: false,
  },
];
