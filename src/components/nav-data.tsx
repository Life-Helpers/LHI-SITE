"use client";

import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  BookMarked,
  CalendarDays,
  BookOpen,
  Compass,
  FileText,
  FolderGit2,
  GraduationCap,
  Handshake,
  MessageSquareHeart,
  HeartHandshake,
  HeartPulse,
  Newspaper,
  Radio,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wheat,
} from "lucide-react";

import { LHI_PHOTOS } from "@/data/lhi-photos";
import { useLocale } from "@/i18n/locale-context";

export type NavCard = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  tag?: string;
};

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  tag?: string;
  image?: string;
  /** Column in the Impact mega menu. */
  group?: "results" | "stories";
};

export type FeaturedNavStory = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  tag: string;
};

export const whoWeAreFeatured: {
  heritage: FeaturedNavStory;
  nidake: FeaturedNavStory;
} = {
  heritage: {
    title: "22 Years of Service",
    subtitle:
      "Founded in Sokoto on 1 October 2004, now working across 11 Nigerian states.",
    href: "/our-history",
    image: LHI_PHOTOS.teamStrategicPlan.src,
    tag: "Our Legacy",
  },
  nidake: {
    title: "NIDAKE Social Enterprise",
    subtitle:
      "Reusable sanitary pads made at the Goshen Development Centre, Sokoto.",
    href: "/nidake",
    image: LHI_PHOTOS.nidakeKit.src,
    tag: "Social Enterprise",
  },
};

export const whatWeDoCards: NavCard[] = [
  {
    label: "Health & WASH",
    href: "/health",
    description: "MNCH, nutrition, WASH, malaria and HIV services",
    icon: HeartPulse,
    image: LHI_PHOTOS.healthScreening.src,
    tag: "Maternal & Child",
  },
  {
    label: "Education",
    href: "/education",
    description: "Accelerated and non-formal learning for out-of-school children",
    icon: GraduationCap,
    image: LHI_PHOTOS.abepGirls.src,
    tag: "Basic Education",
  },
  {
    label: "Livelihood",
    href: "/livelihood",
    description: "Vocational skills, VSLAs and cash assistance",
    icon: Handshake,
    image: LHI_PHOTOS.gidanArzikiTailoring.src,
    tag: "Resilience",
  },
  {
    label: "Food Security",
    href: "/food-security",
    description: "Smallholder farming, farmers hubs and climate adaptation",
    icon: Wheat,
    image: LHI_PHOTOS.farmerWomanHarvest.src,
    tag: "Food Systems",
  },
  {
    label: "Social Inclusion",
    href: "/social-inclusion",
    description: "Governance, peacebuilding and advocacy",
    icon: Users,
    image: LHI_PHOTOS.communityDialogue.src,
    tag: "Equal Rights",
  },
  {
    label: "Protection & GBV",
    href: "/protection",
    description: "Violence against women and girls; child protection",
    icon: ShieldCheck,
    image: LHI_PHOTOS.activismWomen.src,
    tag: "Protection",
  },
];

export const whatWeDoExtra: NavLink = {
  label: "Radio Program",
  href: "/radio",
  description: "Weekly on Royal FM 101.5 Sokoto, Tuesdays 11 AM",
  icon: Radio,
};

export const whatWeDoFeatured: FeaturedNavStory = {
  title: "WeSpeak (Muyi Magana)",
  subtitle: "LHI's weekly radio programme on health, education, livelihood, agriculture and gender equity.",
  href: "/radio",
  image: LHI_PHOTOS.solarRadioFarmer.src,
  tag: "Radio Program",
};

export const impactFeatured: {
  glance: FeaturedNavStory;
  story: FeaturedNavStory;
} = {
  glance: {
    title: "LHI at a Glance",
    subtitle: "Our offices, thematic areas, mission and values in one infographic, plus the nutrition project journey.",
    href: "/fact-sheet#at-a-glance",
    image: "/infographics/lhi-at-a-glance.jpg",
    tag: "Infographic",
  },
  story: {
    title: "G4G: Achieving Beyond School",
    subtitle: "Girls in Shinkafi, Zamfara State, learn leadership, life skills, bead making and slipper making.",
    href: "/blog/g4g-achieving-beyond-school-zamfara",
    image: LHI_PHOTOS.g4gZamfaraSkills.src,
    tag: "Success Story",
  },
};

export const getInvolvedFeatured: FeaturedNavStory = {
  title: "Donate",
  subtitle: "Your gift puts a smile on a face: it reaches families across our 11 states.",
  href: "/donate",
  image: LHI_PHOTOS.farmerWomanHarvest.src,
  tag: "Give",
};

/** Localized overlay: keeps hrefs/icons/images fixed, swaps labels via the active dictionary. */
export function useLocalizedNav() {
  const { t } = useLocale();

  const whoWeAre: NavLink[] = [
    {
      label: t.whoWeAreMenu.aboutUs,
      href: "/about",
      description: "Our vision, mission, and values of Love, Honesty & Inclusion",
      icon: HeartHandshake,
      tag: "Core Identity",
    },
    {
      label: t.whoWeAreMenu.ourHistory,
      href: "/our-history",
      description: "22 years, from Sokoto in 2004 to 11 states",
      icon: Compass,
      tag: "Heritage",
    },
    {
      label: t.whoWeAreMenu.ourStrategies,
      href: "/our-strategies",
      description: "Our 4 strategies and the Strategic Plan 2026–2030",
      icon: Target,
      tag: "Approach",
    },
    {
      label: t.whoWeAreMenu.nidake,
      href: "/nidake",
      description: "Locally made reusable sanitary pads for girls and women",
      icon: Sparkles,
      tag: "Enterprise",
    },
    {
      label: t.whoWeAreMenu.boardOfTrustees,
      href: "/board-of-trustees",
      description: "Institutional governance & fiduciary stewardship",
      icon: Scale,
      tag: "Governance",
    },
    {
      label: t.whoWeAreMenu.managementTeam,
      href: "/management-team",
      description: "Executive directorates and field operations leadership",
      icon: Users,
      tag: "Leadership",
    },
    {
      label: t.whoWeAreMenu.ourCommitment,
      href: "/our-commitment",
      description: "Safeguarding, PSEA and feedback & complaints channels",
      icon: ShieldAlert,
      tag: "Safeguarding",
    },
  ];

  const whatWeDo: NavCard[] = [
    {
      label: t.whatWeDoMenu.health,
      description: t.whatWeDoMenu.healthDesc,
      href: "/health",
      icon: HeartPulse,
      image: LHI_PHOTOS.healthScreening.src,
      tag: "Maternal & Child",
    },
    {
      label: t.whatWeDoMenu.education,
      description: t.whatWeDoMenu.educationDesc,
      href: "/education",
      icon: GraduationCap,
      image: LHI_PHOTOS.abepGirls.src,
      tag: "Basic Education",
    },
    {
      label: t.whatWeDoMenu.livelihood,
      description: t.whatWeDoMenu.livelihoodDesc,
      href: "/livelihood",
      icon: Handshake,
      image: LHI_PHOTOS.gidanArzikiTailoring.src,
      tag: "Resilience",
    },
    {
      label: t.whatWeDoMenu.foodSecurity,
      description: t.whatWeDoMenu.foodSecurityDesc,
      href: "/food-security",
      icon: Wheat,
      image: LHI_PHOTOS.farmerWomanHarvest.src,
      tag: "Food Systems",
    },
    {
      label: t.whatWeDoMenu.socialInclusion,
      description: t.whatWeDoMenu.socialInclusionDesc,
      href: "/social-inclusion",
      icon: Users,
      image: LHI_PHOTOS.communityDialogue.src,
      tag: "Equal Rights",
    },
    {
      label: t.whatWeDoMenu.protection,
      description: t.whatWeDoMenu.protectionDesc,
      href: "/protection",
      icon: ShieldCheck,
      image: LHI_PHOTOS.activismWomen.src,
      tag: "Protection",
    },
  ];

  const whatWeDoExtraLocalized: NavLink = {
    label: t.whatWeDoMenu.radioAdvocacy,
    href: "/radio",
    description: "Weekly on Royal FM 101.5 Sokoto, Tuesdays 11 AM",
    icon: Radio,
  };

  const impact: NavLink[] = [
    { label: t.impactMenu.annualReport, href: "/impact", description: "Organisation-wide results since 2004", icon: FileText, tag: "Accountability", group: "results" },
    { label: "Fact Sheet & Infographics", href: "/fact-sheet", description: "LHI at a glance and project results in numbers", icon: BarChart3, tag: "Results", group: "results" },
    { label: t.impactMenu.projectsInterventions, href: "/interventions/projectandintervention", description: "Every profiled project, with dossiers & PDF factsheets", icon: FolderGit2, tag: "Portfolio", group: "results" },
    { label: "Brochure", href: "/brochure", description: "The Noma Tushen Arziki resilience hub and LHI infographics", icon: BookMarked, tag: "Read", group: "results" },
    { label: "Feedback", href: "/feedback", description: "Compliments, suggestions and complaints, answered by our team", icon: MessageSquareHeart, tag: "Your voice", group: "results" },
    { label: t.impactMenu.successStories, href: "/success-stories", description: "Lives changed, in their own words", icon: Award, tag: "Human Stories", group: "stories" },
    { label: "Project Magazines", href: "/project-magazines", description: "Flip through our magazines and Helpers Digest bulletins", icon: BookOpen, tag: "Read", group: "stories" },
    { label: "LHI Blog & Newsletter", href: "/blog", description: "News, field stories, newsletters and publications", icon: Newspaper, tag: "Dispatches", group: "stories" },
    { label: "Radio Program", href: "/radio", description: "Our community radio programme and recordings", icon: Radio, tag: "On air", group: "stories" },
    { label: "Events & Observance Days", href: "/events", description: "Upcoming events and international days, add to calendar", icon: CalendarDays, tag: "Calendar", group: "stories" },
  ];

  const getInvolved: NavLink[] = [
    { label: "Volunteer & Get Involved", href: "/get-involved", description: "Volunteer openings and ways to support our work", icon: HeartHandshake, tag: "Join us" },
    { label: "Donate", href: "/donate", description: "Support families in the communities we serve", icon: Sparkles, tag: "Give" },
    { label: "Humanitarian Training", href: "/get-involved/training", description: "Free safeguarding courses with certificates", icon: GraduationCap, tag: "Learn" },
    { label: "Careers", href: "/careers", description: "Current vacancies and how to apply", icon: Users, tag: "Work with us" },
    { label: "Procurement", href: "/procurement", description: "Vendor requests, bids and supplier registration", icon: FileText, tag: "Suppliers" },
    { label: "Partner & Bidder Portal", href: "/partner-portal", description: "Compliance documents & consortium / RFP expression of interest", icon: Handshake, tag: "For donors" },
  ];

  return {
    whoWeAreLinks: whoWeAre,
    whoWeAreFeatured,
    whatWeDoCards: whatWeDo,
    whatWeDoExtra: whatWeDoExtraLocalized,
    whatWeDoFeatured,
    impactLinks: impact,
    impactFeatured,
    getInvolvedLinks: getInvolved,
    getInvolvedFeatured,
  };
}
