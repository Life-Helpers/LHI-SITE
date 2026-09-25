/**
 * LHI's six thematic areas: the one place their ids, names, links and numbering are defined.
 * The project directory badges, admin pickers, programme pages and home page tiles all read
 * from here. Translated menu labels live in src/i18n (keyed by the same ids).
 */
export const THEMATIC_AREA_IDS = ["health", "education", "livelihood", "food-security", "social-inclusion", "protection"] as const;

export type ThematicAreaId = (typeof THEMATIC_AREA_IDS)[number];

export interface ThematicArea {
  id: ThematicAreaId;
  /** "01"–"06", the order used across the site. */
  number: string;
  /** Short name: page titles and home page tiles. */
  name: string;
  /** Fuller label: project badges, filters and admin pickers. */
  label: string;
  href: string;
  /** One-line scope, shown with the project filters. */
  scope: string;
}

export const THEMATIC_AREAS: Record<ThematicAreaId, ThematicArea> = {
  health: {
    id: "health",
    number: "01",
    name: "Health",
    label: "Health & WASH",
    href: "/health",
    scope: "Maternal & infant care, clinical malaria mitigation, Tom Brown nutrition, solar clean water.",
  },
  education: {
    id: "education",
    number: "02",
    name: "Education",
    label: "Education",
    href: "/education",
    scope: "Accelerated learning centers, girl-child retention, literacy hubs & non-formal learning.",
  },
  livelihood: {
    id: "livelihood",
    number: "03",
    name: "Livelihood",
    label: "Livelihood",
    href: "/livelihood",
    scope: "VSLA community savings, vocational start-up kits (tailoring, soap making), and cash grants.",
  },
  "food-security": {
    id: "food-security",
    number: "04",
    name: "Food Security",
    label: "Food Security",
    href: "/food-security",
    scope: "Climate-smart agriculture, dry-season irrigation, small ruminant livestock & market linkages.",
  },
  "social-inclusion": {
    id: "social-inclusion",
    number: "05",
    name: "Social Inclusion",
    label: "Social Inclusion",
    href: "/social-inclusion",
    scope: "Civic governance, women in decision-making, disability rights & civic dialogues.",
  },
  protection: {
    id: "protection",
    number: "06",
    name: "Protection",
    label: "Protection & GBV",
    href: "/protection",
    scope: "Spotlight Initiative, safe spaces, SGBV survivor psycho-social aid & child safeguarding.",
  },
};

export const THEMATIC_AREA_LIST: ThematicArea[] = THEMATIC_AREA_IDS.map((id) => THEMATIC_AREAS[id]);

export function isThematicAreaId(value: string): value is ThematicAreaId {
  return (THEMATIC_AREA_IDS as readonly string[]).includes(value);
}
