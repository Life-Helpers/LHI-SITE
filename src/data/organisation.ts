import { THEMATIC_AREAS } from "@/data/thematic-areas";

/**
 * Organisational content from the LHI Organisational Profile and the
 * Strategic Plan 2026–2030 ("A plan towards Consolidation of Programme Impact
 * and Organisational Sustainability", 30 April 2026).
 */

export const ORG_SUMMARY =
  "Life Helpers Initiative [LHI] is a Nigerian non-governmental organization working in the development and humanitarian sectors using an integrated approach to reach and support marginalized populations, including children, youth, women, people living with disabilities, and men, through community structures.";

export const VISION = "A more fulfilled life for everyone.";
export const MISSION =
  "To be a leading non-governmental organization working to maximize all opportunities to empower marginalized people.";
export const PHILOSOPHY = "Touching Lives, Transforming Households, Impacting Communities.";
export const MOTTO = "Putting A Smile On A Face";

export const CORE_VALUES = [
  {
    name: "Love",
    text: "We passionately foster a friendly working environment that promotes unity and kindness as we exhibit professionalism and excellence in our services.",
  },
  { name: "Honesty", text: "We act and communicate clearly and always honor our commitments." },
  {
    name: "Inclusion",
    text: "We welcome all individuals without discrimination and ensure equal access and opportunities to our clients and staff.",
  },
] as const;

export const THEMATIC_FOCUS = [
  { id: "health", name: THEMATIC_AREAS["health"].name, href: THEMATIC_AREAS["health"].href, scope: "MNCH, Nutrition, WASH, Immunization, Malaria, SRH, HIV/AIDS & TB" },
  {
    id: "education",
    name: THEMATIC_AREAS["education"].name,
    href: THEMATIC_AREAS["education"].href,
    scope: "Early Child Development, Formal & Non-Formal Education, Education Governance & Complementary Educational Services",
  },
  {
    id: "livelihood",
    name: THEMATIC_AREAS["livelihood"].name,
    href: THEMATIC_AREAS["livelihood"].href,
    scope:
      "Technical & Vocational Training, Group/Village Savings & Loan Associations, Business, Entrepreneurial Development & Financial Literacy, Multi-Purpose Cash Assistance",
  },
  { id: "social-inclusion", name: THEMATIC_AREAS["social-inclusion"].name, href: THEMATIC_AREAS["social-inclusion"].href, scope: "Governance, Peace Building & High-level Advocacy" },
  { id: "protection", name: THEMATIC_AREAS["protection"].name, href: THEMATIC_AREAS["protection"].href, scope: "Violence against Women & Girls; Child Protection" },
  {
    id: "food-security",
    name: THEMATIC_AREAS["food-security"].name,
    href: THEMATIC_AREAS["food-security"].href,
    scope: "Agriculture, Small Ruminants / Aquaculture, Food Supplies / Supports, Climate Adaptation",
  },
] as const;

/** The four "Strengthening" strategies from the Organisational Profile. */
export const CORE_STRATEGIES = [
  {
    code: "S-C",
    name: "Strengthening Capacities",
    text: "Building the technical, managerial, and operational competencies of individuals, communities, and institutions to deliver and sustain development outcomes.",
    focus: [
      "Workforce development (staff, volunteers, frontline workers)",
      "Community capacity building (CBAs, WDCs, youth groups)",
      "Institutional strengthening (CSOs, local partners)",
      "Knowledge transfer and continuous learning",
    ],
  },
  {
    code: "S-S",
    name: "Strengthening Systems",
    text: "Improving the structures, processes, and frameworks that govern service delivery, especially within health, education, and social systems.",
    focus: [
      "Systems strengthening",
      "Data systems and M&E frameworks",
      "Institutional governance and accountability",
      "Policy implementation support",
    ],
  },
  {
    code: "S-PC",
    name: "Strengthening Partnership & Collaboration",
    text: "Building and managing strategic relationships with stakeholders to enhance resource mobilization, coordination, and program effectiveness.",
    focus: [
      "Donor and development partner engagement",
      "Government collaboration (federal, state, LGA levels)",
      "Private sector partnerships",
      "Consortium and multi-partner project implementation",
    ],
  },
  {
    code: "S-NL",
    name: "Strengthening Networking & Linkages",
    text: "Facilitating connections between communities, services, and institutions to ensure continuity of care, support, and opportunities.",
    focus: [
      "Community-to-facility linkages",
      "Referral networks (health, protection, education)",
      "CSO and community networks",
      "Knowledge-sharing platforms",
    ],
  },
] as const;

/** Strategic Plan 2026–2030 */
export const STRATEGIC_PLAN = {
  title: "Strategic Plan 2026–2030",
  subtitle: "A plan towards Consolidation of Programme Impact, and Organisational Sustainability",
  date: "30 April 2026",
  goal: "Improved well-being, resilience, and inclusion of vulnerable populations in communities where LHI operates.",
  outcomeA:
    "Increased utilisation of health and education services, increased household income, food stability, and participation of marginalized groups in decision-making.",
  outcomeB: "Strengthened organisational capacity.",
  programmeResults: [
    { area: "Health", result: "Improved access to quality healthcare services and enhanced health outcomes for all health seekers" },
    { area: "Education", result: "Increased access to basic education and improved learning outcomes" },
    { area: "Livelihood", result: "Improved household economic resilience and income generation" },
    { area: "Food security", result: "Increased food security and sustainable agricultural productivity" },
    { area: "Social inclusion", result: "Increased social inclusion and equitable participation in development opportunities" },
    { area: "Protection", result: "Improved protection, safety, and dignity of vulnerable populations" },
  ],
  capacityResults: [
    { area: "Organisational leadership & governance", result: "Improved governance and administrative procedures" },
    { area: "Human resource development", result: "Increased productivity and an efficient workforce" },
    { area: "Fund development / Resource mobilisation", result: "Increased and diversified sources of income/funds" },
    { area: "Financial management", result: "Efficient management of organisational financial resources" },
    { area: "Infrastructure and facilities development", result: "Adequate and conducive work environment across all locations" },
    { area: "Organisational communications", result: "Increased visibility and publicity" },
    { area: "Partnership and networking", result: "Effective partnership and expansion of services to target beneficiaries" },
    { area: "Monitoring, Evaluation, Research & Learning", result: "Improved data processes and management for information and decision-making" },
  ],
  keyStrategies: [
    {
      name: "Systems strengthening",
      text: "Working with existing government systems and community structures, strengthening financial, group management, protection, supply chain and data systems so that results outlive project funding. Capacity assessments precede every intervention.",
    },
    {
      name: "Service delivery",
      text: "Direct provision of WASH facilities, nutrition support, education and agriculture infrastructure where strategic, complementing duty bearers at state and local levels.",
    },
    {
      name: "Advocacy",
      text: "Advocating for policy formulation, regulation and action that improve conditions for vulnerable and marginalised groups, and for inclusive governance at all levels.",
    },
    {
      name: "Community mobilisation, sensitisation and engagement",
      text: "Behaviour change communication, community outreach and media to encourage healthier choices, school enrolment and participation in livelihood programmes.",
    },
    {
      name: "Networking and collaboration",
      text: "Linking with NGOs, community groups and government ministries, departments and agencies to improve coverage and access.",
    },
    {
      name: "Organisational capacity development",
      text: "Strengthening governance, human resources, resource mobilisation, infrastructure, communication and M&E so LHI can deliver the plan efficiently.",
    },
    {
      name: "Research, documentation and publicity",
      text: "Operations research for evidence-based advocacy, and documentation that tells the public about LHI's work and attracts partnerships.",
    },
  ],
  strategicUnits: [
    { name: "Finance", text: "Coordinates and manages all financial transactions and documentation." },
    { name: "Operations", text: "Oversees administration, security, supply chain, and general logistics." },
    { name: "Programmes", text: "Coordinates and provides leadership across all the thematic areas of our interest." },
    {
      name: "Safeguarding, Accountability & Gender (SAG)",
      text: "Coordinates safeguarding, accountability to affected populations, feedback mechanisms, and inclusive gender programming.",
    },
    {
      name: "Business Development, Partnership & Grant Management (BuDPaGM)",
      text: "Drives resource mobilisation, manages partner relationships, researches fundable opportunities, and oversees grant management.",
    },
    {
      name: "Monitoring, Evaluation, Research & Learning (MERL)",
      text: "Coordinates data management, operational and programmatic research and assessment, knowledge management, and learning.",
    },
    { name: "Compliance & Internal Audit (CIA)", text: "Ensures policy and procedural compliance and upholds internal financial integrity." },
  ],
  institutionalAchievements: [
    "Secured grant portfolios of over ₦8 billion between 2021 and 2025.",
    "Built strong relationships with state, local government and community stakeholders, including security officers who help keep work in rural communities safe.",
    "Migrated accounting from QuickBooks to an Enterprise Resource Planning (ERP) system, adopted Kobo Collect for digital data collection and strengthened MEL.",
    "Improved staff capacity through Knowledge Sharing Sessions, organisation-sponsored programmes and partner training.",
    "Invested in office buildings, equipment and working tools, with owned office complexes in Sokoto, Kebbi and Yobe.",
    "Created a “Hall of Fame” and alumni network for former staff who made exceptional contributions.",
    "Created a Communications Unit producing videos, documentaries and radio talk shows.",
  ],
  imperatives: {
    programmatic: [
      "Deepen technical staff competence across the six thematic areas: Health, Education, Livelihood, Food Security, Gender & Social Inclusion, and Social Protection.",
      "Institutionalise quality improvement and assurance, with a framework to monitor programme outputs and outcomes.",
      "Strengthen LHI's capacity to use advocacy as a complementary strategy.",
      "Conduct operations research to provide current, accurate data for advocacy.",
      "Implement robust Monitoring, Evaluation, Accountability and Learning (MEAL).",
    ],
    organisational: [
      "Invest more in ICT.",
      "Amend the LHI Constitution to reflect best practice and co-opted Board members.",
      "Simplify the organisational structure to reflect current programmes and scope.",
      "Strengthen the Board, staff and volunteers through exposure, training and regular performance assessment.",
      "Expand office space, equipment and vehicles in project states and the liaison office.",
      "Improve staff welfare to remain competitive.",
      "Improve documentation, communication, publicity and visibility.",
    ],
  },
  geography:
    "Head office at Goshen Development Centre, Tamaje, Sokoto, with programme footprints in Adamawa, Bauchi, Borno, Ebonyi, Katsina, Kebbi, Plateau, Yobe and Zamfara States, and the FCT. LHI will consolidate in states where it already has presence; expansion to Benue and Kaduna will depend on funding availability.",
  targetGroups:
    "Vulnerable people, especially marginalised communities, women, the girl child, people with disabilities, displaced populations, and others disadvantaged in one form or another.",
  foreword: {
    author: "Engr. Godfrey Mayoku",
    role: "Chairman, LHI Board of Trustees",
    quote:
      "This Strategic Plan is more than a document, it is a promise: a promise to deepen our impact across our six thematic areas, to strengthen systems, amplify advocacy, and elevate community leadership, and to uphold our core values of Love, Honesty, and Inclusion in every action we take.",
  },
  acknowledgement: {
    author: "Tayo Fatinikun",
    role: "Executive Director",
    quote:
      "It was simply just a passion – a passion to touch lives, a passion to make children feel wanted, an attempt to restore their dignity. That passion now has a structure, a vehicle, and over the years, it has become stronger and better. We are Life Helpers.",
  },
} as const;

/** Partners named across the Profile and Strategic Plan. */
export const PARTNER_NAMES = [
  "FCDO (UK)",
  "World Food Programme (WFP)",
  "UNICEF",
  "European Union / ECHO",
  "UN OCHA (Nigeria Humanitarian Fund)",
  "UNDP",
  "UNESCO",
  "USG / BHA",
  "International Rescue Committee (IRC)",
  "Save the Children International",
  "CARE International",
  "Plan International Nigeria",
  "ZOA / Canadian Foodgrains Bank",
  "Global Affairs Canada",
  "Management Sciences for Health (MSH)",
  "Project HOPE",
  "Palladium Group",
  "ALIMA",
  "BMZ / KfW",
  "SIDA",
  "FAO",
  "IITA",
  "National Democratic Institute (NDI)",
  "Pfizer Foundation",
] as const;

export const ANTHEM = [
  "Life Helpers Initiative,",
  "Goshen Center, Since 2006,",
  "We’ve got this name, Forward ever,",
  "We shall continue to grow,",
  "We Pray to Almighty God,",
  "to be on our side",
  "L.H.I - LHI",
  "We are proud of you,",
  "We are proud of you",
  "Love, Honesty, Integrity",
  "is our behavior,",
  "Thanks to everybody",
  "working day and night.",
  "L.H.I, is our pride",
  "Life Helpers Initiative",
  "Putting A Smile On a Face",
] as const;
