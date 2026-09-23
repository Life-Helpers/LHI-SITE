/**
 * Collection definitions for the admin CMS. Shared by the server (validation,
 * storage) and the admin UI (list tables and edit forms), so adding a field here
 * is enough for it to appear in the editor and be persisted.
 */

export type Role = "administrator" | "editor" | "author";

export const ROLE_LABELS: Record<Role, string> = {
  administrator: "Administrator",
  editor: "Editor",
  author: "Author",
};

const ROLE_RANK: Record<Role, number> = { author: 1, editor: 2, administrator: 3 };

export function hasRole(userRole: Role, minRole: Role) {
  return ROLE_RANK[userRole] >= ROLE_RANK[minRole];
}

export type FieldType =
  | "text"
  | "slug"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "multiselect"
  | "list"
  | "image"
  | "images"
  | "file"
  | "url";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: FieldOption[];
  /** Shown in the right-hand "Publish" sidebar instead of the main column. */
  sidebar?: boolean;
  /** For slug fields: the field the slug is generated from. */
  from?: string;
}

export interface CollectionDef {
  name: CollectionName;
  label: string;
  singular: string;
  description: string;
  minRole: Role;
  titleField: string;
  /** Columns shown in the list table (field names). */
  columns: string[];
  /** Field whose value drives the status filter tabs in the list. */
  statusField?: string;
  /** Items cannot be created or deleted (e.g. map states tied to map geometry). */
  fixed?: boolean;
  /** Public URL of an item, for the "View" link. */
  publicPath?: (item: Record<string, unknown>) => string | null;
  fields: FieldDef[];
}

export type CollectionName = "posts" | "interventions" | "states" | "partners" | "documents";

export const PILLAR_OPTIONS: FieldOption[] = [
  { value: "health", label: "Health & WASH" },
  { value: "education", label: "Education" },
  { value: "livelihood", label: "Livelihood" },
  { value: "food-security", label: "Food Security" },
  { value: "social-inclusion", label: "Social Inclusion" },
  { value: "protection", label: "Protection & GBV" },
];

export const STATE_OPTIONS: FieldOption[] = [
  { value: "sokoto", label: "Sokoto" },
  { value: "zamfara", label: "Zamfara" },
  { value: "kebbi", label: "Kebbi" },
  { value: "katsina", label: "Katsina" },
  { value: "borno", label: "Borno" },
  { value: "yobe", label: "Yobe" },
  { value: "adamawa", label: "Adamawa" },
  { value: "bauchi", label: "Bauchi" },
  { value: "plateau", label: "Plateau" },
  { value: "fct", label: "FCT Abuja" },
  { value: "ebonyi", label: "Ebonyi" },
];

export const POST_CATEGORIES: FieldOption[] = [
  "News",
  "Success Stories",
  "Field Blog",
  "Magazine",
  "Press Release",
  "Events",
].map((c) => ({ value: c, label: c }));

const opts = (...values: string[]): FieldOption[] => values.map((v) => ({ value: v, label: v }));

export const COLLECTIONS: Record<CollectionName, CollectionDef> = {
  posts: {
    name: "posts",
    label: "Posts",
    singular: "Post",
    description: "News, success stories, field blog, magazine features and press releases.",
    minRole: "author",
    titleField: "title",
    columns: ["title", "category", "author", "status", "date"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? `/blog/${item.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Permalink", type: "slug", from: "title", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, help: "One or two sentences shown on cards and in search results." },
      { name: "content", label: "Content", type: "markdown", required: true, help: "Markdown: ## headings, **bold**, - lists, [links](https://…), ![images](/media/…)." },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      { name: "date", label: "Publish date", type: "date", sidebar: true, required: true },
      { name: "category", label: "Category", type: "select", sidebar: true, required: true, options: POST_CATEGORIES },
      { name: "featured", label: "Feature on home page", type: "boolean", sidebar: true },
      { name: "featuredImage", label: "Featured image", type: "image", sidebar: true },
      { name: "author", label: "Author name", type: "text", sidebar: true },
      { name: "tags", label: "Tags", type: "list", sidebar: true, help: "One per line." },
    ],
  },
  interventions: {
    name: "interventions",
    label: "Interventions",
    singular: "Intervention",
    description: "Projects & interventions. Feeds the project directory, dossiers, factsheets and the operational map.",
    minRole: "editor",
    titleField: "title",
    columns: ["title", "donor", "status", "states"],
    statusField: "status",
    publicPath: (item) => `/interventions/${item.id}`,
    fields: [
      { name: "title", label: "Project title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "shortTitle", required: true },
      { name: "shortTitle", label: "Short title", type: "text", required: true },
      { name: "donor", label: "Donor / lead partner", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "keyInterventions", label: "Key interventions & deliverables", type: "list", required: true, help: "One per line." },
      { name: "impactMetric", label: "Headline impact", type: "textarea", required: true },
      { name: "locations", label: "Locations (description)", type: "text", required: true },
      { name: "imageSrc", label: "Main photo", type: "image", required: true },
      { name: "imageAlt", label: "Main photo alt text", type: "text", required: true },
      { name: "imageCaption", label: "Main photo caption", type: "text" },
      { name: "gallery", label: "Field gallery photos", type: "images" },
      { name: "youtubeId", label: "YouTube video ID", type: "text", help: "The part after watch?v= in a YouTube link." },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: opts("Active", "Completed", "Multi-Year") },
      { name: "duration", label: "Duration", type: "text", sidebar: true, required: true },
      { name: "states", label: "States", type: "multiselect", sidebar: true, options: STATE_OPTIONS, help: "Pins the project on the map. Leave empty if not state-specific." },
      { name: "primaryThematic", label: "Primary thematic area", type: "select", sidebar: true, required: true, options: PILLAR_OPTIONS },
      { name: "thematicIds", label: "All thematic areas", type: "multiselect", sidebar: true, required: true, options: PILLAR_OPTIONS },
      { name: "featured", label: "Featured project", type: "boolean", sidebar: true },
      { name: "tags", label: "Tags", type: "list", sidebar: true },
    ],
  },
  states: {
    name: "states",
    label: "Map States",
    singular: "State",
    description: "The 11 frontline states on the operational map: offices, LGAs covered and reach.",
    minRole: "editor",
    titleField: "name",
    columns: ["name", "zone", "lgasCovered", "beneficiaries"],
    fixed: true,
    fields: [
      { name: "name", label: "Display name", type: "text", required: true },
      { name: "focus", label: "Focus statement", type: "textarea", required: true },
      { name: "office", label: "LHI office (city)", type: "text" },
      { name: "zone", label: "Geo-political zone", type: "select", sidebar: true, required: true, options: opts("North-West", "North-East", "North-Central", "South-East") },
      { name: "totalLgas", label: "Total LGAs", type: "number", sidebar: true, required: true },
      { name: "lgasCovered", label: "LGAs covered", type: "number", sidebar: true, help: "0 hides the figure on the map." },
      { name: "beneficiaries", label: "Beneficiaries reached", type: "number", sidebar: true, help: "M&E-validated figure. 0 hides it." },
    ],
  },
  partners: {
    name: "partners",
    label: "Partners",
    singular: "Partner",
    description: "Implementing partners and donors shown in the home-page logo marquee.",
    minRole: "editor",
    titleField: "name",
    columns: ["name", "category", "partnershipSince", "visible"],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "id", label: "ID", type: "slug", from: "shortName", required: true },
      { name: "shortName", label: "Short name", type: "text", required: true },
      { name: "acronym", label: "Acronym", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "priorityFocus", label: "Priority focus", type: "text" },
      { name: "jointPrograms", label: "Joint programmes", type: "list", help: "One per line." },
      { name: "targetStates", label: "Target states", type: "list", help: "One per line." },
      { name: "statsHeadline", label: "Stat label", type: "text" },
      { name: "statsValue", label: "Stat value", type: "text" },
      { name: "logoUrl", label: "Logo", type: "image", sidebar: true, help: "Upload the partner's official logo. Without one, the built-in mark is used." },
      { name: "visible", label: "Show on website", type: "boolean", sidebar: true },
      { name: "category", label: "Category", type: "select", sidebar: true, required: true, options: opts("UN Agencies", "Bilateral Donors", "International NGOs", "Government & Clusters") },
      { name: "countryOrOrigin", label: "Country / origin", type: "text", sidebar: true },
      { name: "establishedYear", label: "Founded", type: "text", sidebar: true },
      { name: "partnershipSince", label: "Partner since", type: "text", sidebar: true },
      { name: "websiteUrl", label: "Website", type: "url", sidebar: true },
      { name: "order", label: "Display order", type: "number", sidebar: true },
    ],
  },
  documents: {
    name: "documents",
    label: "Compliance Documents",
    singular: "Document",
    description: "Due-diligence library on the Partner & Bidder Portal (CAC, tax, audits, policies).",
    minRole: "editor",
    titleField: "title",
    columns: ["title", "category", "file"],
    publicPath: () => "/partner-portal",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "id", label: "ID", type: "slug", from: "title", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "category", label: "Category", type: "select", sidebar: true, required: true, options: opts("Organisational documents", "Registration & tax", "Financial accountability", "Safeguarding & integrity") },
      { name: "file", label: "Document file (PDF)", type: "file", sidebar: true, help: "Leave empty to show “Request a certified copy”." },
      { name: "href", label: "Or link to page", type: "text", sidebar: true, help: "Internal path, e.g. /impact" },
    ],
  },
};

export const COLLECTION_NAMES = Object.keys(COLLECTIONS) as CollectionName[];

export function isCollectionName(value: string): value is CollectionName {
  return value in COLLECTIONS;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Site-wide settings edited on the Settings screen. */
export interface CmsSettings {
  homeFeature: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    excerpt: string;
    image: string;
    linkLabel: string;
    linkHref: string;
  };
  nidake: {
    costUsd: number;
    yearsOfDignity: number;
    schoolDaysSaved: number;
  };
  contact: {
    email: string;
    phone: string;
  };
}

export type SubmissionType = "contact" | "volunteer" | "consortium-eoi";
export type SubmissionStatus = "new" | "read" | "archived";

export interface Submission {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  name: string;
  email: string;
  subject: string;
  organization?: string;
  fields: Record<string, string>;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type PublicUser = Omit<CmsUser, "passwordHash">;

export interface ActivityEntry {
  id: string;
  at: string;
  user: string;
  action: string;
  target: string;
  href?: string;
}

export interface Certificate {
  /** Public certificate code, e.g. LHI-SG-7K2Q9M. */
  id: string;
  courseId: string;
  courseTitle: string;
  name: string;
  email: string;
  organization?: string;
  score: number;
  issuedAt: string;
}
