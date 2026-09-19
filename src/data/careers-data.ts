export interface JobPosting {
  id: string;
  title: string;
  department: "Health & Nutrition" | "Protection & PSEA" | "Programs & M&E" | "Operations & Finance" | "Community & Advocacy";
  location: string;
  state: string;
  type: "Full-time" | "Contract" | "Field-based";
  deadline: string;
  postedDate: string;
  experienceLevel: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  slots: number;
}

export const recentJobPostings: JobPosting[] = [
  {
    id: "lhi-job-001",
    title: "Health & Nutrition Officer",
    department: "Health & Nutrition",
    location: "Maiduguri & Jere LGAs",
    state: "Borno State",
    type: "Field-based",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "3+ Years Humanitarian Experience",
    slots: 4,
    summary:
      "Oversee integrated primary healthcare service delivery, community management of acute malnutrition (CMAM), and outpatient therapeutic feeding (OTP) for displaced populations and host communities in Borno State.",
    responsibilities: [
      "Manage mobile and static health clinic operations, ensuring adherence to national primary healthcare protocols.",
      "Lead infant and young child feeding (IYCF) counseling and Tom Brown supplementary food demonstrations.",
      "Conduct regular mid-upper arm circumference (MUAC) community nutrition screenings and early case referrals.",
      "Coordinate cold-chain vaccine management and medical drug supply distribution in partnership with State Primary Healthcare Development Agency (SPHCDA).",
      "Supervise Community Health Extension Workers (CHEWs) and voluntary nutrition mobilizers.",
    ],
    requirements: [
      "Degree in Medicine, Public Health, Nursing, Human Nutrition, or related clinical science.",
      "Minimum 3 years of clinical or community health response experience in North-East humanitarian contexts.",
      "Familiarity with SMART surveys, CMAM guidelines, and integrated disease surveillance.",
      "Fluency in English and Hausa/Kanuri is strongly required.",
      "Commitment to humanitarian principles and PSEA safeguarding.",
    ],
  },
  {
    id: "lhi-job-002",
    title: "Protection & PSEA Program Officer",
    department: "Protection & PSEA",
    location: "Damaturu & Gujba",
    state: "Yobe State",
    type: "Full-time",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "3+ Years",
    slots: 2,
    summary:
      "Drive community protection monitoring, gender-based violence (GBV) prevention, child safeguarding, and lead grassroots PSEA accountability to affected populations across field locations.",
    responsibilities: [
      "Facilitate Community Feedback and Complaint Mechanisms (CFM) with dedicated confidential PSEA referral pathways.",
      "Train project staff, community volunteers, and traditional leaders on PSEA, survivor-centered ethics, and non-retaliation.",
      "Supervise Case Workers providing psychosocial first aid (PFA) and dignity kit distributions to vulnerable adolescent girls and women.",
      "Represent Life Helpers Initiative at Protection Sector Working Groups and GBV Sub-Sector coordination meetings.",
      "Prepare weekly protection monitoring incident reports and vulnerability assessments.",
    ],
    requirements: [
      "Bachelor's degree in Social Work, Psychology, International Development, Law, or related social sciences.",
      "Proven track record in humanitarian protection programming and PSEA complaint handling.",
      "Sound understanding of the IASC Guidelines on GBV Interventions in Humanitarian Settings.",
      "Exceptional empathy, confidentiality, and active listening skills.",
      "Proficiency in English and local languages (Hausa, Kanuri, or Fulfulde).",
    ],
  },
  {
    id: "lhi-job-003",
    title: "Nurse / Community Health Extension Worker (CHEW)",
    department: "Health & Nutrition",
    location: "Katsina & Daura",
    state: "Katsina State",
    type: "Field-based",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "2+ Years",
    slots: 6,
    summary:
      "Deliver frontline antenatal care, basic emergency obstetric care, child immunizations, and community hygiene counseling in hard-to-reach rural health facilities.",
    responsibilities: [
      "Conduct triage, consultations, and administer prescribed medications at primary health care centers.",
      "Deliver routine EPI vaccinations and maintain strict vaccine cold chain temperature logs.",
      "Provide reproductive health education, family planning counseling, and maternal wellness tracking.",
      "Maintain patient registers and report weekly epidemiological surveillance metrics.",
      "Support community health dialogues to dispel vaccine hesitancy and promote institutional deliveries.",
    ],
    requirements: [
      "Certified Nurse/Midwife or licensed Community Health Extension Worker (CHEW) with valid practicing license.",
      "At least 2 years clinical experience in primary healthcare or NGO health outreach.",
      "Strong competence in maternal and neonatal healthcare procedures.",
      "Fluency in Hausa is mandatory.",
    ],
  },
  {
    id: "lhi-job-004",
    title: "Monitoring, Evaluation, Accountability & Learning (MEAL) Officer",
    department: "Programs & M&E",
    location: "Sokoto HQ with travel across 11 states",
    state: "Sokoto State",
    type: "Full-time",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "3+ Years",
    slots: 2,
    summary:
      "Lead robust M&E frameworks, baseline and endline evaluations, digital data collection (KoboToolbox/ODK), and ensure beneficiary accountability across grant portfolios.",
    responsibilities: [
      "Design project Performance Monitoring Plans (PMPs), indicator tracking tables, and data quality assessment (DQA) tools.",
      "Configure digital survey forms on KoboToolbox and train enumerators on field data collection protocols.",
      "Analyze qualitative and quantitative datasets using SPSS, STATA, or Excel dashboards for donor reporting.",
      "Oversee the institutional Accountability to Affected Populations (AAP) feedback desk and complaints register.",
      "Facilitate quarterly 'Pause and Reflect' learning sessions with program managers and field directors.",
    ],
    requirements: [
      "Degree in Statistics, Demography, Economics, Public Health, or relevant quantitative discipline.",
      "Minimum 3 years demonstrated experience in humanitarian MEAL.",
      "High proficiency in KoboToolbox, PowerBI, Excel, and GIS mapping tools.",
      "Demonstrated ability to produce high-quality analytical donor reports (UNICEF, NHF, Plan).",
    ],
  },
  {
    id: "lhi-job-005",
    title: "Medical Laboratory Technician",
    department: "Health & Nutrition",
    location: "Sokoto Mobile Clinic & Eastern Byepass",
    state: "Sokoto State",
    type: "Full-time",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "2+ Years",
    slots: 2,
    summary:
      "Perform diagnostic laboratory tests, rapid diagnostic testing (RDT), microscopy, and quality assurance for mobile clinic interventions and community health campaigns.",
    responsibilities: [
      "Collect, label, and process patient biological specimens following strict biosafety and infection control protocols.",
      "Perform Malaria RDTs, HIV testing and counseling, hemoglobin estimations, urinalysis, and stool microscopy.",
      "Calibrate laboratory diagnostic instruments and manage inventory of reagents and consumables.",
      "Maintain confidential, accurate diagnostic records and transmit verified test results to attending clinicians.",
      "Ensure biohazard waste disposal complies with national environmental health standards.",
    ],
    requirements: [
      "Diploma or Degree in Medical Laboratory Science/Technician from an accredited institution with valid MLSCN license.",
      "Minimum 2 years laboratory practice in clinic or hospital setting.",
      "Knowledge of biosafety protocols and standard operating procedures (SOPs).",
      "Detail-oriented with strict adherence to patient medical privacy.",
    ],
  },
  {
    id: "lhi-job-006",
    title: "Admin & Logistics Officer",
    department: "Operations & Finance",
    location: "Abuja Liaison Office & Maiduguri",
    state: "Federal Capital Territory / Borno",
    type: "Full-time",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "3+ Years",
    slots: 2,
    summary:
      "Manage procurement processes, fleet operations, warehouse inventory, asset registers, and vendor contracting in accordance with donor and LHI compliance guidelines.",
    responsibilities: [
      "Execute transparent quotations, bids, and purchase orders complying with LHI and donor procurement thresholds.",
      "Oversee vehicle fleet scheduling, fuel reconciliation, driver safety protocols, and field travel security clearances.",
      "Manage warehouse storage, goods received notes (GRN), waybills, and quarterly stock audits.",
      "Maintain fixed asset registers, ensuring tagging, maintenance, and insurance of organizational property.",
      "Liaise with government agencies, service providers, and building management for facility maintenance.",
    ],
    requirements: [
      "Degree in Business Administration, Supply Chain Management, Logistics, or related field.",
      "Minimum 3 years experience managing logistics in an NGO or multinational setting.",
      "Proficient in ERP software, procurement documentation, and inventory tracking.",
      "Strong negotiation, interpersonal, and communication skills.",
    ],
  },
  {
    id: "lhi-job-007",
    title: "Community Nutrition Mobilizer",
    department: "Health & Nutrition",
    location: "Bauchi & Gombe LGAs",
    state: "Bauchi State",
    type: "Field-based",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "1+ Years",
    slots: 8,
    summary:
      "Engage women care groups, community leaders, and religious institutions to drive adoption of optimal infant nutrition, early childhood hygiene, and local recipe preparation.",
    responsibilities: [
      "Facilitate weekly Mother-to-Mother support groups focused on exclusive breastfeeding and complementary feeding.",
      "Demonstrate preparation of Tom Brown nutritious porridge using locally sourced grains and legumes.",
      "Conduct door-to-door mid-upper arm circumference (MUAC) screening for children under 5.",
      "Refer children with severe acute malnutrition (SAM) with medical complications to stabilization centers.",
      "Document case recovery stories and update village health committee registers.",
    ],
    requirements: [
      "Diploma or certificate in Community Health, Social Work, Food & Nutrition, or related field.",
      "At least 1 year of grassroots community mobilization experience.",
      "Resident of target LGA with strong local community respect and acceptance.",
      "Fluency in local community dialects (Hausa, Fulani).",
    ],
  },
  {
    id: "lhi-job-008",
    title: "Finance & Grants Officer",
    department: "Operations & Finance",
    location: "Goshen Development Center, Sokoto HQ",
    state: "Sokoto State",
    type: "Full-time",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "3+ Years",
    slots: 1,
    summary:
      "Ensure compliant financial accounting, project budget tracking, bank reconciliations, statutory tax remittances, and financial reporting for institutional grants.",
    responsibilities: [
      "Prepare monthly cash flow forecasts, journal vouchers, and multi-currency bank reconciliations.",
      "Review payment requests, invoices, and expense vouchers for strict adherence to donor budget line allocations.",
      "Manage payroll calculations, statutory deductions (PAYE, Pension, Withholding Tax), and regulatory compliance.",
      "Support external project audits and internal control reviews.",
      "Generate monthly Financial Status Reports (FSR) comparing actual expenditures against approved budgets.",
    ],
    requirements: [
      "B.Sc in Accounting, Finance, or related discipline; ICAN/ACCA qualification or in-view is an advantage.",
      "Minimum 3 years accounting experience within non-governmental humanitarian organizations.",
      "Proficiency in accounting software (QuickBooks, Sage, or ERP) and advanced Microsoft Excel.",
      "High integrity and zero tolerance for fraud or fiscal mismanagement.",
    ],
  },
  {
    id: "lhi-job-009",
    title: "Case Workers (GBV Response & Child Protection)",
    department: "Protection & PSEA",
    location: "Maiduguri, Bama & Monguno",
    state: "Borno State",
    type: "Field-based",
    deadline: "Open / Rolling Review",
    postedDate: "Recent",
    experienceLevel: "2+ Years",
    slots: 5,
    summary:
      "Deliver compassionate, survivor-centered case management for vulnerable women, children, and survivors of gender-based violence in camp and host communities.",
    responsibilities: [
      "Provide individual casework services following the survivor-centered approach and informed consent standards.",
      "Develop safety plans and facilitate referrals for medical care, legal aid, mental health, and emergency shelter.",
      "Operate Safe Spaces for Women and Girls, facilitating recreational and psychosocial wellness activities.",
      "Maintain confidential case files in secure locked filing systems and compliant digital protection databases.",
      "Participate in case conferences and inter-agency protection coordination.",
    ],
    requirements: [
      "Diploma or Degree in Psychology, Social Work, Sociology, Nursing, or related field.",
      "Minimum 2 years experience in GBV or Child Protection case management.",
      "Demonstrated ability to maintain confidentiality and ethical boundaries.",
      "Fluency in Hausa, Kanuri, or Shuwa Arabic is required.",
    ],
  },
];
