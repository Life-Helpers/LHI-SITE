import type { Program } from "@/types/content";

/**
 * LHI's real thematic operational pillars, sourced from the organization's
 * own content brief (not the live site, which currently has no dedicated
 * program pages to draw from). Card/stat numbers are counts of named focus
 * areas and organization-wide facts (states active, founding year) rather
 * than fabricated per-pillar impact figures — LHI's real reporting only
 * gives cumulative, org-wide numbers (see /impact), not a per-pillar split.
 */
export const programs: Program[] = [
  {
    id: "health-nutrition",
    name: "Health & Nutrition",
    region: "Northwest & Northeast Nigeria",
    status: "active",
    summary:
      "High-impact health interventions across conflict-affected and rural communities, delivered alongside multilateral partners.",
    description: [
      "In the northwest and northeast zones of Nigeria, health indices remain relatively low in many communities — a core, high-engagement focus area for LHI's field teams.",
      "Maternal, Infant, and Young Child Nutrition (MIYCN): prevention and clinical treatment of acute malnutrition, including MUAC screening, Community-Based Management of Acute Malnutrition (CMAM), and locally formulated complementary food (Tom Brown).",
      "Maternal & Child Health (MNCH): antenatal and postnatal care facilitation, capacity building for frontline primary healthcare providers, and emergency referral transport.",
      "Immunization & Disease Control: routine childhood immunization, malaria early diagnosis and prophylaxis, and rapid response mechanisms.",
      "WASH (Water, Sanitation & Hygiene): emergency and developmental water, sanitation, and hygiene services, including water point rehabilitation in IDP host communities.",
    ],
    metricLabel: "Focus areas",
    metricValue: "4",
    stats: [
      { label: "States active", value: "11" },
      { label: "Established", value: "2004" },
    ],
    featured: true,
  },
  {
    id: "education",
    name: "Education & Emergency Learning",
    region: "Northern Nigeria",
    status: "active",
    summary:
      "Bridging gender and literacy gaps in learning access for rural and displaced children.",
    description: [
      "Recognizing low literacy and high poverty among rural dwellers, LHI mobilizes households and community leaders to improve girl-child education, raise school enrolment, and support effective learning.",
      "Early Childhood Development (ECD): safe community learning spaces, foundational cognitive stimulation, and early literacy models.",
      "Girls' Education & Enrollment: targeted community sensitization and scholarship or material support to bridge gender disparity in Northern Nigeria.",
      "Non-Formal & Complementary Education: accelerated learning curricula for out-of-school and internally displaced children.",
      "Digital Literacy & System Governance: digital skills integration and strengthening of School-Based Management Committees (SBMCs).",
    ],
    metricLabel: "Focus areas",
    metricValue: "4",
    stats: [
      { label: "States active", value: "11" },
      { label: "Established", value: "2004" },
    ],
    featured: true,
  },
  {
    id: "livelihood-social-protection",
    name: "Livelihood, Social Protection & Cash Assistance",
    region: "Adamawa, Bauchi, Benue, Borno, Ebonyi, Katsina, Kebbi, Plateau, Yobe, Zamfara",
    status: "active",
    summary:
      "Skills training, savings groups, and cash assistance for youth, women, and returnee households.",
    description: [
      "LHI identifies, selects, trains, and supports women, youth, and people with special needs so they can build sustainable livelihoods and participate meaningfully in community life.",
      "Vocational & Technical Skills Training: demand-driven market skills for youths, female-headed households, and vulnerable returnees.",
      "Village Savings and Loan Associations (VSLA): community-led micro-savings groups, financial inclusion, and peer loan guarantees.",
      "Multipurpose Cash Assistance (MPCA): unconditional and conditional cash transfers supporting basic household needs and small-business seed funding.",
    ],
    metricLabel: "Focus areas",
    metricValue: "3",
    stats: [
      { label: "States active", value: "11" },
      { label: "Established", value: "2004" },
    ],
    featured: true,
  },
  {
    id: "agriculture-food-security",
    name: "Agriculture, Food Security & Climate Adaptation",
    region: "Rural Northern Nigeria",
    status: "active",
    summary:
      "Climate-smart farming, livestock support, and market access for smallholder and peasant farmers.",
    description: [
      "For beneficiaries who are largely peasant and smallholder farmers, LHI's agriculture component focuses on production, diversification, value addition, and market linkages to enhance livelihoods.",
      "Smallholder Farmer Extension: climate-smart agronomic practices, drought-resistant certified seed distribution, and modern planting techniques.",
      "Livestock & Small Ruminant Husbandry: distribution and veterinary support for goats and sheep to diversify household income.",
      "Market Access & Producer Groups: aggregate marketing, post-harvest loss reduction, and sustainable commercial value chain linkages.",
    ],
    metricLabel: "Focus areas",
    metricValue: "3",
    stats: [
      { label: "States active", value: "11" },
      { label: "Established", value: "2004" },
    ],
    featured: false,
  },
  {
    id: "gender-protection",
    name: "Gender, Social Inclusion & Protection",
    region: "Northern Nigeria",
    status: "active",
    summary:
      "Protection, inclusion, and civic participation for women, girls, and people with disabilities.",
    description: [
      "Basic participation for marginalized groups: identifying, selecting, training, and supporting women, youth, and people with special needs to be involved in local and political governance.",
      "Gender-Based Violence (GBV) Response: psychosocial support, case management, and sustained community awareness, including the 16 Days of Activism campaign.",
      "The Women Situation Room: weekly radio outreach discussing women's civic rights, reproductive healthcare, and leadership development.",
      "Disability Inclusion: tailored economic and social intervention funds for Persons Living With Disabilities (PLWD).",
      "PSEA & Safeguarding Policy: zero-tolerance compliance framework safeguarding beneficiaries against sexual exploitation, abuse, and harassment across all programs.",
    ],
    metricLabel: "Focus areas",
    metricValue: "4",
    stats: [
      { label: "States active", value: "11" },
      { label: "Established", value: "2004" },
    ],
    featured: false,
  },
];
