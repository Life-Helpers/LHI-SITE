import { siteConfig } from "@/config/site";
import type { CmsSettings } from "@/lib/cms/schema";

/**
 * Organisation facts editors manage in Admin → Settings (contact details, social media
 * accounts, impact figures), plus the figures counted automatically. The server reads them
 * with getSiteData(); client components get them from <SiteDataProvider> via useSiteData().
 */
export interface SiteData {
  contact: CmsSettings["contact"];
  social: CmsSettings["social"];
  stats: CmsSettings["stats"] & {
    /** States with an LHI office, counted from the map. */
    statesActive: string;
    /** Whole years since 1 October 2004. */
    yearsOfService: string;
  };
}

export function siteDataFrom(settings: Pick<CmsSettings, "contact" | "social" | "stats">): SiteData {
  return {
    contact: settings.contact,
    social: settings.social,
    stats: { ...settings.stats, statesActive: siteConfig.stats.statesActive, yearsOfService: siteConfig.stats.yearsOfService },
  };
}

/** The built-in values, used until Settings are saved and outside the provider. */
export const DEFAULT_SITE_DATA: SiteData = siteDataFrom({
  contact: {
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phoneDisplay,
    helpline: siteConfig.contact.feedbackLine,
    feedbackEmail: siteConfig.contact.feedbackEmail,
    pseaEmail: siteConfig.contact.pseaEmail,
    recruitmentEmail: siteConfig.contact.recruitmentEmail,
  },
  social: { ...siteConfig.social },
  stats: {
    peopleReached: siteConfig.stats.peopleReached,
    households: siteConfig.stats.households,
    projects: siteConfig.stats.projects,
    staff: siteConfig.stats.staff,
    volunteers: siteConfig.stats.volunteers,
    grants: siteConfig.stats.grants,
  },
});

/** A tel: link for a number written with spaces or dashes. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** A WhatsApp chat link for a number, with an optional first message. */
export const whatsappHref = (phone: string, text?: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
