import type { InterventionProject, ThematicPillarId } from "@/data/interventions-data";
import type { OperationalState } from "@/data/operational-states";
import type { PartnerItem } from "@/data/partners-data";

/** Stored shape of an intervention: flat so the generic editor can edit every field. */
export type CmsIntervention = Omit<InterventionProject, "image" | "thematicAreas" | "gallery"> & {
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  thematicIds: ThematicPillarId[];
  gallery: string[];
};

export type CmsState = OperationalState;

export type CmsPartner = Omit<PartnerItem, "logo" | "categoryBadgeColor"> & {
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
  status: "draft" | "published";
  tags: string[];
  featured: boolean;
  updatedAt: string;
}

export interface CollectionRecords {
  posts: CmsPost;
  interventions: CmsIntervention;
  states: CmsState;
  partners: CmsPartner;
  documents: CmsDocument;
}
