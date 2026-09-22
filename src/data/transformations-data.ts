export interface TransformationItem {
  id: string;
  title: string;
  category: "food-security" | "health" | "education" | "livelihood" | "protection";
  categoryLabel: string;
  thematicHref: string;
  location: string;
  donorPartner: string;
  year: string;
  summary: string;
  impactMetrics: {
    label: string;
    value: string;
  }[];
  before: {
    image: string;
    alt: string;
    label: string;
    description: string;
    tag: string;
  };
  after: {
    image: string;
    alt: string;
    label: string;
    description: string;
    tag: string;
  };
  keyChanges: string[];
}

export const TRANSFORMATION_ITEMS: TransformationItem[] = [
  {
    id: "farmland-irrigation",
    title: "Dry-Season Solar-Irrigated Farmland vs. Arid Barren Land",
    category: "food-security",
    categoryLabel: "Food Security & Agriculture",
    thematicHref: "/food-security",
    location: "Jere & Biu LGAs, Borno State",
    donorPartner: "ZOA International / European Union",
    year: "2022 – 2024",
    summary:
      "Transforming arid, drought-cracked soil prone to desertification into lush year-round agricultural farmland through solar-powered drip irrigation, conservation agriculture, and certified drought-tolerant seeds for 5,200 returnee smallholder families.",
    impactMetrics: [
      { label: "Crop Yield Expansion", value: "+340%" },
      { label: "Dry-Season Harvest Cycles", value: "3 Times / Year" },
      { label: "Beneficiary Farmers", value: "5,200 Families" },
      { label: "Household Income Growth", value: "₦185,000 / Season" },
    ],
    before: {
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=80",
      alt: "Drought-stricken, cracked arid barren soil before irrigation intervention",
      label: "BEFORE: Arid Barren Soil (Drought Season)",
      description:
        "Parched, cracked Sahelian earth unable to support crops during 7 months of dry season. Displaced returnee households suffered severe seasonal hunger and dependence on emergency food drops.",
      tag: "Parched Arid Soil",
    },
    after: {
      image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1400&q=80",
      alt: "Lush green thriving irrigated agricultural farmland with diverse vegetable crops and happy farmers",
      label: "AFTER: Solar Drip-Irrigated High-Yield Farmland",
      description:
        "Flourishing multi-crop fields cultivated with tomatoes, onions, maize, and peppers using eco-friendly solar borehole irrigation, yielding abundant harvests even during peak dry months.",
      tag: "Lush Irrigated Harvest",
    },
    keyChanges: [
      "Installed 16 deep solar-powered borehole irrigation systems with drip distribution lines.",
      "Trained smallholders in organic mulching and moisture conservation practices.",
      "Provided certified drought-resistant seed packs and natural bio-fertilizers.",
      "Linked farmers directly to Maiduguri commercial wholesale markets for premium pricing.",
    ],
  },
  {
    id: "solar-borehole-wash",
    title: "Rehabilitated Solar-Powered Borehole vs. Contaminated Open Well",
    category: "health",
    categoryLabel: "Health & WASH",
    thematicHref: "/health",
    location: "Gusau, Maru & Kaura Namoda, Zamfara State",
    donorPartner: "UNICEF Nigeria / LHI MIRP Resilience Programme",
    year: "2023 – 2025",
    summary:
      "Replacing hazardous, muddy open pits with hygienic multi-tap solar-powered water stations. Women and children who previously trekked 6 kilometers daily now access clean potable water within 5 minutes of their doorsteps.",
    impactMetrics: [
      { label: "Waterborne Illness Drop", value: "-92%" },
      { label: "Daily Clean Water Output", value: "35,000 Litres" },
      { label: "Community Access Time", value: "< 5 Minutes" },
      { label: "Direct Beneficiaries", value: "28,000 Residents" },
    ],
    before: {
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
      alt: "Stagnant muddy contaminated open puddle water source before borehole rehabilitation",
      label: "BEFORE: Contaminated Open Pit Well",
      description:
        "Uncovered, stagnant muddy water hole shared with livestock. Frequent seasonal cholera and typhoid outbreaks incapacitated children and kept mothers from economic livelihood activities.",
      tag: "Contaminated Pit Well",
    },
    after: {
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1400&q=80",
      alt: "Crystal clear clean running tap water from newly rehabilitated solar-powered borehole station",
      label: "AFTER: Multi-Tap Solar Potable Water Station",
      description:
        "Continuous 24/7 solar-pumped clean drinking water with chlorination tanks, raised concrete perimeter fencing, and a trained community WASH management committee.",
      tag: "Solar Clean Tap Water",
    },
    keyChanges: [
      "Drilled and retrofitted 52 high-yield solar boreholes with submersible pumping systems.",
      "Installed elevated 10,000-litre storage reservoirs with 6-tap hygiene distribution points.",
      "Established community WASH committees (50% female leadership) for routine maintenance.",
      "Zero reported cholera outbreaks in beneficiary wards since project commissioning.",
    ],
  },
  {
    id: "maternity-clinic-upgrade",
    title: "Upgraded Primary Health Clinic vs. Dilapidated Rural Health Post",
    category: "health",
    categoryLabel: "Maternal Health & Primary Care",
    thematicHref: "/health",
    location: "Kware & Wamakko LGAs, Sokoto State",
    donorPartner: "MSH (PMI-S) / Plan International (SHOW)",
    year: "2021 – 2024",
    summary:
      "Transforming a crumbling, dark rural outpost into a modern 24-hour primary health center equipped with solar lighting, sterile delivery beds, cold-chain vaccine storage, and compassionate clinical staff.",
    impactMetrics: [
      { label: "Skilled Birth Attendance", value: "+210%" },
      { label: "Maternal Mortality in Ward", value: "0 Deaths in 2 Yrs" },
      { label: "Vaccine Cold Chain Uptime", value: "100% 24/7" },
      { label: "Patients Served Annually", value: "34,500 Mothers & Kids" },
    ],
    before: {
      image: "https://images.unsplash.com/photo-1588718974598-11586ced4052?auto=format&fit=crop&w=1400&q=80",
      alt: "Dilapidated abandoned rural concrete structure with peeling paint and no equipment",
      label: "BEFORE: Dilapidated Rural Health Post",
      description:
        "Leaking roofs, no electricity, broken exam tables, and no cold storage for vaccines. Mothers gave birth at home on dirt floors in darkness, facing catastrophic postpartum complications.",
      tag: "Dilapidated Rural Post",
    },
    after: {
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80",
      alt: "Bright, sanitized, modern primary healthcare delivery room with trained medical professional",
      label: "AFTER: Modern 24/7 Solar Maternal & Pediatric Clinic",
      description:
        "Sanitized maternity ward, solar direct-drive refrigerators, emergency delivery kits, youth-friendly health desk, and full-time trained midwives providing dignified, loving care.",
      tag: "Upgraded Modern Clinic",
    },
    keyChanges: [
      "Complete physical renovation, solar roof installation, and borehole water connection.",
      "Supplied state-of-the-art ultrasound scanners, delivery beds, and sterilization autoclaves.",
      "Trained 45 community midwives and primary care nurses in emergency obstetric care (EmONC).",
      "Created an emergency motorcycle ambulance network for rural labor transport.",
    ],
  },
  {
    id: "learning-center-makeover",
    title: "Accelerated Learning Center vs. Makeshift Damaged Shelter",
    category: "education",
    categoryLabel: "Education & Girl-Child Literacy",
    thematicHref: "/education",
    location: "Bade & Jakusko LGAs, Yobe State",
    donorPartner: "Save the Children International / BMZ Germany",
    year: "2022 – 2025",
    summary:
      "Transforming dusty, exposed tree-shade learning into safe, bright, fully furnished accelerated literacy hubs where conflict-affected girls and boys catch up on lost academic years with joy and dignity.",
    impactMetrics: [
      { label: "Student Literacy Gain", value: "+280%" },
      { label: "Girl-Child Retention", value: "96.4%" },
      { label: "Classrooms Built/Upgraded", value: "75 Hubs" },
      { label: "Scholastic Kits Distributed", value: "14,000 Packs" },
    ],
    before: {
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80",
      alt: "Broken weathered classroom structure with crumbling brick and dusty exposed floor",
      label: "BEFORE: Makeshift Damaged Learning Shelter",
      description:
        "Wind-blown, overcrowded makeshift shelter where children sat on bare gravel in dust storms. Rain abruptly terminated lessons, and girls lacked private, secure sanitation facilities.",
      tag: "Makeshift Learning Space",
    },
    after: {
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80",
      alt: "Vibrant, joyful, well-furnished classroom with smiling students holding books and participating",
      label: "AFTER: Equipped Accelerated Learning Hub",
      description:
        "Sturdy ventilated learning halls with comfortable double desks, visual teaching boards, solar lighting, separate dignity WASH facilities, and trained trauma-informed educators.",
      tag: "Equipped Safe Classroom",
    },
    keyChanges: [
      "Constructed secure, earthquake- and storm-resistant community learning blocks.",
      "Provided personalized school bags, exercise books, geometry sets, and uniforms.",
      "Trained teachers in child-centered accelerated teaching methodologies.",
      "Integrated psychosocial trauma counseling and child safeguarding protocols.",
    ],
  },
];
