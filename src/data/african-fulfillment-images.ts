import { LHI_PHOTOS } from "@/data/lhi-photos";

/**
 * Hero and banner imagery for every page, sourced from real LHI field photography
 * (see lhi-photos.ts), in keeping with the motto "Putting a smile on a face".
 */

export interface FulfillmentImage {
  src: string;
  alt: string;
  caption: string;
  tag?: string;
}

export interface HeroSlideItem {
  id: string;
  src: string;
  alt: string;
  eyebrow: string;
  prefix: string;
  highlight: string;
  suffix: string;
  body: string;
  caption: string;
  tag: string;
  mottoBadge: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export const heroChildSlides: HeroSlideItem[] = [
  {
    id: "slide-smile",
    src: LHI_PHOTOS.smilingGirls.src,
    alt: LHI_PHOTOS.smilingGirls.alt,
    eyebrow: "Life Helpers Initiative · Sokoto, Nigeria",
    prefix: "Putting a radiant smile on every child's face across ",
    highlight: "Nigeria",
    suffix: ".",
    body: "Since 2004, LHI has combined humanitarian relief, child protection, and community development across 11 states — touching lives, transforming households, and nurturing resilient young generations.",
    caption: "Putting a smile on a face — bringing dignity, joy, and hope to every vulnerable child.",
    tag: "Child Welfare & Hope",
    mottoBadge: "Motto: “Putting a smile on a face” since 2004",
    primaryCta: {
      label: "Donate Now",
      href: "/donate",
    },
    secondaryCta: {
      label: "See Our Programs",
      href: "/programs",
    },
  },
  {
    id: "slide-education",
    src: LHI_PHOTOS.abepGirls.src,
    alt: LHI_PHOTOS.abepGirls.alt,
    eyebrow: "Education & Girl-Child Literacy",
    prefix: "Nurturing young minds through ",
    highlight: "inclusive quality learning",
    suffix: ".",
    body: "Learning centres, trained facilitators, learning materials and community management committees that bring out-of-school children back to learning and on to formal school.",
    caption: "3,255 out-of-school children now learning in 35 ABEP centres across six LGAs of Sokoto State.",
    tag: "Quality Education",
    mottoBadge: "Equal Access to Joyful Learning",
    primaryCta: {
      label: "Support Education",
      href: "/education",
    },
    secondaryCta: {
      label: "View Success Stories",
      href: "/success-stories",
    },
  },
  {
    id: "slide-health",
    src: LHI_PHOTOS.muacScreening.src,
    alt: LHI_PHOTOS.muacScreening.alt,
    eyebrow: "Maternal, Infant & Child Health",
    prefix: "Restoring health, nutrition & vitality for ",
    highlight: "vulnerable children",
    suffix: ".",
    body: "Delivering life-saving primary healthcare, routine immunization, therapeutic nutrition for malnourished children, and clean WASH facilities in remote rural settlements.",
    caption: "Clinical nutrition and immunization restoring vibrant health and childhood smiles.",
    tag: "Vitality & Nutrition",
    mottoBadge: "Every Child Healthy & Thriving",
    primaryCta: {
      label: "Health Interventions",
      href: "/health",
    },
    secondaryCta: {
      label: "Our Impact",
      href: "/impact",
    },
  },
  {
    id: "slide-protection",
    src: LHI_PHOTOS.activismMarch.src,
    alt: LHI_PHOTOS.activismMarch.alt,
    eyebrow: "Child Protection & Psychosocial Care",
    prefix: "Creating safe havens and safeguarding ",
    highlight: "children's dignity",
    suffix: ".",
    body: "Preventing violence against women and girls, protecting children, and applying zero-tolerance safeguarding policies across every programme.",
    caption: "Communities standing together against gender-based violence.",
    tag: "Safe & Protected",
    mottoBadge: "Safe Havens for Every Child",
    primaryCta: {
      label: "Protect Children",
      href: "/protection",
    },
    secondaryCta: {
      label: "Our Safeguarding",
      href: "/our-commitment",
    },
  },
  {
    id: "slide-livelihood",
    src: LHI_PHOTOS.gidanArzikiTailoring.src,
    alt: LHI_PHOTOS.gidanArzikiTailoring.alt,
    eyebrow: "Livelihoods & Savings",
    prefix: "Skills, savings and enterprise that build ",
    highlight: "self-reliance",
    suffix: ".",
    body: "Farmers service hubs, vocational training and group savings help women and youths turn skills into income, from Batagarawa in Katsina to Gusau in Zamfara.",
    caption: "Trainee at the Gidan Arziki vocational centre, Batagarawa, Katsina State.",
    tag: "Livelihoods",
    mottoBadge: "Touching Lives; Transforming Households",
    primaryCta: {
      label: "Livelihood Programmes",
      href: "/livelihood",
    },
    secondaryCta: {
      label: "Read the Magazine",
      href: "/blog/gidan-arziki-magazine-vol-2",
    },
  },
  {
    id: "slide-community",
    src: LHI_PHOTOS.farmerWomanHarvest.src,
    alt: LHI_PHOTOS.farmerWomanHarvest.alt,
    eyebrow: "22 Years of Impact · 1.5M+ People Reached",
    prefix: "Transforming communities with love, honesty and ",
    highlight: "unwavering hope",
    suffix: ".",
    body: "From the Beulah Project supporting orphaned children in Sokoto in 2004 to a multi-state NGO with offices in 11 states — bringing smiles, resilience, and economic dignity to households.",
    caption: "Twenty-two years of putting smiles on faces across Nigeria.",
    tag: "22 Years of Impact",
    mottoBadge: "1.5M+ Smiles & Counting",
    primaryCta: {
      label: "Get Involved",
      href: "/get-involved",
    },
    secondaryCta: {
      label: "About Life Helpers",
      href: "/about",
    },
  },
];

export const africanFulfillmentImages = {
  // 1. Home Hero & Banner
  homeHero: {
    src: LHI_PHOTOS.farmerWomanHarvest.src,
    alt: LHI_PHOTOS.farmerWomanHarvest.alt,
    caption: "Putting a smile on a face — bringing hope and fulfillment to every community.",
    tag: "Putting A Smile On A Face",
  },
  homeMotherChild: {
    src: LHI_PHOTOS.motherChildNutrition.src,
    alt: LHI_PHOTOS.motherChildNutrition.alt,
    caption: "Healthy mothers, thriving children, and resilient households across 11 states.",
    tag: "Maternal & Child Health",
  },

  // 2. About Us
  aboutHero: {
    src: LHI_PHOTOS.teamStrategicPlan.src,
    alt: LHI_PHOTOS.teamStrategicPlan.alt,
    caption: "Founded on Love, Honesty, and Inclusion to maximize opportunities for the vulnerable.",
    tag: "Our Community",
  },
  aboutHeritage: {
    src: LHI_PHOTOS.hqOffice.src,
    alt: LHI_PHOTOS.hqOffice.alt,
    caption: "From the Beulah Project in 2004 to over two decades of transformative smiles.",
    tag: "20 Years of Impact",
  },

  // 3. Our History
  historyHero: {
    src: LHI_PHOTOS.staffGroup.src,
    alt: LHI_PHOTOS.staffGroup.alt,
    caption: "Over 20 years of bringing smiles, dignity, and sustainable hope to Northern Nigeria.",
    tag: "Since Oct 1, 2004",
  },

  // 4. Programs
  programsHero: {
    src: LHI_PHOTOS.learningCentre.src,
    alt: LHI_PHOTOS.learningCentre.alt,
    caption: "Six thematic pillars delivering lasting smiles and community resilience.",
    tag: "Field Interventions",
  },

  // 5. Impact Reports
  impactHero: {
    src: LHI_PHOTOS.jafaroCabbage.src,
    alt: LHI_PHOTOS.jafaroCabbage.alt,
    caption: "Transparent results, verified metrics, and over 1.5 million fulfilled lives.",
    tag: "Evidence of Joy",
  },

  // 6. Success Stories
  successStoriesHero: {
    src: LHI_PHOTOS.murja.src,
    alt: LHI_PHOTOS.murja.alt,
    caption: "Real transformations: from severe vulnerability to radiant smiles and self-reliance.",
    tag: "Stories of Hope",
  },

  // 7. Education
  educationHero: {
    src: LHI_PHOTOS.abepGirls.src,
    alt: LHI_PHOTOS.abepGirls.alt,
    caption: "Empowering children and girl-child scholars with joyful learning and digital access.",
    tag: "Quality Education",
  },

  // 8. Health
  healthHero: {
    src: LHI_PHOTOS.healthScreening.src,
    alt: LHI_PHOTOS.healthScreening.alt,
    caption: "Primary healthcare, immunization, and clinical nutrition that restore vibrant smiles.",
    tag: "Vitality & Care",
  },

  // 9. Food Security
  foodSecurityHero: {
    src: LHI_PHOTOS.maizeFarmerWoman.src,
    alt: LHI_PHOTOS.maizeFarmerWoman.alt,
    caption: "Climate-smart farming and drought-resilient crops creating food sovereignty and joy.",
    tag: "Food Sovereignty",
  },

  // 10. Protection
  protectionHero: {
    src: LHI_PHOTOS.activismWomen.src,
    alt: LHI_PHOTOS.activismWomen.alt,
    caption: "Child protection, PSEA accountability, and emotional safe spaces that nurture childhood joy.",
    tag: "Safe & Protected",
  },

  // 11. Livelihoods
  livelihoodHero: {
    src: LHI_PHOTOS.womanShop.src,
    alt: LHI_PHOTOS.womanShop.alt,
    caption: "Village Savings & Loan Associations fostering financial independence and fulfilled smiles.",
    tag: "Economic Dignity",
  },

  // 12. Social Inclusion
  socialInclusionHero: {
    src: LHI_PHOTOS.communityDialogue.src,
    alt: LHI_PHOTOS.communityDialogue.alt,
    caption: "Guaranteeing equity for persons with disabilities and marginalized groups.",
    tag: "Universal Inclusion",
  },

  // 13. Emergencies
  emergenciesHero: {
    src: LHI_PHOTOS.mirpDistribution.src,
    alt: LHI_PHOTOS.mirpDistribution.alt,
    caption: "Rapid, dignified emergency response that brings immediate relief and restores smiles.",
    tag: "Rapid Relief",
  },

  // 14. NIDAKE
  nidakeHero: {
    src: LHI_PHOTOS.nidakeBeneficiary.src,
    alt: LHI_PHOTOS.nidakeBeneficiary.alt,
    caption: "Reusable pads and menstrual health education keeping girls confident and in school.",
    tag: "Dignity & Equity",
  },

  // 15. Radio Advocacy
  radioHero: {
    src: LHI_PHOTOS.solarRadioFarmer.src,
    alt: LHI_PHOTOS.solarRadioFarmer.alt,
    caption: "The Women Situation Room: broadcasting civic empowerment and life-saving health education.",
    tag: "Voices of Hope",
  },

  // 16. News & Updates
  newsHero: {
    src: LHI_PHOTOS.hubAerial.src,
    alt: LHI_PHOTOS.hubAerial.alt,
    caption: "Updates and dispatches from our frontline teams putting smiles on faces across Nigeria.",
    tag: "Field Dispatches",
  },

  // 17. Events
  eventsHero: {
    src: LHI_PHOTOS.conference.src,
    alt: LHI_PHOTOS.conference.alt,
    caption: "Workshops, training sessions, and community commemorations filled with joy.",
    tag: "Community Convenings",
  },

  // 18. Board of Trustees
  trusteesHero: {
    src: LHI_PHOTOS.wfpMeeting.src,
    alt: LHI_PHOTOS.wfpMeeting.alt,
    caption: "Fiduciary integrity, ethical oversight, and mission-driven guidance.",
    tag: "Strategic Governance",
  },

  // 19. Management Team
  managementHero: {
    src: LHI_PHOTOS.teamStrategicPlan.src,
    alt: LHI_PHOTOS.teamStrategicPlan.alt,
    caption: "Over 350 dedicated humanitarian professionals driving change across 11 states.",
    tag: "Executive Leadership",
  },

  // 20. Our Strategies
  strategiesHero: {
    src: LHI_PHOTOS.strategyWorkshop1.src,
    alt: LHI_PHOTOS.strategyWorkshop1.alt,
    caption: "Community co-ownership, systems strengthening, and sustainable methodologies.",
    tag: "Proven Methodologies",
  },

  // 21. Our Commitment
  commitmentHero: {
    src: LHI_PHOTOS.caseManagement.src,
    alt: LHI_PHOTOS.caseManagement.alt,
    caption: "Uncompromising safeguarding, zero tolerance for exploitation, and profound love.",
    tag: "Uncompromising Ethics",
  },

  // 22. Board of Trustees alias
  boardHero: {
    src: LHI_PHOTOS.wfpMeeting.src,
    alt: LHI_PHOTOS.wfpMeeting.alt,
    caption: "Fiduciary integrity, ethical oversight, and mission-driven guidance.",
    tag: "Strategic Governance",
  },

  // 23. Management Team alias
  teamHero: {
    src: LHI_PHOTOS.staffEvent.src,
    alt: LHI_PHOTOS.staffEvent.alt,
    caption: "Over 350 dedicated humanitarian professionals driving change across 11 states.",
    tag: "Executive Leadership",
  },

  // 24. Blog Hero
  blogHero: {
    src: LHI_PHOTOS.schoolAssembly.src,
    alt: LHI_PHOTOS.schoolAssembly.alt,
    caption: "Frontline perspectives and evidence-based field analyses bringing community smiles.",
    tag: "Field Insights",
  },

  // 25. Donate Hero
  donateHero: {
    src: LHI_PHOTOS.murja.src,
    alt: LHI_PHOTOS.murja.alt,
    caption: "Every gift brings life, hope, and fulfilled smiles",
    tag: "Transforming Lives",
  },

  // 26. Contact Hero
  contactHero: {
    src: LHI_PHOTOS.hqOffice.src,
    alt: LHI_PHOTOS.hqOffice.alt,
    caption: "Connect with our dedicated teams across 11 states in Nigeria",
    tag: "National Presence",
  },

  // 27. Volunteer Hero
  volunteerHero: {
    src: LHI_PHOTOS.kitDistribution.src,
    alt: LHI_PHOTOS.kitDistribution.alt,
    caption: "Together, bringing shared fulfillment and smiles to every village",
    tag: "Volunteer With Us",
  },

  // 28. Careers Hero
  careersHero: {
    src: LHI_PHOTOS.staffTraining.src,
    alt: LHI_PHOTOS.staffTraining.alt,
    caption: "Join a passionate team creating real smiles and lasting community impact",
    tag: "Join Our Mission",
  },

  // 29. Projects & Interventions Hero
  interventionsHero: {
    src: LHI_PHOTOS.hubAerial.src,
    alt: LHI_PHOTOS.hubAerial.alt,
    caption: "High-impact multi-sectoral projects bringing sustainable fulfillment and smiles",
    tag: "Impact in Action",
  },
} as const;
