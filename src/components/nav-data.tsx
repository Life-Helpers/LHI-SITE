"use client";

import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Calendar,
  Compass,
  FileText,
  FolderGit2,
  GraduationCap,
  Handshake,
  Headphones,
  HeartHandshake,
  HeartPulse,
  Newspaper,
  Radio,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Target,
  Users,
  Wheat,
} from "lucide-react";

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
    description: "20+ years journey from Sokoto in 2004 across 11 states",
    icon: Compass,
    tag: "Heritage",
  },
  {
    label: "Our Commitment",
    href: "/our-commitment",
    description: "PSEA safeguarding, whistleblower channels & disability fund",
    icon: ShieldAlert,
    tag: "Safeguarding",
  },
  {
    label: "Our Strategies",
    href: "/our-strategies",
    description: "6 strategic pillars: advocacy, SBCC, evidence & partnerships",
    icon: Target,
    tag: "Approach",
  },
  {
    label: "NIDAKE",
    href: "/nidake",
    description: "Me & You reusable pad enterprise & girl-child retention",
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
    title: "20 Years of Grounded Service",
    subtitle:
      "Founded in Sokoto on Oct 1, 2004 — delivering relief and sustainable progress across 11 Nigerian states.",
    href: "/our-history",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80",
    tag: "Our Legacy",
  },
  nidake: {
    title: "NIDAKE Social Enterprise",
    subtitle:
      "Sustainable reusable pads keeping adolescent girls in school while providing local female tailoring jobs.",
    href: "/nidake",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=400&q=80",
    tag: "Social Enterprise",
  },
};

export const whatWeDoCards: NavCard[] = [
  {
    label: "Health & WASH",
    href: "/health",
    description: "Tom Brown infant nutrition, maternal care & solar clean water",
    icon: HeartPulse,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500&q=80",
    tag: "Maternal & Child",
  },
  {
    label: "Education",
    href: "/education",
    description: "Accelerated learning centers, girl-child retention & digital skills",
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&q=80",
    tag: "Basic Education",
  },
  {
    label: "Livelihood",
    href: "/livelihood",
    description: "VSLA community savings, vocational starter kits & cash grants",
    icon: Handshake,
    image:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=500&q=80",
    tag: "Resilience",
  },
  {
    label: "Food Security",
    href: "/food-security",
    description: "Climate-smart agriculture, irrigation & market linkages",
    icon: Wheat,
    image:
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=500&q=80",
    tag: "Food Systems",
  },
  {
    label: "Social Inclusion",
    href: "/social-inclusion",
    description: "Disability rights, universal accessibility & civic advocacy",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80",
    tag: "Equal Rights",
  },
  {
    label: "Protection & GBV",
    href: "/protection",
    description: "One-stop GBV response, safe spaces & child safeguarding",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80",
    tag: "Protection",
  },
];

export const whatWeDoExtra: NavLink = {
  label: "Radio Advocacy",
  href: "/radio",
  description: "The Women Situation Room broadcasting peace in 4 languages",
  icon: Radio,
};

export const whatWeDoFeatured: FeaturedNavStory = {
  title: "The Women Situation Room",
  subtitle:
    "Broadcasting maternal health, peacebuilding & legal rights in 4 languages reaching 2.5M+ listeners across Northern Nigeria.",
  href: "/radio",
  image:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
  tag: "Radio Advocacy",
};

export const impactLinks: NavLink[] = [
  {
    label: "Annual Reports",
    href: "/impact",
    description: "Audited finances, strategic indicators & institutional reports",
    icon: FileText,
    tag: "Accountability",
  },
  {
    label: "Projects & Interventions",
    href: "/interventions/projectandintervention",
    description: "9 multi-state programs backed by UNICEF, KfW, NHF & Plan",
    icon: FolderGit2,
    tag: "Active Grants",
  },
  {
    label: "Success Stories",
    href: "/success-stories",
    description: "Documented beneficiary accounts & verified community recoveries",
    icon: Award,
    tag: "Human Stories",
  },
  {
    label: "LHI Field Blog",
    href: "/blog",
    description: "Field reports, health worker perspectives & grassroots insights",
    icon: BookOpen,
    tag: "Insights",
  },
  {
    label: "Events & Updates",
    href: "/events",
    description: "Quarterly Pause & Reflect sessions, workshops & conferences",
    icon: Calendar,
    tag: "Convenings",
  },
  {
    label: "News & Bulletins",
    href: "/news-updates",
    description: "Humanitarian press statements & quarterly field dispatches",
    icon: Newspaper,
    tag: "Dispatches",
  },
  {
    label: "Radio Stories",
    href: "/radio-story",
    description: "Recorded beneficiary audio testimonials from rural airwaves",
    icon: Radio,
    tag: "Audio Stories",
  },
  {
    label: "Before & After Visuals",
    href: "/transformations",
    description: "Interactive comparison sliders of community water, farming & clinic upgrades",
    icon: Sliders,
    tag: "Visual Proof",
  },
  {
    label: "Multimedia & Radio Hub",
    href: "/multimedia",
    description: "Women Situation Room podcasts in Hausa, Kanuri & English",
    icon: Headphones,
    tag: "Audio Hub",
  },
];

export const impactFeatured: {
  nutrition: FeaturedNavStory;
  water: FeaturedNavStory;
} = {
  nutrition: {
    title: "Tom Brown Malnutrition Recovery",
    subtitle:
      "How community-blend nutrition restored 1,200+ severely malnourished infants to health in Sokoto & Zamfara.",
    href: "/success-stories",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    tag: "Nutrition Recovery",
  },
  water: {
    title: "Gujba Solar Borehole",
    subtitle:
      "Supplying 3,500+ displaced persons with potable clean water and preventing water-borne disease outbreaks.",
    href: "/interventions/projectandintervention",
    image:
      "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80",
    tag: "Clean WASH",
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
      description: "20+ years journey from Sokoto in 2004 across 11 states",
      icon: Compass,
      tag: "Heritage",
    },
    {
      label: t.whoWeAreMenu.ourCommitment,
      href: "/our-commitment",
      description: "PSEA safeguarding, whistleblower channels & disability fund",
      icon: ShieldAlert,
      tag: "Safeguarding",
    },
    {
      label: t.whoWeAreMenu.ourStrategies,
      href: "/our-strategies",
      description: "6 strategic pillars: advocacy, SBCC, evidence & partnerships",
      icon: Target,
      tag: "Approach",
    },
    {
      label: t.whoWeAreMenu.nidake,
      href: "/nidake",
      description: "Me & You reusable pad enterprise & girl-child retention",
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
      image:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500&q=80",
      tag: "Maternal & Child",
    },
    {
      label: t.whatWeDoMenu.education,
      description: t.whatWeDoMenu.educationDesc,
      href: "/education",
      icon: GraduationCap,
      image:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=500&q=80",
      tag: "Basic Education",
    },
    {
      label: t.whatWeDoMenu.livelihood,
      description: t.whatWeDoMenu.livelihoodDesc,
      href: "/livelihood",
      icon: Handshake,
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=500&q=80",
      tag: "Resilience",
    },
    {
      label: t.whatWeDoMenu.foodSecurity,
      description: t.whatWeDoMenu.foodSecurityDesc,
      href: "/food-security",
      icon: Wheat,
      image:
        "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=500&q=80",
      tag: "Food Systems",
    },
    {
      label: t.whatWeDoMenu.socialInclusion,
      description: t.whatWeDoMenu.socialInclusionDesc,
      href: "/social-inclusion",
      icon: Users,
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80",
      tag: "Equal Rights",
    },
    {
      label: t.whatWeDoMenu.protection,
      description: t.whatWeDoMenu.protectionDesc,
      href: "/protection",
      icon: ShieldCheck,
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80",
      tag: "Protection",
    },
  ];

  const whatWeDoExtraLocalized: NavLink = {
    label: t.whatWeDoMenu.radioAdvocacy,
    href: "/radio",
    description: "The Women Situation Room broadcasting peace in 4 languages",
    icon: Radio,
  };

  const impact: NavLink[] = [
    {
      label: t.impactMenu.annualReport,
      href: "/impact",
      description: "Audited finances, strategic indicators & institutional reports",
      icon: FileText,
      tag: "Accountability",
    },
    {
      label: t.impactMenu.projectsInterventions,
      href: "/interventions/projectandintervention",
      description: "9 multi-state programs backed by UNICEF, KfW, NHF & Plan",
      icon: FolderGit2,
      tag: "Active Grants",
    },
    {
      label: t.impactMenu.successStories,
      href: "/success-stories",
      description: "Documented beneficiary accounts & verified community recoveries",
      icon: Award,
      tag: "Human Stories",
    },
    {
      label: t.impactMenu.blog,
      href: "/blog",
      description: "Field reports, health worker perspectives & grassroots insights",
      icon: BookOpen,
      tag: "Insights",
    },
    {
      label: t.impactMenu.eventsUpdates,
      href: "/events",
      description: "Quarterly Pause & Reflect sessions, workshops & conferences",
      icon: Calendar,
      tag: "Convenings",
    },
    {
      label: t.impactMenu.newsletter,
      href: "/news-updates",
      description: "Humanitarian press statements & quarterly field dispatches",
      icon: Newspaper,
      tag: "Dispatches",
    },
    {
      label: t.impactMenu.radioStory,
      href: "/radio-story",
      description: "Recorded beneficiary audio testimonials from rural airwaves",
      icon: Radio,
      tag: "Audio Stories",
    },
    {
      label: "Before & After Visuals",
      href: "/transformations",
      description: "Interactive comparison sliders of community water, farming & clinic upgrades",
      icon: Sliders,
      tag: "Visual Proof",
    },
    {
      label: "Multimedia & Radio Hub",
      href: "/multimedia",
      description: "Women Situation Room podcasts in Hausa, Kanuri & English",
      icon: Headphones,
      tag: "Audio Hub",
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
