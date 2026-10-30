/**
 * Collection definitions for the admin CMS. Shared by the server (validation,
 * storage) and the admin UI (list tables and edit forms), so adding a field here
 * is enough for it to appear in the editor and be persisted.
 */

import { OPERATIONAL_STATES } from "@/data/operational-states";
import { programHref, THEMATIC_AREA_IDS, THEMATIC_AREA_LIST } from "@/data/thematic-areas";
import { SAFEGUARDING_CHECKS } from "@/lib/cms/safeguarding";
import type { HomeTextByLocale } from "@/lib/home-text";

/** A role id: one of the built-in roles or a custom role created in Users → Roles. */
export type Role = string;

/** Everything a team member can be allowed to do in the admin. */
export const PERMISSION_GROUPS = [
  {
    label: "Content",
    items: [
      { id: "posts.own", label: "Write blog posts", help: "Create blog posts and edit their own." },
      { id: "posts.all", label: "Edit everyone's blog posts", help: "Edit, publish and delete any blog post." },
      { id: "posts.review", label: "Approve sensitive stories", help: "Publish stories flagged as sensitive (health status, GBV, child protection, mental health) after the safeguarding checks." },
      { id: "media", label: "Upload media", help: "Upload files and use the media library." },
      { id: "media.delete", label: "Delete media", help: "Remove files from the media library." },
      { id: "comments", label: "Moderate comments", help: "Approve or delete reader comments." },
      { id: "episodes", label: "Radio episodes", help: "Upload and publish radio recordings." },
      { id: "events", label: "Events", help: "Add LHI events to the events calendar and home page." },
      { id: "magazines", label: "Project magazines", help: "Upload magazine PDFs as flipbooks." },
      { id: "about", label: "History & team", help: "Edit the history timeline and the board, management and coordinator profiles." },
      { id: "homepage", label: "Home page content", help: "Edit the hero slides, testimonials and before & after stories." },
      { id: "impact", label: "Impact & emergencies", help: "Edit impact reports and emergencies, and switch the site-wide emergency alert on or off." },
      { id: "pages", label: "Thematic pages, FAQs & observances", help: "Edit the thematic area pages, the FAQ and the observance days calendar." },
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
      { id: "training.content", label: "Write courses & lessons", help: "Create courses (new ones start as drafts) and edit their lessons, photos and practice questions." },
      { id: "training.exams", label: "Set final exams", help: "Write final exam questions, mark the correct answers and set the pass mark." },
      { id: "training.publish", label: "Publish courses", help: "Make a course live for learners, take it down, or delete a draft." },
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

/** Kept for the Administrator role alone: no other role can be given them. */
export const ADMIN_ONLY_PERMISSIONS: readonly Permission[] = ["activity"];

/** Every permission with its label and help, in menu order. */
export const PERMISSION_ITEMS: { id: Permission; label: string; help: string; group: string }[] = PERMISSION_GROUPS.flatMap((g) =>
  g.items.map((i): { id: Permission; label: string; help: string; group: string } => ({ id: i.id, label: i.label, help: i.help, group: g.label })),
);

/** Where each permission's work is done in the admin, so people see their functions as links. */
export const PERMISSION_HOME: Record<Permission, string> = {
  "posts.own": "/admin/content/posts",
  "posts.all": "/admin/content/posts",
  "posts.review": "/admin/content/posts",
  media: "/admin/media",
  "media.delete": "/admin/media",
  comments: "/admin/comments",
  episodes: "/admin/content/episodes",
  events: "/admin/content/events",
  magazines: "/admin/magazines",
  about: "/admin/content/team",
  homepage: "/admin/content/heroSlides",
  impact: "/admin/content/impactReports",
  pages: "/admin/content/thematicAreas",
  interventions: "/admin/content/interventions",
  states: "/admin/content/states",
  partners: "/admin/content/partners",
  documents: "/admin/content/documents",
  submissions: "/admin/submissions",
  "submissions.delete": "/admin/submissions",
  jobs: "/admin/content/jobs",
  tenders: "/admin/content/tenders",
  training: "/admin/learners",
  "training.manage": "/admin/learners",
  "training.content": "/admin/training",
  "training.exams": "/admin/training",
  "training.publish": "/admin/training",
  newsletter: "/admin/newsletter",
  email: "/admin/outbox",
  users: "/admin/users",
  settings: "/admin/settings",
  activity: "/admin/activity",
};

/** Where each admin section's content appears on the public site, so editors can open it in one click. */
export const SITE_LOCATIONS: Record<string, { label: string; href: string }[]> = {
  posts: [{ label: "News & updates", href: "/blog" }, { label: "Success stories", href: "/success-stories" }],
  interventions: [{ label: "Projects & interventions", href: "/interventions" }],
  states: [{ label: "Operational map (home page)", href: "/#operational-map-heading" }],
  partners: [{ label: "Partners strip (home page)", href: "/#implementing-partners-section" }],
  documents: [{ label: "Partner & Bidder Portal", href: "/partner-portal" }],
  jobs: [{ label: "Careers page", href: "/careers" }],
  tenders: [{ label: "Procurement page", href: "/procurement" }],
  episodes: [{ label: "Radio & TV page", href: "/radio" }, { label: "Home page radio", href: "/" }],
  events: [{ label: "Events calendar", href: "/events" }],
  milestones: [{ label: "Our History", href: "/our-history" }],
  team: [{ label: "Management team", href: "/management-team" }, { label: "Board of Trustees", href: "/board-of-trustees" }],
  heroSlides: [{ label: "Home page slides", href: "/" }],
  testimonials: [{ label: "Testimonials (home page)", href: "/#testimonials-heading" }],
  beforeAfter: [{ label: "Before & after (home page)", href: "/#before-after-heading" }],
  impactReports: [{ label: "Impact page", href: "/impact" }],
  emergencies: [{ label: "Emergencies page", href: "/emergencies" }],
  thematicAreas: [{ label: "Programmes page", href: "/programs" }],
  faqs: [{ label: "FAQ page", href: "/faq" }, { label: "About page", href: "/about" }],
  observances: [{ label: "Events calendar", href: "/events" }],
  magazines: [{ label: "Project Magazines page", href: "/project-magazines" }],
  learners: [{ label: "Humanitarian Training centre", href: "/get-involved/training" }],
  training: [{ label: "Humanitarian Training centre", href: "/get-involved/training" }],
  certificates: [{ label: "Certificate check (training page)", href: "/get-involved/training" }],
  comments: [{ label: "News & updates", href: "/blog" }],
  homeText: [{ label: "Home page", href: "/" }],
  newsletter: [{ label: "Sign-up form (site footer)", href: "/#site-footer" }],
  submissions: [{ label: "Contact form", href: "/contact" }, { label: "Careers", href: "/careers" }, { label: "Procurement", href: "/procurement" }, { label: "Get involved", href: "/get-involved" }],
};

/** Admin pages outside /admin/content whose key in SITE_LOCATIONS differs from their path. */
const ADMIN_PAGE_KEYS: Record<string, string> = { "home-text": "homeText", "email-settings": "homeText" };

/** The public page for the admin screen at `pathname` (the top bar's "View site"), or the home page. */
export function siteHrefFor(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean); // ["admin", "content", "episodes", ...]
  const key = parts[1] === "content" ? parts[2] : parts[1] ? (ADMIN_PAGE_KEYS[parts[1]] ?? parts[1]) : "";
  return (key && SITE_LOCATIONS[key]?.[0]?.href) || "/";
}

/** A username: 3–30 lower-case letters, numbers, dots, dashes or underscores. */
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,29}$/;

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
    permissions: ALL_PERMISSIONS.filter((p) => !["users", "settings", "activity", "submissions.delete", "posts.review"].includes(p)),
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
  | "url"
  /** A page on this site (/…) or an https://, mailto: or tel: link. */
  | "link";

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
  /** For select/multiselect fields: choices are the records of this collection (by id). */
  relation?: CollectionName;
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
  /** These items can be edited but not deleted, and keep their id (their pages are built in). */
  lockedIds?: readonly string[];
  /** Public URL of an item, for the "View" link. */
  publicPath?: (item: Record<string, unknown>) => string | null;
  fields: FieldDef[];
}

export type CollectionName =
  | "posts"
  | "interventions"
  | "states"
  | "partners"
  | "documents"
  | "jobs"
  | "tenders"
  | "episodes"
  | "events"
  | "milestones"
  | "team"
  | "heroSlides"
  | "testimonials"
  | "beforeAfter"
  | "impactReports"
  | "emergencies"
  | "thematicAreas"
  | "faqs"
  | "observances";

export const PILLAR_OPTIONS: FieldOption[] = THEMATIC_AREA_LIST.map((a) => ({ value: a.id, label: a.label }));

export const EVENT_AREA_OPTIONS: FieldOption[] = [
  { value: "lhi", label: "LHI (organisation-wide)" },
  { value: "humanitarian", label: "Humanitarian" },
  ...PILLAR_OPTIONS,
];

export const STATE_OPTIONS: FieldOption[] = OPERATIONAL_STATES.map((st) => ({ value: st.id, label: st.name }));

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

export const PUBLISH_OPTIONS: FieldOption[] = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

/** Card colours for testimonials (brand gradients). */
export const TESTIMONIAL_TONES: FieldOption[] = [
  { value: "from-primary to-[#a80f14]", label: "LHI red" },
  { value: "from-accent to-[#7a3605]", label: "LHI orange" },
  { value: "from-[#7d0c10] to-[#4a0709]", label: "Deep maroon" },
  { value: "from-[#b45309] to-[#7c2d12]", label: "Amber" },
  { value: "from-[#15803d] to-[#14532d]", label: "Green" },
  { value: "from-[#1d4ed8] to-[#1e3a8a]", label: "Blue" },
];

export const COLLECTIONS: Record<CollectionName, CollectionDef> = {
  posts: {
    name: "posts",
    label: "Blog & News Posts",
    singular: "Blog post",
    description: "Everything on the blog: news, success stories, field blog, magazine features and press releases. Click a title to edit it, or “Add Blog post” to write a new one; pick the category in the right-hand panel.",
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
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "draft", label: "Draft" }, { value: "review", label: "Pending review" }, { value: "published", label: "Published" }] },
      { name: "sensitive", label: "Sensitive story", type: "boolean", sidebar: true, help: "Tick for stories about health status (e.g. HIV), GBV or abuse, child protection or mental health. Detected automatically from the title, excerpt and tags too. Sensitive stories need approval before they go live." },
      { name: "safeguarding", label: "Safeguarding checks", type: "multiselect", sidebar: true, options: SAFEGUARDING_CHECKS, help: "All four must be ticked before a sensitive story can be published." },
      { name: "date", label: "Publish date", type: "date", sidebar: true, required: true, help: "Choose a future date to schedule the post; it goes live automatically on that day." },
      { name: "category", label: "Category", type: "select", sidebar: true, required: true, options: POST_CATEGORIES },
      { name: "featured", label: "Feature on home page", type: "boolean", sidebar: true },
      { name: "featuredImage", label: "Featured image", type: "image", sidebar: true },
      { name: "projects", label: "Related projects", type: "multiselect", sidebar: true, relation: "interventions", help: "Lists this story under “Stories from this project” on each project's page." },
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
      { name: "partnerIds", label: "Partners", type: "multiselect", sidebar: true, relation: "partners", help: "Partner profiles for this project; the partner's profile lists it." },
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
      { name: "allowDownload", label: "Visitors can download the file", type: "boolean", sidebar: true, help: "Untick to hide the download button on the site (the file stays in the admin)." },
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
      { name: "allowDownload", label: "Visitors can download the file", type: "boolean", sidebar: true, help: "Untick to hide the download button on the site (the file stays in the admin)." },
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
      { name: "allowDownload", label: "Visitors can download the file", type: "boolean", sidebar: true, help: "Untick to hide the download button on the site (the file stays in the admin)." },
    ],
  },
  episodes: {
    name: "episodes",
    label: "Radio Episodes",
    singular: "Episode",
    description:
      "Radio programme recordings played by the home-page radio and the Radio & TV page. Upload any audio file (MP3, M4A, WAV, OGG, FLAC, AAC; WMA, AMR, AIFF and phone recordings are turned into MP3 automatically), or paste a Google Drive link to the audio file (shared as \"Anyone with the link\") — best for recordings over 4 MB.",
    permission: "episodes",
    titleField: "title",
    columns: ["title", "programme", "language", "status", "date"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? `/radio#${item.id}` : null),
    fields: [
      { name: "title", label: "Episode title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      {
        name: "audio",
        label: "Audio recording",
        type: "audio",
        required: true,
        help: "Upload MP3, M4A, AAC, WAV or OGG, or paste a Google Drive link to the file (Share → Anyone with the link → Copy link).",
      },
      { name: "summary", label: "Summary", type: "textarea", required: true, help: "What the episode covers, shown under the player." },
      { name: "topics", label: "Topics", type: "list", help: "One per line, e.g. Malaria prevention." },
      { name: "guests", label: "Guests / speakers", type: "list", help: "One per line." },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
      { name: "programme", label: "Programme", type: "select", sidebar: true, required: true, options: opts("WeSpeak (Muyi Magana)", "UNESCO Project", "SARAH Project", "The Women Situation Room", "Special broadcast", "Jingle / PSA") },
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
  milestones: {
    name: "milestones",
    label: "History Timeline",
    singular: "Milestone",
    description:
      "The stops on the Our History road map. Date milestones only from LHI's own records or what the photos show, and keep to verifiable facts.",
    permission: "about",
    titleField: "title",
    columns: ["year", "title", "location", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? "/our-history" : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "year", label: "Year", type: "text", required: true, help: "e.g. 2013, or a range such as 2021–2025." },
      { name: "location", label: "Location", type: "text", help: "Shown as a pin label, e.g. Sokoto State." },
      { name: "summary", label: "Story", type: "textarea", required: true },
      { name: "photos", label: "Photos", type: "images", help: "Shown in a grid beside the story (1–4 photos work best)." },
      { name: "photoAlts", label: "Photo descriptions (alt text)", type: "list", help: "One per line, in the same order as the photos. Describe what each photo shows." },
      { name: "photoLabels", label: "Photo labels", type: "list", help: "Optional. One per line in photo order, printed on each photo (e.g. its archive title). Give a label for every photo or for none." },
      { name: "caption", label: "Caption under the photos", type: "text" },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
      { name: "order", label: "Position on the road", type: "number", sidebar: true, required: true, help: "Lower numbers come first. Leave gaps (10, 20, 30…) to insert later." },
      { name: "states", label: "States opened (map pins)", type: "multiselect", sidebar: true, options: STATE_OPTIONS, help: "Shows a map of Nigeria with a pin on each state." },
      { name: "showLogos", label: "Show the old → new logo card", type: "boolean", sidebar: true, help: "Replaces the photos with the logo change card." },
    ],
  },
  team: {
    name: "team",
    label: "Team",
    singular: "Team member",
    description: "The Board of Trustees, the management team and the state office coordinators.",
    permission: "about",
    titleField: "name",
    columns: ["name", "group", "role", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status !== "published" ? null : item.group === "board" ? "/board-of-trustees" : "/management-team"),
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "name", required: true },
      { name: "role", label: "Role / title", type: "text", required: true },
      { name: "credentials", label: "Credentials", type: "text", help: "e.g. FICA, FIMC, CMC" },
      { name: "department", label: "Department (management)", type: "text" },
      { name: "overview", label: "Overview (management)", type: "textarea" },
      { name: "state", label: "State (coordinators)", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "photo", label: "Portrait", type: "image", help: "Board and management cards show a portrait; coordinators don't." },
      { name: "group", label: "Group", type: "select", sidebar: true, required: true, options: [{ value: "board", label: "Board of Trustees" }, { value: "management", label: "Management team" }, { value: "coordinator", label: "State office coordinator" }] },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
      { name: "order", label: "Order", type: "number", sidebar: true, required: true, help: "Lower numbers come first within the group." },
    ],
  },
  heroSlides: {
    name: "heroSlides",
    label: "Hero Slides",
    singular: "Hero slide",
    description: "The rotating photo slides at the top of the home page. Use real LHI photos of people from the communities we serve.",
    permission: "homepage",
    titleField: "highlight",
    columns: ["highlight", "tag", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? "/" : null),
    fields: [
      { name: "prefix", label: "Headline: start", type: "text", required: true, help: "e.g. Putting a radiant smile on every child's face across " },
      { name: "highlight", label: "Headline: highlighted word(s)", type: "text", required: true, help: "Underlined in red, e.g. Nigeria" },
      { name: "suffix", label: "Headline: end", type: "text", help: "e.g. a full stop." },
      { name: "id", label: "URL slug", type: "slug", from: "highlight", required: true },
      { name: "body", label: "Body text", type: "textarea", required: true },
      { name: "image", label: "Photo", type: "image", required: true },
      { name: "imageAlt", label: "Photo description (alt text)", type: "text", required: true },
      { name: "eyebrow", label: "Eyebrow", type: "text", help: "Small line above the headline." },
      { name: "tag", label: "Theme tag", type: "text", help: "Shown in the top badge and the caption card, e.g. Child Welfare & Hope." },
      { name: "caption", label: "Caption card text", type: "text" },
      { name: "mottoBadge", label: "Motto badge", type: "text" },
      { name: "primaryLabel", label: "Main button text", type: "text", required: true },
      { name: "primaryHref", label: "Main button link", type: "link", required: true, help: "A page on this site (e.g. /donate) or an https:// link." },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryHref", label: "Second button link", type: "link" },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: PUBLISH_OPTIONS },
      { name: "order", label: "Order", type: "number", sidebar: true, required: true, help: "Lower numbers show first." },
    ],
  },
  testimonials: {
    name: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Quotes on the home page. Use only quotes published in LHI's magazines, newsletters or stories, and link to the full story.",
    permission: "homepage",
    titleField: "name",
    columns: ["name", "role", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? "/" : null),
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "name", required: true },
      { name: "role", label: "Role or place", type: "text", required: true },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "href", label: "Link to the full story", type: "link", required: true, help: "e.g. /blog/murja-eight-years-of-struggle-to-renewed-hope" },
      { name: "tone", label: "Card colour", type: "select", sidebar: true, required: true, options: TESTIMONIAL_TONES },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: PUBLISH_OPTIONS },
      { name: "order", label: "Order", type: "number", sidebar: true, required: true },
    ],
  },
  beforeAfter: {
    name: "beforeAfter",
    label: "Before & After",
    singular: "Before & after story",
    description:
      "The before/now slider on the home page. Every statement must come from a published LHI story. Never show an identifiable child survivor or link anyone to a health status.",
    permission: "homepage",
    titleField: "name",
    columns: ["name", "place", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? "/" : null),
    fields: [
      { name: "name", label: "Name", type: "text", required: true, help: "Person or place, e.g. Murja Yari or Noma Tushen Arziki Hub." },
      { name: "id", label: "URL slug", type: "slug", from: "name", required: true },
      { name: "place", label: "Place", type: "text", required: true },
      { name: "photo", label: "\"Now\" photo", type: "image", required: true },
      { name: "photoAlt", label: "\"Now\" photo description (alt text)", type: "text", required: true },
      { name: "beforePhoto", label: "\"Before\" photo", type: "image", help: "Optional. Shown in black and white; without it the \"now\" photo is used." },
      { name: "beforeTitle", label: "Before: headline", type: "text", required: true },
      { name: "beforeText", label: "Before: text", type: "textarea", required: true },
      { name: "afterTitle", label: "Now: headline", type: "text", required: true },
      { name: "afterText", label: "Now: text", type: "textarea", required: true },
      { name: "href", label: "Link to the full story", type: "link", required: true },
      { name: "linkLabel", label: "Link text", type: "text", help: "Defaults to \"Read <name>'s story\"." },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: PUBLISH_OPTIONS },
      { name: "order", label: "Order", type: "number", sidebar: true, required: true },
    ],
  },
  impactReports: {
    name: "impactReports",
    label: "Impact Reports",
    singular: "Impact report",
    description: "Reports on /impact. Use audited or officially published figures only.",
    permission: "impact",
    titleField: "title",
    columns: ["title", "period", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? `/impact/${item.id}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "period", label: "Period covered", type: "text", required: true, help: "e.g. January–December 2025" },
      { name: "publishedAt", label: "Published / source", type: "text", help: "e.g. March 2026" },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "description", label: "Report text", type: "textarea", required: true, help: "Separate paragraphs with a blank line." },
      { name: "stats", label: "Figures", type: "list", help: "One per line as Label | Value, e.g. Individuals reached | 1.5M+" },
      { name: "image", label: "Photo", type: "image" },
      { name: "imageAlt", label: "Photo description (alt text)", type: "text" },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: PUBLISH_OPTIONS },
      { name: "order", label: "Order", type: "number", sidebar: true, required: true },
      { name: "relatedProgramIds", label: "Thematic areas covered", type: "multiselect", sidebar: true, options: PILLAR_OPTIONS },
    ],
  },
  emergencies: {
    name: "emergencies",
    label: "Emergencies",
    singular: "Emergency",
    description:
      "Declared emergencies on /emergencies. Tick \"Show the alert banner\" on an active emergency to put a banner on every page; set it to Resolved (or untick) to take the banner down.",
    permission: "impact",
    titleField: "title",
    columns: ["title", "region", "severity", "status", "declaredAt"],
    statusField: "status",
    publicPath: (item) => (item.status === "draft" ? null : `/emergencies/${item.id}`),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "region", label: "Region", type: "text", required: true, help: "e.g. Goronyo LGA, Sokoto State" },
      { name: "declaredAt", label: "Declared", type: "text", required: true, help: "e.g. January 2026" },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "description", label: "Full text", type: "textarea", required: true, help: "Separate paragraphs with a blank line." },
      { name: "stats", label: "Figures", type: "list", help: "One per line as Label | Value, e.g. Households reached | 1,200" },
      { name: "alertMessage", label: "Alert banner message", type: "text", help: "e.g. Flood response in Sokoto: LHI teams are on the ground." },
      { name: "alertCtaLabel", label: "Alert banner button", type: "text", help: "e.g. Read the update" },
      {
        name: "status",
        label: "Status",
        type: "select",
        sidebar: true,
        required: true,
        options: [
          { value: "draft", label: "Draft (hidden)" },
          { value: "active", label: "Active" },
          { value: "resolved", label: "Resolved" },
        ],
      },
      { name: "severity", label: "Severity", type: "select", sidebar: true, required: true, options: [{ value: "critical", label: "Critical" }, { value: "warning", label: "Warning" }] },
      { name: "showAlert", label: "Show the alert banner", type: "boolean", sidebar: true, help: "Only while the emergency is Active." },
      { name: "relatedProgramIds", label: "Responding thematic areas", type: "multiselect", sidebar: true, options: PILLAR_OPTIONS },
    ],
  },
  thematicAreas: {
    name: "thematicAreas",
    label: "Thematic Area Pages",
    singular: "Thematic area",
    description: "LHI's thematic areas: the six built-in ones (which can be edited but not deleted) and any you add. Each has its own page and appears on the Programmes page.",
    permission: "pages",
    titleField: "name",
    columns: ["name", "region", "metricValue"],
    lockedIds: THEMATIC_AREA_IDS,
    publicPath: (item) => programHref(String(item.id)),
    fields: [
      { name: "name", label: "Page title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "name", required: true, help: "The built-in six keep their address." },
      { name: "region", label: "Region", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "description", label: "Page text", type: "textarea", required: true, help: "Separate paragraphs with a blank line." },
      { name: "metricLabel", label: "Headline figure: label", type: "text" },
      { name: "metricValue", label: "Headline figure: value", type: "text" },
      { name: "stats", label: "Other figures", type: "list", help: "One per line as Label | Value." },
      { name: "image", label: "Photo", type: "image", required: true },
      { name: "imageAlt", label: "Photo description (alt text)", type: "text", required: true },
    ],
  },
  faqs: {
    name: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions and answers on /faq and the About page.",
    permission: "pages",
    titleField: "question",
    columns: ["question", "category", "order", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? "/faq" : null),
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "question", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      { name: "tags", label: "Search words", type: "list", help: "One per line; helps visitors find the answer." },
      { name: "category", label: "Category", type: "select", sidebar: true, required: true, options: [{ value: "organization", label: "Organisation" }, { value: "programs", label: "Programmes" }, { value: "donations", label: "Donations" }] },
      { name: "featured", label: "Show as a popular question", type: "boolean", sidebar: true },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: PUBLISH_OPTIONS },
      { name: "order", label: "Order", type: "number", sidebar: true, required: true },
    ],
  },
  observances: {
    name: "observances",
    label: "Observance Days",
    singular: "Observance day",
    description:
      "International and national days on the events calendar and the home page. List only fixed-date days proclaimed by the UN, WHO, UNESCO, the African Union or the Nigerian government.",
    permission: "pages",
    titleField: "title",
    columns: ["title", "month", "day", "area", "status"],
    statusField: "status",
    publicPath: (item) => (item.status === "published" ? `/events#${item.id}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "id", label: "URL slug", type: "slug", from: "title", required: true },
      { name: "by", label: "Proclaimed by", type: "text", required: true },
      { name: "description", label: "Why it matters to LHI", type: "textarea", required: true },
      { name: "month", label: "Month (1–12)", type: "number", sidebar: true, required: true },
      { name: "day", label: "Day", type: "number", sidebar: true, required: true },
      { name: "endMonth", label: "Last month (multi-day)", type: "number", sidebar: true, help: "Leave at 0 for a single day." },
      { name: "endDay", label: "Last day (multi-day)", type: "number", sidebar: true },
      { name: "area", label: "Area", type: "select", sidebar: true, required: true, options: EVENT_AREA_OPTIONS },
      { name: "status", label: "Status", type: "select", sidebar: true, required: true, options: PUBLISH_OPTIONS },
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
  /** Home page text overrides per language (Admin → Home Page Text). Empty means the built-in text. */
  homeText: HomeTextByLocale;
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
    /** Price of one dignity kit in Naira. */
    costNgn: number;
    yearsOfDignity: number;
    schoolDaysSaved: number;
  };
  contact: {
    email: string;
    phone: string;
    /** WhatsApp / SMS feedback and safeguarding (PSEA) line. */
    helpline: string;
    feedbackEmail: string;
    pseaEmail: string;
    recruitmentEmail: string;
  };
  /** Official social media accounts (full https:// links). */
  social: {
    facebook: string;
    instagram: string;
    x: string;
    linkedin: string;
    youtube: string;
    linktree: string;
  };
  /** Organisation-wide figures shown on the home page, About, Careers and elsewhere. States and years are counted automatically. */
  stats: {
    peopleReached: string;
    households: string;
    projects: string;
    staff: string;
    volunteers: string;
    grants: string;
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
  /** The newsletter sign-up pop-up. Each visitor sees it once per `campaign`. */
  popup: {
    enabled: boolean;
    /** Changing it shows the pop-up once more to everyone. */
    campaign: string;
  };
  /** Email delivery set up in Admin → Email & Pop-up. The API key is kept encrypted in the secrets store, never here. */
  email: {
    enabled: boolean;
    provider: EmailProviderId;
    /** Mailgun sending domain, e.g. mg.lhinigeria.org. */
    domain: string;
    /** Mailgun account region. */
    region: "us" | "eu";
    /** Sender, e.g. Life Helpers Initiative <news@mg.lhinigeria.org>. */
    from: string;
    replyTo: string;
    /** Last 4 characters of the saved API key, to show it is set. */
    keyHint: string;
  };
}

export const EMAIL_PROVIDERS = ["mailgun", "resend", "sendgrid", "postmark", "brevo"] as const;
export type EmailProviderId = (typeof EMAIL_PROVIDERS)[number];

export type SubmissionType =
  | "contact"
  | "volunteer"
  | "consortium-eoi"
  | "job-application"
  | "vendor-registration"
  | "tender-response"
  | "feedback"
  | "newsletter"
  | "donation";
export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  "job-application": "Job applications",
  "tender-response": "Vendor bids",
  "vendor-registration": "Vendor registration",
  "consortium-eoi": "Consortium / RFP",
  feedback: "Feedback",
  contact: "Contact",
  volunteer: "Volunteer",
  newsletter: "Newsletter",
  donation: "Donations",
};

export type SubmissionStatus = "new" | "read" | "archived";

/** Review pipeline for submissions that are processed (applications, bids, feedback). */
export const REVIEW_STAGES: Partial<Record<SubmissionType, string[]>> = {
  "job-application": ["New", "Screening", "Shortlisted", "Interview", "Offer", "Hired", "Not successful"],
  "tender-response": ["Received", "Compliance check", "Technical evaluation", "Financial evaluation", "Awarded", "Not successful"],
  "vendor-registration": ["Received", "Verified", "Approved vendor", "Not approved"],
  feedback: ["New", "Acknowledged", "In progress", "Resolved", "Closed"],
  "consortium-eoi": ["New", "Under review", "Responded", "Partnered", "Declined"],
};
/** Types that carry a 0–100 evaluation score. */
export const SCORED_TYPES: SubmissionType[] = ["job-application", "tender-response"];

export interface SubmissionReview {
  stage: string;
  score?: number;
  notes: { id: string; author: string; text: string; at: string }[];
  updatedAt: string;
  updatedBy: string;
}

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
  review?: SubmissionReview;
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
  /** Sign-in email (also where password reset links go); may be empty for a username-only login. */
  email: string;
  /** Optional short sign-in name set by an administrator, e.g. "amina.blog". */
  username?: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
  /** Base32 TOTP secret when two-step verification is on. */
  totpSecret?: string;
  /** Secret being set up, until the first code is confirmed. */
  totpPending?: string;
  /**
   * Must choose their own password before doing anything else: after the default Admin/Admin
   * login, or when an administrator set the password and asked them to replace it.
   */
  mustChangePassword?: boolean;
  /** Turned off by an administrator: can't sign in, and any open session ends. */
  disabled?: boolean;
}

export type PublicUser = Omit<CmsUser, "passwordHash" | "totpSecret" | "totpPending"> & {
  /** Two-step verification is enabled. */
  twoFactor: boolean;
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

/** A magazine uploaded in the admin; its pages are rendered to images in the editor's browser. */
export interface CmsMagazine {
  slug: string;
  title: string;
  kind: string;
  period: string;
  description: string;
  partners: string;
  story: string;
  pages: number;
  pdf: string;
  /** False hides the "Download PDF" buttons; the flipbook still shows the pages. */
  allowDownload?: boolean;
  status: "published" | "draft";
  createdAt: string;
  createdBy: string;
}
