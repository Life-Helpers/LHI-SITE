import type { LhiPhotoKey } from "@/data/lhi-photos";

/**
 * Seed "Before & After" stories for the home page (Admin → Before & After). Every
 * before/after statement is taken from LHI's project magazines and newsletter; the photo is
 * the person or place in the story. The "before" side is shown in black and white: a real
 * earlier photo when we have one, otherwise the same photo.
 */
export interface BeforeAfterStory {
  id: string;
  name: string;
  place: string;
  photo: LhiPhotoKey;
  /** A real photo from before the support; when missing, the "before" side shows the main photo in black and white. */
  beforePhoto?: LhiPhotoKey;
  before: { title: string; text: string };
  after: { title: string; text: string };
  href: string;
}

export const BEFORE_AFTER_STORIES: BeforeAfterStory[] = [
  {
    id: "jafaro",
    name: "Jafaro Baro",
    place: "Katsina LGA, Katsina State",
    photo: "jafaroCabbage",
    beforePhoto: "jafaroFieldBefore",
    before: { title: "One harvest, low prices", text: "Poor seeds took 80 days to mature; his cabbages sold for ₦175–₦200 each." },
    after: {
      title: "Two harvests, three times the price",
      text: "Improved seeds mature in 60 days, and his cabbages now sell for ₦500–₦600 each. “Now there is no day I return home without money in my hand.”",
    },
    href: "/blog/jafaro-harvesting-prosperity-twice-a-year",
  },
  {
    id: "murja",
    name: "Murja Yari",
    place: "Katsina State",
    photo: "murja",
    beforePhoto: "murjaPassbook",
    before: { title: "Eight years of struggle", text: "Widowed with 11 children and no income: “There were times when we spent up to five days without anything to eat.”" },
    after: {
      title: "A food business that runs all day",
      text: "She invested her ₦75,000 WFP cash transfer in food supplies, sells from morning until evening and saves weekly with a VSLA.",
    },
    href: "/blog/murja-eight-years-of-struggle-to-renewed-hope",
  },
  {
    id: "saudatu",
    name: "Saudatu Aliyu, 14",
    place: "Wurno LGA, Sokoto State",
    photo: "saudatu",
    before: { title: "Out of school", text: "Only her eldest sibling had ever attended school; Saudatu spent her days helping at the market." },
    after: {
      title: "Back in class, dreaming of medicine",
      text: "Enrolled through the EU/UNICEF ABEP, she walks to school with her friends. “Ilmi shi ne hasken rayuwa” (Education is the light of life).",
    },
    href: "/blog/saudatu-a-bag-a-dream",
  },
  {
    id: "azima",
    name: "Azima Bello",
    place: "Zamfara State",
    photo: "azimaAtHome",
    beforePhoto: "azima",
    before: { title: "A child bride at fifteen", text: "Forced into marriage at fifteen, she returned home broken and without hope." },
    after: {
      title: "A skilled apprentice and saver",
      text: "Through the UNICEF Early Child Marriage project she found a safe space, learned tailoring and is saving for her own sewing machine.",
    },
    href: "/blog/azima-future-stitched-with-hope",
  },
  {
    id: "noma",
    name: "Noma Tushen Arziki Hub",
    place: "Wamakko LGA, Sokoto State",
    photo: "hubAerial",
    beforePhoto: "hubConstruction",
    before: { title: "A construction site", text: "In October 2025 the hub in Wamakko was still a construction site, with buildings going up and the demonstration farm being laid out." },
    after: {
      title: "A working farming wealth hub",
      text: "Commissioned on 27 November 2025 with WFP and FCDO: rice milling, cold storage, a fish farm, hire services and training, run by a community Facility Management Committee.",
    },
    href: "/blog/noma-tushen-arziki-farming-wealth-hub",
  },
];
