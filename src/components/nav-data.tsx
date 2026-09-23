"use client";

import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Compass,
  FileText,
  FolderGit2,
  GraduationCap,
  Handshake,
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
};

export type FeaturedNavStory = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  tag: string;
};

export const whoWeAreLinks: NavLink[] = [
  {
    label: "About Us",
    href: "/about",
    description: "Our vision, mission, and values of Love, Honesty & Inclusion",
    icon: HeartHandshake,
    tag: "Core Identity",
  },
  {
    label: "Our History",
    href: "/our-history",
    description: "22 years, from Sokoto in 2004 to 11 states",
    icon: Compass,
    tag: "Heritage",
  },
  {
    label: "Our Commitment",
    href: "/our-commitment",
    description: "Safeguarding, PSEA and feedback & complaints channels",
    icon: ShieldAlert,
    tag: "Safeguarding",
  },
  {
    label: "Our Strategies",
    href: "/our-strategies",
    description: "Our 4 strategies and the Strategic Plan 2026–2030",
    icon: Target,
    tag: "Approach",
  },
  {
    label: "NIDAKE",
    href: "/nidake",
    description: "Locally made reusable sanitary pads for girls and women",
    icon: Sparkles,
    tag: "Enterprise",
  },
  {
    label: "Board of Trustees",
    href: "/board-of-trustees",
    description: "Institutional governance & fiduciary stewardship",
    icon: Scale,
    tag: "Governance",
  },
  {
    label: "Management Team",
    href: "/management-team",
    description: "Executive directorates and field operations leadership",
    icon: Users,
    tag: "Leadership",
  },
];

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
    image: LHI_PHOTOS.nidakePad.src,
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
  label: "WeSpeak Radio",
  href: "/blog/wespeak-muyi-magana-radio",
  description: "Weekly on Royal FM 101.5 Sokoto, Tuesdays 11 AM",
  icon: Radio,
};

export const whatWeDoFeatured: FeaturedNavStory = {
  title: "WeSpeak (Muyi Magana)",
  subtitle: "LHI's weekly radio programme on health, education, livelihood, agriculture and gender equity.",
  href: "/blog/wespeak-muyi-magana-radio",
  image: LHI_PHOTOS.solarRadioFarmer.src,
  tag: "Radio Advocacy",
};

export const impactLinks: NavLink[] = [
  {
    label: "Annual Reports",
    href: "/impact",
    description: "Organisation-wide results since 2004",
    icon: FileText,
    tag: "Accountability",
  },
  {
    label: "Projects & Interventions",
    href: "/interventions/projectandintervention",
    description: "38 profiled projects with dossiers & PDF factsheets",
    icon: FolderGit2,
    tag: "Active Grants",
  },
  {
    label: "Partner & Bidder Portal",
    href: "/partner-portal",
    description: "Compliance documents & consortium / RFP expression of interest",
    icon: Handshake,
    tag: "For Donors",
  },
  {
    label: "Project Magazines",
    href: "/project-magazines",
    description: "Flip through our project magazines online",
    icon: BookOpen,
    tag: "Read",
  },
  {
    label: "Success Stories",
    href: "/success-stories",
    description: "Stories from our magazines and newsletter",
    icon: Award,
    tag: "Human Stories",
  },
  {
    label: "LHI Field Blog",
    href: "/blog",
    description: "All news, stories and magazine features",
    icon: BookOpen,
    tag: "Insights",
  },
  {
    label: "News & Bulletins",
    href: "/news-updates",
    description: "News, the LHI newsletter and project magazines",
    icon: Newspaper,
    tag: "Dispatches",
  },
];

export const impactFeatured: {
  nutrition: FeaturedNavStory;
  water: FeaturedNavStory;
} = {
  nutrition: {
    title: "A Bag, A Dream",
    subtitle: "Saudatu, 14, is back in class through the EU/UNICEF Accelerated Basic Education Programme.",
    href: "/blog/saudatu-a-bag-a-dream",
    image: LHI_PHOTOS.saudatu.src,
    tag: "Education",
  },
  water: {
    title: "Gidan Arziki Hub",
    subtitle: "A solar-powered farmers service hub in Batagarawa, commissioned in April 2026.",
    href: "/blog/gidan-arziki-hub-commissioned-batagarawa",
    image: LHI_PHOTOS.gidanArzikiAerial.src,
    tag: "Livelihoods",
  },
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
      label: t.whoWeAreMenu.ourCommitment,
      href: "/our-commitment",
      description: "Safeguarding, PSEA and feedback & complaints channels",
      icon: ShieldAlert,
      tag: "Safeguarding",
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
    href: "/blog/wespeak-muyi-magana-radio",
    description: "Weekly on Royal FM 101.5 Sokoto, Tuesdays 11 AM",
    icon: Radio,
  };

  const impact: NavLink[] = [
    {
      label: t.impactMenu.annualReport,
      href: "/impact",
      description: "Organisation-wide results since 2004",
      icon: FileText,
      tag: "Accountability",
    },
    {
      label: t.impactMenu.projectsInterventions,
      href: "/interventions/projectandintervention",
      description: "38 profiled projects with dossiers & PDF factsheets",
      icon: FolderGit2,
      tag: "Active Grants",
    },
    {
      label: "Partner & Bidder Portal",
      href: "/partner-portal",
      description: "Compliance documents & consortium / RFP expression of interest",
      icon: Handshake,
      tag: "For Donors",
    },
    {
      label: "Project Magazines",
      href: "/project-magazines",
      description: "Flip through our project magazines online",
      icon: BookOpen,
      tag: "Read",
    },
    {
      label: t.impactMenu.successStories,
      href: "/success-stories",
      description: "Stories from our magazines and newsletter",
      icon: Award,
      tag: "Human Stories",
    },
    {
      label: t.impactMenu.blog,
      href: "/blog",
      description: "All news, stories and magazine features",
      icon: BookOpen,
      tag: "Insights",
    },
    {
      label: t.impactMenu.newsletter,
      href: "/news-updates",
      description: "News, the LHI newsletter and project magazines",
      icon: Newspaper,
      tag: "Dispatches",
    },
    {
      label: "Humanitarian Training",
      href: "/get-involved/training",
      description: "Free safeguarding courses with certificates",
      icon: GraduationCap,
      tag: "Learn",
    },
    {
      label: "Careers & Procurement",
      href: "/careers",
      description: "Vacancies, vendor requests and registration",
      icon: Users,
      tag: "Work with us",
    },
  ];

  return {
    whoWeAreLinks: whoWeAre,
    whoWeAreFeatured,
    whatWeDoCards: whatWeDo,
    whatWeDoExtra: whatWeDoExtraLocalized,
    whatWeDoFeatured,
    impactLinks: impact,
    impactFeatured,
  };
}
