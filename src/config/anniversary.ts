import { siteConfig } from "@/config/site";

/**
 * Anniversary celebration popup. LHI was founded on 1 October 2004.
 * The popup shows between `showFrom` and `showUntil` (inclusive, Nigeria time).
 */
const founded = new Date(`${siteConfig.foundingDate}T00:00:00+01:00`);

export const ANNIVERSARY = {
  enabled: true,
  years: 22,
  date: "2026-10-01",
  showFrom: "2026-09-15",
  showUntil: "2026-10-31",
  foundedYear: founded.getFullYear(),
};
