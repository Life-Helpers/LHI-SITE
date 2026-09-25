import { LHI_PHOTOS } from "@/data/lhi-photos";
import { PROGRAM_GALLERIES } from "@/data/program-galleries";
import type { CmsPost } from "@/lib/cms/types";

/** Photo stories built from LHI's photo collections. Seeded as CMS posts; editable in Admin → Posts. */

const SECTIONS: { id: string; heading: string }[] = [
  { id: "health", heading: "Health, nutrition and immunisation" },
  { id: "education", heading: "Education" },
  { id: "social-inclusion", heading: "Inclusion and dignity" },
  { id: "food-security", heading: "From seed to plate" },
  { id: "livelihood", heading: "Women rising" },
  { id: "protection", heading: "Protection" },
];

const COVER = LHI_PHOTOS.healthAmbassadorsTraining;

// The cover photo already heads the post, so it is not repeated in the body.
const body = SECTIONS.map(({ id, heading }) => {
  const photos = (PROGRAM_GALLERIES[id] ?? []).filter(({ photo }) => LHI_PHOTOS[photo].src !== COVER.src).map(({ photo, caption }) => {
    const p = LHI_PHOTOS[photo];
    return `![${p.alt}](${p.src})\n\n*${caption}*`;
  });
  return `## ${heading}\n\n${photos.join("\n\n")}`;
}).join("\n\n");

export const PHOTO_STORY_POSTS: CmsPost[] = [
  {
    id: "photo-story-health-ambassadors",
    slug: "health-ambassadors-lhi-in-pictures",
    title: "Health Ambassadors: Life Helpers Initiative in Pictures",
    category: "News",
    date: "2026-09-24",
    author: "LHI Communications",
    authorId: "",
    status: "published",
    featured: false,
    featuredImage: COVER.src,
    tags: ["Photo story", "Health", "Nutrition", "Immunisation", "NIDAKE", "Education", "GBV"],
    excerpt:
      "Training health educators, immunising children, teaching nutrition from seed to plate, and standing against gender-based violence: our work in pictures.",
    updatedAt: "2026-09-24",
    content: `Health ambassadors are at the heart of Life Helpers Initiative's journey: we train experts for communities, building a healthier tomorrow one educator at a time. These photos show that work, and the wider work it supports, in communities across our states.

${body}

See more on our thematic area pages: [Health](/health), [Education](/education), [Livelihood](/livelihood), [Food Security](/food-security), [Social Inclusion](/social-inclusion) and [Protection](/protection).`,
  },
];
