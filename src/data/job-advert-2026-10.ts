import type { CmsJob } from "@/lib/cms/types";

/**
 * The 28 vacancies in LHI's job advert of October 2026 (public/documents/careers/
 * lhi-job-vacancies-october-2026.pdf), closing 24 October 2026. Only what the advert states:
 * title, duty station(s) and how to apply. Contract type is left blank because the advert
 * does not give one; set it in Admin → Jobs & Vacancies when known.
 *
 * Added to the site once by the content import in src/lib/cms/store.ts.
 */

export const JOB_ADVERT_2026_10_PDF = "/documents/careers/lhi-job-vacancies-october-2026.pdf";
const DEADLINE = "2026-10-24";
const POSTED = "2026-10-21";

const description = (title: string, location: string) => `## About Life Helpers Initiative

Life Helpers Initiative (LHI) is a National Non-Governmental Organization based in Nigeria, registered to operate across various states. Since 2004, LHI has been active in the Northeast (Borno, Yobe, Bauchi, Adamawa and Plateau States), Northwest (Sokoto, Kebbi, Katsina and Zamfara States), as well as Ebonyi State and the Federal Capital Territory (FCT). Guided by its mission, LHI is committed to empowering children, youth, women and communities in all aspects of life.

LHI works across six thematic areas: Health, Education, Livelihood, Food Security, Social Inclusion and Protection.

## The position

**${title}**, duty station: ${location}.

LHI is pleased to announce this opening for qualified and experienced individuals who are graduates in the relevant or related fields. As an organization that values gender equality and inclusivity, we strongly encourage applications from women, people living with HIV/AIDS and individuals with disabilities.

## PSEAH / safeguarding statement of commitment

LHI has a zero-tolerance policy towards sexual exploitation, abuse and harassment. We believe that everyone has the right to live free from sexual violence and any form of abuse, regardless of age, sex, gender, sexual orientation, disability, religion or ethnic origin.

## How to apply

Interested and qualified candidates should send their application and CV to **recruitment@lhinigeria.org**. Please indicate the position with the location applied for as the subject of your application (for example: *${title} – ${location.split(";")[0].trim()}*).

Application closing date: **24 October 2026**. Only shortlisted candidates will be contacted.`;

const job = (title: string, id: string, location: string, department: string): CmsJob => ({
  id,
  title,
  summary: `LHI is recruiting a ${title} (${location}). Open to qualified and experienced graduates in the relevant or related fields. Applications close on 24 October 2026.`,
  description: description(title, location),
  requirements: [
    "A graduate in the relevant field or a related field",
    "Qualified and experienced for the position",
    "Commitment to LHI's zero-tolerance policy on sexual exploitation, abuse and harassment",
  ],
  location,
  status: "open",
  department,
  employmentType: "",
  reference: "",
  positions: 0,
  postedDate: POSTED,
  deadline: DEADLINE,
  attachment: JOB_ADVERT_2026_10_PDF,
});

export const JOB_ADVERT_2026_10: CmsJob[] = [
  job("Project Lead", "project-lead-2026", "Sokoto", "Programmes"),
  job("Protection Specialist", "protection-specialist-2026", "Borno", "Protection & Gender"),
  job("LGA Protection Officer", "lga-protection-officer-2026", "Tangaza, Sokoto; Ngala, Dikwa and Monguno, Borno State; Geidam, Yobe; Jibia, Katsina", "Protection & Gender"),
  job("WASH Officer", "wash-officer-2026", "Tangaza, Sokoto; Ngala, Dikwa and Monguno, Borno State; Geidam, Yobe; Jibia, Katsina", "Health & Nutrition"),
  job("WASH Infrastructure Manager", "wash-infrastructure-manager-2026", "Ngala, Borno", "Health & Nutrition"),
  job("Nutrition/Health Specialist", "nutrition-health-specialist-2026", "Borno", "Health & Nutrition"),
  job("Medical Doctor", "medical-doctor-2026", "Tangaza, Sokoto", "Health & Nutrition"),
  job("SC Nutrition Coordinator", "sc-nutrition-coordinator-2026", "Tangaza, Sokoto; Jibia, Katsina", "Health & Nutrition"),
  job("Referral Nurse", "referral-nurse-2026", "Sokoto", "Health & Nutrition"),
  job("MERL Manager", "merl-manager-2026", "Borno and Yobe", "MEAL"),
  job("Nurse/Midwife", "nurse-midwife-2026", "Tangaza, Sokoto; Ngala, Borno", "Health & Nutrition"),
  job("Mental Health", "mental-health-2026", "Tangaza, Sokoto; Ngala, Borno; Jibia, Katsina", "Health & Nutrition"),
  job("Pharmacist", "pharmacist-2026", "Tangaza, Sokoto", "Health & Nutrition"),
  job("Laboratory Scientist", "laboratory-scientist-2026", "Tangaza, Sokoto", "Health & Nutrition"),
  job("Feedback & Accountability Officer", "feedback-and-accountability-officer-2026", "Sokoto and Borno", "Safeguarding & Accountability"),
  job("Cash & Voucher Assistant", "cash-and-voucher-assistant-2026", "Tangaza, Sokoto", "Livelihood & Agriculture"),
  job("Pharmacy Specialist", "pharmacy-specialist-2026", "Sokoto", "Health & Nutrition"),
  job("Warehouse Assistant", "warehouse-assistant-2026", "Katsina and Borno", "Logistics & Procurement"),
  job("Protection Manager", "protection-manager-2026", "Borno/Yobe", "Protection & Gender"),
  job("Health/Nutrition Manager", "health-nutrition-manager-2026", "Borno/Yobe", "Health & Nutrition"),
  job("WASH Manager", "wash-manager-2026", "Borno/Yobe", "Health & Nutrition"),
  job("Feedback and Accountability Manager", "feedback-and-accountability-manager-2026", "Yobe", "Safeguarding & Accountability"),
  job("Cash & Voucher Assistance and Food Security and Livelihoods (CVA/FSL) Manager", "cash-and-voucher-assistance-and-food-security-and-livelihoods-cva-fsl-manager-2026", "Borno/Yobe", "Livelihood & Agriculture"),
  job("MERL Officer", "merl-officer-2026", "Borno and Yobe", "MEAL"),
  job("LGA Nutrition Officer", "lga-nutrition-officer-2026", "Ngala, Dikwa and Monguno, Borno State; Geidam, Yobe", "Health & Nutrition"),
  job("Community Based Health Workers' Supervisor", "community-based-health-workers-supervisor-2026", "Ngala, Dikwa and Monguno, Borno State; Geidam, Yobe", "Health & Nutrition"),
  job("PSS - Psychosocial Support Officer", "pss-psychosocial-support-officer-2026", "Ngala, Dikwa and Monguno, Borno State; Geidam, Yobe", "Protection & Gender"),
  job("LGA Cash & Voucher Officer", "lga-cash-and-voucher-officer-2026", "Ngala, Dikwa and Monguno, Borno State; Geidam, Yobe", "Livelihood & Agriculture"),
];
