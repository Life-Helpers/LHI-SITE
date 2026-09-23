export type Locale = "en" | "fr" | "ha" | "yo" | "ig";

export type Dictionary = {
  htmlLang: string;
  skipToContent: string;
  nav: {
    home: string;
    whoWeAre: string;
    whatWeDo: string;
    impact: string;
    getInvolved: string;
    contact: string;
    donate: string;
  };
  whoWeAreMenu: {
    aboutUs: string;
    ourHistory: string;
    ourCommitment: string;
    ourStrategies: string;
    nidake: string;
    boardOfTrustees: string;
    managementTeam: string;
  };
  whatWeDoMenu: {
    health: string;
    healthDesc: string;
    education: string;
    educationDesc: string;
    livelihood: string;
    livelihoodDesc: string;
    foodSecurity: string;
    foodSecurityDesc: string;
    socialInclusion: string;
    socialInclusionDesc: string;
    protection: string;
    protectionDesc: string;
    radioAdvocacy: string;
  };
  impactMenu: {
    blog: string;
    successStories: string;
    annualReport: string;
    projectsInterventions: string;
    eventsUpdates: string;
    newsletter: string;
    radioStory: string;
  };
  accessibility: {
    settingsLabel: string;
    textSize: string;
    decrease: string;
    increase: string;
    dyslexiaFont: string;
    reduceMotion: string;
  };
  theme: {
    switchToLight: string;
    switchToDark: string;
  };
  language: {
    label: string;
    disclaimer: string;
  };
  footer: {
    tagline: string;
    emergencies: string;
    programs: string;
    impactReports: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    rights: string;
    adminLogin: string;
    whoWeAreHeading: string;
    programsHeading: string;
    impactHeading: string;
    getInvolvedHeading: string;
  };
  home: {
    heroEyebrow: string;
    heroPrefix: string;
    heroHighlight: string;
    heroSuffix: string;
    heroBody: string;
    donateNow: string;
    seePrograms: string;
    stats: {
      statesActive: string;
      individualsReached: string;
      householdsReached: string;
      yearsOfService: string;
    };
    whoWeAre: {
      eyebrow: string;
      heading: string;
      body: string;
      visionTitle: string;
      visionBody: string;
      missionTitle: string;
      missionBody: string;
      valuesTitle: string;
      values: [string, string, string];
      moreAboutLhi: string;
    };
    whatWeDo: {
      heading: string;
      subtitle: string;
      viewAllPrograms: string;
    };
    latest: {
      heading: string;
      subtitle: string;
      eventsTitle: string;
      eventsNote: string;
      eventsCta: string;
      blogTitle: string;
      blogNote: string;
      blogCta: string;
    };
    radio: {
      eyebrow: string;
      heading: string;
      body: string;
      cta: string;
    };
    testimonials: {
      heading: string;
      subtitle: string;
      comingSoonTitle: string;
      comingSoonBody: string;
    };
    partners: {
      heading: string;
      subtitle: string;
    };
    philosophy: {
      heading: string;
      quote: string;
      highlight: string;
      attribution: string;
    };
    newsletter: {
      heading: string;
      body: string;
      placeholder: string;
      subscribeCta: string;
    };
  };
};
