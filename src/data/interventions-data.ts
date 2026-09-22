import type { OperationalStateId } from "@/data/operational-states";

export type ThematicPillarId =
  | "health"
  | "education"
  | "livelihood"
  | "food-security"
  | "social-inclusion"
  | "protection";

export interface ThematicPillarRef {
  id: ThematicPillarId;
  name: string;
  href: string;
  badgeColor: string;
}

export interface InterventionProject {
  id: string;
  title: string;
  shortTitle: string;
  donor: string;
  partnerLogos?: string[];
  status: "Active" | "Completed" | "Multi-Year";
  duration: string;
  locations: string;
  /** Frontline states where this intervention is delivered (drives the operational map). */
  states: OperationalStateId[];
  thematicAreas: ThematicPillarRef[];
  primaryThematic: ThematicPillarId;
  image: {
    src: string;
    alt: string;
    caption: string;
  };
  /** Extra field photos for the dossier carousel. Add real LHI photos here as they become available. */
  gallery?: { src: string; alt: string; caption: string }[];
  /** Optional YouTube video id for the dossier's field video. */
  youtubeId?: string;
  summary: string;
  keyInterventions: string[];
  impactMetric: string;
  tags: string[];
  featured?: boolean;
}

export const THEMATIC_PILLARS: Record<
  ThematicPillarId,
  { name: string; href: string; badgeColor: string; description: string }
> = {
  health: {
    name: "Health & WASH",
    href: "/health",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Maternal & infant care, clinical malaria mitigation, Tom Brown nutrition, solar clean water.",
  },
  education: {
    name: "Education",
    href: "/education",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Accelerated learning centers, girl-child retention, literacy hubs & non-formal learning.",
  },
  livelihood: {
    name: "Livelihood",
    href: "/livelihood",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "VSLA community savings, vocational start-up kits (tailoring, soap making), and cash grants.",
  },
  "food-security": {
    name: "Food Security",
    href: "/food-security",
    badgeColor: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
    description: "Climate-smart agriculture, dry-season irrigation, small ruminant livestock & market linkages.",
  },
  "social-inclusion": {
    name: "Social Inclusion",
    href: "/social-inclusion",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Civic governance, women in decision-making, disability rights & civic dialogues.",
  },
  protection: {
    name: "Protection & GBV",
    href: "/protection",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Spotlight Initiative, safe spaces, SGBV survivor psycho-social aid & child safeguarding.",
  },
};

export function getPillarRef(id: ThematicPillarId): ThematicPillarRef {
  const p = THEMATIC_PILLARS[id];
  return {
    id,
    name: p.name,
    href: p.href,
    badgeColor: p.badgeColor,
  };
}

export const INTERVENTIONS_DATA: InterventionProject[] = [
  // 1. PMI-S GUC Project (MSH / USAID)
  {
    id: "pmi-s-msh",
    title: "President's Malaria Initiative for States (PMI-S) GUC Project",
    shortTitle: "PMI-S Malaria Project",
    donor: "Management Sciences for Health (MSH) / USAID",
    status: "Active",
    duration: "Multi-Year Grant",
    locations: "Zamfara State (Selected LGAs & Primary Health Facilities)",
    states: ["zamfara"],
    primaryThematic: "health",
    thematicAreas: [getPillarRef("health")],
    image: {
      src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      alt: "Healthcare worker conducting clinical diagnostics and maternal malaria consultation in northern Nigeria",
      caption: "Healthcare worker mentoring and rapid malaria diagnostic testing in primary healthcare centers",
    },
    summary:
      "Implemented in close partnership with Management Sciences for Health (MSH) under the U.S. President’s Malaria Initiative for States (PMI-S). The intervention significantly reduces under-five and maternal morbidity and mortality caused by malaria in hard-to-reach and security-compromised LGAs across Zamfara State.",
    keyInterventions: [
      "Mentored and built clinical capacity for over 1,200 frontline healthcare providers across primary facilities.",
      "Conducted extensive Data Quality Assurance (DQA) across state health management information systems (DHIS2).",
      "Strengthened community drug distributors (CDDs) for seasonal malaria chemoprevention (SMC) outreach.",
      "Facilitated facility-based commodity supply chain monitoring to prevent stock-outs of ACTs and rapid test kits.",
    ],
    impactMetric: "Over 450,000 children and pregnant women protected through clinical care and seasonal chemoprevention.",
    tags: ["malaria", "msh", "zamfara", "health-systems", "primary-care", "pmi-s"],
    featured: true,
  },

  // 2. Save the Children International (SCI) Project (EU Early Recovery)
  {
    id: "save-the-children-yobe",
    title: "EU Support to Early Recovery from Conflict and Resilience Building",
    shortTitle: "SCI Resilience & Early Recovery",
    donor: "Save the Children International (SCI) / European Union",
    status: "Active",
    duration: "4-Year Comprehensive Initiative",
    locations: "Yobe State (Conflict-Affected Communities in Bade, Jakusko & Damaturu)",
    states: ["yobe"],
    primaryThematic: "education",
    thematicAreas: [
      getPillarRef("education"),
      getPillarRef("livelihood"),
      getPillarRef("protection"),
      getPillarRef("health"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      alt: "African school children participating joyfully in educational learning and child protection activities",
      caption: "Community learning centers and child-friendly spaces established for conflict-affected children in Yobe State",
    },
    summary:
      "A flagship multi-sectoral partnership with Save the Children International, supported by the European Union. The project supports early recovery and strengthens community resilience by expanding child protection networks, ensuring uninterrupted education in emergency zones, fostering youth vocations, and restoring basic family healthcare access.",
    keyInterventions: [
      "Established community-based child protection committees (CBCPCs) and safe learning environments.",
      "Provided market-driven vocational training in tailoring, soap manufacturing, barbing, and bicycle repair.",
      "Surpassed job creation benchmarks, with 98.9% of trained youth establishing sustainable income enterprises.",
      "Delivered child nutrition monitoring and cash-for-livelihoods assistance, reducing negative household coping strategies.",
    ],
    impactMetric: "Over 120,000 conflict-affected children and caregivers supported with protection, education, and livelihood kits.",
    tags: ["save-the-children", "yobe", "resilience", "child-protection", "vocational", "education"],
    featured: true,
  },

  // 3. Spotlight Initiative (UN / EU)
  {
    id: "spotlight-initiative",
    title: "Spotlight Initiative: Eliminating Violence Against Women & Girls",
    shortTitle: "Spotlight Initiative SGBV Response",
    donor: "United Nations (UN Women, UNFPA, UNICEF) & European Union",
    status: "Active",
    duration: "Multi-Year Global Program",
    locations: "Sokoto State (Focus LGAs & Rural Wards)",
    states: ["sokoto"],
    primaryThematic: "protection",
    thematicAreas: [
      getPillarRef("protection"),
      getPillarRef("social-inclusion"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      alt: "Empowered Nigerian women community advocates leading human rights and gender-based violence prevention dialogue",
      caption: "Women leaders and community advocates mobilizing against gender-based violence and early forced marriage",
    },
    summary:
      "The Spotlight Initiative is the world’s largest targeted effort to eliminate all forms of violence against women and girls (VAWG). In Sokoto State, LHI spearheads grassroots community mobilization, survivor psychosocial support, and policy advocacy alongside traditional rulers, faith leaders, and legal authorities.",
    keyInterventions: [
      "Operated confidential psychosocial counseling centers and multi-agency referral desks for survivors.",
      "Trained male champions and religious leaders on positive masculinity, Islamic jurisprudence on rights, and anti-SGBV norms.",
      "Equipped adolescent girls and survivors with dignity kits, medical referrals, and legal aid representation.",
      "Facilitated community surveillance networks to identify and report domestic violence and child marriage early.",
    ],
    impactMetric: "Over 68,000 women and adolescent girls reached; 1,450 survivors provided comprehensive legal and psychosocial aid.",
    tags: ["spotlight-initiative", "un-women", "unfpa", "sgbv", "protection", "women-rights"],
    featured: true,
  },

  // 4. SHOW Project (Plan International / Global Affairs Canada)
  {
    id: "show-plan",
    title: "Strengthening Health Outcomes for Women and Children (SHOW)",
    shortTitle: "SHOW Health Project",
    donor: "Plan International / Global Affairs Canada",
    status: "Completed",
    duration: "5-Year Flagship Project",
    locations: "Sokoto & Bauchi States",
    states: ["sokoto", "bauchi"],
    primaryThematic: "health",
    thematicAreas: [
      getPillarRef("health"),
      getPillarRef("protection"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
      alt: "Healthcare worker caring for a mother and newborn infant at a rural primary health clinic in Nigeria",
      caption: "Maternal and newborn care facilitation, adolescent health clinics, and emergency transport schemes",
    },
    summary:
      "Implemented across northern Nigeria in partnership with Plan International and funded by Global Affairs Canada. The SHOW project transformed the health landscape for adolescent girls, mothers, and newborns by upgrading primary health facilities, establishing youth-friendly health desks, and training frontline health workers.",
    keyInterventions: [
      "Established 48 youth-friendly health corners providing non-judgmental reproductive healthcare.",
      "Equipped local health centers with clinical delivery kits, solar lighting, and cold chain equipment.",
      "Formed community emergency transport schemes (ETS) with commercial motorists to carry laboring mothers to hospitals.",
      "Trained peer educators to lead behavioral change dialogues addressing teenage pregnancies and safe motherhood.",
    ],
    impactMetric: "85,000+ adolescent girls and mothers accessed respectful, confidential reproductive and maternal healthcare.",
    tags: ["plan-international", "show", "canada", "adolescent-health", "maternal", "health"],
    featured: true,
  },

  // 5. UNICEF Multi-Sectoral Integrated Resilience Programme (MIRP)
  {
    id: "unicef-mirp",
    title: "UNICEF Multi-Sectoral Integrated Resilience Programme (MIRP)",
    shortTitle: "UNICEF MIRP Resilience & WASH",
    donor: "UNICEF Nigeria",
    status: "Active",
    duration: "Multi-Year Field Program",
    locations: "Zamfara State (Gusau, Maru, Kaura Namoda, Anka) & Sokoto State",
    states: ["zamfara", "sokoto"],
    primaryThematic: "health",
    thematicAreas: [
      getPillarRef("health"),
      getPillarRef("food-security"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
      alt: "Healthy African child smiling brightly following therapeutic nutrition and clinical care",
      caption: "Community screening for acute malnutrition, Tom Brown therapeutic recipes, and immunization catch-up",
    },
    summary:
      "A comprehensive multi-sectoral initiative in partnership with UNICEF Nigeria addressing severe childhood malnutrition, waterborne disease outbreaks, and routine immunization gaps in remote, security-affected communities across Northwest Nigeria.",
    keyInterventions: [
      "Executed door-to-door mid-upper arm circumference (MUAC) screening for children under 5.",
      "Formulated and distributed locally sourced, highly nutritious Tom Brown supplementary food to combat wasting.",
      "Rehabilitated 52 dysfunctional community boreholes and fitted solar-powered submersible pumps for potable water.",
      "Organized community immunization catch-up sessions, achieving a 98% cure rate in outpatient stabilization centers.",
    ],
    impactMetric: "45,000+ children screened; over 12,000 severely malnourished infants rehabilitated back to health.",
    tags: ["unicef", "mirp", "nutrition", "wash", "zamfara", "immunization", "tom-brown"],
    featured: true,
  },

  // 6. UNICEF REACH: Reaching and Empowering Adolescent Girls
  {
    id: "unicef-reach",
    title: "REACH: Reaching and Empowering Adolescent Girls",
    shortTitle: "UNICEF REACH Girls Empowerment",
    donor: "UNICEF Nigeria",
    status: "Active",
    duration: "Multi-Year Initiative",
    locations: "Northwest Nigeria (Sokoto, Kebbi, Zamfara)",
    states: ["sokoto", "kebbi", "zamfara"],
    primaryThematic: "education",
    thematicAreas: [
      getPillarRef("education"),
      getPillarRef("livelihood"),
      getPillarRef("protection"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
      alt: "Adolescent African girl students engaged actively in non-formal education and accelerated literacy program",
      caption: "Accelerated learning centers, life skills training, and dignity kits enabling adolescent girls to thrive",
    },
    summary:
      "REACH is designed to re-enroll out-of-school adolescent girls and young female survivors of hardship into accelerated basic literacy, numeracy, and vocational pathways. The project integrates psychosocial counseling with dignity kits to ensure sustainable retention.",
    keyInterventions: [
      "Operated 75 non-formal community learning centers equipped with gender-segregated WASH facilities.",
      "Distributed scholastic backpacks, study textbooks, and menstrual hygiene dignity packs.",
      "Provided vocational entrepreneurship starter kits (tailoring, shoemaking, pastry making, and digital skills).",
      "Engaged parents and traditional leaders to eliminate economic and social barriers to female school continuation.",
    ],
    impactMetric: "Over 14,000 adolescent girls transitioned into formal secondary schools or self-sufficient micro-enterprises.",
    tags: ["unicef", "reach", "girls-education", "adolescent", "literacy", "protection"],
    featured: true,
  },

  // 7. Stabilization and Resilience Building Project (SIF)
  {
    id: "sif-stabilization",
    title: "Stabilization and Resilience Building Project",
    shortTitle: "SIF Stabilization & Livelihood",
    donor: "Secours Islamique France (SIF)",
    status: "Active",
    duration: "Multi-Year Grant",
    locations: "Zamfara State (Host & Displaced Communities)",
    states: ["zamfara"],
    primaryThematic: "livelihood",
    thematicAreas: [
      getPillarRef("livelihood"),
      getPillarRef("protection"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
      alt: "Nigerian women artisans in vocational tailoring workshop creating handmade products",
      caption: "Vocational skills acquisition, multipurpose cash grants, and market linkages for vulnerable households",
    },
    summary:
      "In partnership with Secours Islamique France (SIF), this project delivers comprehensive socio-economic recovery for populations displaced by civil insecurity in Zamfara State. It combines technical vocational skills with unconditional cash transfers and psycho-social recovery.",
    keyInterventions: [
      "Established community vocational hubs providing accredited training in tailoring, leather crafts, and cosmetology.",
      "Disbursed Multipurpose Cash Assistance (MPCA) to highly vulnerable, female-headed displaced families.",
      "Constructed safe spaces for trauma recovery, grief counseling, and psychosocial peer-support circles.",
      "Connected artisan cooperatives directly to regional grain and craft markets to maximize fair pricing.",
    ],
    impactMetric: "3,800+ households restored to economic independence with sustainable vocational tools and capital.",
    tags: ["sif", "secours-islamique", "zamfara", "livelihood", "cash-assistance", "resilience"],
  },

  // 8. ZOA Jere & Biu Projects (ZOA International / EU)
  {
    id: "zoa-resilience",
    title: "ZOA Community Resilience, Livelihoods & Food Security Project",
    shortTitle: "ZOA Jere & Biu Projects",
    donor: "ZOA International / European Union",
    status: "Active",
    duration: "Multi-Year Partnership",
    locations: "Borno State (Jere LGA & Biu LGA)",
    states: ["borno"],
    primaryThematic: "food-security",
    thematicAreas: [
      getPillarRef("food-security"),
      getPillarRef("livelihood"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=80",
      alt: "African smallholder farmers harvesting thriving agricultural produce in community farm",
      caption: "Climate-resilient agricultural extension, dry-season irrigation, and village savings schemes in Borno State",
    },
    summary:
      "A strategic recovery intervention implemented in Borno State alongside ZOA International and backed by the European Union. Focused on revitalizing agricultural productivity, establishing Village Savings and Loan Associations (VSLA), and restocking small ruminant livestock for returnee households.",
    keyInterventions: [
      "Trained smallholder farmers in conservation agriculture, soil replenishment, and drip-irrigation techniques.",
      "Distributed drought-tolerant certified seeds, organic fertilizers, and manual sprayers.",
      "Established 140 Village Savings and Loan Associations (VSLA) to foster grassroots credit and emergency funds.",
      "Provided vaccinated breed goats and sheep to female-headed households for livestock multiplier schemes.",
    ],
    impactMetric: "Over 5,200 smallholder farmer households equipped; crop yields expanded by an average of 42%.",
    tags: ["zoa", "borno", "jere", "biu", "agriculture", "vsla", "food-security", "livelihood"],
  },

  // 9. PLAN BMZ Community Resilience & Livelihoods (Plan International / BMZ)
  {
    id: "plan-bmz",
    title: "PLAN BMZ Community Resilience & Livelihoods Project",
    shortTitle: "PLAN BMZ Resilience Project",
    donor: "German Federal Ministry for Economic Cooperation and Development (BMZ) via Plan International",
    status: "Multi-Year",
    duration: "Humanitarian-Development Nexus Program",
    locations: "Yobe State (Conflict-Affected LGAs)",
    states: ["yobe"],
    primaryThematic: "livelihood",
    thematicAreas: [
      getPillarRef("livelihood"),
      getPillarRef("food-security"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      alt: "Smiling Nigerian woman entrepreneur counting savings in village loan association meeting",
      caption: "Village Savings and Loan Associations (VSLA) and climate-smart agricultural support in Yobe State",
    },
    summary:
      "Funded by the German Federal Ministry (BMZ) and managed in partnership with Plan International. Strengthens household economic resilience in communities recovering from the Boko Haram insurgency through collective savings, livestock restocking, and peacebuilding committees.",
    keyInterventions: [
      "Mobilized and coached 120+ Village Savings and Loan Associations with peer-to-peer micro-capital.",
      "Delivered small ruminant animals (breeding goats) with veterinary vaccination support to 1,500 rural women.",
      "Organized community peace and social cohesion committees to resolve farmer-herder land resource friction.",
      "Installed solar-powered community grain processing mills to reduce manual agricultural post-harvest labor.",
    ],
    impactMetric: "120+ Village Savings groups operating; over 3,200 households generating sustainable independent revenue.",
    tags: ["bmz", "germany", "plan-international", "yobe", "vsla", "livelihood", "food-security"],
  },

  // 10. Alive & Thrive (A&T) Project (FHI 360 / Gates Foundation)
  {
    id: "alive-and-thrive",
    title: "Alive & Thrive (A&T) Maternal, Infant, & Young Child Nutrition",
    shortTitle: "Alive & Thrive MIYCN Nutrition",
    donor: "FHI 360 / Bill & Melinda Gates Foundation",
    status: "Completed",
    duration: "Strategic Nutrition Project",
    locations: "Sokoto State (Statewide Primary Care Network)",
    states: ["sokoto"],
    primaryThematic: "health",
    thematicAreas: [getPillarRef("health")],
    image: {
      src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
      alt: "Community health worker measuring infant development and counseling young mother on child nutrition",
      caption: "Infant and young child feeding (IYCF) counseling, exclusive breastfeeding drives, and micronutrients",
    },
    summary:
      "Implemented in close partnership with FHI 360 to scale up Maternal, Infant, and Young Child Nutrition (MIYCN) practices across Sokoto State. The initiative addressed chronic child stunting, maternal anemia, and low exclusive breastfeeding rates through intensive community counseling.",
    keyInterventions: [
      "Mentored community volunteers, traditional birth attendants, and primary healthcare nurses on optimal IYCF.",
      "Conducted house-to-house social and behavior change communication (SBCC) on exclusive breastfeeding for 6 months.",
      "Trained patent proprietary medicine vendors to advocate for iron-folic acid supplementation for pregnant mothers.",
      "Engaged Islamic scholars and traditional community emirs to endorse early infant nutrition guidelines.",
    ],
    impactMetric: "Over 95,000 mothers reached; exclusive breastfeeding rates in target wards rose by more than 35%.",
    tags: ["fhi360", "alive-and-thrive", "nutrition", "miycn", "sokoto", "health"],
  },

  // 11. ACE3 Project (Health Systems Consult / USAID)
  {
    id: "ace3-hiv",
    title: "Accelerated Control of the HIV Epidemic and Systems Support (ACE3)",
    shortTitle: "ACE3 HIV/AIDS Health System Project",
    donor: "Health Systems Consult Limited (HSCL) / USAID",
    status: "Active",
    duration: "Multi-Year Epidemic Control Program",
    locations: "Sokoto State (Target LGAs & Treatment Facilities)",
    states: ["sokoto"],
    primaryThematic: "health",
    thematicAreas: [getPillarRef("health")],
    image: {
      src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      alt: "Laboratory technician and clinician reviewing clinical diagnostic samples in modern health facility",
      caption: "HIV testing, prevention of mother-to-child transmission (PMTCT), and antiretroviral treatment adherence",
    },
    summary:
      "A strategic health system strengthening initiative in partnership with Health Systems Consult Limited (HSCL) supported by USAID. Aims to achieve HIV epidemic control in Sokoto State through targeted community testing, patient-centered care, and eliminating stigma.",
    keyInterventions: [
      "Delivered voluntary, confidential community-based HIV testing and linkage to immediate clinical treatment.",
      "Scaled up Prevention of Mother-to-Child Transmission (PMTCT) services in rural primary health centers.",
      "Established peer support groups ensuring high adherence to Antiretroviral Therapy (ART) among clients.",
      "Trained healthcare workers on confidentiality protocols, compassionate care, and anti-stigma counseling.",
    ],
    impactMetric: "Over 52,000 community members screened; 100% of diagnosed clients linked to life-saving antiretroviral care.",
    tags: ["ace3", "hscl", "usaid", "hiv-aids", "health", "sokoto", "pmtct"],
  },

  // 12. USAID Integrated Health Program (IHP / Palladium)
  {
    id: "usaid-ihp",
    title: "Integrated Health Program (IHP) Private Sector Engagement",
    shortTitle: "USAID Integrated Health Program (IHP)",
    donor: "USAID / Palladium Group",
    status: "Completed",
    duration: "Multi-Year Health Systems Grant",
    locations: "Sokoto & Kebbi States",
    states: ["sokoto", "kebbi"],
    primaryThematic: "health",
    thematicAreas: [getPillarRef("health")],
    image: {
      src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      alt: "Community pharmacist consulting with client on childhood illness remedies and safe medication",
      caption: "Training Patent Proprietary Medicine Vendors (PPMVs) and community pharmacists in illness management",
    },
    summary:
      "Under USAID’s flagship Integrated Health Program (IHP) with Palladium, LHI mobilized the private healthcare retail sector—specifically Patent Proprietary Medicine Vendors (PPMVs) and Community Pharmacists (CPs)—to deliver quality first-line pediatric and reproductive healthcare.",
    keyInterventions: [
      "Trained 750+ proprietary patent medicine vendors and community pharmacists in Integrated Community Case Management (iCCM).",
      "Standardized treatment algorithms for childhood pneumonia, malaria, and diarrhea using dispersible zinc and ORS.",
      "Expanded access to voluntary family planning counseling and modern contraceptive methods in rural wards.",
      "Integrated private vendors into state health management reporting mechanisms for verified epidemiological surveillance.",
    ],
    impactMetric: "750+ accredited vendors operational, serving over 180,000 rural families with certified medications.",
    tags: ["usaid", "ihp", "palladium", "ppmv", "child-health", "family-planning", "health"],
  },

  // 13. NHF Child Protection in Emergencies & Dignity Kits (NHF / UN OCHA)
  {
    id: "nhf-cpie",
    title: "NHF Emergency Child Protection & Dignity Kit Distribution",
    shortTitle: "NHF Child Protection in Emergencies",
    donor: "Nigeria Humanitarian Fund (NHF) / UN OCHA, Child Protection AoR",
    status: "Active",
    duration: "Humanitarian Response Allocation",
    locations: "Borno State (Jere LGA & Maiduguri Metropolitan Council)",
    states: ["borno"],
    primaryThematic: "protection",
    thematicAreas: [
      getPillarRef("protection"),
      getPillarRef("social-inclusion"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
      alt: "Humanitarian distribution of emergency dignity kits and supplies to displaced mothers in Borno State",
      caption: "Emergency child protection case management, unaccompanied minors family tracing, and dignity kit distribution",
    },
    summary:
      "A vital frontline humanitarian intervention funded by the Nigeria Humanitarian Fund (NHF) under UN OCHA. Focused on urgent child protection for families displaced by armed conflict in Borno State, tracing separated children and safeguarding young girls from exploitation.",
    keyInterventions: [
      "Delivered comprehensive child protection case management for 2,400 vulnerable and separated children.",
      "Reunited 180 unaccompanied and separated minors (UASC) with biological family members across IDP settlements.",
      "Established protected child-friendly spaces (CFS) offering mental health and psychosocial support (MHPSS).",
      "Distributed 18,000+ hygiene dignity kits containing soap, reusable pads, wrappers, and solar flashlights.",
    ],
    impactMetric: "18,000+ dignity kits delivered; 2,400 children assisted with psychosocial emergency counseling.",
    tags: ["nhf", "un-ocha", "borno", "maiduguri", "child-protection", "cpie", "protection"],
  },

  // 14. ECODiN & ECHO Disaster Response & Coordination (IRC Consortium / ECHO)
  {
    id: "ecodin-disaster",
    title: "ECODiN: Enhancing Coordination Systems for Disaster Response in Nigeria",
    shortTitle: "ECODiN Disaster Response",
    donor: "International Rescue Committee (IRC) Consortium / ECHO",
    status: "Active",
    duration: "Strategic Multi-Agency Consortium",
    locations: "Northeast & North-Central Nigeria (Borno, Adamawa, Yobe, Sokoto)",
    states: ["borno", "adamawa", "yobe", "sokoto"],
    primaryThematic: "food-security",
    thematicAreas: [
      getPillarRef("food-security"),
      getPillarRef("protection"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
      alt: "Emergency humanitarian relief task force coordinating flood disaster response and food supplies",
      caption: "Institutional coordination, flood hazard early warning, and rapid emergency food security relief",
    },
    summary:
      "The ECODiN program aims to institutionalize rapid disaster preparedness and coordination across federal and state emergency relief agencies (NEMA/SEMA). LHI coordinates grassroots rapid response teams, flood hazard alerts, and emergency food delivery to displaced populations.",
    keyInterventions: [
      "Established community early-warning focal points along flood-prone riverine communities in Northern Nigeria.",
      "Conducted joint contingency simulation drills with State Emergency Management Agencies (SEMA).",
      "Deployed 72-hour emergency food baskets and clean potable water tanks during seasonal disaster shocks.",
      "Strengthened local civil protection networks to prioritize elderly, disabled, and child-headed households in relief.",
    ],
    impactMetric: "Over 65,000 individuals protected with rapid contingency response during seasonal flooding emergencies.",
    tags: ["ecodin", "echo", "irc", "disaster-response", "nema", "sema", "food-security"],
  },

  // 15. EU-ACT Project (Agents for Citizen-driven Transformation)
  {
    id: "eu-act",
    title: "EU-ACT: Agents for Citizen-Driven Transformation Project",
    shortTitle: "EU-ACT Governance Transformation",
    donor: "European Union / British Council",
    status: "Completed",
    duration: "Institutional Capacity Initiative",
    locations: "Sokoto State",
    states: ["sokoto"],
    primaryThematic: "social-inclusion",
    thematicAreas: [
      getPillarRef("social-inclusion"),
      getPillarRef("education"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
      alt: "Civil society leaders in conference room discussing governance transparency and community accountability",
      caption: "Capacity building for civil society groups, citizen advocacy, and public accountability dialogues",
    },
    summary:
      "Funded by the European Union and managed by the British Council, EU-ACT strengthened local civil society organizations (CSOs) in Sokoto State. LHI facilitated institutional governance training, citizen scorecards, and public resource tracking to demand transparency from public agencies.",
    keyInterventions: [
      "Trained 45 grassroots community-based organizations (CBOs) in financial accounting and ethical compliance.",
      "Facilitated town hall dialogues bridging citizen groups and local government legislative councils.",
      "Developed citizen tracking scorecards monitoring state budget execution in primary healthcare and education.",
      "Amplified youth and women’s representation on state developmental planning committees.",
    ],
    impactMetric: "45 local CSOs empowered; citizen scorecards adopted in 6 local government areas to guide public spending.",
    tags: ["eu-act", "european-union", "british-council", "governance", "social-inclusion", "accountability"],
  },

  // 16. Democratic Governance & Women in Leadership (IRI & NDI)
  {
    id: "iri-ndi-governance",
    title: "Civic Inclusion, Democratic Governance & Women’s Political Participation",
    shortTitle: "IRI & NDI Civic Inclusion",
    donor: "International Republican Institute (IRI) & National Democratic Institute (NDI)",
    status: "Active",
    duration: "Strategic Civic Program",
    locations: "Sokoto & Kebbi States",
    states: ["sokoto", "kebbi"],
    primaryThematic: "social-inclusion",
    thematicAreas: [getPillarRef("social-inclusion")],
    image: {
      src: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
      alt: "Nigerian women holding voter cards and participating in community civic rights education workshop",
      caption: "Civic rights education, peaceful voting advocacy, and breaking barriers for women in political governance",
    },
    summary:
      "A dual partnership with the International Republican Institute (IRI) and National Democratic Institute (NDI) empowering women, youth, and persons with disabilities to actively participate in political decision-making, electoral engagement, and community leadership.",
    keyInterventions: [
      "Trained female political aspirants and grassroots leaders in campaign organizing, media relations, and debate skills.",
      "Conducted extensive voter rights awareness campaigns in rural communities, reaching thousands of first-time voters.",
      "Advocated with political party executives to reduce candidacy registration fees for female and young candidates.",
      "Organized non-violent election monitoring pacts across inter-faith and youth community groups.",
    ],
    impactMetric: "Over 35,000 citizens mobilized; female voter turnout increased by 28% across target polling wards.",
    tags: ["iri", "ndi", "democracy", "women-in-politics", "civic-rights", "social-inclusion"],
  },

  // 17. BMZ / KfW Mothers' Associations for Girls' Education
  {
    id: "bmz-mothers-education",
    title: "BMZ / KfW Mothers' Associations for Girls' Education & School Retention",
    shortTitle: "BMZ Mothers' Associations",
    donor: "German Government (BMZ) via KfW Development Bank & UNICEF",
    status: "Active",
    duration: "Education Grant Cycle",
    locations: "Zamfara & Sokoto States (40 Rural Wards)",
    states: ["zamfara", "sokoto"],
    primaryThematic: "education",
    thematicAreas: [
      getPillarRef("education"),
      getPillarRef("social-inclusion"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
      alt: "Passionate Nigerian mother and educator mentoring young girls in rural classroom",
      caption: "Mothers' Associations monitoring girl-child attendance, providing school uniforms, and eliminating dropouts",
    },
    summary:
      "Funded by the German Federal Government (BMZ) through KfW Development Bank and technical coordination by UNICEF. Mobilizes rural mothers into organized school support associations that actively track female attendance, conduct house-to-house enrollment drives, and manage revolving uniform funds.",
    keyInterventions: [
      "Formed and sustained 220 functional Mothers’ Associations across 40 vulnerable rural educational wards.",
      "Provided seed grants for associations to sew and distribute free school uniforms and menstrual kits for girl scholars.",
      "Mediated directly with households when girls were at risk of dropping out due to economic hardship or early marriage.",
      "Collaborated with State Universal Basic Education Boards (SUBEB) to improve school safety and teacher attendance.",
    ],
    impactMetric: "Over 22,000 girls enrolled and retained in basic schools; 220 active Mothers' Associations operating.",
    tags: ["bmz", "kfw", "unicef", "girls-education", "mothers-associations", "education"],
  },

  // 18. Women Situation Room & Peace Radio Broadcasts
  {
    id: "women-situation-room",
    title: "The Women Situation Room & Multi-State Peace Radio Broadcasts",
    shortTitle: "Women Situation Room Radio",
    donor: "Life Helpers Initiative Media Directorate & Partner FM Stations",
    status: "Active",
    duration: "Continuous Weekly Flagship Broadcast",
    locations: "11 States Regional Broadcast Network",
    states: ["sokoto", "zamfara", "kebbi", "borno", "yobe", "adamawa", "bauchi", "kano", "kaduna", "niger", "fct"],
    primaryThematic: "social-inclusion",
    thematicAreas: [
      getPillarRef("social-inclusion"),
      getPillarRef("protection"),
      getPillarRef("health"),
    ],
    image: {
      src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
      alt: "Radio broadcaster hosting live interactive peacebuilding and maternal health program in broadcast studio",
      caption: "Weekly live radio broadcasts in Hausa, Kanuri, and English reaching over 2.5 million rural listeners",
    },
    summary:
      "A weekly multi-state broadcast network operating across Northern Nigeria. Provides accessible audio discussions on maternal health, child protection, conflict resolution, women's civic rights, and routine immunization for rural families without internet or literacy access.",
    keyInterventions: [
      "Broadcasted weekly interactive radio phone-in programs across top regional FM stations in Hausa, Kanuri, and English.",
      "Hosted expert panels of medical doctors, Islamic scholars, human rights lawyers, and traditional leaders.",
      "Established toll-free radio listener feedback hotlines for emergency GBV report triage and health referrals.",
      "Trained community radio listening clubs that meet weekly to discuss broadcast topics and implement local solutions.",
    ],
    impactMetric: "Over 2.5 million weekly listeners tuned in across 11 states; over 4,500 direct listener call-ins resolved.",
    tags: ["radio", "women-situation-room", "advocacy", "peacebuilding", "social-inclusion", "protection"],
  },
];
