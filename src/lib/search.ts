import "server-only";

import { COURSES } from "@/data/training/courses";
import { getAllMagazines, getCalendarEvents, getInterventions, getPublicJobs, getPublicTenders, getPublishedPosts } from "@/lib/cms/content";

export interface SearchResult {
  title: string;
  href: string;
  excerpt: string;
  type: string;
  score: number;
}

const PAGES: { title: string; href: string; excerpt: string }[] = [
  { title: "About Life Helpers Initiative", href: "/about", excerpt: "Who we are, our history since 2004, values and partners." },
  { title: "Our history", href: "/our-history", excerpt: "From the Beulah Project in Sokoto to 11 states." },
  { title: "Our strategies", href: "/our-strategies", excerpt: "How we work: our four strategies." },
  { title: "Our commitment and safeguarding", href: "/our-commitment", excerpt: "Safeguarding, PSEA and accountability to communities." },
  { title: "Board of Trustees", href: "/board-of-trustees", excerpt: "Our Board of Trustees." },
  { title: "Management team", href: "/management-team", excerpt: "Directors and state coordinators." },
  { title: "Programmes", href: "/programs", excerpt: "Our six thematic areas." },
  { title: "Health & WASH", href: "/health", excerpt: "Maternal and child health, nutrition, malaria, water and sanitation." },
  { title: "Education", href: "/education", excerpt: "Learning centres, girls' education and literacy." },
  { title: "Livelihood", href: "/livelihood", excerpt: "Savings groups, vocational skills and small businesses." },
  { title: "Food security", href: "/food-security", excerpt: "Climate-smart agriculture, farmer service hubs and food assistance." },
  { title: "Social inclusion", href: "/social-inclusion", excerpt: "Disability inclusion, women's participation and peacebuilding." },
  { title: "Protection & GBV", href: "/protection", excerpt: "Gender-based violence prevention and response, child protection." },
  { title: "Emergencies", href: "/emergencies", excerpt: "Emergency relief and restoration." },
  { title: "Annual reports", href: "/impact", excerpt: "Organisation-wide results and the 2024 Annual Report." },
  { title: "Fact sheet", href: "/fact-sheet", excerpt: "Project results in numbers, reports and presentations." },
  { title: "Brochure", href: "/brochure", excerpt: "Noma Tushen Arziki Farmer Service Center resilience hub." },
  { title: "Feedback", href: "/feedback", excerpt: "Compliments, suggestions, complaints and questions." },
  { title: "Events & observance days", href: "/events", excerpt: "Upcoming events and international days, add to calendar." },
  { title: "Voices of the People (VOP)", href: "/radio", excerpt: "WeSpeak (Muyi Magana) radio programme, Royal FM 101.5 Sokoto." },
  { title: "Humanitarian Training", href: "/get-involved/training", excerpt: "Free online courses with certificates." },
  { title: "Get involved and volunteer", href: "/get-involved", excerpt: "Volunteer, partner or support our work." },
  { title: "Donate", href: "/donate", excerpt: "Support our work." },
  { title: "Careers", href: "/careers", excerpt: "Vacancies at Life Helpers Initiative." },
  { title: "Procurement", href: "/procurement", excerpt: "Vendor requests and vendor registration." },
  { title: "Partner & bidder portal", href: "/partner-portal", excerpt: "Compliance documents and expressions of interest." },
  { title: "Contact", href: "/contact", excerpt: "Our offices in 11 states." },
  { title: "Frequently asked questions", href: "/faq", excerpt: "Answers to common questions." },
  { title: "NIDAKE reusable sanitary pads", href: "/nidake", excerpt: "Menstrual hygiene and dignity for girls." },
  { title: "Project magazines", href: "/project-magazines", excerpt: "Flip through our magazines and Helpers Digest bulletins." },
  { title: "Privacy policy", href: "/privacy", excerpt: "How we protect your personal data." },
];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

function score(q: string[], title: string, body: string) {
  const t = norm(title);
  const b = norm(body);
  let total = 0;
  for (const term of q) {
    const inTitle = t.includes(term);
    const inBody = b.includes(term);
    if (!inTitle && !inBody) return 0;
    total += (inTitle ? 5 : 0) + (inBody ? 1 : 0);
  }
  return total;
}

const snippet = (text: string, terms: string[]) => {
  const plain = text.replace(/[#*_>[\]()`|]/g, " ").replace(/\s+/g, " ").trim();
  const i = terms.map((t) => norm(plain).indexOf(t)).filter((x) => x >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, i - 60);
  return (start > 0 ? "…" : "") + plain.slice(start, start + 200) + (plain.length > start + 200 ? "…" : "");
};

export async function searchSite(query: string): Promise<SearchResult[]> {
  const terms = norm(query).split(/\s+/).filter((t) => t.length > 1).slice(0, 8);
  if (!terms.length) return [];
  const [posts, interventions, jobs, tenders, events, magazines] = await Promise.all([
    getPublishedPosts(),
    getInterventions(),
    getPublicJobs(),
    getPublicTenders(),
    getCalendarEvents(366),
    getAllMagazines(),
  ]);
  const out: SearchResult[] = [];
  const add = (type: string, title: string, href: string, body: string, excerpt: string) => {
    const s = score(terms, title, body);
    if (s) out.push({ type, title, href, excerpt: excerpt || snippet(body, terms), score: s });
  };
  for (const p of posts) add(p.category, p.title, `/blog/${p.slug}`, `${p.excerpt} ${p.tags.join(" ")} ${p.content}`, snippet(`${p.excerpt} ${p.content}`, terms));
  for (const i of interventions)
    add("Project", i.title, `/interventions/${i.id}`, `${i.shortTitle} ${i.donor} ${i.locations} ${i.summary} ${i.keyInterventions.join(" ")} ${i.tags.join(" ")}`, i.summary);
  for (const m of magazines) add("Magazine", m.title, `/project-magazines/${m.slug}`, `${m.kind} ${m.period} ${m.description} ${m.partners}`, m.description);
  for (const c of COURSES) add("Course", c.title, `/get-involved/training/${c.id}`, `${c.subtitle} ${c.lessons.map((l) => `${l.title} ${l.summary}`).join(" ")}`, c.subtitle);
  for (const j of [...jobs.open, ...jobs.closed]) add(jobs.isOpen(j) ? "Vacancy" : "Closed vacancy", j.title, `/careers/${j.id}`, `${j.summary} ${j.location} ${j.department}`, j.summary);
  for (const t of [...tenders.open, ...tenders.past]) add("Vendor request", t.title, `/procurement/${t.id}`, `${t.summary} ${t.reference} ${t.location}`, t.summary);
  const seen = new Set<string>();
  for (const e of events) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    add("Event", e.title, `/events#${e.id}`, `${e.description} ${e.by ?? ""}`, e.description);
  }
  for (const pg of PAGES) add("Page", pg.title, pg.href, pg.excerpt, pg.excerpt);
  return out.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 60);
}
