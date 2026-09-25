import type { Dictionary, Locale } from "@/i18n/types";

/**
 * Home page text that editors can override per language in Admin → Home Page Text.
 * Keys are paths into the `home` section of the i18n dictionaries; an empty override
 * falls back to the built-in translation, so nothing changes until an editor saves text.
 */
export interface HomeTextField {
  key: string;
  label: string;
  multiline?: boolean;
  /** One item per line (e.g. core values). */
  list?: boolean;
}

export interface HomeTextSection {
  title: string;
  fields: HomeTextField[];
}

export const HOME_TEXT_SECTIONS: HomeTextSection[] = [
  {
    title: "Impact statistics (labels)",
    fields: [
      { key: "stats.statesActive", label: "States label" },
      { key: "stats.individualsReached", label: "Individuals label" },
      { key: "stats.householdsReached", label: "Households label" },
      { key: "stats.yearsOfService", label: "Years label" },
    ],
  },
  {
    title: "Who We Are, vision, mission and values",
    fields: [
      { key: "whoWeAre.eyebrow", label: "Eyebrow" },
      { key: "whoWeAre.heading", label: "Heading" },
      { key: "whoWeAre.body", label: "Introduction", multiline: true },
      { key: "whoWeAre.visionTitle", label: "Vision title" },
      { key: "whoWeAre.visionBody", label: "Vision", multiline: true },
      { key: "whoWeAre.missionTitle", label: "Mission title" },
      { key: "whoWeAre.missionBody", label: "Mission", multiline: true },
      { key: "whoWeAre.valuesTitle", label: "Values title" },
      { key: "whoWeAre.values", label: "Core values", multiline: true, list: true },
      { key: "whoWeAre.moreAboutLhi", label: "Link text" },
    ],
  },
  {
    title: "What We Do",
    fields: [
      { key: "whatWeDo.heading", label: "Heading" },
      { key: "whatWeDo.subtitle", label: "Subtitle", multiline: true },
      { key: "whatWeDo.viewAllPrograms", label: "Button text" },
    ],
  },
  {
    title: "Latest from LHI",
    fields: [
      { key: "latest.heading", label: "Heading" },
      { key: "latest.subtitle", label: "Subtitle" },
      { key: "latest.eventsTitle", label: "Events card title" },
      { key: "latest.eventsNote", label: "Events card text", multiline: true },
      { key: "latest.eventsCta", label: "Events card button" },
      { key: "latest.blogTitle", label: "Blog card title" },
      { key: "latest.blogNote", label: "Blog card text", multiline: true },
      { key: "latest.blogCta", label: "Blog card button" },
    ],
  },
  {
    title: "WeSpeak radio",
    fields: [
      { key: "radio.eyebrow", label: "Eyebrow" },
      { key: "radio.heading", label: "Heading" },
      { key: "radio.body", label: "Description", multiline: true },
      { key: "radio.cta", label: "Button text" },
    ],
  },
  {
    title: "Testimonials and partners",
    fields: [
      { key: "testimonials.heading", label: "Testimonials heading" },
      { key: "testimonials.subtitle", label: "Testimonials subtitle", multiline: true },
      { key: "partners.heading", label: "Partners heading" },
      { key: "partners.subtitle", label: "Partners subtitle", multiline: true },
    ],
  },
  {
    title: "Our Philosophy",
    fields: [
      { key: "philosophy.heading", label: "Heading" },
      { key: "philosophy.quote", label: "Quote", multiline: true },
      { key: "philosophy.highlight", label: "Highlighted line" },
      { key: "philosophy.attribution", label: "Attribution" },
    ],
  },
  {
    title: "Newsletter sign-up",
    fields: [
      { key: "newsletter.heading", label: "Heading" },
      { key: "newsletter.body", label: "Text", multiline: true },
      { key: "newsletter.subscribeCta", label: "Button text" },
    ],
  },
];

export const HOME_TEXT_FIELDS = HOME_TEXT_SECTIONS.flatMap((s) => s.fields);

export type HomeTextValues = Record<string, string | string[]>;
export type HomeTextByLocale = Partial<Record<Locale, HomeTextValues>>;

const MAX_TEXT = 2000;
const MAX_LIST_ITEMS = 8;

/** Keep only known keys with non-empty, length-limited values. */
export function sanitizeHomeText(input: unknown): HomeTextValues {
  const out: HomeTextValues = {};
  if (!input || typeof input !== "object") return out;
  const raw = input as Record<string, unknown>;
  for (const field of HOME_TEXT_FIELDS) {
    const value = raw[field.key];
    if (field.list) {
      const items = (Array.isArray(value) ? value : typeof value === "string" ? value.split("\n") : [])
        .map((v) => String(v).trim().slice(0, MAX_TEXT))
        .filter(Boolean)
        .slice(0, MAX_LIST_ITEMS);
      if (items.length) out[field.key] = items;
    } else if (typeof value === "string" && value.trim()) {
      out[field.key] = value.trim().slice(0, MAX_TEXT);
    }
  }
  return out;
}

/** The built-in value of a field, for placeholders in the editor. */
export function homeTextDefault(home: Dictionary["home"], key: string): string | string[] {
  const [section, name] = key.split(".");
  const group = (home as unknown as Record<string, Record<string, string | string[]>>)[section];
  return group?.[name] ?? "";
}

/** The home dictionary with an editor's overrides applied on top. */
export function applyHomeText(home: Dictionary["home"], values?: HomeTextValues): Dictionary["home"] {
  if (!values || Object.keys(values).length === 0) return home;
  const merged = structuredClone(home) as unknown as Record<string, Record<string, unknown>>;
  for (const [key, value] of Object.entries(values)) {
    const [section, name] = key.split(".");
    if (!merged[section] || !(name in merged[section])) continue;
    if (Array.isArray(value) ? value.length > 0 : Boolean(value)) merged[section][name] = value;
  }
  return merged as unknown as Dictionary["home"];
}
