import { THEMATIC_AREA_LIST, type ThematicAreaId } from "@/data/thematic-areas";

/**
 * International and national observance days linked to LHI's six thematic areas and to
 * humanitarian action, plus LHI's own anniversary (1 October, founded 2004).
 *
 * Only fixed-date days proclaimed by the UN, WHO, UNESCO, the African Union or the Nigerian
 * government are listed, so every date recurs on the same day each year and can be checked.
 */

export type ObservanceArea =
  | "health"
  | "education"
  | "livelihood"
  | "food-security"
  | "social-inclusion"
  | "protection"
  | "humanitarian"
  | "lhi";

export const OBSERVANCE_AREAS: Record<ObservanceArea, { label: string; href: string }> = {
  lhi: { label: "LHI", href: "/about" },
  humanitarian: { label: "Humanitarian", href: "/emergencies" },
  ...(Object.fromEntries(THEMATIC_AREA_LIST.map((a) => [a.id, { label: a.label, href: a.href }])) as Record<ThematicAreaId, { label: string; href: string }>),
};

export interface Observance {
  id: string;
  title: string;
  /** 1–12 */
  month: number;
  day: number;
  /** For multi-day observances (e.g. 16 Days of Activism), the last day. */
  endMonth?: number;
  endDay?: number;
  area: ObservanceArea;
  /** Proclaimed by. */
  by: string;
  /** Why it matters to LHI's work. */
  description: string;
}

export const LHI_FOUNDING_YEAR = 2004;

export const OBSERVANCES: Observance[] = [
  // LHI
  {
    id: "lhi-anniversary",
    title: "LHI Anniversary",
    month: 10,
    day: 1,
    area: "lhi",
    by: "Life Helpers Initiative",
    description:
      "Life Helpers Initiative was founded in Sokoto on 1 October 2004. Each year we celebrate with the communities, partners, staff and volunteers who put smiles on faces across Nigeria.",
  },

  // Humanitarian
  { id: "world-humanitarian-day", title: "World Humanitarian Day", month: 8, day: 19, area: "humanitarian", by: "United Nations", description: "Honouring aid workers and the people affected by crises whom they serve, including LHI's frontline teams in the North-East and North-West." },
  { id: "international-volunteer-day", title: "International Volunteer Day", month: 12, day: 5, area: "humanitarian", by: "United Nations", description: "Celebrating the community volunteers and structures at the heart of LHI's approach." },
  { id: "disaster-risk-reduction-day", title: "International Day for Disaster Risk Reduction", month: 10, day: 13, area: "humanitarian", by: "United Nations", description: "Building community resilience to floods, drought and displacement." },
  { id: "world-refugee-day", title: "World Refugee Day", month: 6, day: 20, area: "humanitarian", by: "United Nations", description: "Standing with refugees and internally displaced people, including families LHI supports in camps and host communities." },
  { id: "international-day-of-charity", title: "International Day of Charity", month: 9, day: 5, area: "humanitarian", by: "United Nations", description: "A day to give, volunteer and support humanitarian work." },
  { id: "red-cross-red-crescent-day", title: "World Red Cross and Red Crescent Day", month: 5, day: 8, area: "humanitarian", by: "International Red Cross and Red Crescent Movement", description: "Recognising humanitarian principles and the volunteers who uphold them." },
  { id: "international-day-of-peace", title: "International Day of Peace", month: 9, day: 21, area: "humanitarian", by: "United Nations", description: "Promoting peaceful co-existence in conflict-affected communities." },

  // Health & WASH
  { id: "world-tuberculosis-day", title: "World Tuberculosis Day", month: 3, day: 24, area: "health", by: "World Health Organization", description: "Raising awareness to end TB, including community case finding and treatment support." },
  { id: "world-water-day", title: "World Water Day", month: 3, day: 22, area: "health", by: "United Nations", description: "Safe water for every household, a focus of LHI's WASH interventions." },
  { id: "world-health-day", title: "World Health Day", month: 4, day: 7, area: "health", by: "World Health Organization", description: "Health for all, from primary health care to community health workers." },
  { id: "world-malaria-day", title: "World Malaria Day", month: 4, day: 25, area: "health", by: "World Health Organization", description: "Prevention, testing and treatment to end malaria, including seasonal malaria chemoprevention campaigns." },
  { id: "menstrual-hygiene-day", title: "Menstrual Hygiene Day", month: 5, day: 28, area: "health", by: "Global observance", description: "Dignity kits and menstrual health education so girls stay in school." },
  { id: "world-hepatitis-day", title: "World Hepatitis Day", month: 7, day: 28, area: "health", by: "World Health Organization", description: "Awareness, testing and vaccination against viral hepatitis." },
  { id: "world-breastfeeding-week", title: "World Breastfeeding Week", month: 8, day: 1, endMonth: 8, endDay: 7, area: "health", by: "WABA, WHO and UNICEF", description: "Protecting and supporting breastfeeding for child survival and nutrition." },
  { id: "world-mental-health-day", title: "World Mental Health Day", month: 10, day: 10, area: "health", by: "World Health Organization", description: "Mental health and psychosocial support for people affected by conflict and GBV." },
  { id: "global-handwashing-day", title: "Global Handwashing Day", month: 10, day: 15, area: "health", by: "Global Handwashing Partnership", description: "Handwashing with soap: a simple habit that prevents disease." },
  { id: "world-polio-day", title: "World Polio Day", month: 10, day: 24, area: "health", by: "Rotary International and WHO", description: "Keeping Nigeria polio-free through immunisation." },
  { id: "world-toilet-day", title: "World Toilet Day", month: 11, day: 19, area: "health", by: "United Nations", description: "Safe sanitation for every community." },
  { id: "world-aids-day", title: "World AIDS Day", month: 12, day: 1, area: "health", by: "United Nations / UNAIDS", description: "Solidarity with people living with HIV and continued action to end AIDS." },
  { id: "universal-health-coverage-day", title: "Universal Health Coverage Day", month: 12, day: 12, area: "health", by: "United Nations", description: "Quality health care for everyone, without financial hardship." },

  // Education
  { id: "international-day-of-education", title: "International Day of Education", month: 1, day: 24, area: "education", by: "United Nations / UNESCO", description: "Education as a human right, from learning centres to school enrolment drives." },
  { id: "international-literacy-day", title: "International Literacy Day", month: 9, day: 8, area: "education", by: "UNESCO", description: "Literacy and numeracy for children and adults, including LHI's accelerated learning programmes." },
  { id: "protect-education-from-attack", title: "International Day to Protect Education from Attack", month: 9, day: 9, area: "education", by: "United Nations", description: "Keeping schools, learners and teachers safe in conflict-affected areas." },
  { id: "world-teachers-day", title: "World Teachers' Day", month: 10, day: 5, area: "education", by: "UNESCO", description: "Honouring the teachers and facilitators who make learning possible." },
  { id: "day-of-the-girl-child", title: "International Day of the Girl Child", month: 10, day: 11, area: "education", by: "United Nations", description: "Girls' rights, education and empowerment." },

  // Livelihood
  { id: "international-womens-day", title: "International Women's Day", month: 3, day: 8, area: "livelihood", by: "United Nations", description: "Women's economic empowerment, leadership and rights." },
  { id: "msme-day", title: "Micro-, Small and Medium-sized Enterprises Day", month: 6, day: 27, area: "livelihood", by: "United Nations", description: "Small businesses and savings groups (GSLA/VSLA) that build household resilience." },
  { id: "international-youth-day", title: "International Youth Day", month: 8, day: 12, area: "livelihood", by: "United Nations", description: "Skills, jobs and opportunities for young people." },
  { id: "day-of-rural-women", title: "International Day of Rural Women", month: 10, day: 15, area: "livelihood", by: "United Nations", description: "Rural women farmers and entrepreneurs who feed families and communities." },
  { id: "eradication-of-poverty-day", title: "International Day for the Eradication of Poverty", month: 10, day: 17, area: "livelihood", by: "United Nations", description: "Ending poverty in all its forms through livelihoods and social protection." },

  // Food security
  { id: "world-environment-day", title: "World Environment Day", month: 6, day: 5, area: "food-security", by: "United Nations Environment Programme", description: "Protecting the land and environment that farming families depend on." },
  { id: "desertification-and-drought-day", title: "Desertification and Drought Day", month: 6, day: 17, area: "food-security", by: "United Nations", description: "Restoring land and building resilience to drought in the Sahel." },
  { id: "world-food-day", title: "World Food Day", month: 10, day: 16, area: "food-security", by: "FAO", description: "Food security and nutrition, from agric-led livelihoods to emergency food assistance." },
  { id: "world-soil-day", title: "World Soil Day", month: 12, day: 5, area: "food-security", by: "FAO", description: "Healthy soils for climate-smart agriculture." },

  // Social inclusion
  { id: "world-day-of-social-justice", title: "World Day of Social Justice", month: 2, day: 20, area: "social-inclusion", by: "United Nations", description: "Fairness, inclusion and dignity for marginalised people." },
  { id: "international-widows-day", title: "International Widows' Day", month: 6, day: 23, area: "social-inclusion", by: "United Nations", description: "The rights and livelihoods of widows and the families they support." },
  { id: "international-day-of-older-persons", title: "International Day of Older Persons", month: 10, day: 1, area: "social-inclusion", by: "United Nations", description: "Inclusion and care for older people in our communities." },
  { id: "day-of-persons-with-disabilities", title: "International Day of Persons with Disabilities", month: 12, day: 3, area: "social-inclusion", by: "United Nations", description: "Inclusion of people living with disabilities in every programme we run." },

  // Protection & GBV
  { id: "zero-tolerance-fgm", title: "International Day of Zero Tolerance for FGM", month: 2, day: 6, area: "protection", by: "United Nations", description: "Ending female genital mutilation through community dialogue." },
  { id: "nigeria-childrens-day", title: "Children's Day (Nigeria)", month: 5, day: 27, area: "protection", by: "Federal Government of Nigeria", description: "Celebrating Nigerian children and their right to protection, health and education." },
  { id: "world-day-against-child-labour", title: "World Day Against Child Labour", month: 6, day: 12, area: "protection", by: "International Labour Organization", description: "Keeping children in school and out of harmful work." },
  { id: "day-of-the-african-child", title: "Day of the African Child", month: 6, day: 16, area: "protection", by: "African Union", description: "The rights and welfare of children across Africa." },
  { id: "sexual-violence-in-conflict-day", title: "International Day for the Elimination of Sexual Violence in Conflict", month: 6, day: 19, area: "protection", by: "United Nations", description: "Standing with survivors and preventing sexual violence in conflict." },
  { id: "day-against-trafficking", title: "World Day against Trafficking in Persons", month: 7, day: 30, area: "protection", by: "United Nations", description: "Preventing trafficking and protecting survivors." },
  { id: "world-childrens-day", title: "World Children's Day", month: 11, day: 20, area: "protection", by: "United Nations / UNICEF", description: "Children's rights, marking the adoption of the Convention on the Rights of the Child." },
  { id: "16-days-of-activism", title: "16 Days of Activism against Gender-Based Violence", month: 11, day: 25, endMonth: 12, endDay: 10, area: "protection", by: "UN Women and global civil society", description: "From the International Day for the Elimination of Violence against Women (25 November) to Human Rights Day (10 December)." },
  { id: "elimination-of-violence-against-women", title: "International Day for the Elimination of Violence against Women", month: 11, day: 25, area: "protection", by: "United Nations", description: "Ending violence against women and girls, and supporting survivors." },
  { id: "human-rights-day", title: "Human Rights Day", month: 12, day: 10, area: "protection", by: "United Nations", description: "Dignity and rights for everyone, the foundation of protection work." },
];

/** A dated occurrence of an observance, or of an event the team added in the admin. */
export interface CalendarEvent {
  id: string;
  title: string;
  /** YYYY-MM-DD, inclusive. */
  start: string;
  end: string;
  area: ObservanceArea;
  description: string;
  by?: string;
  location?: string;
  time?: string;
  /** Link to more information (internal path or URL). */
  href?: string;
  /** Observance days repeat every year. */
  yearly: boolean;
  /** Title for the repeating calendar entry when `title` names a specific year. */
  recurringTitle?: string;
  kind: "observance" | "event";
}

const pad = (n: number) => String(n).padStart(2, "0");
export const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

export function anniversaryNumber(year: number) {
  const n = year - LHI_FOUNDING_YEAR;
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

/** The occurrence of an observance in a given year. */
export function occurrence(o: Observance, year: number): CalendarEvent {
  const endYear = o.endMonth && o.endMonth < o.month ? year + 1 : year;
  return {
    id: o.id,
    title: o.id === "lhi-anniversary" ? `LHI ${anniversaryNumber(year)} Anniversary` : o.title,
    ...(o.id === "lhi-anniversary" ? { recurringTitle: `LHI Anniversary (founded 1 October ${LHI_FOUNDING_YEAR})` } : {}),
    start: ymd(year, o.month, o.day),
    end: ymd(endYear, o.endMonth ?? o.month, o.endDay ?? o.day),
    area: o.area,
    description: o.description,
    by: o.by,
    href: o.id === "lhi-anniversary" ? "/our-history" : OBSERVANCE_AREAS[o.area].href,
    yearly: true,
    kind: "observance",
  };
}

/** Observance occurrences that end on or after `today`, within the next `days` days, soonest first. */
export function upcomingObservances(today: string, days = 366): CalendarEvent[] {
  const year = Number(today.slice(0, 4));
  const limit = new Date(`${today}T00:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + days);
  const until = limit.toISOString().slice(0, 10);
  return [year - 1, year, year + 1]
    .flatMap((y) => OBSERVANCES.map((o) => occurrence(o, y)))
    .filter((e) => e.end >= today && e.start <= until)
    .sort(compareEvents);
}

/** Soonest first; on the same day LHI's own events come first. */
export function compareEvents(a: CalendarEvent, b: CalendarEvent) {
  const rank = (e: CalendarEvent) => (e.area === "lhi" ? 0 : e.kind === "event" ? 1 : 2);
  return a.start.localeCompare(b.start) || rank(a) - rank(b) || a.title.localeCompare(b.title);
}

/** Whole days from `today` to the event start (0 = today, negative = already running). */
export function daysUntil(today: string, start: string) {
  return Math.round((Date.parse(`${start}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Formatted by hand (not Intl) so server and browser render identical text.
const parts = (d: string) => {
  const date = new Date(`${d}T12:00:00Z`);
  return { y: date.getUTCFullYear(), m: date.getUTCMonth(), day: date.getUTCDate(), wd: date.getUTCDay() };
};

export const monthShort = (d: string) => MONTHS[parts(d).m].slice(0, 3);
export const monthLabel = (yearMonth: string) => {
  const { y, m } = parts(`${yearMonth}-01`);
  return `${MONTHS[m]} ${y}`;
};

export function formatEventDate(e: Pick<CalendarEvent, "start" | "end">) {
  const a = parts(e.start);
  if (e.start === e.end) return `${WEEKDAYS[a.wd]}, ${a.day} ${MONTHS[a.m]} ${a.y}`;
  const b = parts(e.end);
  return `${a.day} ${MONTHS[a.m].slice(0, 3)}${a.y === b.y ? "" : ` ${a.y}`} – ${b.day} ${MONTHS[b.m].slice(0, 3)} ${b.y}`;
}
