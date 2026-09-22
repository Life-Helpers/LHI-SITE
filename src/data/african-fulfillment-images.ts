/**
 * Curated African fulfillment photography library celebrating Life Helpers Initiative's
 * founding motto: "Putting a smile on a face" — touching lives, transforming households,
 * and impacting communities across Nigeria.
 *
 * Each image portrays genuine joy, fulfillment, dignity, and authentic smiles.
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
    src: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=1600&q=85",
    alt: "Joyful African child with a wide beaming radiant smile embodying pure hope and happiness",
    eyebrow: "Life Helpers Initiative · Sokoto, Nigeria",
    prefix: "Putting a radiant smile on every child's face across ",
    highlight: "Northern Nigeria",
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
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=85",
    alt: "African school children smiling brightly in classroom during interactive learning",
    eyebrow: "Education & Girl-Child Literacy",
    prefix: "Nurturing young minds through ",
    highlight: "inclusive quality learning",
    suffix: ".",
    body: "Providing school kits, safe learning spaces, teacher training, and scholarships to eliminate barriers for out-of-school children and vulnerable girl scholars.",
    caption: "Empowering over 80,000 children to learn, read, and lead with confidence and joy.",
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
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=85",
    alt: "Radiant African girl smiling with bright eyes and hope in community health program",
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
    src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=1600&q=85",
    alt: "Young African boy with a beaming confident smile in a child-friendly safe space",
    eyebrow: "Child Protection & Psychosocial Care",
    prefix: "Creating safe havens and safeguarding ",
    highlight: "children's dignity",
    suffix: ".",
    body: "Establishing community child-friendly spaces, psychosocial trauma counseling, and zero-tolerance safeguarding policies that protect children from harm and exploitation.",
    caption: "Safe community spaces where children play, heal, and develop their full potential.",
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
    id: "slide-community",
    src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1600&q=85",
    alt: "Group of African children smiling and laughing together outdoors with genuine happiness",
    eyebrow: "20+ Years of Impact · 1.5M+ Lives Reached",
    prefix: "Transforming communities with love, honesty and ",
    highlight: "unwavering hope",
    suffix: ".",
    body: "From Beulah Projects funfairs in Sokoto in 2004 to a national NGO operating across 11 states — bringing smiles, resilience, and economic dignity to households.",
    caption: "Two decades of continuous dedication to putting smiles on faces across Nigeria.",
    tag: "20 Years of Impact",
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
    src: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=1200&q=85",
    alt: "Radiant African child with a wide joyful smile filled with hope and happiness",
    caption: "Putting a smile on a face — bringing hope and fulfillment to every community.",
    tag: "Putting A Smile On A Face",
  },
  homeMotherChild: {
    src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85",
    alt: "Happy African mother and smiling child enjoying health and nutrition support",
    caption: "Healthy mothers, thriving children, and resilient households across 11 states.",
    tag: "Maternal & Child Health",
  },

  // 2. About Us
  aboutHero: {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85",
    alt: "Joyful African youth and community members smiling together in togetherness and fulfillment",
    caption: "Founded on Love, Honesty, and Inclusion to maximize opportunities for the vulnerable.",
    tag: "Our Community",
  },
  aboutHeritage: {
    src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85",
    alt: "Smiling African children laughing together outdoors with genuine happiness",
    caption: "From Beulah Projects funfairs in 2004 to over two decades of transformative smiles.",
    tag: "20 Years of Impact",
  },

  // 3. Our History
  historyHero: {
    src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85",
    alt: "Group of African children smiling with joyful fulfillment in a community celebration",
    caption: "Over 20 years of bringing smiles, dignity, and sustainable hope to Northern Nigeria.",
    tag: "Since Oct 1, 2004",
  },

  // 4. Programs
  programsHero: {
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=85",
    alt: "Radiant African girl smiling with bright eyes and pure joy in community program",
    caption: "Six thematic pillars delivering lasting smiles and community resilience.",
    tag: "Field Interventions",
  },

  // 5. Impact Reports
  impactHero: {
    src: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=1600&q=85",
    alt: "Fulfilled African community celebrating water and healthcare achievements with radiant smiles",
    caption: "Transparent results, verified metrics, and over 1.5 million fulfilled lives.",
    tag: "Evidence of Joy",
  },

  // 6. Success Stories
  successStoriesHero: {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=85",
    alt: "Smiling African child holding hands with humanitarian worker, radiating happiness and safety",
    caption: "Real transformations: from severe vulnerability to radiant smiles and self-reliance.",
    tag: "Stories of Hope",
  },

  // 7. Education
  educationHero: {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=85",
    alt: "Joyful African students in school uniforms smiling and raising hands in classroom",
    caption: "Empowering children and girl-child scholars with joyful learning and digital access.",
    tag: "Quality Education",
  },

  // 8. Health
  healthHero: {
    src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=85",
    alt: "Smiling African healthcare nurse holding a healthy, smiling infant with tenderness",
    caption: "Primary healthcare, immunization, and clinical nutrition that restore vibrant smiles.",
    tag: "Vitality & Care",
  },

  // 9. Food Security
  foodSecurityHero: {
    src: "https://images.pexels.com/photos/8948347/pexels-photo-8948347.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Smiling African woman farmer standing in lush green agricultural field celebrating harvest",
    caption: "Climate-smart farming and drought-resilient crops creating food sovereignty and joy.",
    tag: "Food Sovereignty",
  },

  // 10. Protection
  protectionHero: {
    src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=1600&q=85",
    alt: "Young African boy with a beaming confident smile in a safe community child-friendly space",
    caption: "Child protection, PSEA accountability, and emotional safe spaces that nurture childhood joy.",
    tag: "Safe & Protected",
  },

  // 11. Livelihoods
  livelihoodHero: {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=85",
    alt: "Empowered African businesswoman smiling proudly in front of her local enterprise",
    caption: "Village Savings & Loan Associations fostering financial independence and fulfilled smiles.",
    tag: "Economic Dignity",
  },

  // 12. Social Inclusion
  socialInclusionHero: {
    src: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=1600&q=85",
    alt: "Joyful African youth smiling together in an inclusive community recreational gathering",
    caption: "Guaranteeing equity for persons with disabilities and marginalized groups.",
    tag: "Universal Inclusion",
  },

  // 13. Emergencies
  emergenciesHero: {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=85",
    alt: "Humanitarian worker smiling warmly while assisting African community members with aid kits",
    caption: "Rapid, dignified emergency response that brings immediate relief and restores smiles.",
    tag: "Rapid Relief",
  },

  // 14. NIDAKE
  nidakeHero: {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85",
    alt: "Confident, radiant African young woman smiling with pride and dignity",
    caption: "Reusable pads and menstrual health education keeping girls confident and in school.",
    tag: "Dignity & Equity",
  },

  // 15. Radio Advocacy
  radioHero: {
    src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1600&q=85",
    alt: "Happy African woman listening with a warm smile on her face to community radio broadcast",
    caption: "The Women Situation Room: broadcasting civic empowerment and life-saving health education.",
    tag: "Voices of Hope",
  },

  // 16. News & Updates
  newsHero: {
    src: "https://images.unsplash.com/photo-1567057419565-4349c49d8a04?auto=format&fit=crop&w=1600&q=85",
    alt: "African community members gathered together smiling during a field townhall session",
    caption: "Updates and dispatches from our frontline teams putting smiles on faces across Nigeria.",
    tag: "Field Dispatches",
  },

  // 17. Events
  eventsHero: {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85",
    alt: "Celebratory African community event with attendees smiling and celebrating achievements",
    caption: "Workshops, training sessions, and community commemorations filled with joy.",
    tag: "Community Convenings",
  },

  // 18. Board of Trustees
  trusteesHero: {
    src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Diverse African leadership and board members engaged in strategic governance with pleasant smiles",
    caption: "Fiduciary integrity, ethical oversight, and mission-driven guidance.",
    tag: "Strategic Governance",
  },

  // 19. Management Team
  managementHero: {
    src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Smiling African executives and program specialists collaborating in national office",
    caption: "Over 350 dedicated humanitarian professionals driving change across 11 states.",
    tag: "Executive Leadership",
  },

  // 20. Our Strategies
  strategiesHero: {
    src: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Community members smiling in a participatory planning circle in an African village",
    caption: "Community co-ownership, systems strengthening, and sustainable methodologies.",
    tag: "Proven Methodologies",
  },

  // 21. Our Commitment
  commitmentHero: {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=85",
    alt: "Community hands united together in solidarity, care, and mutual trust",
    caption: "Uncompromising safeguarding, zero tolerance for exploitation, and profound love.",
    tag: "Uncompromising Ethics",
  },

  // 22. Board of Trustees alias
  boardHero: {
    src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Diverse African leadership and board members engaged in strategic governance with pleasant smiles",
    caption: "Fiduciary integrity, ethical oversight, and mission-driven guidance.",
    tag: "Strategic Governance",
  },

  // 23. Management Team alias
  teamHero: {
    src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Smiling African executives and program specialists collaborating in national office",
    caption: "Over 350 dedicated humanitarian professionals driving change across 11 states.",
    tag: "Executive Leadership",
  },

  // 24. Blog Hero
  blogHero: {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=85",
    alt: "Smiling African field practitioners and students sharing stories and knowledge",
    caption: "Frontline perspectives and evidence-based field analyses bringing community smiles.",
    tag: "Field Insights",
  },

  // 25. Donate Hero
  donateHero: {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    alt: "Radiant smiling African children and family celebrating life and community support",
    caption: "Every gift brings life, hope, and fulfilled smiles",
    tag: "Transforming Lives",
  },

  // 26. Contact Hero
  contactHero: {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=85",
    alt: "Warm smiling African staff and community welcoming visitors at Life Helpers Initiative",
    caption: "Connect with our dedicated teams across 11 states in Nigeria",
    tag: "National Presence",
  },

  // 27. Volunteer Hero
  volunteerHero: {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
    alt: "Inspiring community members and volunteers joyfully collaborating with bright smiles",
    caption: "Together, bringing shared fulfillment and smiles to every village",
    tag: "Volunteer With Us",
  },

  // 28. Careers Hero
  careersHero: {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80",
    alt: "Confident smiling African professional humanitarian worker empowering local development",
    caption: "Join a passionate team creating real smiles and lasting community impact",
    tag: "Join Our Mission",
  },

  // 29. Projects & Interventions Hero
  interventionsHero: {
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=85",
    alt: "Vibrant smiling African community members participating in agricultural and health projects",
    caption: "High-impact multi-sectoral projects bringing sustainable fulfillment and smiles",
    tag: "Impact in Action",
  },
} as const;
