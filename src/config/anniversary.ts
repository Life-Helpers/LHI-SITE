import { siteConfig } from "@/config/site";

/**
 * Anniversary celebration popup. LHI was founded on 1 October 2004, so every 1 October is the
 * anniversary. The popup shows from 15 September to 31 October each year (inclusive, Nigeria
 * time); the year and count roll over on their own.
 */
const founded = new Date(`${siteConfig.foundingDate}T00:00:00+01:00`);
const foundedYear = founded.getFullYear();
const [, month, day] = siteConfig.foundingDate.split("-");

const lagosToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());

function upcomingYear() {
  const today = lagosToday();
  const year = Number(today.slice(0, 4));
  // Once this year's window has closed, look ahead to next year's anniversary.
  return today > `${year}-10-31` ? year + 1 : year;
}

const year = upcomingYear();

export const ANNIVERSARY = {
  enabled: true,
  years: year - foundedYear,
  date: `${year}-${month}-${day}`,
  showFrom: `${year}-09-15`,
  showUntil: `${year}-10-31`,
  foundedYear,
};
