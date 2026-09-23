import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";
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

interface ProjectInput
  extends Omit<InterventionProject, "image" | "thematicAreas" | "tags" | "primaryThematic"> {
  pillars: [ThematicPillarId, ...ThematicPillarId[]];
  photo: LhiPhotoKey;
  caption?: string;
  tags?: string[];
}

function project({ pillars, photo, caption, tags, ...rest }: ProjectInput): InterventionProject {
  const img = LHI_PHOTOS[photo];
  return {
    ...rest,
    primaryThematic: pillars[0],
    thematicAreas: pillars.map(getPillarRef),
    image: { src: img.src, alt: img.alt, caption: caption ?? img.alt },
    tags: tags ?? [],
  };
}

/**
 * LHI project portfolio, from "Project Experiences" in the Organisational Profile
 * (over 45 projects implemented; these are the ones the profile describes).
 * States are only set where the profile names them. Status reflects the profile's
 * ordering (most recent first) and can be corrected in Admin → Interventions.
 */
export const INTERVENTIONS_DATA: InterventionProject[] = [
  project({
    id: "fcdo-wfp-resilience-smallholder-farmers",
    title: "Resilience Building and Smallholder Farmers Support Project in Northwest Nigeria",
    shortTitle: "FCDO/WFP Smallholder Farmers Resilience",
    donor: "FCDO / World Food Programme (WFP)",
    status: "Active",
    duration: "Sept 2025 – Feb 2026 reporting period (ongoing)",
    locations: "Sokoto (Kware & Wamakko LGAs) and Katsina (Batagarawa & Katsina LGAs)",
    states: ["sokoto", "katsina"],
    pillars: ["food-security", "livelihood"],
    photo: "jafaroCabbage",
    caption: "Jafaro Baro now harvests cabbage twice in the time it once took to grow one crop",
    summary:
      "A multidimensional approach to the interconnected challenges facing smallholder farmers: farmer-led irrigation development (FLID), access to farming inputs and market systems, community-managed assets and non-farm income streams, with a phased exit strategy that leaves community-owned systems behind.",
    keyInterventions: [
      "Cash-based transfers (₦75,000) as a safety net and seed capital for small businesses.",
      "Improved seeds, fertiliser and Good Agronomic Practice training for dry-season farming.",
      "Village Savings and Loan Associations, bank account linkage and NIMC registration.",
      "Noma Tushen Arziki Hub (Wamakko) and Gidan Arziki Farmer Service Centre (Batagarawa), plus the AgriFMIS digital farmer registry.",
    ],
    impactMetric: "5,700 households reached directly and 37,050 household members indirectly across 42 wards.",
    tags: ["wfp", "fcdo", "vsla", "cash-transfer", "agriculture"],
    featured: true,
  }),
  project({
    id: "echo-unicef-education-in-emergencies",
    title: "Quality and Relevant Education for Children in Emergency and Non-Emergency Settings",
    shortTitle: "ECHO/UNICEF Education in Emergencies",
    donor: "ECHO / UNICEF",
    status: "Active",
    duration: "Ongoing",
    locations: "Conflict- and displacement-affected communities",
    states: [],
    pillars: ["education", "protection"],
    photo: "learningCentre",
    summary:
      "Quality basic education for out-of-school children, including Almajiri learners, girls and children with disabilities affected by conflict and displacement, to reduce out-of-school rates and improve completion and transition to junior secondary school.",
    keyInterventions: [
      "Enrol 3,083 out-of-school children (1,850 girls, 1,233 boys) in the Alternate Basic Education Programme (ABEP).",
      "Mainstream 924 children into formal schools.",
      "Reach 5,819 out-of-school children through emergency radio learning.",
      "Train 420 facilitators (105 initially and 315 under the crisis modifier).",
    ],
    impactMetric: "3,083 children enrolled, 924 mainstreamed and 5,819 reached by radio learning (targets).",
    tags: ["echo", "unicef", "oosc", "almajiri"],
  }),
  project({
    id: "unocha-irc-multisector-nutrition",
    title: "Multi-Sector Life-Saving Assistance and Targeted Nutrition Response",
    shortTitle: "UNOCHA Multi-Sector & Nutrition Response",
    donor: "UNOCHA (through the International Rescue Committee)",
    status: "Active",
    duration: "Ongoing",
    locations: "Northeast and Northwest Nigeria",
    states: [],
    pillars: ["health", "protection"],
    photo: "muacScreening",
    summary:
      "Multi-sector life-saving humanitarian assistance in Northeast Nigeria alongside targeted nutrition response in Northwest Nigeria. Under a pre-award arrangement, IRC authorised LHI to begin implementing the approved technical proposal and budget.",
    keyInterventions: [
      "Life-saving multi-sector assistance for crisis-affected households in the Northeast.",
      "Targeted nutrition screening, treatment and referral in the Northwest.",
    ],
    impactMetric: "Integrated humanitarian and nutrition response across two regions.",
    tags: ["unocha", "irc", "nutrition"],
  }),
  project({
    id: "unesco-flhe-health-wellbeing",
    title: "Family Life HIV Education (FLHE) and Education for Health and Wellbeing (EHW)",
    shortTitle: "UNESCO FLHE & Health and Wellbeing",
    donor: "UNESCO",
    status: "Active",
    duration: "Ongoing",
    locations: "Primary and secondary schools and host communities",
    states: [],
    pillars: ["education", "health"],
    photo: "schoolAssembly",
    summary:
      "Supports quality Family Life HIV Education and Education for Health and Wellbeing that empowers adolescents and young people with skills to prevent HIV, reduce unintended pregnancies and eliminate gender-based violence in schools.",
    keyInterventions: [
      "Train 2,000 teachers from at least 450 primary and secondary schools on FLHE/EHW.",
      "Train 120 community, religious and traditional leaders on SGBV, early pregnancy, child marriage and reintegration of teenage mothers.",
      "Train 20 peer educators per school in 30 schools and 30 health providers in adolescent reproductive health.",
      "Support 10 teenage mothers and dropout girls back to school; develop IEC materials and digital engagements.",
    ],
    impactMetric: "2,000 teachers across 450+ schools and 600 peer educators targeted.",
    tags: ["unesco", "flhe", "hiv", "adolescents"],
  }),
  project({
    id: "zoa-lean-season-goronyo-rabah",
    title: "Lean Season Food Assistance in Goronyo and Rabah LGAs of Sokoto State",
    shortTitle: "ZOA Lean Season Food Assistance",
    donor: "ZOA / Canadian Foodgrains Bank",
    status: "Active",
    duration: "Annual lean season",
    locations: "Goronyo and Rabah LGAs, Sokoto State",
    states: ["sokoto"],
    pillars: ["food-security", "livelihood"],
    photo: "womanCooking",
    summary:
      "Improves food security and protects vulnerable households during the annual lean season, reducing the impact of seasonal food shortages, preventing negative coping mechanisms and supporting the nutrition and resilience of women, children and other at-risk community members.",
    keyInterventions: [
      "Food assistance to food-insecure and vulnerable households in Goronyo and Rabah.",
      "Targeting of women, children and at-risk community members.",
      "Implementation according to the approved work plan, budget and donor requirements.",
    ],
    impactMetric: "Lean-season food security for vulnerable households in two LGAs.",
    tags: ["zoa", "cfgb", "food-assistance"],
  }),
  project({
    id: "unocha-sci-health-nutrition-borno-yobe",
    title: "Life-saving Integrated Health and Nutrition Interventions for Women and Children Facing Acute Malnutrition",
    shortTitle: "UNOCHA/SCI Health & Nutrition",
    donor: "UNOCHA Nigeria Humanitarian Fund (CBPF) / Save the Children International",
    status: "Active",
    duration: "Ongoing",
    locations: "Crisis-affected communities in Borno and Yobe States",
    states: ["borno", "yobe"],
    pillars: ["health"],
    photo: "motherChildNutrition",
    summary:
      "Integrated, life-saving health and nutrition interventions for women and children suffering from or at risk of acute malnutrition, reducing morbidity and mortality through timely access to essential health services.",
    keyInterventions: [
      "Nutrition screening, treatment and referral for acute malnutrition.",
      "Essential health services for women and children in humanitarian-affected communities.",
      "Implemented with Save the Children International under the Country-Based Pooled Fund.",
    ],
    impactMetric: "Life-saving care for women and children with acute malnutrition in Borno and Yobe.",
    tags: ["unocha", "nhf", "save-the-children", "nutrition"],
  }),
  project({
    id: "eu-unicef-rmnch-sokoto",
    title: "Strengthening RMNCH+NM Quality of Care in Primary Health Care Facilities of Sokoto State",
    shortTitle: "EU/UNICEF RMNCH+N Quality of Care",
    donor: "European Union / UNICEF",
    status: "Active",
    duration: "Ongoing",
    locations: "Sokoto State: 1 tertiary hospital, 23 general hospitals and 244 PHCs (one per ward)",
    states: ["sokoto"],
    pillars: ["health"],
    photo: "healthScreening",
    summary:
      "Strengthens maternal, newborn and child health services by building health worker skills (Specialized Newborn Care, Kangaroo Mother Care, Helping Babies Breathe) and improving service quality through training, mentoring and supportive supervision.",
    keyInterventions: [
      "Three-layered strategy of training, mentoring and supportive supervision.",
      "Specialized Newborn Care, Kangaroo Mother Care and Helping Babies Breathe skills.",
      "Coverage of Sokoto Specialist Hospital, 23 general hospitals and 244 primary healthcare centres.",
    ],
    impactMetric: "268 health facilities, one PHC in every ward of Sokoto State.",
    tags: ["eu", "unicef", "mnch", "newborn"],
    featured: true,
  }),
  project({
    id: "zoa-food-security-wurno-kware",
    title: "Stabilizing Food Security of Households Affected by the Humanitarian Crisis in Wurno and Kware LGAs",
    shortTitle: "ZOA Food Security Wurno & Kware",
    donor: "ZOA / Canadian Foodgrains Bank",
    status: "Completed",
    duration: "Completed",
    locations: "Wurno and Kware LGAs, Sokoto State",
    states: ["sokoto"],
    pillars: ["food-security"],
    photo: "maizeFarmerWoman",
    summary: "Stabilised food security for households affected by the humanitarian crisis in Wurno and Kware Local Government Areas of Sokoto State.",
    keyInterventions: ["Food security support for crisis-affected households.", "Implemented in partnership with ZOA."],
    impactMetric: "Crisis-affected households in two Sokoto LGAs supported.",
    tags: ["zoa", "cfgb"],
  }),
  project({
    id: "alima-medico-nutrition-borno-yobe",
    title: "Emergency Medico-Nutritional Services to Displaced and Host Populations in Borno and Yobe",
    shortTitle: "ALIMA Emergency Medico-Nutrition",
    donor: "CDCS / ALIMA",
    status: "Completed",
    duration: "Completed",
    locations: "Jere LGA (Borno) and Bade LGA (Yobe)",
    states: ["borno", "yobe"],
    pillars: ["health"],
    photo: "muacScreening",
    summary:
      "As implementing partner to ALIMA, LHI reduced morbidity and mortality among host and displaced populations through emergency medico-nutritional services.",
    keyInterventions: ["Emergency medical and nutrition services for displaced and host communities.", "Community screening and referral."],
    impactMetric: "Emergency care for displaced and host populations in Jere and Bade.",
    tags: ["alima", "nutrition", "emergency"],
  }),
  project({
    id: "undp-lake-chad-peacebuilding",
    title: "Promoting CSO-led Peacebuilding Initiatives in the Lake Chad Basin Sub-region",
    shortTitle: "UNDP Lake Chad Peacebuilding",
    donor: "UNDP",
    status: "Completed",
    duration: "Completed",
    locations: "Selected locations in Borno, Adamawa and Yobe States",
    states: ["borno", "adamawa", "yobe"],
    pillars: ["social-inclusion", "livelihood", "protection"],
    photo: "communityDialogue",
    summary:
      "A consortium-led project deploying location-specific interventions across peacebuilding, livelihood development, protection, agriculture-based support and institution building for marginalized populations.",
    keyInterventions: [
      "Peacebuilding initiatives and knowledge-strengthening platforms.",
      "Livelihood development and agriculture-based support.",
      "Protection and institutional building for marginalized populations.",
    ],
    impactMetric: "Consortium peacebuilding across three Northeast states.",
    tags: ["undp", "peacebuilding", "lake-chad"],
  }),
  project({
    id: "fcdo-unicef-mirp",
    title: "Multi-sectoral Integrated Resilience Programme (MIRP) in Northwest Nigeria",
    shortTitle: "FCDO/UNICEF MIRP",
    donor: "FCDO / UNICEF",
    status: "Active",
    duration: "Ongoing",
    locations: "Northwest Nigeria",
    states: [],
    pillars: ["protection", "livelihood"],
    photo: "mirpDistribution",
    summary:
      "Timely, compassionate services for children at risk of or affected by abuse, neglect and exploitation, including unaccompanied and separated children, adolescent girls and children associated with armed groups, alongside household income resilience through technical and vocational development.",
    keyInterventions: [
      "Child protection services and case management for at-risk children.",
      "Support for unaccompanied and separated children and adolescent girls.",
      "Individual, household and community income resilience through technical and vocational skills.",
    ],
    impactMetric: "Protection and income resilience for vulnerable children and households.",
    tags: ["fcdo", "unicef", "mirp", "child-protection"],
  }),
  project({
    id: "sci-durable-solutions-yobe",
    title: "Livelihood and Peacebuilding Project: Durable Solution Yobe",
    shortTitle: "Durable Solutions Yobe",
    donor: "Swedish Development Cooperation / Save the Children International",
    status: "Active",
    duration: "Ongoing",
    locations: "Selected LGAs of Yobe State",
    states: ["yobe"],
    pillars: ["livelihood", "social-inclusion"],
    photo: "womenGroup",
    summary:
      "As a consortium partner, LHI supports the rebuilding of individual, household and community economic growth through livestock and agricultural support and value-chain additions, aligned with the Yobe State Government Economic Development Plan on Durable Solutions.",
    keyInterventions: [
      "Livestock and agricultural support with value-chain additions.",
      "Priority support to women-headed households.",
      "Alignment with the state's Durable Solutions economic plan.",
    ],
    impactMetric: "Over 2,000 households served, especially women-headed households.",
    tags: ["sida", "save-the-children", "durable-solutions"],
  }),
  project({
    id: "care-enrich-frontline-health-workers",
    title: "EnRICH / Mobilizing Nigeria Community Frontline Health Workers Project",
    shortTitle: "CARE EnRICH Frontline Health Workers",
    donor: "CARE International / GCPTC",
    status: "Active",
    duration: "Ongoing",
    locations: "Community health systems in project LGAs",
    states: [],
    pillars: ["health", "livelihood"],
    photo: "healthOutreach",
    summary:
      "Trains, mentors and supports frontline health workers to improve healthcare quality and outcomes, while strengthening community health systems through participation, access to essential services, referral and linkages.",
    keyInterventions: [
      "Training and mentoring of frontline health workers.",
      "Community orientations, referral and linkages to essential services.",
      "Piloting Frontline Healthcare Workers Savings & Loan Associations.",
    ],
    impactMetric: "Stronger community health systems and economic support for health workers.",
    tags: ["care", "chw", "enrich"],
  }),
  project({
    id: "unicef-end-child-marriage-zamfara",
    title: "Leading the Global Agenda to End Child Marriage by 2030 in Zamfara State",
    shortTitle: "UNICEF End Child Marriage Zamfara",
    donor: "UNICEF / ECM",
    status: "Completed",
    duration: "Completed",
    locations: "3 selected LGAs of Zamfara State",
    states: ["zamfara"],
    pillars: ["protection", "social-inclusion", "livelihood"],
    photo: "pledgeSchool",
    summary:
      "A pivotal grant to transform the lives of vulnerable adolescent girls through stakeholder engagement and advocacy for policy change, removing barriers and vulnerabilities through technical and vocational skill empowerment.",
    keyInterventions: [
      "Key stakeholder engagement and advocacy for policy change.",
      "Technical and vocational skills for vulnerable adolescent girls.",
    ],
    impactMetric: "Adolescent girls empowered across 3 LGAs of Zamfara.",
    tags: ["unicef", "child-marriage", "adolescent-girls"],
  }),
  project({
    id: "echo-irc-multisectoral-resilience",
    title: "Strengthening Resilience through Multi-Sectoral Response in Borno, Zamfara and Sokoto States",
    shortTitle: "ECHO/IRC Multi-Sectoral Resilience",
    donor: "ECHO / International Rescue Committee",
    status: "Active",
    duration: "24 months",
    locations: "Gwoza LGA (Borno), Anka LGA (Zamfara) and Sabon Birni LGA (Sokoto)",
    states: ["borno", "zamfara", "sokoto"],
    pillars: ["health", "education", "protection"],
    photo: "childrenWater",
    summary:
      "With IRC and CHAD International, a 24-month multi-sectoral action providing coordinated life-saving assistance in hard-to-reach areas, improving the ability of IDPs and host communities to meet basic needs.",
    keyInterventions: [
      "Access to health and nutrition services.",
      "Education and WASH support.",
      "Protection services for internally displaced persons and host communities.",
    ],
    impactMetric: "Life-saving multi-sectoral assistance in three hard-to-reach LGAs.",
    tags: ["echo", "irc", "idp"],
  }),
  project({
    id: "unicef-reach-adolescent-girls",
    title: "Reaching and Empowering Adolescent Girls in Northwest Nigeria (REACH)",
    shortTitle: "UNICEF REACH Adolescent Girls",
    donor: "UNICEF",
    status: "Completed",
    duration: "Completed",
    locations: "Binji LGA, Sokoto State",
    states: ["sokoto"],
    pillars: ["protection", "education"],
    photo: "smilingGirls",
    summary:
      "With the Ministry of Women and Children Affairs, LHI supported enrolled adolescent girls in Binji and strengthened grassroots engagement through community groups and protection structures.",
    keyInterventions: [
      "Support for enrolled adolescent girls.",
      "Identify, strengthen and deploy community groups and protection structures.",
      "Community engagement on gender-based issues such as domestic violence and hawking.",
    ],
    impactMetric: "Adolescent girls supported with protection-focused community engagement.",
    tags: ["unicef", "reach", "adolescent-girls"],
  }),
  project({
    id: "msh-pmi-s-plateau-malaria",
    title: "Monitor and Mentor Health Facilities on Malaria Case Management, Data Management and Malaria in Pregnancy",
    shortTitle: "MSH PMI-S Malaria (Plateau)",
    donor: "USG / Management Sciences for Health (PMI-S)",
    status: "Completed",
    duration: "Completed",
    locations: "327 primary healthcare centres in Plateau State",
    states: ["plateau"],
    pillars: ["health"],
    photo: "healthScreening",
    summary:
      "A President's Malaria Initiative for States project providing technical support to frontline providers to improve malaria treatment for children and pregnant women, and strengthening state agencies to use data for a responsive malaria programme.",
    keyInterventions: [
      "Mentoring on malaria case management and malaria in pregnancy.",
      "Data management support to state agencies.",
    ],
    impactMetric: "327 primary healthcare centres supported.",
    tags: ["msh", "pmi-s", "malaria"],
  }),
  project({
    id: "project-hope-ace3-hiv",
    title: "Accelerating the Control of HIV Epidemic Cluster 3 (ACE-3) Project",
    shortTitle: "ACE-3 HIV Epidemic Control",
    donor: "USG / Project HOPE",
    status: "Completed",
    duration: "Completed",
    locations: "13 LGAs",
    states: [],
    pillars: ["health"],
    photo: "healthOutreach",
    summary:
      "A ₦43 million grant supporting facility-based comprehensive HIV treatment for mothers and children and activating community access, care and support.",
    keyInterventions: ["Facility-based comprehensive HIV treatment for mothers and children.", "Community access, care and support."],
    impactMetric: "Comprehensive HIV services across 13 LGAs.",
    tags: ["project-hope", "hiv", "ace-3"],
  }),
  project({
    id: "irc-integrated-emergency-response-sokoto",
    title: "Integrated Emergency Response to the Displaced Population",
    shortTitle: "IRC Integrated Emergency Response (Sokoto)",
    donor: "USG OHA / International Rescue Committee",
    status: "Active",
    duration: "Since July 2024",
    locations: "Displacement camps and PHCs in Sokoto State",
    states: ["sokoto"],
    pillars: ["health"],
    photo: "muacScreening",
    summary:
      "In an IRC-led consortium with COOPI and ALIMA, LHI delivers critical health and nutrition services to displaced persons through clinical treatment and community approaches, using existing PHCs and mobile clinics at the camp.",
    keyInterventions: [
      "Mobile clinics and support to existing primary health centres.",
      "Community MUAC screening and outpatient therapeutic programmes (OTPs).",
      "Builds on stabilisation centre sites established under the ECHO-supported project.",
    ],
    impactMetric: "Integrated clinical and community nutrition care for displaced persons.",
    tags: ["irc", "usg", "nutrition", "idp"],
  }),
  project({
    id: "sci-bha-multisectoral-yobe",
    title: "Integrated Multisectoral Lifesaving Assistance for Conflict-Affected Households",
    shortTitle: "USG BHA/SCI Lifesaving Assistance",
    donor: "USG BHA / Save the Children International",
    status: "Active",
    duration: "Since 2023",
    locations: "65 communities in Damaturu, Gujba, Tarmuwa, Geidam and Gulani LGAs, Yobe State",
    states: ["yobe"],
    pillars: ["health", "protection"],
    photo: "childrenWater",
    summary:
      "In a Save the Children-led consortium, LHI delivers nutrition, WASH and protection services and strengthens state, LGA and community structures to provide adequate services.",
    keyInterventions: [
      "Nutrition services for conflict-affected households.",
      "WASH services.",
      "Protection services and strengthening of community structures.",
    ],
    impactMetric: "65 communities across 5 LGAs of Yobe State.",
    tags: ["bha", "save-the-children", "wash"],
  }),
  project({
    id: "msh-malaria-security-challenged-areas",
    title: "Enhancing Quality Malaria Services in Security-Challenged Areas",
    shortTitle: "MSH Malaria in Security-Challenged Areas",
    donor: "Management Sciences for Health / USG",
    status: "Completed",
    duration: "Completed",
    locations: "Security-challenged LGAs",
    states: [],
    pillars: ["health"],
    photo: "healthOutreach",
    summary:
      "Enhanced primary-level health workforce capacity to provide comprehensive malaria services and strengthened overall malaria programming in the state.",
    keyInterventions: ["Capacity building of primary health workers on malaria.", "Strengthening state malaria programming."],
    impactMetric: "Comprehensive malaria services in hard-to-reach, insecure areas.",
    tags: ["msh", "malaria"],
  }),
  project({
    id: "care-pfizer-infectious-disease-under5",
    title: "Reducing Infectious Disease among Children under 5",
    shortTitle: "CARE/Pfizer Child Infectious Disease",
    donor: "CARE International / Pfizer Foundation",
    status: "Completed",
    duration: "Completed",
    locations: "Selected communities",
    states: [],
    pillars: ["health"],
    photo: "motherChildNutrition",
    summary:
      "A CARE-led consortium combining health system strengthening and community-based services to address infectious disease outbreaks and malnutrition, increasing acceptance of immunisation and health services.",
    keyInterventions: [
      "Health system strengthening and community-based services.",
      "Response to infectious disease outbreaks and malnutrition.",
      "Improving immunisation uptake and community buy-in.",
    ],
    impactMetric: "Improved immunisation acceptance and child health in selected communities.",
    tags: ["care", "pfizer", "immunisation"],
  }),
  project({
    id: "sci-eu-resilience-vulnerable-households",
    title: "Developing Resilience for Vulnerable Households",
    shortTitle: "SCI/EU Household Resilience",
    donor: "Save the Children International / European Union",
    status: "Completed",
    duration: "Completed",
    locations: "Conflict-affected communities",
    states: [],
    pillars: ["livelihood"],
    photo: "womanShop",
    summary:
      "Platforms supporting people affected by conflict to develop their livelihoods, grow their assets and build resilience to future shocks.",
    keyInterventions: [
      "Financial literacy and entrepreneurship capacity building.",
      "Internationally approved Start and Improve Your Business, Enterprise Your Business and GET AHEAD curricula.",
    ],
    impactMetric: "Conflict-affected households equipped to build livelihoods and assets.",
    tags: ["save-the-children", "eu", "siyb"],
  }),
  project({
    id: "zoa-borno-resilience",
    title: "Increasing Resiliency among Crisis-Affected Population in Borno",
    shortTitle: "ZOA Borno Resilience",
    donor: "ZOA / Canadian Foodgrains Bank",
    status: "Completed",
    duration: "Completed",
    locations: "Borno State",
    states: ["borno"],
    pillars: ["livelihood", "food-security"],
    photo: "vegetableTrader",
    summary: "Basic livelihood development that contributed to the health and education of crisis-affected households' children.",
    keyInterventions: ["Basic livelihood development for crisis-affected households."],
    impactMetric: "Over 1,000 households supported to build resilience.",
    tags: ["zoa", "cfgb"],
  }),
  project({
    id: "unicef-kfw-girls-for-girls-yobe",
    title: "Girls for Girls (G4G) Component of the Resilience Integrated Education Programming for Children and Youth",
    shortTitle: "UNICEF/KfW Girls for Girls (Yobe)",
    donor: "UNICEF / KfW",
    status: "Completed",
    duration: "Completed",
    locations: "Yobe State",
    states: ["yobe"],
    pillars: ["education"],
    photo: "girlsLearning",
    summary:
      "Mobilised girls to access basic education through enrolment, re-enrolment, retention and progression, supported by Girls4Girls groups, Mothers' Associations and School-Based Management Committees.",
    keyInterventions: [
      "Girls4Girls groups supporting girls in school.",
      "Mothers' Associations promoting women's participation in education.",
      "Strengthening School-Based Management Committees.",
    ],
    impactMetric: "Girls enrolled, retained and progressing in basic education.",
    tags: ["unicef", "kfw", "g4g", "girls-education"],
  }),
  project({
    id: "eu-spotlight-ending-gbv",
    title: "Ending Gender Violence against Women and Girls in Selected LGAs",
    shortTitle: "EU Spotlight Initiative",
    donor: "EU Spotlight Initiative / UNICEF",
    status: "Completed",
    duration: "Completed",
    locations: "Selected LGAs",
    states: [],
    pillars: ["protection"],
    photo: "activismWomen",
    summary:
      "Provided an immediate supportive platform for survivors and strengthened community structures to identify and support survivors of violence, including those living with disabilities.",
    keyInterventions: [
      "Survivors' forum as a supportive platform.",
      "Strengthening community structures and surveillance teams.",
      "Building community caseworkers' capacity in case management, referral and linkage to services.",
    ],
    impactMetric: "Survivors and caregivers supported through community-based structures.",
    tags: ["spotlight", "gbv", "eu"],
  }),
  project({
    id: "iita-goat-rearing-food-processing",
    title: "Training of Women on Goat Rearing and Micro-Processing of Legumes and Cereals",
    shortTitle: "IITA Nutrition & Livelihoods",
    donor: "International Institute of Tropical Agriculture (IITA) / USG",
    status: "Completed",
    duration: "Completed",
    locations: "Goat rearing pilot in 3 LGAs; micro-processing in 12 LGAs",
    states: [],
    pillars: ["food-security", "livelihood", "health"],
    photo: "nutritionDemo",
    summary:
      "A two-way combination of nutrition and livelihood approaches: nutrition education and food demonstrations promoting dietary diversity, with training on goat rearing and processing of legumes and cereals.",
    keyInterventions: [
      "Nutrition education and food demonstrations on dietary diversification.",
      "Women trained in goat rearing (pilot, 3 LGAs).",
      "Micro-processing of legumes and cereals (12 LGAs).",
    ],
    impactMetric: "1,220 women trained on dietary diversification.",
    tags: ["iita", "nutrition", "small-ruminants"],
  }),
  project({
    id: "palladium-ihp-child-health",
    title: "Integrated Health Program: Child Health Clinical Skills, CP & PPMV Training and Malnutrition Reduction",
    shortTitle: "USG/Palladium Integrated Health Program",
    donor: "USG / Palladium Group",
    status: "Completed",
    duration: "Completed",
    locations: "Bauchi, Ebonyi, Kebbi and Sokoto States",
    states: ["bauchi", "ebonyi", "kebbi", "sokoto"],
    pillars: ["health"],
    photo: "healthScreening",
    summary:
      "A grant-under-contract health system intervention improving prevention, diagnosis and treatment of childhood illness at primary facilities and in communities, using the low-dose high-frequency (LDHF) approach.",
    keyInterventions: [
      "Onsite clinical skills training for over 3,200 health providers on child health, nutrition, WASH, malaria and routine immunisation.",
      "712 PHCs and communities reached with 235 health professional ad-hoc staff.",
      "700 community pharmacists and patent medicine vendors in Sokoto and Kebbi supported on child health, maternal health and family planning.",
      "In Ebonyi, 195 health workers and 130 CBWs across 65 PHCs supported on food-based approaches to child malnutrition.",
    ],
    impactMetric: "3,200+ health providers trained across 712 PHCs in four states.",
    tags: ["palladium", "ihp", "child-health"],
    featured: true,
  }),
  project({
    id: "plan-bmz-peaceful-coexistence-health",
    title: "Restoration of Peaceful Coexistence and Adolescent Health",
    shortTitle: "Plan/BMZ Peace & Adolescent Health",
    donor: "Plan International Nigeria / BMZ",
    status: "Completed",
    duration: "Completed",
    locations: "Project communities",
    states: [],
    pillars: ["social-inclusion", "health"],
    photo: "communityLeaders",
    summary:
      "Promoted peaceful coexistence through peacebuilding initiatives while facilitating access to basic health for pregnant women and children under 5 and building community support mechanisms for comprehensive healthcare.",
    keyInterventions: ["Community peacebuilding initiatives.", "Access to basic health for pregnant women and children under 5."],
    impactMetric: "Peacebuilding combined with maternal and child health access.",
    tags: ["plan", "bmz", "peacebuilding"],
  }),
  project({
    id: "wep-netherlands-gender-equality",
    title: "Enhancing Gender Equality in Selected LGAs",
    shortTitle: "WEP Gender Equality",
    donor: "Women Environmental Programme / Kingdom of the Netherlands",
    status: "Completed",
    duration: "Completed",
    locations: "Selected LGAs",
    states: [],
    pillars: ["social-inclusion"],
    photo: "womenGathering",
    summary: "Mobilised women through community women's groups to participate in decision-making processes for the wellbeing of their households and communities.",
    keyInterventions: ["Women's groups mobilised for participation in decision-making."],
    impactMetric: "Women's voices strengthened in community decision-making.",
    tags: ["wep", "netherlands", "gender"],
  }),
  project({
    id: "plan-sida-protection-livelihood",
    title: "Strengthening Systems for the Protection of Vulnerable People: Protection and Livelihood",
    shortTitle: "Plan/SIDA Protection & Livelihood",
    donor: "Plan International / SIDA",
    status: "Completed",
    duration: "Completed",
    locations: "Project communities",
    states: [],
    pillars: ["protection", "livelihood", "social-inclusion"],
    photo: "caseManagement",
    summary:
      "Advocated for policies that promote women's participation in decision-making, built the capacity of government officials, ensured survivors were well served and set up livelihoods for vulnerable households.",
    keyInterventions: [
      "Advocacy for women's participation at all levels of decision-making.",
      "Capacity building for government administrators and officials.",
      "Survivor services and livelihood support for vulnerable households.",
    ],
    impactMetric: "Stronger protection systems and economic viability for vulnerable households.",
    tags: ["plan", "sida", "protection"],
  }),
  project({
    id: "fao-resilience-livelihood",
    title: "Supporting the Development of Resilience Mechanisms for Conflict-Affected Populations: Livelihood",
    shortTitle: "FAO Resilience & GSLAs",
    donor: "FAO / SIDA, German & Norwegian governments",
    status: "Completed",
    duration: "Completed",
    locations: "Conflict-affected communities",
    states: [],
    pillars: ["livelihood", "food-security"],
    photo: "vslaWomenMeeting",
    summary:
      "Increased the resilience of livelihoods to threats and crises through layered livelihood support and access to credit for individuals, households and groups.",
    keyInterventions: [
      "Group Savings and Loan Associations (GSLAs).",
      "Linking savings groups to good agricultural and nutritional practices.",
    ],
    impactMetric: "Crisis-affected households with access to credit and resilient livelihoods.",
    tags: ["fao", "gsla", "resilience"],
  }),
  project({
    id: "unicef-dfid-gep-girl-child",
    title: "Supporting Girl-Child Enrolment, Retention and Learning (GEP)",
    shortTitle: "UNICEF/DFID Girls' Education Project",
    donor: "Girls' Education Project (GEP) / UNICEF / DFID",
    status: "Completed",
    duration: "Completed",
    locations: "Over 300 schools in 9 LGAs",
    states: [],
    pillars: ["education"],
    photo: "schoolchildrenBooks",
    summary:
      "Developed channels for girl-child education through direct mobilisation of girls, Girls4Girls groups in school, Mothers' Associations outside school and stronger School-Based Management Committees.",
    keyInterventions: ["Girls4Girls groups.", "Mothers' Associations.", "SBMC strengthening in over 300 schools."],
    impactMetric: "Over 300 schools in 9 LGAs.",
    tags: ["gep", "unicef", "dfid", "girls-education"],
  }),
  project({
    id: "neri-gwoza-livelihood",
    title: "Supporting the Livelihood of Women and Youth in Gwoza",
    shortTitle: "NERI Gwoza Livelihoods",
    donor: "NERI / USG",
    status: "Completed",
    duration: "Completed",
    locations: "Gwoza LGA, Borno State",
    states: ["borno"],
    pillars: ["livelihood"],
    photo: "womanTailoring",
    summary:
      "Supported women and youths to develop income-generating channels through vocational and technical skills and business and financial education using the ILO Start and Improve Your Business and Enterprise Your Business curricula.",
    keyInterventions: ["Vocational and technical skills development.", "ILO SIYB and EYB business and financial education."],
    impactMetric: "Over 250 women and youths supported.",
    tags: ["neri", "livelihood", "siyb"],
  }),
  project({
    id: "unicef-dfid-gep2-basic-access",
    title: "Basic Access to Education in GEP 2 & EAC",
    shortTitle: "UNICEF/DFID GEP 2 Basic Access",
    donor: "UNICEF / DFID",
    status: "Completed",
    duration: "Completed",
    locations: "Over 500 schools and 300 communities",
    states: [],
    pillars: ["education", "livelihood"],
    photo: "learningCentre",
    summary:
      "Improved equitable access, learning outcomes and completion of quality education, built the capacity of education providers and strengthened government and community systems.",
    keyInterventions: [
      "In- and out-of-school education support: enrolment, retention, progression and transition.",
      "Mothers' Associations supported to improve income to support their children, especially girls.",
    ],
    impactMetric: "Over 500 schools and 300 communities.",
    tags: ["gep", "unicef", "dfid"],
  }),
  project({
    id: "plan-gac-show",
    title: "Strengthen Health Outcomes for Women and Children (SHOW)",
    shortTitle: "Plan/GAC SHOW",
    donor: "Plan International / Global Affairs Canada",
    status: "Completed",
    duration: "Completed",
    locations: "Project LGAs",
    states: [],
    pillars: ["health"],
    photo: "motherChildNutrition",
    summary:
      "Improved utilisation of essential health services by women of childbearing age, adolescent girls, newborns and children under 5 living in poverty, with strong institutional strengthening of health workers and systems.",
    keyInterventions: ["Essential health services for women, adolescent girls, newborns and children under 5.", "Health worker and health system strengthening."],
    impactMetric: "Improved use of essential maternal and child health services.",
    tags: ["plan", "gac", "show", "mnch"],
  }),
  project({
    id: "nei-plus-education",
    title: "NEI-PLUS: Northern Education Initiative Plus",
    shortTitle: "NEI-PLUS Education",
    donor: "Northern Education Initiative / USG",
    status: "Completed",
    duration: "Completed",
    locations: "Project communities",
    states: [],
    pillars: ["education", "social-inclusion"],
    photo: "girlsLearning",
    summary:
      "Integrated out-of-school children, Almajiri and adolescent girls into basic education and improved children's reading skills through the non-formal system while mainstreaming into formal schools.",
    keyInterventions: [
      "Non-formal learning and mainstreaming into formal schools.",
      "Reading skills improvement.",
      "Women's participation in children's education, especially girls and children with disabilities.",
    ],
    impactMetric: "Out-of-school children, Almajiri and adolescent girls reached with basic education.",
    tags: ["nei", "usaid", "almajiri"],
  }),
  project({
    id: "ndi-women-political-governance",
    title: "Women in Political and Governance Processes",
    shortTitle: "NDI Women in Governance",
    donor: "National Democratic Institute (NDI) / USG",
    status: "Completed",
    duration: "Completed",
    locations: "Local government areas",
    states: [],
    pillars: ["social-inclusion"],
    photo: "womenGathering",
    summary:
      "Increased women's participation in local government processes through advocacy, working with women's groups and groups of people living with disabilities to enhance their penetration into the civic space.",
    keyInterventions: ["Advocacy for women's participation in local governance.", "Engagement of women's groups and people living with disabilities."],
    impactMetric: "Greater participation of women and PWDs in governance.",
    tags: ["ndi", "governance", "women"],
  }),
];
