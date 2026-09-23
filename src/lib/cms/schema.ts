/**
 * Collection definitions for the admin CMS. Shared by the server (validation,
 * storage) and the admin UI (list tables and edit forms), so adding a field here
 * is enough for it to appear in the editor and be persisted.
 */

/** A role id: one of the built-in roles or a custom role created in Users → Roles. */
export type Role = string;

/** Everything a team member can be allowed to do in the admin. */
export const PERMISSION_GROUPS = [
  {
    label: "Content",
    items: [
      { id: "posts.own", label: "Write posts", help: "Create posts and edit their own." },
      { id: "posts.all", label: "Edit everyone's posts", help: "Edit, publish and delete any post." },
      { id: "media", label: "Upload media", help: "Upload files and use the media library." },
      { id: "media.delete", label: "Delete media", help: "Remove files from the media library." },
      { id: "comments", label: "Moderate comments", help: "Approve or delete reader comments." },
      { id: "episodes", label: "Radio episodes", help: "Upload and publish radio recordings." },
      { id: "events", label: "Events", help: "Add LHI events to the events calendar and home page." },
    ],
  },
  {
    label: "Programmes & partnerships",
    items: [
      { id: "interventions", label: "Projects & interventions", help: "Manage project dossiers." },
      { id: "states", label: "Map states", help: "Edit the operational map." },
      { id: "partners", label: "Partners & logos", help: "Manage partner profiles." },
      { id: "documents", label: "Compliance documents", help: "Manage the partner document library." },
    ],
  },
  {
    label: "Inbox, recruitment & procurement",
    items: [
      { id: "submissions", label: "View submissions", help: "Read form submissions and download CVs and bids." },
      { id: "submissions.delete", label: "Delete submissions", help: "Permanently delete submissions." },
      { id: "jobs", label: "Jobs & vacancies", help: "Publish and close vacancies." },
      { id: "tenders", label: "Vendor requests", help: "Publish RFQs and tenders." },
    ],
  },
  {
    label: "Training",
    items: [
      { id: "training", label: "Learners & certificates", help: "View learners, progress and certificates." },
      { id: "training.manage", label: "Manage learner accounts", help: "Reset learner passwords and delete accounts." },
    ],
  },
  {
    label: "Communications",
    items: [
      { id: "newsletter", label: "Newsletter & subscribers", help: "Send newsletters and export the subscriber list." },
      { id: "email", label: "Email outbox", help: "See every email the site has sent or queued, and retry failures." },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users & roles", help: "Create logins, assign roles and define roles." },
      { id: "settings", label: "Site settings", help: "Edit site-wide settings." },
      { id: "activity", label: "Activity log", help: "See who changed what." },
    ],
  },
] as const;

export type Permission = (typeof PERMISSION_GROUPS)[number]["items"][number]["id"];

export const ALL_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.id));

export interface CmsRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  /** Built-in roles can't be deleted; the Administrator role always has every permission. */
  builtIn?: boolean;
}

export const BUILT_IN_ROLES: CmsRole[] = [
  {
    id: "administrator",
    name: "Administrator",
    description: "Full access, including users, roles and settings.",
    permissions: ALL_PERMISSIONS,
    builtIn: true,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Manages all content, programmes, inbox, recruitment and training.",
    permissions: ALL_PERMISSIONS.filter((p) => !["users", "settings", "activity", "submissions.delete"].includes(p)),
    builtIn: true,
  },
  {
    id: "author",
    name: "Author",
    description: "Writes their own posts and uploads media.",
    permissions: ["posts.own", "media"],
    builtIn: true,
  },
];

/** Permission check against a signed-in user's resolved permissions. */
export function can(user: { permissions: readonly Permission[] } | null | undefined, permission?: Permission) {
  if (!user) return false;
  return !permission || user.permissions.includes(permission);
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
  | "audio"
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
  /** Permission needed to manage this collection. */
  permission: Permission;
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

export type CollectionName = "posts" | "interventions" | "states" | "partners" | "documents" | "jobs" | "tenders" | "episodes" | "events";

export const PILLAR_OPTIONS: FieldOption[] = [
  { value: "health", label: "Health & WASH" },
  { value: "education", label: "Education" },
  { value: "livelihood", label: "Livelihood" },
  { value: "food-security", label: "Food Security" },
  { value: "social-inclusion", label: "Social Inclusion" },
  { value: "protection", label: "Protection & GBV" },
];

export const EVENT_AREA_OPTIONS: FieldOption[] = [
  { value: "lhi", label: "LHI (organisation-wide)" },
  { value: "humanitarian", label: "Humanitarian" },
  ...PILLAR_OPTIONS,
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
  "Newsletter",
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
    permission: "posts.own",
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
    permission: "interventions",
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
    permission: "states",
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
    permission: "partners",
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
    permission: "documents",
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
  jobs: {
    name: "jobs",
    label: "Jobs & Vacancies",
    singular: "Vacancy",
    description: "Vacancies shown on the Careers page. Applications (with CVs) arrive in Submissions.",
    permission: "jobs",
    titleField: "title",
    columns: ["title", "department", "location", "status", "deadline"],
    statusField: "status",
    publicPath: (item) => (item.status === "open" || item.status === "closed" ? `/careers/${item.id}` : null),
    fields: [
      { name: "title", label: "Job title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, help: "Two or three sentences shown on the vacancy card." },
      { name: "description", label: "Full job description", type: "markdown", required: true, help: "Background, responsibilities, reporting line. Markdown supported." },
      { name: "requirements", label: "Qualifications & requirements", type: "list", help: "One per line." },
      { name: "location", label: "Duty station", type: "text", required: true, help: "e.g. Sokoto (with travel to project LGAs)" },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }, { value: "draft", label: "Draft" }] },
      { name: "department", label: "Department / unit", type: "select", sidebar: true, required: true, options: opts("Programmes", "Health & Nutrition", "Education", "Livelihood & Agriculture", "Protection & Gender", "MEAL", "Finance & Grants", "Human Resources & Administration", "Logistics & Procurement", "Safeguarding & Accountability", "Communications") },
      { name: "employmentType", label: "Contract type", type: "select", sidebar: true, required: true, options: opts("Full-time", "Fixed-term contract", "Consultancy", "Internship", "Volunteer") },
      { name: "reference", label: "Reference number", type: "text", sidebar: true },
      { name: "positions", label: "Number of positions", type: "number", sidebar: true },
      { name: "postedDate", label: "Date posted", type: "date", sidebar: true, required: true },
      { name: "deadline", label: "Application deadline", type: "date", sidebar: true, required: true, help: "Applications close at the end of this day." },
      { name: "attachment", label: "Job description / ToR (PDF)", type: "file", sidebar: true },
    ],
  },
  tenders: {
    name: "tenders",
    label: "Vendor Requests",
    singular: "Vendor request",
    description: "Requests for quotation, tenders and expressions of interest on the Procurement page. Vendor responses arrive in Submissions.",
    permission: "tenders",
    titleField: "title",
    columns: ["title", "reference", "category", "status", "deadline"],
    statusField: "status",
    publicPath: (item) => (item.status === "draft" ? null : `/procurement/${item.id}`),
    fields: [
      { name: "title", label: "Title", type: "text", required: true, help: "e.g. Supply of dignity kits to Sokoto field office" },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "description", label: "Scope, specifications & instructions", type: "markdown", required: true, help: "Items/quantities, delivery location and schedule, how to submit, evaluation criteria." },
      { name: "requirements", label: "Eligibility & documents required", type: "list", help: "One per line, e.g. CAC certificate, tax clearance." },
      { name: "location", label: "Delivery / service location", type: "text", required: true },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }, { value: "awarded", label: "Awarded" }, { value: "draft", label: "Draft" }] },
      { name: "reference", label: "Reference number", type: "text", sidebar: true, required: true, help: "e.g. LHI/SOK/RFQ/2026/014" },
      { name: "category", label: "Request type", type: "select", sidebar: true, required: true, options: opts("Request for Quotation (RFQ)", "Invitation to Tender (ITB)", "Request for Proposal (RFP)", "Expression of Interest (EOI)", "Prequalification") },
      { name: "procurementType", label: "Category", type: "select", sidebar: true, required: true, options: opts("Goods", "Services", "Works", "Consultancy") },
      { name: "postedDate", label: "Date published", type: "date", sidebar: true, required: true },
      { name: "deadline", label: "Submission deadline", type: "date", sidebar: true, required: true },
      { name: "document", label: "Solicitation pack (PDF)", type: "file", sidebar: true },
    ],
  },
  episodes: {
    name: "episodes",
    label: "Radio Episodes",
    singular: "Episode",
    description: "Radio programme recordings played by the home-page radio and the Radio page. Upload MP3/M4A audio up to 80 MB.",
    permission: "episodes",
    titleField: "title",
    columns: ["title", "programme", "language", "status", "date"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? `/radio#${item.id}` : null),
    fields: [
      { name: "title", label: "Episode title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "audio", label: "Audio recording", type: "audio", required: true, help: "MP3, M4A, AAC, WAV or OGG, up to 80 MB." },
      { name: "summary", label: "Summary", type: "textarea", required: true, help: "What the episode covers, shown under the player." },
      { name: "topics", label: "Topics", type: "list", help: "One per line, e.g. Malaria prevention." },
      { name: "guests", label: "Guests / speakers", type: "list", help: "One per line." },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
      { name: "programme", label: "Programme", type: "select", sidebar: true, required: true, options: opts("WeSpeak (Muyi Magana)", "The Women Situation Room", "Special broadcast", "Jingle / PSA") },
      { name: "date", label: "Broadcast date", type: "date", sidebar: true, required: true },
      { name: "language", label: "Language", type: "select", sidebar: true, required: true, options: opts("Hausa", "English", "Hausa & English", "Fulfulde", "Kanuri", "Other") },
      { name: "duration", label: "Duration", type: "text", sidebar: true, help: "e.g. 58:30 (shown until the audio loads)." },
      { name: "station", label: "Station", type: "text", sidebar: true, help: "e.g. Radio Nigeria Royal FM 101.5, Sokoto" },
      { name: "cover", label: "Cover image", type: "image", sidebar: true },
      { name: "featured", label: "Play first on the home page", type: "boolean", sidebar: true },
    ],
  },
  events: {
    name: "events",
    label: "Events",
    singular: "Event",
    description:
      "LHI events (launches, trainings, campaigns, community days). They appear with the international observance days on the Events page and, when next up, on the home page, with Add to calendar.",
    permission: "events",
    titleField: "title",
    columns: ["title", "startDate", "location", "area", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? `/events#${item.id}` : null),
    fields: [
      { name: "title", label: "Event title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, help: "One or two sentences shown on the event card." },
      { name: "location", label: "Location", type: "text", help: "e.g. Goshen Development Center, Sokoto, or Online" },
      { name: "link", label: "More information link", type: "text", help: "Optional. A page on this site (e.g. /blog/…) or a registration link (https://…)." },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
      { name: "startDate", label: "Start date", type: "date", sidebar: true, required: true },
      { name: "endDate", label: "End date", type: "date", sidebar: true, help: "Leave empty for a one-day event." },
      { name: "time", label: "Time", type: "text", sidebar: true, help: "e.g. 10:00 AM – 1:00 PM (WAT)" },
      { name: "area", label: "Thematic area", type: "select", sidebar: true, required: true, options: EVENT_AREA_OPTIONS },
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
  donations: {
    /** Bank transfer details shown on the donate page; hidden when empty. One account per paragraph. */
    bankDetails: string;
  };
  engagement: {
    /** Publish reader comments immediately instead of holding them for review. */
    autoApproveComments: boolean;
    /** Where new-submission alerts are sent once email is connected. */
    alertEmail: string;
  };
}

export type SubmissionType =
  | "contact"
  | "volunteer"
  | "consortium-eoi"
  | "job-application"
  | "vendor-registration"
  | "tender-response"
  | "feedback"
  | "newsletter";
export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  "job-application": "Job applications",
  "tender-response": "Vendor bids",
  "vendor-registration": "Vendor registration",
  "consortium-eoi": "Consortium / RFP",
  feedback: "Feedback",
  contact: "Contact",
  volunteer: "Volunteer",
  newsletter: "Newsletter",
};

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
  /** Private uploads (CVs, quotations) served only to signed-in editors. */
  attachments?: { filename: string; stored: string; size: number }[];
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

export type PublicUser = Omit<CmsUser, "passwordHash"> & {
  /** Resolved from the user's role at sign-in time. */
  roleName: string;
  permissions: Permission[];
};

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

/** Reader engagement on posts (likes are anonymous counts; comments are moderated). */
export interface PostLikes {
  id: string; // post slug
  likes: number;
}

export type CommentStatus = "pending" | "approved";

export interface PostComment {
  id: string;
  slug: string;
  postTitle: string;
  name: string;
  email: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
}

/** Humanitarian Training learner account (separate from admin users). */
export interface LearnerCourseProgress {
  completed: string[];
  certificateId?: string;
  score?: number;
  /** Final-assessment attempts and the latest score. */
  attempts?: number;
  lastScore?: number;
  updatedAt?: string;
}

export interface Learner {
  id: string;
  name: string;
  email: string;
  organization?: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
  progress: Record<string, LearnerCourseProgress>;
}

/** Every email the site sends is recorded here first, so nothing is lost before a provider is connected. */
export type OutboxStatus = "queued" | "sent" | "failed";

export interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  /** What triggered it, e.g. "confirmation", "team-alert", "password-reset", "newsletter". */
  kind: string;
  status: OutboxStatus;
  attempts: number;
  error?: string;
  createdAt: string;
  sentAt?: string;
  /** Newsletter campaign this email belongs to. */
  campaignId?: string;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  body: string;
  recipients: number;
  sentBy: string;
  sentAt: string;
}

/** One-time password reset token (only the SHA-256 hash is stored). */
export interface ResetToken {
  id: string;
  kind: "learner" | "team";
  accountId: string;
  expiresAt: string;
  usedAt?: string;
}

export interface Unsubscribe {
  id: string;
  email: string;
  at: string;
}
