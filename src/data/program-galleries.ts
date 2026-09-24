import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";

/**
 * "In pictures" galleries on the thematic area pages. Photos and captions come from
 * LHI's "Health Ambassadors" photo collection; a few photos were already on the site
 * (healthScreening, healthOutreach, learningCentre) and are reused rather than copied.
 */
export interface GalleryPhoto {
  photo: LhiPhotoKey;
  caption: string;
}

export const PROGRAM_GALLERIES: Record<string, GalleryPhoto[]> = {
  health: [
    { photo: "healthAmbassadorsTraining", caption: "Health ambassadors: training experts for communities, building a healthier tomorrow, one educator at a time." },
    { photo: "maternalHealthSession", caption: "One birth at a time: LHI health workers highlight maternal health and common childhood illnesses to build healthy communities." },
    { photo: "immunisationRegister", caption: "Immunisation for all: ensuring equal access to protection." },
    { photo: "nutritionMotherChild", caption: "Nutrition nurtured: working for healthier lives for children through the BHA project." },
    { photo: "vaccinationOutreach", caption: "Protecting our future, one vaccine at a time." },
    { photo: "immunisationAdvocacy", caption: "Guardians of health: immunisation advocacy safeguarding communities." },
    { photo: "vaccinationChampions", caption: "Vaccination champions: building resilient communities, shield by shield." },
    { photo: "nutritionFoodDemo", caption: "Our nutrition journey, lighting the path to health and vitality." },
    { photo: "nutritionCookingDemo", caption: "Nutrition nurtured: empowering communities through nutritional awareness." },
    { photo: "nutritionAwarenessCooking", caption: "Nourishing communities by fostering nutritional awareness for healthier lives." },
    { photo: "healthScreening", caption: "Training experts who will transform communities." },
    { photo: "healthAwarenessHall", caption: "Our health awareness and training efforts in many forms." },
    { photo: "healthOutreach", caption: "Spreading hope: health awareness bridging gaps in healthcare through education and advocacy." },
  ],
  education: [
    { photo: "learningCentre", caption: "Education unleashed: supporting dreams and opening doors to opportunity through education." },
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
    { photo: "gbvAwarenessMarch", caption: "Breaking chains, building bridges: taking on gender-based violence and promoting safety, equality and empowerment." },
  ],
};

export function programGallery(programId: string) {
  return (PROGRAM_GALLERIES[programId] ?? []).map((g) => ({ ...LHI_PHOTOS[g.photo], caption: g.caption }));
}
