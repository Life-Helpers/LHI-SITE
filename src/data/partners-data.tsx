import React from "react";

export type PartnerCategory =
  | "All"
  | "UN Agencies"
  | "Bilateral Donors"
  | "International NGOs"
  | "Government & Clusters";

export interface PartnerItem {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  category: "UN Agencies" | "Bilateral Donors" | "International NGOs" | "Government & Clusters";
  categoryBadgeColor: string;
  countryOrOrigin: string;
  establishedYear: string;
  partnershipSince: string;
  priorityFocus: string;
  description: string;
  jointPrograms: string[];
  targetStates: string[];
  statsHeadline: string;
  statsValue: string;
  websiteUrl: string;
  logo: React.ReactNode;
}

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  "All",
  "UN Agencies",
  "Bilateral Donors",
  "International NGOs",
  "Government & Clusters",
];

export const PARTNERS_DATA: PartnerItem[] = [
  {
    id: "unicef",
    name: "United Nations Children's Fund",
    shortName: "UNICEF",
    acronym: "UNICEF",
    category: "UN Agencies",
    categoryBadgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    countryOrOrigin: "Global / United Nations",
    establishedYear: "1946",
    partnershipSince: "2014",
    priorityFocus: "Child Protection, Nutrition, Education in Emergencies, Integrated Resilience (MIRP)",
    description:
      "A primary multilateral partner supporting LHI's comprehensive child protection, severe acute malnutrition (SAM) treatment, and Education Cannot Wait (ECW) initiatives across frontline communities in Northern Nigeria.",
    jointPrograms: [
      "Multi-Sectoral Integrated Resilience Programme (MIRP) in Borno & Yobe",
      "Community-Based Child Protection Networks (CPNs) & Case Management",
      "Rapid Response Nutrition Outpatient Therapeutic Programs (OTPs)",
      "Safe Schools & Accelerated Basic Learning for Out-of-School Children",
    ],
    targetStates: ["Sokoto", "Borno", "Yobe", "Adamawa", "Zamfara"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.unicef.org/nigeria",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="30" r="22" className="fill-sky-500/10 stroke-sky-500" strokeWidth="2.5" />
        {/* UN Olive Branch & Emblem silhouette */}
        <path
          d="M22 34C22 26 27 20 34 20C41 20 46 26 46 34"
          stroke="#00AEEF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="34" cy="24" r="3.5" fill="#00AEEF" />
        <path
          d="M26 38C29 42 39 42 42 38"
          stroke="#00AEEF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 30C18 38 25 45 34 45C43 45 50 38 50 30"
          stroke="#00AEEF"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
        {/* UNICEF Wordmark */}
        <text
          x="66"
          y="37"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="800"
          letterSpacing="-0.04em"
          className="fill-sky-600 dark:fill-sky-400"
        >
          unicef
        </text>
        <circle cx="150" cy="22" r="2" fill="#00AEEF" />
        <text
          x="67"
          y="48"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="0.12em"
          className="fill-foreground/60"
        >
          FOR EVERY CHILD
        </text>
      </svg>
    ),
  },
  {
    id: "plan-international",
    name: "Plan International",
    shortName: "Plan International",
    acronym: "PLAN",
    category: "International NGOs",
    categoryBadgeColor: "bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600/20",
    countryOrOrigin: "United Kingdom / Global",
    establishedYear: "1937",
    partnershipSince: "2016",
    priorityFocus: "Girls' Rights, Adolescent Protection, Sexual & Reproductive Health, Early Learning",
    description:
      "Strategic partnership dedicated to advancing equality for girls and protecting vulnerable young people from gender-based violence, early marriage, and forced displacement across Northeast Nigeria.",
    jointPrograms: [
      "Adolescent Girls Empowerment & Mentorship Hubs (AGEM)",
      "Gender-Based Violence Case Management & Clinical Referrals",
      "Inclusive Early Childhood Development Centers",
      "Youth Civic Leadership & Peacebuilding Circles",
    ],
    targetStates: ["Borno", "Adamawa", "Sokoto"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://plan-international.org/nigeria",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="10" width="40" height="40" rx="8" className="fill-blue-600 dark:fill-blue-500" />
        {/* Plan Human silhouette */}
        <circle cx="32" cy="24" r="5" fill="#FFFFFF" />
        <path
          d="M24 38C24 32 27 30 32 30C37 30 40 32 40 38"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text
          x="62"
          y="32"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-blue-900 dark:fill-blue-100"
        >
          PLAN
        </text>
        <text
          x="63"
          y="46"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="10"
          fontWeight="700"
          letterSpacing="0.14em"
          className="fill-blue-600 dark:fill-blue-400"
        >
          INTERNATIONAL
        </text>
      </svg>
    ),
  },
  {
    id: "nhf",
    name: "Nigeria Humanitarian Fund (UN OCHA)",
    shortName: "Nigeria Humanitarian Fund",
    acronym: "NHF / OCHA",
    category: "UN Agencies",
    categoryBadgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    countryOrOrigin: "United Nations / OCHA",
    establishedYear: "2017",
    partnershipSince: "2018",
    priorityFocus: "Emergency Shelter, WASH Facilities, Multi-Sector Frontline IDP Assistance",
    description:
      "A country-based pooled fund managed by UN OCHA that provides timely, flexible, and targeted funding directly to frontline humanitarian responders like LHI for urgent life-saving interventions.",
    jointPrograms: [
      "Emergency Solar Borehole Drilling & Clean Water Sanitation Stations",
      "Transitional IDP Shelter Kits & Dignity Pack Distribution",
      "Critical Winterization & Monsoon Contingency Relief",
      "First-Line Medical & Cholera Prevention Encampments",
    ],
    targetStates: ["Borno", "Yobe", "Adamawa"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.unocha.org/nigeria/about-nhf",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 10L14 18V32C14 42 22 50 32 53C42 50 50 42 50 32V18L32 10Z"
          className="fill-blue-900 dark:fill-slate-800 stroke-amber-500"
          strokeWidth="2"
        />
        <path d="M32 20V42M22 31H42" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="31" r="3" fill="#FFFFFF" />
        <text
          x="62"
          y="30"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="18"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          NHF NIGERIA
        </text>
        <text
          x="63"
          y="45"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.08em"
          className="fill-muted-foreground"
        >
          HUMANITARIAN POOLED FUND · OCHA
        </text>
      </svg>
    ),
  },
  {
    id: "actionaid",
    name: "ActionAid Nigeria",
    shortName: "ActionAid",
    acronym: "ACTIONAID",
    category: "International NGOs",
    categoryBadgeColor: "bg-red-600/10 text-red-600 dark:text-red-400 border-red-600/20",
    countryOrOrigin: "South Africa / United Kingdom",
    establishedYear: "1972",
    partnershipSince: "2015",
    priorityFocus: "Social Justice, Women's Economic Autonomy, Grassroots Accountability & Governance",
    description:
      "Working collaboratively with LHI to advance local democratic accountability, women-led agricultural cooperatives, and equitable access to social protection mechanisms in rural Nigeria.",
    jointPrograms: [
      "Women's Agribusiness & Micro-Capital Revolving Seed Funds",
      "Community Public Expenditure Tracking & Budget Transparency",
      "Protection from Violence Against Women & Girls (VAWG)",
      "Resilient Livelihoods & Agro-Ecological Training Clusters",
    ],
    targetStates: ["Sokoto", "Zamfara", "Kebbi", "FCT"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://nigeria.actionaid.org",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="12" width="36" height="36" rx="18" fill="#E4002B" />
        <path d="M22 30H38M30 22V38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <text
          x="58"
          y="35"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="21"
          fontWeight="900"
          letterSpacing="-0.03em"
          fill="#E4002B"
        >
          actionaid
        </text>
        <text
          x="59"
          y="47"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.14em"
          className="fill-foreground/70"
        >
          NIGERIA · ENDING POVERTY
        </text>
      </svg>
    ),
  },
  {
    id: "bmz-germany",
    name: "German Federal Ministry for Economic Cooperation & Development",
    shortName: "BMZ Germany",
    acronym: "BMZ",
    category: "Bilateral Donors",
    categoryBadgeColor: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20",
    countryOrOrigin: "Federal Republic of Germany",
    establishedYear: "1961",
    partnershipSince: "2017",
    priorityFocus: "Multi-Year Resilience, Climate Adaptation, Rural Water Systems, Conflict Transformation",
    description:
      "German governmental backing enabling large-scale community transformation through multi-year resilience, solarized water infrastructure, and sustainable agricultural livelihoods.",
    jointPrograms: [
      "German-Nigerian Resilience Building Initiative (GNRBI)",
      "Solar-Powered Deep Aquifer Water Distribution Networks",
      "Vocational Apprenticeships for Conflict-Affected Youth",
      "Soil Rehabilitation & Drought-Resilient Crop Trials",
    ],
    targetStates: ["Sokoto", "Zamfara", "Katsina"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.bmz.de/en",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* German Tricolor Accent Bar */}
        <rect x="12" y="16" width="6" height="28" fill="#111111" rx="1" />
        <rect x="18" y="16" width="6" height="28" fill="#DD0000" rx="1" />
        <rect x="24" y="16" width="6" height="28" fill="#FFCE00" rx="1" />
        {/* BMZ Emblem Stylized */}
        <circle cx="44" cy="30" r="14" className="stroke-foreground/40" strokeWidth="1.5" />
        <path d="M40 26L44 22L48 26M44 23V37" stroke="#DD0000" strokeWidth="2" strokeLinecap="round" />
        <text
          x="68"
          y="31"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          letterSpacing="0.02em"
          className="fill-foreground"
        >
          BMZ
        </text>
        <text
          x="69"
          y="44"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="0.06em"
          className="fill-muted-foreground"
        >
          GERMAN COOPERATION
        </text>
      </svg>
    ),
  },
  {
    id: "kfw",
    name: "KfW Development Bank",
    shortName: "KfW Development Bank",
    acronym: "KfW",
    category: "Bilateral Donors",
    categoryBadgeColor: "bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-600/20",
    countryOrOrigin: "Germany",
    establishedYear: "1948",
    partnershipSince: "2018",
    priorityFocus: "Public Health Infrastructure, Primary School Rehabilitation, Climate Resilience",
    description:
      "Collaborating on major development financing initiatives alongside UNICEF to rebuild social infrastructure, solarize medical dispensaries, and establish durable learning environments.",
    jointPrograms: [
      "Primary Health Clinic Solarization & Cold Chain Refrigeration",
      "Classroom Reconstruction in Displaced Community Clusters",
      "Sustainable Ecological Drainage & Flood Mitigation",
      "Community Oversight Committees for Civil Infrastructure",
    ],
    targetStates: ["Sokoto", "Borno", "Adamawa"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.kfw-entwicklungsbank.de",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="14" width="42" height="32" rx="6" fill="#0A2540" />
        <path d="M22 22V38M34 22L26 30L34 38M44 22L36 38" stroke="#E3001B" strokeWidth="2.5" strokeLinecap="round" />
        <text
          x="64"
          y="33"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-blue-950 dark:fill-blue-200"
        >
          KfW
        </text>
        <text
          x="65"
          y="46"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.12em"
          className="fill-red-600 dark:fill-red-400"
        >
          DEVELOPMENT BANK
        </text>
      </svg>
    ),
  },
  {
    id: "global-affairs-canada",
    name: "Global Affairs Canada",
    shortName: "Global Affairs Canada",
    acronym: "GAC",
    category: "Bilateral Donors",
    categoryBadgeColor: "bg-red-700/10 text-red-700 dark:text-red-400 border-red-700/20",
    countryOrOrigin: "Canada",
    establishedYear: "1909",
    partnershipSince: "2019",
    priorityFocus: "Feminist International Assistance Policy, Maternal & Child Health, SGBV Response",
    description:
      "Strategic bilateral funding channel focusing on women's voice, leadership development, specialized healthcare for survivors of gender violence, and rights protection across vulnerable states.",
    jointPrograms: [
      "Women’s Voice & Grassroots Leadership Acceleration Project",
      "Maternal & Newborn Clinical Outreach in Hard-to-Reach Settlements",
      "Trauma-Informed Psychosocial Support for Conflict Survivors",
      "Girl-Child Education Scholarships & Retention Mentorship",
    ],
    targetStates: ["Sokoto", "Zamfara", "FCT"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.international.gc.ca",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Canadian Maple Leaf Silhouette */}
        <path
          d="M32 12L34 20L40 18L37 25L46 26L40 31L44 38L36 36L34 46L32 46L30 36L22 38L26 31L20 26L29 25L26 18L32 20L32 12Z"
          fill="#D80621"
        />
        <text
          x="58"
          y="29"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="15"
          fontWeight="800"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          Global Affairs Canada
        </text>
        <text
          x="59"
          y="43"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="0.04em"
          className="fill-muted-foreground"
        >
          AFFAIRES MONDIALES CANADA
        </text>
      </svg>
    ),
  },
  {
    id: "usaid",
    name: "United States Agency for International Development",
    shortName: "USAID",
    acronym: "USAID",
    category: "Bilateral Donors",
    categoryBadgeColor: "bg-blue-800/10 text-blue-900 dark:text-blue-300 border-blue-800/20",
    countryOrOrigin: "United States of America",
    establishedYear: "1961",
    partnershipSince: "2017",
    priorityFocus: "Preventative Healthcare, Food Security, Peacebuilding & Democratic Governance",
    description:
      "Partnering on primary healthcare delivery, infectious disease tracking, and food-security resilience programs targeting historically underserved pastoralist and agrarian settlements.",
    jointPrograms: [
      "Community Malaria & Acute Respiratory Illness Surveillance",
      "Drought-Tolerant Grain Seed Distribution & Farmer Clubs",
      "Inter-Faith Community Peace & Conflict Resolution Councils",
      "Clean Water Sanitation Encampments for Influx Zones",
    ],
    targetStates: ["Sokoto", "Kebbi", "Borno"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.usaid.gov/nigeria",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="30" r="18" className="fill-blue-950 stroke-blue-700" strokeWidth="1.5" />
        <path d="M22 30C26 26 38 26 42 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 33C28 36 36 36 40 33" stroke="#BA0C2F" strokeWidth="2" strokeLinecap="round" />
        <text
          x="58"
          y="32"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-blue-950 dark:fill-blue-200"
        >
          USAID
        </text>
        <text
          x="59"
          y="45"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-red-600 dark:fill-red-400"
        >
          FROM THE AMERICAN PEOPLE
        </text>
      </svg>
    ),
  },
  {
    id: "wfp",
    name: "United Nations World Food Programme",
    shortName: "World Food Programme",
    acronym: "WFP",
    category: "UN Agencies",
    categoryBadgeColor: "bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 border-cyan-600/20",
    countryOrOrigin: "Global / United Nations",
    establishedYear: "1961",
    partnershipSince: "2018",
    priorityFocus: "Emergency Food Security, Supplementary Feeding for Children, Shock-Responsive Logistics",
    description:
      "Joint field operations targeting acute nutritional deficits among children under five and pregnant women facing displacement and climatic shocks in frontline regions.",
    jointPrograms: [
      "Blanket Supplementary Feeding Programmes (BSFP)",
      "Targeted Supplementary Feeding for Moderate Acute Malnutrition",
      "Electronic Voucher & Cash-for-Work Livelihood Projects",
      "Emergency Cold-Chain Logistics & Nutritious Paste Distribution",
    ],
    targetStates: ["Borno", "Yobe", "Adamawa"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.wfp.org/countries/nigeria",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="30" r="18" fill="#1E90FF" />
        {/* Wheat sheaf & maize motif */}
        <path d="M32 18V42M26 24C28 22 36 22 38 24M25 30C28 28 36 28 39 30M27 36C29 34 35 34 37 36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <text
          x="58"
          y="31"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-blue-600 dark:fill-blue-400"
        >
          WFP
        </text>
        <text
          x="59"
          y="45"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.1em"
          className="fill-foreground/70"
        >
          WORLD FOOD PROGRAMME
        </text>
      </svg>
    ),
  },
  {
    id: "fcdo-uk",
    name: "UK Foreign, Commonwealth & Development Office",
    shortName: "UK FCDO",
    acronym: "FCDO",
    category: "Bilateral Donors",
    categoryBadgeColor: "bg-rose-700/10 text-rose-800 dark:text-rose-300 border-rose-700/20",
    countryOrOrigin: "United Kingdom",
    establishedYear: "1968",
    partnershipSince: "2019",
    priorityFocus: "Girls' Education Challenge, Conflict Stabilization, Universal Health Coverage",
    description:
      "Support from the British people to safeguard vulnerable girls' uninterrupted basic education, combat gender inequality, and deploy primary health workers into fragile rural wards.",
    jointPrograms: [
      "Girls' Secondary School Transition & Retention Stipends",
      "Community Healthcare Workers Deployment in Hard-to-Reach Clinics",
      "Peace Committees for Farmer-Herder Conflict De-escalation",
      "Disability-Inclusive WASH Facilities in Public Schools",
    ],
    targetStates: ["Sokoto", "Katsina", "Zamfara"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.gov.uk/government/organisations/foreign-commonwealth-development-office",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="14" width="38" height="32" rx="4" fill="#00247D" />
        <path d="M12 14L50 46M50 14L12 46" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M12 14L50 46M50 14L12 46" stroke="#CF142B" strokeWidth="1.2" />
        <path d="M31 14V46M12 30H50" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M31 14V46M12 30H50" stroke="#CF142B" strokeWidth="3" />
        <text
          x="58"
          y="31"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="20"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          UK aid
        </text>
        <text
          x="59"
          y="44"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="0.08em"
          className="fill-muted-foreground"
        >
          FROM THE BRITISH PEOPLE · FCDO
        </text>
      </svg>
    ),
  },
  {
    id: "european-union",
    name: "European Union (ECHO / EU Humanitarian Aid)",
    shortName: "European Union",
    acronym: "EU / ECHO",
    category: "Bilateral Donors",
    categoryBadgeColor: "bg-blue-700/10 text-blue-800 dark:text-blue-300 border-blue-700/20",
    countryOrOrigin: "European Union",
    establishedYear: "1992",
    partnershipSince: "2017",
    priorityFocus: "Emergency Medical Relief, Civil Protection, Rapid Disaster Preparedness",
    description:
      "Providing immediate, principled emergency relief for victims of humanitarian crises and displaced communities throughout Northern and North-Eastern Nigeria.",
    jointPrograms: [
      "Emergency Mobile Health Clinics & Trauma Triage Posts",
      "Disaster Risk Reduction & Flood Evacuation Preparedness Plans",
      "Urgent Clean Water Filtration Encampments in Refugee Clusters",
      "Critical Medical Supply Chains for Remote Rural Clinics",
    ],
    targetStates: ["Borno", "Yobe", "Adamawa", "Sokoto"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://civil-protection-humanitarian-aid.ec.europa.eu",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="14" width="38" height="32" rx="4" fill="#003399" />
        {/* Ring of 12 Stars */}
        <circle cx="31" cy="22" r="1.5" fill="#FFCC00" />
        <circle cx="35" cy="23" r="1.5" fill="#FFCC00" />
        <circle cx="38" cy="26" r="1.5" fill="#FFCC00" />
        <circle cx="39" cy="30" r="1.5" fill="#FFCC00" />
        <circle cx="38" cy="34" r="1.5" fill="#FFCC00" />
        <circle cx="35" cy="37" r="1.5" fill="#FFCC00" />
        <circle cx="31" cy="38" r="1.5" fill="#FFCC00" />
        <circle cx="27" cy="37" r="1.5" fill="#FFCC00" />
        <circle cx="24" cy="34" r="1.5" fill="#FFCC00" />
        <circle cx="23" cy="30" r="1.5" fill="#FFCC00" />
        <circle cx="24" cy="26" r="1.5" fill="#FFCC00" />
        <circle cx="27" cy="23" r="1.5" fill="#FFCC00" />
        <text
          x="58"
          y="30"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontWeight="800"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          European Union
        </text>
        <text
          x="59"
          y="44"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-blue-600 dark:fill-blue-400"
        >
          HUMANITARIAN AID (ECHO)
        </text>
      </svg>
    ),
  },
  {
    id: "undp",
    name: "United Nations Development Programme",
    shortName: "UNDP",
    acronym: "UNDP",
    category: "UN Agencies",
    categoryBadgeColor: "bg-sky-700/10 text-sky-800 dark:text-sky-300 border-sky-700/20",
    countryOrOrigin: "Global / United Nations",
    establishedYear: "1965",
    partnershipSince: "2019",
    priorityFocus: "Community Stabilization, Early Recovery, Sustainable Livelihoods, Youth Enterprises",
    description:
      "Transitioning communities from humanitarian crisis to durable self-reliance through local market recovery, trade apprenticeship grants, and public institutional capacity-building.",
    jointPrograms: [
      "Regional Stabilization Facility (RSF) Livelihood Grantees",
      "Youth Vocational Toolkits (Tailoring, Carpentry, Renewable Solar)",
      "Local Dispute Adjudication & Traditional Council Capacitation",
      "Ecological Tree Nurseries & Desertification Countermeasures",
    ],
    targetStates: ["Borno", "Yobe", "Adamawa"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.undp.org/nigeria",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="14" width="38" height="32" rx="4" fill="#006EB4" />
        <path d="M22 22H30M22 30H36M22 38H32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="22" r="2.5" fill="#FFFFFF" />
        <text
          x="58"
          y="32"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-sky-700 dark:fill-sky-400"
        >
          UNDP
        </text>
        <text
          x="59"
          y="45"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-foreground/70"
        >
          DEVELOPMENT PROGRAMME
        </text>
      </svg>
    ),
  },
  {
    id: "save-the-children",
    name: "Save the Children International",
    shortName: "Save the Children",
    acronym: "SAVE",
    category: "International NGOs",
    categoryBadgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    countryOrOrigin: "United Kingdom / Global",
    establishedYear: "1919",
    partnershipSince: "2015",
    priorityFocus: "Child Safeguarding, Pneumonia & Diarrhea Treatment, Girl-Child Protection",
    description:
      "Global non-profit partner united with LHI to guarantee every child survives, learns, and is protected from violence, abuse, and neglect across Northwest and Northeast Nigeria.",
    jointPrograms: [
      "Integrated Community Case Management (iCCM) for Under-Fives",
      "Child Safeguarding Audits & Whistleblower Protection Networks",
      "Severe Acute Malnutrition (SAM) Inpatient & Outpatient Stabilizations",
      "Temporary Learning Spaces (TLS) for Crisis-Affected Children",
    ],
    targetStates: ["Sokoto", "Katsina", "Zamfara", "Borno"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://nigeria.savethechildren.net",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="30" r="18" fill="#DA291C" />
        {/* Child silhouette jumping with open arms */}
        <circle cx="32" cy="22" r="3.5" fill="#FFFFFF" />
        <path d="M25 33L32 26L39 33M32 26V36M28 41L32 36L36 41" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text
          x="58"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="14"
          fontWeight="800"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          Save the Children
        </text>
        <text
          x="59"
          y="42"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-red-600 dark:fill-red-400"
        >
          INTERNATIONAL · NIGERIA
        </text>
      </svg>
    ),
  },
  {
    id: "irc",
    name: "International Rescue Committee",
    shortName: "IRC",
    acronym: "IRC",
    category: "International NGOs",
    categoryBadgeColor: "bg-amber-600/10 text-amber-800 dark:text-amber-300 border-amber-600/20",
    countryOrOrigin: "United States / Global",
    establishedYear: "1933",
    partnershipSince: "2016",
    priorityFocus: "Emergency Health, Gender-Based Violence (GBV) Response, Water Sanitation (WASH)",
    description:
      "Collaborating on rapid emergency deployment, frontline clinical response, safe spaces for women and girls, and emergency water trucking in high-security volatile theaters.",
    jointPrograms: [
      "Women & Girls Safe Spaces (WGSS) & Trauma Therapy",
      "Emergency Water Trucking & Cholera Disinfection Points",
      "Reproductive Health Clinical Referrals in Remote Camps",
      "Cash Relief for Displaced Households Facing Extreme Duress",
    ],
    targetStates: ["Borno", "Adamawa", "Yobe"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.rescue.org/country/nigeria",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="14" width="38" height="32" rx="4" fill="#FFC72C" />
        {/* Bold black diagonal rescue bars */}
        <path d="M20 38L32 18H38L26 38H20Z" fill="#111111" />
        <path d="M34 38L42 24H46L38 38H34Z" fill="#111111" />
        <text
          x="58"
          y="31"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          IRC
        </text>
        <text
          x="59"
          y="45"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-amber-600 dark:fill-amber-400"
        >
          INTERNATIONAL RESCUE COMM.
        </text>
      </svg>
    ),
  },
  {
    id: "fmoh",
    name: "Federal Ministry of Health & SPHCDA",
    shortName: "Federal Ministry of Health",
    acronym: "FMOH / SPHCDA",
    category: "Government & Clusters",
    categoryBadgeColor: "bg-emerald-700/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/20",
    countryOrOrigin: "Federal Republic of Nigeria",
    establishedYear: "1914",
    partnershipSince: "2004",
    priorityFocus: "National Immunization Days, Primary Healthcare Strengthening, Epidemic Preparedness",
    description:
      "Foundational partnership with the Federal and State Ministries of Health aligning LHI's interventions with Nigeria's National Primary Health Care Development Agency guidelines.",
    jointPrograms: [
      "Supplemental Immunization Activities (SIA) for Polio & Measles",
      "Maternal & Child Health Weeks across 11 State Healthcare Boards",
      "Frontline Primary Healthcare Worker Capacity Certifications",
      "Epidemic Early Warning & Response System (EWARS) Surveillance",
    ],
    targetStates: ["Sokoto", "Zamfara", "Kebbi", "Katsina", "Borno", "Adamawa", "Yobe", "Kano", "Kaduna", "Bauchi", "FCT"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://health.gov.ng",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="30" r="18" fill="#008751" />
        {/* Caduceus healing staff & Nigerian green-white-green bar */}
        <path d="M32 18V42M25 24C30 20 34 20 39 24M25 32C30 28 34 28 39 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="18" r="2" fill="#F59E0B" />
        <text
          x="58"
          y="29"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="15"
          fontWeight="800"
          letterSpacing="-0.02em"
          className="fill-foreground"
        >
          Federal Ministry of Health
        </text>
        <text
          x="59"
          y="43"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-emerald-600 dark:fill-emerald-400"
        >
          NIGERIA · SPHCDA PARTNER
        </text>
      </svg>
    ),
  },
  {
    id: "cp-aor",
    name: "Child Protection Area of Responsibility (CP AoR)",
    shortName: "Child Protection AoR",
    acronym: "CP AoR",
    category: "Government & Clusters",
    categoryBadgeColor: "bg-teal-600/10 text-teal-700 dark:text-teal-400 border-teal-600/20",
    countryOrOrigin: "Global Protection Cluster",
    establishedYear: "2007",
    partnershipSince: "2015",
    priorityFocus: "Case Management Standards, Family Tracing & Reunification (FTR), Mental Health (MHPSS)",
    description:
      "Active implementing member of the global and national Child Protection humanitarian cluster coordinating humanitarian responses for unaccompanied, separated, and traumatized children.",
    jointPrograms: [
      "Family Tracing & Reunification (FTR) for Unaccompanied Minors",
      "Child Protection Information Management System (CPIMS+)",
      "Community Child Protection Committees & Youth Safe Sanctuaries",
      "Specialized Case Workers Standards & PSEA Auditing Framework",
    ],
    targetStates: ["Borno", "Yobe", "Adamawa", "Sokoto", "Zamfara"],
    statsHeadline: "",
    statsValue: "",
    websiteUrl: "https://www.cpaor.net",
    logo: (
      <svg viewBox="0 0 200 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="14" width="38" height="32" rx="6" fill="#0D9488" />
        {/* Child silhouette enclosed by sheltering hands */}
        <path d="M22 36C22 30 25 24 31 22C37 24 40 30 40 36" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="31" cy="27" r="3" fill="#FFFFFF" />
        <path d="M26 38C28 41 34 41 36 38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <text
          x="58"
          y="31"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="18"
          fontWeight="900"
          letterSpacing="-0.02em"
          className="fill-teal-700 dark:fill-teal-300"
        >
          CP AoR
        </text>
        <text
          x="59"
          y="45"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.08em"
          className="fill-foreground/70"
        >
          GLOBAL PROTECTION CLUSTER
        </text>
      </svg>
    ),
  },
];
