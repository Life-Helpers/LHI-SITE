/**
 * NIDAKE dignity kit economics used by the impact calculator and Sponsor-A-Girl packs.
 * KIT_COST_USD is a provisional figure: confirm with the NIDAKE enterprise team before launch.
 */
export const NIDAKE_KIT = {
  costUsd: 15,
  yearsOfDignity: 3,
  schoolDaysSaved: 180,
} as const;

export interface SponsorPack {
  id: string;
  name: string;
  kits: number;
  audience: string;
}

export const SPONSOR_PACKS: SponsorPack[] = [
  { id: "one-girl", name: "Sponsor a Girl", kits: 1, audience: "One schoolgirl in a rural community" },
  { id: "classroom", name: "Classroom Pack", kits: 10, audience: "A classroom of adolescent girls" },
  { id: "camp", name: "Displaced Camp Pack", kits: 25, audience: "Girls in an IDP camp learning centre" },
  { id: "school", name: "Whole-School Pack", kits: 100, audience: "Every girl in a rural secondary school" },
];

export function donateHrefForKits(kits: number) {
  const amount = kits * NIDAKE_KIT.costUsd;
  return `/donate?amount=${amount}&designation=nidake&kits=${kits}`;
}
