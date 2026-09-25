/**
 * NIDAKE dignity kit economics used by the impact calculator and Sponsor-A-Girl packs.
 * Prices are in Naira; costNgn can be changed in Admin → Settings.
 */
export const NIDAKE_KIT = {
  costNgn: 22500,
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

export const formatNaira = (amount: number) => `₦${new Intl.NumberFormat("en-NG").format(Math.round(amount))}`;

/** Links to the donate page with the kits and their Naira value; the donor chooses how to pay there. */
export function donateHrefForKits(kits: number, costNgn: number = NIDAKE_KIT.costNgn) {
  return `/donate?designation=nidake&kits=${kits}&ngn=${Math.round(kits * costNgn)}`;
}
