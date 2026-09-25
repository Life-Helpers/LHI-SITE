import { LHI_PHOTOS } from "@/data/lhi-photos";

/**
 * Milestones for the Our History road map. Summaries come from LHI's Organisational
 * Profile and Strategic Plan; milestones marked "from the archive" are dated by the
 * banners, captions and dates visible in LHI's own archive photos.
 */
export interface HistoryPhoto {
  src: string;
  alt: string;
  /** Shown on the photo: the picture's own title from LHI's archive. */
  label?: string;
}

export type HistoryMedia =
  | { kind: "photos"; photos: HistoryPhoto[]; caption?: string }
  | { kind: "logos"; caption?: string };

export interface HistoryMilestone {
  year: string;
  title: string;
  location?: string;
  summary: string;
  media?: HistoryMedia;
  /** @svg-maps/nigeria ids of states LHI expanded into at this milestone; shown as pins on a map. */
  states?: string[];
}

const h = (file: string, alt: string, label?: string): HistoryPhoto => ({ src: `/images/lhi/history/${file}`, alt, label });

/** The start of the road: where the foundation was laid. */
export const HISTORY_START = {
  date: "1 October 2004 · Sokoto",
  title: "Where the journey began",
  summary: "Foundation was laid here at the Goshen Development Centre.",
  photos: [
    h("goshen-foundation-blocks.jpg", "Sandcrete blocks stacked on the cleared site of the Goshen Development Centre", "Blocks on site"),
    h("goshen-foundation-walls.jpg", "Block walls rising on the Goshen Development Centre site", "The walls go up"),
    h("goshen-centre-building.jpg", "The completed building at the Goshen Development Centre", "Goshen Development Centre"),
  ],
};

export const OLD_LOGO = h("lhi-old-logo.png", "Life Helpers Initiative's first logo: helping hands over a globe, with the words Putting A Smile On A Face");

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    year: "2004",
    title: "Inception as the Beulah Project",
    location: "Sokoto State",
    states: ["sokoto"],
    summary:
      "Established on October 1, 2004 as the Beulah Project, supporting children at the orphanage. In the words of Executive Director Tayo Fatinikun, “It was simply just a passion – a passion to touch lives, a passion to make children feel wanted, an attempt to restore their dignity.”",
    media: {
      kind: "photos",
      caption: "Children's fun days from our early years in Sokoto",
      photos: [
        h("early-years-childrens-day.jpg", "Children gathered round a table at an early LHI children's fun day"),
        h("early-years-playground.jpg", "Children playing on swings at an early LHI children's event"),
        h("early-years-sponsors.jpg", "Volunteers sharing drinks with children at an early LHI children's event"),
      ],
    },
  },
  {
    year: "2006",
    title: "Renamed Life Helpers Initiative",
    location: "Sokoto State",
    summary:
      "As it expanded its scope beyond immediate community needs, the Beulah Project was renamed Life Helpers Initiative and began its transition from a localised project into a structured organisation with broader development ambitions.",
    media: {
      kind: "photos",
      caption: "Youth football and table tennis from our early years",
      photos: [
        h("early-years-football.jpg", "A youth football team in red jerseys at an early LHI tournament"),
        h("early-years-table-tennis.jpg", "Young people playing table tennis at an early LHI youth event"),
      ],
    },
  },
  {
    year: "2007",
    title: "Incorporation as Life Helpers Initiative",
    location: "National CAC Registration",
    summary:
      "Registered with the Corporate Affairs Commission, Abuja, in September 2007 (CAC/IT/25232), with a Board of Trustees providing governance and oversight.",
  },
  {
    year: "2007",
    title: "Children Fiesta at World AIDS Day",
    location: "Shehu Kangiwa Square, Sokoto",
    summary: "Pupils from across Sokoto gathered at Shehu Kangiwa Square for LHI's Children Fiesta, marking World AIDS Day 2007.",
    media: {
      kind: "photos",
      caption: "“Children Fiesta at 2007 World AIDS Day, Shehu Kangiwa Square, Sokoto”",
      photos: [h("2007-world-aids-day-children-fiesta.jpg", "Pupils seated at the Children Fiesta for World AIDS Day 2007, Shehu Kangiwa Square, Sokoto")],
    },
  },
  {
    year: "2008",
    title: "Lifesport Scrabbles Competition",
    location: "Comprehensive School, Runjin Sambo, Sokoto",
    summary:
      "On Friday 29 February 2008, LHI held its Lifesport Scrabbles Competition for secondary school students at Comprehensive School Runjin Sambo, presenting prizes to the winners.",
    media: {
      kind: "photos",
      caption: "Prize-giving at the Life Helpers Lifesport Scrabbles Competition",
      photos: [
        h("2008-lifesport-scrabbles-winners.jpg", "Winners holding their prizes and trophy at the 2008 Lifesport Scrabbles Competition"),
        h("2008-lifesport-scrabbles-prize.jpg", "A student receiving her prize at the 2008 Lifesport Scrabbles Competition"),
      ],
    },
  },
  {
    year: "2009",
    title: "Staff Retreat",
    location: "Goshen Development Centre, Sokoto",
    summary: "The Life Helpers team gathered for its 2009 staff retreat.",
    media: {
      kind: "photos",
      photos: [h("goshen-staff-retreat-2009.jpg", "Life Helpers staff in LH polo shirts at the 2009 staff retreat", "Staff Retreat 2009")],
    },
  },
  {
    year: "2011",
    title: "NEI Children's Day Celebration",
    location: "Sokoto State",
    summary:
      "On Friday 27 May 2011, pupils celebrated Children's Day under the theme “Children, the Leaders of Tomorrow”, with drinking and football competitions, a march past, a quiz and debate, and a dancing competition.",
    media: {
      kind: "photos",
      photos: [h("2011-nei-childrens-day.jpg", "Pupils and teachers holding the NEI Children's Day Celebration banner, May 2011")],
    },
  },
  {
    year: "2012",
    title: "Strengthening Schools and Communities with USAID LEAD",
    location: "Bodinga LGA, Sokoto State",
    summary:
      "With RTI and USAID under the LEAD project, LHI ran two-day trainings on resource mobilisation for village development committee sub-committees on water and sanitation, health and education, and worked with school communities such as Wababe Model Primary School (28 February 2012).",
    media: {
      kind: "photos",
      caption: "VDC sub-committee training in Bodinga LGA, and Wababe Model Primary School",
      photos: [
        h("2012-vdc-resource-mobilisation-training.jpg", "Community members holding a banner for the two-day resource mobilisation training for VDC sub-committees, Bodinga LGA"),
        h("2012-wababe-model-primary-school.jpg", "Community and school leaders meeting at Wababe Model Primary School, 28 February 2012"),
      ],
    },
  },
  {
    year: "2013",
    title: "Expansion to Kebbi State",
    location: "Kebbi State",
    states: ["kebbi"],
    summary:
      "Scaled programming beyond Sokoto into neighboring Kebbi State, rolling out community-based maternal and child healthcare, routine immunization campaigns, and rural Water, Sanitation, and Hygiene (WASH) infrastructure.",
  },
  {
    year: "2014",
    title: "Celebrating 10 Years at Goshen",
    location: "Goshen Development Centre, Sokoto",
    summary:
      "Ten years on from 2004, the team marked the milestone with a staff retreat at the Goshen Development Centre, where Life Helpers sang the Life Helpers anthem.",
    media: {
      kind: "photos",
      photos: [
        h("goshen-10-years-centre.jpg", "Life Helpers staff posing together at the 10-year staff retreat", "Staff Retreat celebrating 10 years at Goshen Development Centre"),
        h("goshen-10-years-group.jpg", "Five Life Helpers staff in LH shirts at the 10-year staff retreat", "Staff Retreat celebrating 10 years in Goshen"),
        h("goshen-10-years-anthem.jpg", "Life Helpers staff singing together at the 10-year staff retreat", "Life Helpers singing the Life Helpers anthem"),
      ],
    },
  },
  {
    year: "2015",
    title: "Expansion to Zamfara State",
    location: "Zamfara State",
    states: ["zamfara"],
    summary:
      "Launched large-scale interventions in Zamfara State focusing on girls' education, community nutrition stabilization for children under five, and gender-based violence prevention through Mothers' Associations and community leaders.",
    media: {
      kind: "photos",
      caption: "Zamfara SUBEB sensitisation on establishing Girls 4 Girls groups in six LGAs",
      photos: [
        h("zamfara-g4g-sensitisation-banner.jpg", "Zamfara State Universal Basic Education Board banner welcoming participants to a Girls 4 Girls groups sensitisation"),
        h("zamfara-g4g-sensitisation.jpg", "A facilitator addressing participants at the Girls 4 Girls groups sensitisation in Zamfara State"),
      ],
    },
  },
  {
    year: "2017",
    title: "North-East Humanitarian Crisis Response",
    location: "Borno, Yobe, & Adamawa States",
    states: ["borno", "yobe", "adamawa"],
    summary:
      "In response to the severe humanitarian emergency in North-East Nigeria, LHI deployed frontline teams to Maiduguri (Borno), Damaturu (Yobe), and Yola (Adamawa). Implemented emergency Child Protection in Emergencies (CPiE), malnutrition stabilization, and emergency psychosocial support funded by the Nigeria Humanitarian Fund (NHF) and international partners.",
    media: { kind: "photos", caption: "Emergency response supplies", photos: [LHI_PHOTOS.sifKit] },
  },
  {
    year: "2017",
    title: "World AIDS Day 2017",
    summary: "LHI staff and volunteers joined World AIDS Day 2017 activities alongside Save the Children.",
    media: {
      kind: "photos",
      photos: [
        h("2017-world-aids-day.jpg", "LHI team in World AIDS Day 2017 T-shirts in front of a Save the Children banner"),
        h("2017-world-aids-day-team.jpg", "LHI team and partners beside an ambulance on World AIDS Day 2017"),
      ],
    },
  },
  {
    year: "2018",
    title: "Staff Retreat at Goshen",
    location: "Goshen Development Centre, Tamaje bypass, Sokoto",
    summary: "The growing Life Helpers team came together again at the Goshen Development Centre for the 2018 staff retreat.",
    media: {
      kind: "photos",
      photos: [
        h("goshen-retreat-2018-team.jpg", "The full Life Helpers team in LHI shirts at the 2018 staff retreat", "Staff Retreat 2018 at Goshen"),
        h("goshen-retreat-2018-group.jpg", "Six Life Helpers staff at the 2018 staff retreat", "Staff Retreat 2018 at Goshen"),
        h("goshen-retreat-2018-hall.jpg", "Staff outside a hall at the Goshen Development Centre during the 2018 retreat", "Staff Retreat 2018 at Goshen Development Centre"),
        h("goshen-retreat-2018-tamaje.jpg", "Life Helpers staff on the lawn at Goshen, Tamaje bypass, during the 2018 retreat", "Staff Retreat 2018 at Goshen, Tamaje bypass"),
      ],
    },
  },
  {
    year: "2019",
    title: "Voices for the Oppressed: a Walk for Violence-Free Elections",
    location: "Sokoto State",
    summary:
      "On 14 February 2019, LHI joined the Independent National Electoral Commission (INEC) in Sokoto State for “Voices for the Oppressed”, a peaceful walk for violence-free 2019 general elections, starting from the Round Mai Ruwa INEC office.",
    media: {
      kind: "photos",
      photos: [
        h("2019-violence-free-elections-walk.jpg", "Women holding the INEC Sokoto “Voices for the Oppressed” banner for a peaceful walk on violence-free 2019 elections"),
        h("2019-violence-free-elections-rally.jpg", "Participants with placards at the 2019 walk for violence-free elections in Sokoto"),
      ],
    },
  },
  {
    year: "2019",
    title: "A New Look: Our New Logo",
    summary:
      "LHI retired its first logo, helping hands over a globe, and adopted today's orange and red Life Helpers wordmark, whose smiling “i” still carries our promise: putting a smile on a face.",
    media: { kind: "logos" },
  },
  {
    year: "2020",
    title: "Expansion to Bauchi State",
    location: "Bauchi State",
    states: ["bauchi"],
    summary:
      "Commenced comprehensive adolescent reproductive health, girl-child empowerment, and community resilience programs in Bauchi, including the multi-year ASPIRED project funded by Global Affairs Canada in partnership with Plan International.",
  },
  {
    year: "2021",
    title: "Abuja Liaison Office & Ebonyi State Expansion",
    location: "FCT Abuja & Ebonyi State",
    states: ["fct", "ebonyi"],
    summary:
      "Established the Liaison Office in Gwarimpa, Abuja, for partner and federal coordination. Extended operations into Ebonyi State, where LHI supported health workers and community-based workers across 65 PHCs to reduce malnutrition in children under 5.",
  },
  {
    year: "2022",
    title: "Expansion to Plateau State",
    location: "Plateau State",
    states: ["plateau"],
    summary:
      "Under the President's Malaria Initiative for States with Management Sciences for Health, LHI began mentoring frontline providers on malaria case management, data management and malaria in pregnancy across 327 primary healthcare centres.",
  },
  {
    year: "2023",
    title: "Katsina Office",
    location: "Katsina State",
    states: ["katsina"],
    summary:
      "Opened the Katsina office, later home to the FCDO/WFP Resilience Building and Smallholder Farmers Support Project and the Gidan Arziki Farmer Service Centre in Batagarawa.",
  },
  {
    year: "2023",
    title: "16 Days of Activism against Gender-Based Violence",
    summary: "Women and community members rallied with LHI during the 2023 16 Days of Activism against Gender-Based Violence.",
    media: {
      kind: "photos",
      photos: [h("2023-16-days-of-activism.jpg", "Women rallying beside a 16 Days of Activism against Gender-Based Violence 2023 banner")],
    },
  },
  {
    year: "2024",
    title: "20 Years of Putting a Smile on a Face",
    summary:
      "LHI celebrated 20 years of service since 1 October 2004, and joined partners at the USAID Integrated Health Program Local Partners Summit.",
    media: {
      kind: "photos",
      caption: "Our 20th anniversary, and the IHP Local Partners Summit",
      photos: [
        h("2024-20th-anniversary.jpg", "Life Helpers Initiative 20th anniversary celebration graphic with framed awards"),
        h("2024-ihp-local-partners-summit.jpg", "LHI staff at the USAID Integrated Health Program Local Partners Summit"),
        h("2024-local-partners-summit-award.jpg", "LHI leadership with partners at the Local Partners Summit"),
      ],
    },
  },
  {
    year: "2021–2025",
    title: "Over ₦8 Billion in Grants",
    location: "11 Office States",
    summary:
      "Secured grant portfolios of over ₦8 billion, migrated to an ERP financial system, adopted Kobo Collect for digital data, strengthened MERL, invested in owned offices in Sokoto, Kebbi and Yobe, and created a dedicated Communications Unit.",
  },
  {
    year: "2025",
    title: "Noma Tushen Arziki Farmer Service Centre",
    location: "Wamakko LGA, Sokoto",
    summary:
      "Commissioned the Noma Tushen Arziki (“Farming Wealth”) Hub on 27 November 2025 with WFP and FCDO: milling, cold storage, a fish farm, hire services and a training space run by a community Facility Management Committee.",
    media: {
      kind: "photos",
      caption: "Drone view of the Noma Tushen Arziki Farmer Service Centre",
      photos: [h("2025-noma-tushen-arziki-hub-drone.jpg", "Drone view of the Noma Tushen Arziki Farmer Service Centre in Wamakko LGA, Sokoto State")],
    },
  },
  {
    year: "2026",
    title: "Gidan Arziki Farmers Service Hub",
    location: "Batagarawa, Katsina",
    summary: "Commissioned in April 2026 under the FCDO/WFP resilience project: a solar-powered farmers service hub in Batagarawa, Katsina State.",
    media: { kind: "photos", caption: "Drone view of the Gidan Arziki commissioning", photos: [LHI_PHOTOS.gidanArzikiCeremony] },
  },
  {
    year: "2026",
    title: "Strategic Plan 2026–2030",
    location: "Goshen Development Centre, Sokoto",
    summary:
      "Adopted LHI's third strategic plan, “A plan towards Consolidation of Programme Impact and Organisational Sustainability”. Today LHI has delivered over 45 projects, directly reaching over 1.5 million people in more than 400,000 households, with 350+ staff and 700+ community volunteers.",
    media: { kind: "photos", photos: [LHI_PHOTOS.strategyWorkshop2] },
  },
];
