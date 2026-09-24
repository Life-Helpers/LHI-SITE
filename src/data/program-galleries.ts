import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";

/**
 * "In pictures" galleries on the thematic area pages. Photos and captions come from
 * LHI's "Health Ambassadors" photo collection and the archive. No photo here is also used
 * as a thematic hero or a project's main photo, so pictures do not repeat across pages.
 */
export interface GalleryPhoto {
  photo: LhiPhotoKey;
  caption: string;
}

export const PROGRAM_GALLERIES: Record<string, GalleryPhoto[]> = {
  health: [
    { photo: "healthAmbassadorsTraining", caption: "Health ambassadors: training experts for communities, building a healthier tomorrow, one educator at a time." },
    { photo: "maternalHealthSession", caption: "One birth at a time: LHI health workers highlight maternal health and common childhood illnesses to build healthy communities." },
    { photo: "nutritionMotherChild", caption: "Nutrition nurtured: working for healthier lives for children through the BHA project." },
    { photo: "vaccinationOutreach", caption: "Protecting our future, one vaccine at a time." },
    { photo: "immunisationAdvocacy", caption: "Guardians of health: immunisation advocacy safeguarding communities." },
    { photo: "vaccinationChampions", caption: "Vaccination champions: building resilient communities, shield by shield." },
    { photo: "nutritionFoodDemo", caption: "Our nutrition journey, lighting the path to health and vitality." },
    { photo: "nutritionCookingDemo", caption: "Nutrition nurtured: empowering communities through nutritional awareness." },
    { photo: "nutritionAwarenessCooking", caption: "Nourishing communities by fostering nutritional awareness for healthier lives." },
    { photo: "healthAwarenessHall", caption: "Our health awareness and training efforts in many forms." },
  ],
  education: [
    { photo: "nidakePadEducation", caption: "NIDAKE pad education sessions break taboos, open conversations and keep girls learning." },
  ],
  livelihood: [
    { photo: "womenSavingsGroup", caption: "Women rising: savings groups and financial independence as a path to empowerment." },
  ],
  "food-security": [
    { photo: "microGardenCommunity", caption: "From seed to plate: nourishing communities through micro gardens." },
    { photo: "microGardenPots", caption: "Our nutrition initiatives in action, from fields to plates." },
    { photo: "nutritionAwarenessWomen", caption: "Empowering communities through nutritional awareness." },
  ],
  "social-inclusion": [
    { photo: "communityGathering", caption: "Creating a more fulfilled life for every person." },
    { photo: "nidakePadsGirls", caption: "NIDAKE reusable pads restore confidence and hygiene for marginalised girls and women, one pad at a time." },
  ],
  protection: [
    { photo: "dayOfGirlChildBanner", caption: "Ranar Yarinya Ta Duniya: marking the International Day of the Girl Child with communities." },
    { photo: "dayOfGirlChildWomen", caption: "Women and girls standing together for the rights of the girl child." },
  ],
};

export function programGallery(programId: string) {
  return (PROGRAM_GALLERIES[programId] ?? []).map((g) => ({ ...LHI_PHOTOS[g.photo], caption: g.caption }));
}
