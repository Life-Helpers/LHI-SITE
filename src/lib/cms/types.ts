import type { InterventionProject, ThematicPillarId } from "@/data/interventions-data";
import type { OperationalState } from "@/data/operational-states";
import type { PartnerItem } from "@/data/partners-data";
import type { TeamMember } from "@/data/team";

/** Stored shape of an intervention: flat so the generic editor can edit every field. */
export type CmsIntervention = Omit<InterventionProject, "image" | "thematicAreas" | "gallery"> & {
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  thematicIds: ThematicPillarId[];
  gallery: string[];
  /** Linked partner profiles (ids). Absent on records saved before links existed. */
  partnerIds?: string[];
};

export type CmsState = OperationalState;

export type CmsPartner = Omit<PartnerItem, "logo"> & {
  logoUrl: string;
  visible: boolean;
  order: number;
};

export interface CmsDocument {
  id: string;
  title: string;
  category: "Organisational documents" | "Registration & tax" | "Financial accountability" | "Safeguarding & integrity";
  description: string;
  file: string;
  href: string;
}

export interface CmsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  date: string;
  featuredImage: string;
  status: "draft" | "review" | "published";
  tags: string[];
  featured: boolean;
  updatedAt: string;
  /** Sensitive stories need an approver (posts.review) and all safeguarding checks to be published. */
  sensitive?: boolean;
  safeguarding?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  /** Projects this post is about (intervention ids). Absent on posts saved before links existed. */
  projects?: string[];
}

export interface CmsJob {
  id: string;
  title: string;
  summary: string;
  description: string;
  requirements: string[];
  location: string;
  status: "open" | "closed" | "draft";
  department: string;
  employmentType: string;
  reference: string;
  positions: number;
  postedDate: string;
  deadline: string;
  attachment: string;
}

export interface CmsTender {
  id: string;
  title: string;
  summary: string;
  description: string;
  requirements: string[];
  location: string;
  status: "open" | "closed" | "awarded" | "draft";
  reference: string;
  category: string;
  procurementType: string;
  postedDate: string;
  deadline: string;
  document: string;
}

export interface CmsEpisode {
  id: string;
  title: string;
  audio: string;
  summary: string;
  topics: string[];
  guests: string[];
  status: "published" | "draft";
  programme: string;
  date: string;
  language: string;
  duration: string;
  station: string;
  cover: string;
  featured: boolean;
}

export interface CmsEvent {
  id: string;
  title: string;
  summary: string;
  location: string;
  link: string;
  status: "published" | "draft";
  startDate: string;
  endDate: string;
  time: string;
  area: string;
}

export interface CollectionRecords {
  posts: CmsPost;
  interventions: CmsIntervention;
  states: CmsState;
  partners: CmsPartner;
  documents: CmsDocument;
  jobs: CmsJob;
  tenders: CmsTender;
  episodes: CmsEpisode;
  events: CmsEvent;
  milestones: CmsMilestone;
  team: CmsTeamMember;
  heroSlides: CmsHeroSlide;
  testimonials: CmsTestimonial;
  beforeAfter: CmsBeforeAfter;
  impactReports: CmsImpactReport;
  emergencies: CmsEmergency;
  thematicAreas: CmsThematicArea;
  faqs: CmsFaq;
  observances: CmsObservance;
}

type Visibility = "published" | "draft";

/** A home page hero slide. The headline is prefix + highlighted word(s) + suffix. */
export interface CmsHeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  prefix: string;
  highlight: string;
  suffix: string;
  body: string;
  caption: string;
  tag: string;
  mottoBadge: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  order: number;
  status: Visibility;
}

export interface CmsTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** The full story this quote comes from. */
  href: string;
  /** Card colour. */
  tone: string;
  order: number;
  status: Visibility;
}

/** A home page "Before & After" story; the before photo is shown in black and white. */
export interface CmsBeforeAfter {
  id: string;
  name: string;
  place: string;
  photo: string;
  photoAlt: string;
  /** Optional real earlier photo; without one the main photo is shown in black and white. */
  beforePhoto: string;
  beforeTitle: string;
  beforeText: string;
  afterTitle: string;
  afterText: string;
  href: string;
  linkLabel: string;
  order: number;
  status: Visibility;
}

export interface CmsImpactReport {
  id: string;
  title: string;
  period: string;
  publishedAt: string;
  summary: string;
  /** Paragraphs separated by a blank line. */
  description: string;
  /** "Label | Value", one per line. */
  stats: string[];
  relatedProgramIds: string[];
  image: string;
  imageAlt: string;
  order: number;
  status: Visibility;
}

export interface CmsEmergency {
  id: string;
  title: string;
  region: string;
  /** Draft emergencies are hidden. */
  status: "draft" | "active" | "resolved";
  severity: "critical" | "warning";
  summary: string;
  /** Paragraphs separated by a blank line. */
  description: string;
  declaredAt: string;
  /** "Label | Value", one per line. */
  stats: string[];
  relatedProgramIds: string[];
  /** Show the site-wide alert banner while the emergency is active. */
  showAlert: boolean;
  alertMessage: string;
  alertCtaLabel: string;
}

/** Page content for one of the six thematic areas. Ids are fixed; editors change the text and photo. */
export interface CmsThematicArea {
  id: string;
  name: string;
  region: string;
  summary: string;
  /** Paragraphs separated by a blank line. */
  description: string;
  metricLabel: string;
  metricValue: string;
  /** "Label | Value", one per line. */
  stats: string[];
  image: string;
  imageAlt: string;
}

export interface CmsFaq {
  id: string;
  category: "organization" | "programs" | "donations";
  question: string;
  answer: string;
  tags: string[];
  featured: boolean;
  order: number;
  status: Visibility;
}

export interface CmsObservance {
  id: string;
  title: string;
  month: number;
  day: number;
  /** 0 when the observance is a single day. */
  endMonth: number;
  endDay: number;
  area: string;
  by: string;
  description: string;
  status: Visibility;
}

/** A stop on the Our History road map. Photos, their alt text and labels are parallel lists. */
export interface CmsMilestone {
  id: string;
  year: string;
  title: string;
  location: string;
  summary: string;
  photos: string[];
  photoAlts: string[];
  photoLabels: string[];
  caption: string;
  /** Shows the old → new logo card instead of photos. */
  showLogos: boolean;
  states: string[];
  order: number;
  status: "published" | "draft";
}

export type CmsTeamMember = TeamMember;
