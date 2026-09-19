import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Handshake,
  HeartPulse,
  ShieldCheck,
  Users,
  Wheat,
} from "lucide-react";

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
