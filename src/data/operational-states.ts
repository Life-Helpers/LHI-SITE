import { INTERVENTIONS_DATA } from "@/data/interventions-data";

/** Ids match the location ids used by the `@svg-maps/nigeria` map geometry. */
export type OperationalStateId =
  | "sokoto"
  | "zamfara"
  | "kebbi"
  | "borno"
  | "yobe"
  | "adamawa"
  | "bauchi"
  | "kano"
  | "kaduna"
  | "niger"
  | "fct";

export type GeoZone = "North-West" | "North-East" | "North-Central";

export interface OperationalState {
  id: OperationalStateId;
  name: string;
  zone: GeoZone;
  /** City of the LHI office in this state, if one exists. */
  office?: string;
  /** Total LGAs (Area Councils for the FCT) in the state. */
  totalLgas: number;
  /**
   * PROVISIONAL: LGAs reached and beneficiaries figures are placeholders pending
   * validation by the LHI M&E unit. Update them here and every map view follows.
   */
  lgasCovered: number;
  beneficiaries: number;
  focus: string;
}

export const OPERATIONAL_STATES: OperationalState[] = [
  {
    id: "sokoto",
    name: "Sokoto",
    zone: "North-West",
    office: "Sokoto (National HQ)",
    totalLgas: 23,
    lgasCovered: 23,
    beneficiaries: 560000,
    focus: "Headquarters state: GBV response, malaria, HIV, nutrition, governance and girls' education.",
  },
  {
    id: "zamfara",
    name: "Zamfara",
    zone: "North-West",
    office: "Gusau",
    totalLgas: 14,
    lgasCovered: 9,
    beneficiaries: 380000,
    focus: "Malaria case management, stabilization of host and displaced communities, and nutrition resilience.",
  },
  {
    id: "kebbi",
    name: "Kebbi",
    zone: "North-West",
    office: "Birnin-Kebbi",
    totalLgas: 21,
    lgasCovered: 8,
    beneficiaries: 110000,
    focus: "Adolescent girls' empowerment, private-sector health engagement and civic inclusion.",
  },
  {
    id: "borno",
    name: "Borno",
    zone: "North-East",
    office: "Maiduguri",
    totalLgas: 27,
    lgasCovered: 6,
    beneficiaries: 160000,
    focus: "Emergency child protection, disaster-response coordination and agricultural resilience in Jere, MMC and Biu.",
  },
  {
    id: "yobe",
    name: "Yobe",
    zone: "North-East",
    office: "Damaturu",
    totalLgas: 17,
    lgasCovered: 5,
    beneficiaries: 120000,
    focus: "Early recovery, youth vocations, child protection and community resilience in Bade, Jakusko and Damaturu.",
  },
  {
    id: "adamawa",
    name: "Adamawa",
    zone: "North-East",
    office: "Jimeta, Yola",
    totalLgas: 21,
    lgasCovered: 4,
    beneficiaries: 40000,
    focus: "Humanitarian coordination and disaster preparedness under the ECODiN consortium.",
  },
  {
    id: "bauchi",
    name: "Bauchi",
    zone: "North-East",
    office: "Bauchi",
    totalLgas: 20,
    lgasCovered: 5,
    beneficiaries: 55000,
    focus: "Maternal, newborn and adolescent health through the SHOW project.",
  },
  {
    id: "kano",
    name: "Kano",
    zone: "North-West",
    totalLgas: 44,
    lgasCovered: 3,
    beneficiaries: 25000,
    focus: "Peace and women's-rights advocacy through the Women Situation Room radio network.",
  },
  {
    id: "kaduna",
    name: "Kaduna",
    zone: "North-West",
    totalLgas: 23,
    lgasCovered: 3,
    beneficiaries: 20000,
    focus: "Peacebuilding broadcasts and community listening clubs.",
  },
  {
    id: "niger",
    name: "Niger",
    zone: "North-Central",
    totalLgas: 25,
    lgasCovered: 2,
    beneficiaries: 15000,
    focus: "Radio advocacy on maternal health, child protection and conflict resolution.",
  },
  {
    id: "fct",
    name: "FCT Abuja",
    zone: "North-Central",
    office: "Gwarimpa, Abuja (Liaison)",
    totalLgas: 6,
    lgasCovered: 2,
    beneficiaries: 15000,
    focus: "Donor liaison, national coordination and policy advocacy.",
  },
];

export function getInterventionsForState(id: OperationalStateId) {
  return INTERVENTIONS_DATA.filter((project) => project.states.includes(id));
}

export function getDonorsForState(id: OperationalStateId) {
  return Array.from(new Set(getInterventionsForState(id).map((project) => project.donor)));
}
