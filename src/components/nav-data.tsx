"use client";

import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Handshake,
  HeartPulse,
  ShieldCheck,
  Users,
  Wheat,
} from "lucide-react";

import { useLocale } from "@/i18n/locale-context";

export type NavCard = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type NavLink = { label: string; href: string };

export const whoWeAreLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Our History", href: "/our-history" },
  { label: "Our Commitment", href: "/our-commitment" },
  { label: "Our Strategies", href: "/our-strategies" },
  { label: "NIDAKE", href: "/nidake" },
  { label: "Board of Trustees", href: "/board-of-trustees" },
  { label: "Management Team", href: "/management-team" },
];

export const whatWeDoCards: NavCard[] = [
  {
    label: "Health",
    href: "/health",
    description: "Nutrition, maternal & child health, WASH",
    icon: HeartPulse,
  },
  {
    label: "Education",
    href: "/education",
    description: "Girl-child education, ECD, digital literacy",
    icon: GraduationCap,
  },
  {
    label: "Livelihood",
    href: "/livelihood",
    description: "Skills training, savings groups, cash assistance",
    icon: Handshake,
  },
  {
    label: "Food Security",
    href: "/food-security",
    description: "Climate-smart farming & market access",
    icon: Wheat,
  },
  {
    label: "Social Inclusion",
    href: "/social-inclusion",
    description: "Civic participation & disability inclusion",
    icon: Users,
  },
  {
    label: "Protection",
    href: "/protection",
    description: "GBV response & safeguarding",
    icon: ShieldCheck,
  },
];

export const whatWeDoExtra: NavLink = {
  label: "Radio Advocacy",
  href: "/radio",
};

export const impactLinks: NavLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Annual Report", href: "/impact" },
  {
    label: "Projects & Interventions",
    href: "/interventions/projectandintervention",
  },
  { label: "Events & Updates", href: "/events" },
  { label: "Newsletter", href: "/news-updates" },
  { label: "Radio Story", href: "/radio-story" },
];

/** Localized overlay: keeps hrefs/icons fixed, swaps labels via the active dictionary. */
export function useLocalizedNav() {
  const { t } = useLocale();

  const whoWeAre: NavLink[] = [
    { label: t.whoWeAreMenu.aboutUs, href: "/about" },
    { label: t.whoWeAreMenu.ourHistory, href: "/our-history" },
    { label: t.whoWeAreMenu.ourCommitment, href: "/our-commitment" },
    { label: t.whoWeAreMenu.ourStrategies, href: "/our-strategies" },
    { label: t.whoWeAreMenu.nidake, href: "/nidake" },
    { label: t.whoWeAreMenu.boardOfTrustees, href: "/board-of-trustees" },
    { label: t.whoWeAreMenu.managementTeam, href: "/management-team" },
  ];

  const whatWeDo: NavCard[] = [
    { label: t.whatWeDoMenu.health, description: t.whatWeDoMenu.healthDesc, href: "/health", icon: HeartPulse },
    { label: t.whatWeDoMenu.education, description: t.whatWeDoMenu.educationDesc, href: "/education", icon: GraduationCap },
    { label: t.whatWeDoMenu.livelihood, description: t.whatWeDoMenu.livelihoodDesc, href: "/livelihood", icon: Handshake },
    { label: t.whatWeDoMenu.foodSecurity, description: t.whatWeDoMenu.foodSecurityDesc, href: "/food-security", icon: Wheat },
    { label: t.whatWeDoMenu.socialInclusion, description: t.whatWeDoMenu.socialInclusionDesc, href: "/social-inclusion", icon: Users },
    { label: t.whatWeDoMenu.protection, description: t.whatWeDoMenu.protectionDesc, href: "/protection", icon: ShieldCheck },
  ];

  const whatWeDoExtraLocalized: NavLink = {
    label: t.whatWeDoMenu.radioAdvocacy,
    href: "/radio",
  };

  const impact: NavLink[] = [
    { label: t.impactMenu.blog, href: "/blog" },
    { label: t.impactMenu.successStories, href: "/success-stories" },
    { label: t.impactMenu.annualReport, href: "/impact" },
    {
      label: t.impactMenu.projectsInterventions,
      href: "/interventions/projectandintervention",
    },
    { label: t.impactMenu.eventsUpdates, href: "/events" },
    { label: t.impactMenu.newsletter, href: "/news-updates" },
    { label: t.impactMenu.radioStory, href: "/radio-story" },
  ];

  return {
    whoWeAreLinks: whoWeAre,
    whatWeDoCards: whatWeDo,
    whatWeDoExtra: whatWeDoExtraLocalized,
    impactLinks: impact,
  };
}
