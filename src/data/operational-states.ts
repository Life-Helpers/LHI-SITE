import type { InterventionProject } from "@/data/interventions-data";

/** Ids match the location ids used by the `@svg-maps/nigeria` map geometry. */
export type OperationalStateId =
  | "sokoto"
  | "adamawa"
  | "bauchi"
  | "borno"
  | "ebonyi"
  | "fct"
  | "katsina"
  | "kebbi"
  | "plateau"
  | "yobe"
  | "zamfara";

export type GeoZone = "North-West" | "North-East" | "North-Central" | "South-East";

export interface OperationalState {
  id: OperationalStateId;
  name: string;
  zone: GeoZone;
  /** LHI office in this state. */
  office?: string;
  /** Total LGAs (Area Councils for the FCT) in the state. */
  totalLgas: number;
  /**
   * LGAs reached and beneficiaries, as validated by the LHI M&E unit.
   * 0 means "not yet published" and the figure is hidden on the map.
   */
  lgasCovered: number;
  beneficiaries: number;
  focus: string;
}

/** The 11 states with an LHI office, per the Organisational Profile and Strategic Plan 2026–2030. */
export const OPERATIONAL_STATES: OperationalState[] = [
  {
    id: "sokoto",
    name: "Sokoto",
    zone: "North-West",
    office: "Headquarters, Goshen Development Centre, Tamaje",
    totalLgas: 23,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "National headquarters. Maternal and newborn health, nutrition, food security, resilience, protection and emergency response.",
  },
  {
    id: "zamfara",
    name: "Zamfara",
    zone: "North-West",
    office: "Gusau",
    totalLgas: 14,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Multi-sectoral humanitarian response, child marriage prevention and adolescent girls' empowerment.",
  },
  {
    id: "kebbi",
    name: "Kebbi",
    zone: "North-West",
    office: "Birnin Kebbi",
    totalLgas: 21,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Child health through facility and community interventions, and adolescent girls' empowerment (REACH).",
  },
  {
    id: "katsina",
    name: "Katsina",
    zone: "North-West",
    office: "Katsina (GRA)",
    totalLgas: 34,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Resilience building for smallholder farmers, cash-based transfers, VSLAs and the Gidan Arziki farmer service centre.",
  },
  {
    id: "borno",
    name: "Borno",
    zone: "North-East",
    office: "Maiduguri",
    totalLgas: 27,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Life-saving health and nutrition, emergency medico-nutritional services, peacebuilding and livelihoods.",
  },
  {
    id: "yobe",
    name: "Yobe",
    zone: "North-East",
    office: "Damaturu",
    totalLgas: 17,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Nutrition, WASH and protection for conflict-affected households, durable solutions and girls' education.",
  },
  {
    id: "adamawa",
    name: "Adamawa",
    zone: "North-East",
    office: "Jimeta, Yola",
    totalLgas: 21,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "CSO-led peacebuilding in the Lake Chad Basin, livelihoods and protection.",
  },
  {
    id: "bauchi",
    name: "Bauchi",
    zone: "North-East",
    office: "Bauchi",
    totalLgas: 20,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Child health and nutrition through primary healthcare strengthening and community outreach.",
  },
  {
    id: "plateau",
    name: "Plateau",
    zone: "North-Central",
    office: "Jos",
    totalLgas: 17,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Malaria case management, data management and malaria in pregnancy across 327 primary healthcare centres.",
  },
  {
    id: "fct",
    name: "FCT Abuja",
    zone: "North-Central",
    office: "Liaison Office, Gwarimpa",
    totalLgas: 6,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Liaison office for donor, partner and federal government coordination.",
  },
  {
    id: "ebonyi",
    name: "Ebonyi",
    zone: "South-East",
    office: "Abakaliki",
    totalLgas: 13,
    lgasCovered: 0,
    beneficiaries: 0,
    focus: "Food-based approaches to reducing malnutrition in children under 5 across supported PHCs.",
  },
];

export function getInterventionsForState(interventions: InterventionProject[], id: OperationalStateId) {
  return interventions.filter((project) => project.states.includes(id));
}

export function getDonorsForState(interventions: InterventionProject[], id: OperationalStateId) {
  return Array.from(new Set(getInterventionsForState(interventions, id).map((project) => project.donor)));
}
