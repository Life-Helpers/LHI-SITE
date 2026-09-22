export interface RadioEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  language: "Hausa" | "Kanuri" | "English" | "Hausa & Kanuri" | "Hausa & English";
  languageCode: "ha" | "kr" | "en" | "ha-kr" | "ha-en";
  primaryLanguage: "Hausa" | "Kanuri" | "English";
  thematicArea: "health" | "protection" | "education" | "social-inclusion" | "livelihood" | "food-security";
  thematicLabel: string;
  broadcastDate: string;
  duration: string; // e.g. "24:45"
  durationSeconds: number;
  stations: string[];
  host: string;
  guests: string[];
  summary: string;
  keyPoints: string[];
  transcriptExcerpt: {
    language: string;
    text: string;
  }[];
  helpline?: string;
  featured?: boolean;
}

export const RADIO_EPISODES: RadioEpisode[] = [
  {
    id: "wsr-ep-24",
    episodeNumber: 24,
    title: "Maternal Nutrition, Exclusive Breastfeeding & Tom Brown Prep",
    subtitle: "Practical community recipes for preventing child stunting and wasting",
    language: "Hausa & English",
    languageCode: "ha-en",
    primaryLanguage: "Hausa",
    thematicArea: "health",
    thematicLabel: "Health & Nutrition",
    broadcastDate: "September 18, 2026",
    duration: "26:40",
    durationSeconds: 1600,
    stations: ["Rima FM 97.1 Sokoto", "Pride FM 103.5 Gusau", "Peace FM 102.5 Maiduguri"],
    host: "Malama Fatima Kaura (LHI Advocacy Team)",
    guests: [
      "Dr. Amina Bello (Consultant Pediatrician, Specialist Hospital Gusau)",
      "Hajiya Aisha Mustapha (Lead Community Nutritionist, UNICEF-LHI MIRP)",
    ],
    summary:
      "In this episode, clinical experts explain how mothers can prepare Tom Brown—a high-energy, protein-rich porridge made of locally grown soybeans, guinea corn, and groundnuts—to nourish recovering infants. The team also answers listener calls regarding exclusive breastfeeding myths during hot Sahel months.",
    keyPoints: [
      "Tom Brown preparation ratio: 3 parts roasted guinea corn, 1 part soybeans, 1 part groundnuts with dried crayfish.",
      "Dispelling the myth that newborn infants need additional water during dry season: breast milk is 88% water.",
      "How Father Support Groups are stepping up to purchase nutritional ingredients for pregnant mothers.",
      "Immediate warning signs of acute malnutrition requiring referral to outpatient therapeutic centers.",
    ],
    transcriptExcerpt: [
      {
        language: "Hausa",
        text: "“Kowane yaro yana da damar samun ingantaccen abinci tun daga haihuwa. Tom Brown hadin wake, dawa, da gyada ne mai saukin kudi wanda ke kare yara daga ciwon tamowa. Iyaye mata, kada ku ji tsoron shayarwa zalla a cikin watanni shida na farko.” — Hajiya Aisha Mustapha",
      },
      {
        language: "English",
        text: "“Every child deserves optimal nutrition from the first hour of birth. Tom Brown is a low-cost, locally sourced formula that shields infants from wasting. Mothers do not need expensive imported formulas when our farms produce nutritious sorghum, groundnuts, and soya beans.”",
      },
    ],
    helpline: "Toll-Free Maternal Helpline: 0800-LHI-HELP (0800-544-4357)",
    featured: true,
  },
  {
    id: "wsr-ep-23",
    episodeNumber: 23,
    title: "Overcoming SGBV: Legal Protections, Confidential Desks & Survivor Rights",
    subtitle: "Breaking silence around gender-based violence and accessing legal justice",
    language: "Hausa & Kanuri",
    languageCode: "ha-kr",
    primaryLanguage: "Hausa",
    thematicArea: "protection",
    thematicLabel: "Protection & SGBV",
    broadcastDate: "September 11, 2026",
    duration: "29:15",
    durationSeconds: 1755,
    stations: ["Rima FM 97.1 Sokoto", "Yobe State Radio Damaturu", "BRTV Maiduguri"],
    host: "Barrister Hadiza Umar (LHI Legal & Gender Unit)",
    guests: [
      "Ustaz Muhammad Dan-Ali (Islamic Jurisprudence Scholar & Human Rights Advocate)",
      "Inspector Ngozi Eze (Gender Desk Officer, Nigeria Police Force)",
    ],
    summary:
      "Broadcasted under the Spotlight Initiative. The panel addresses legal avenues for survivors of sexual and gender-based violence, clarifying that Islamic jurisprudence and the Nigerian Child Rights Act strictly prohibit domestic abuse, early forced marriage, and denial of education. Step-by-step guidance is given on accessing free medical and legal support.",
    keyPoints: [
      "Confidentiality guarantee at all LHI One-Stop Crisis Desks and government Sexual Assault Referral Centers (SARC).",
      "The critical 72-hour clinical window for Post-Exposure Prophylaxis (PEP) and forensic documentation.",
      "Engaging traditional ward heads (Mai Anguwa) as male champions protecting women and vulnerable girls.",
      "How communities can report violations anonymously without exposing victims to social stigma.",
    ],
    transcriptExcerpt: [
      {
        language: "Hausa",
        text: "“Addinin Musulunci ya girmama darajar mace. Cin zarafin mata ba al'ada bace, laifi ne a karkashin dokar kasa da koyarwar addini. Idan an ci zarafin wata 'yar uwa, akwai taimakon likita da lauyoyi kyauta a cibiyoyin LHI.” — Ustaz Muhammad Dan-Ali",
      },
      {
        language: "Kanuri",
        text: "“Kâm kəmûye dondowanzə ba. Hakkin kamuye kərmai cidiwa lardəbe kuro ngəwuro duno cina. Saida lardəbe kəmûro kəri kəmô kəlanzəro shawari kəndobe kəmûye duno cina.”",
      },
    ],
    helpline: "Confidential SGBV Emergency Hotline: 0800-PROTECT (0800-776-8328)",
    featured: true,
  },
  {
    id: "wsr-ep-22",
    episodeNumber: 22,
    title: "Peaceful Farmer-Herder Dispute Mediation & Joint Resource Committees",
    subtitle: "Resolving land and grazing friction through grassroots dialogue",
    language: "Hausa & Kanuri",
    languageCode: "ha-kr",
    primaryLanguage: "Kanuri",
    thematicArea: "social-inclusion",
    thematicLabel: "Social Inclusion & Peacebuilding",
    broadcastDate: "September 4, 2026",
    duration: "25:10",
    durationSeconds: 1510,
    stations: ["BRTV Maiduguri", "Yobe State Radio Damaturu", "Peace FM 102.5"],
    host: "Ibrahim Bukar (Peacebuilding Coordinator, LHI North-East)",
    guests: [
      "Alhaji Modu Gana (Community Pastoralist Leader, Jere LGA)",
      "Mallam Bulama Kyari (Smallholder Farmers Union Chairman)",
    ],
    summary:
      "A candid and collaborative dialogue featuring leaders from both farming cooperatives and pastoralist associations in Borno and Yobe States. Discusses the establishment of joint grazing corridors, water-point sharing timetables, and fair local dispute arbitration committees that prevent escalation into violence.",
    keyPoints: [
      "Establishing demarcation markers along recognized transhumance livestock corridors.",
      "Setting up community-led arbitration councils that resolve crop encroachment without police extortion.",
      "Shared benefits of drought-resilient fodder crops providing feed while preserving farmland topsoil.",
      "The vital role of rural women traders in maintaining market day harmony and early-warning alerts.",
    ],
    transcriptExcerpt: [
      {
        language: "Kanuri",
        text: "“Kəla am dondoma kuro bariwu lardəbe kəlanzaro kəriwu kəla cidi kuro njî lardəbe. Kəriwu dəye la kəmô kəlanzaro faidawanzə ba. Am dondoma kuro am bariwu kəlanzaro kəriwu kalaktə kəla kəndobe.” — Alhaji Modu Gana",
      },
      {
        language: "Hausa",
        text: "“Manoma da makiyaya dangi ne. Ba za a taba samun wadata ba idan babu zaman lafiya. Kwamitin da muka kafa a Jere ya nuna cewa idan shanu suka shiga gona, ana biyan barna cikin adalci ba tare da fada ba.”",
      },
    ],
    helpline: "Early-Warning Conflict Mediation Desk: 0803-PEACE-LHI",
  },
  {
    id: "wsr-ep-21",
    episodeNumber: 21,
    title: "Breaking the Cycle of Child Marriage: Educating Girls for Community Prosperity",
    subtitle: "How Mothers' Associations and religious leaders keep adolescent girls in school",
    language: "Hausa & English",
    languageCode: "ha-en",
    primaryLanguage: "Hausa",
    thematicArea: "education",
    thematicLabel: "Education & Literacy",
    broadcastDate: "August 28, 2026",
    duration: "28:30",
    durationSeconds: 1710,
    stations: ["Rima FM 97.1 Sokoto", "Vision FM Birnin Kebbi", "Pride FM Gusau"],
    host: "Malama Fatima Kaura (LHI Advocacy Team)",
    guests: [
      "Hajiya Maryam Kware (Chairperson, Sokoto Mothers' Association Network)",
      "Sheikh Aliyu Maishanu (Director, Islamic Education Foundation)",
    ],
    summary:
      "Under the BMZ-UNICEF educational initiative, this broadcast highlights why retaining adolescent girls through senior secondary education reduces maternal mortality by over 60% and unlocks multi-generational economic prosperity. Rural mothers share how their savings groups fund uniforms and textbooks.",
    keyPoints: [
      "Mothers' Associations across 40 rural wards tracking daily attendance and intervening before dropouts occur.",
      "How micro-grants for mothers to sew school uniforms eliminate the primary economic reason parents withdraw daughters.",
      "Theological clarity on female scholarship in Islamic history, from Nana Asma'u to modern medical practitioners.",
      "Transition pathways from accelerated non-formal literacy centers into STEM secondary schools.",
    ],
    transcriptExcerpt: [
      {
        language: "Hausa",
        text: "“Lokacin da kika ilmantar da 'ya mace, kin ilmantar da al'umma baki daya. Tarihin Nana Asma'u ya nuna mana cewa mata manyan malamai ne da suka gyara al'umma. Yau 'ya'yanmu mata na iya zama likitoci da injiniyoyi.” — Sheikh Aliyu Maishanu",
      },
      {
        language: "English",
        text: "“When you educate a girl, you educate an entire civilization. Our Mothers' Associations ensure that economic lack is never an excuse to end a daughter's education prematurely. A girl who finishes school protects her children's health, breaks poverty, and leads with dignity.”",
      },
    ],
    helpline: "Girls' Education Support Line: 0800-EDU-GIRL",
    featured: true,
  },
  {
    id: "wsr-ep-20",
    episodeNumber: 20,
    title: "Routine Immunization Truths: Overcoming Vaccine Hesitancy in Rural Wards",
    subtitle: "Protecting children from polio, measles, and meningitis through primary healthcare",
    language: "Hausa",
    languageCode: "ha",
    primaryLanguage: "Hausa",
    thematicArea: "health",
    thematicLabel: "Health & Child Survival",
    broadcastDate: "August 21, 2026",
    duration: "23:50",
    durationSeconds: 1430,
    stations: ["Pride FM 103.5 Gusau", "Rima FM 97.1 Sokoto", "Garkuwa FM"],
    host: "Dr. Usman Kabir (LHI Senior Health Officer)",
    guests: [
      "Dr. Zulaihat Sanusi (State Immunization Officer, Primary Healthcare Development Agency)",
      "Alhaji Bello Sarkin Yaki (Traditional District Health Envoy)",
    ],
    summary:
      "A fast-paced interactive live call-in episode tackling vaccine rumors and mistrust head-on. Medical officers review vaccine cold-chain safety protocols, explain how immunity works, and share schedules for routine childhood vaccinations across primary health clinics.",
    keyPoints: [
      "The full routine immunization schedule from birth (BCG, OPV, Hep B) through Pentavalent and Measles 2.",
      "How solar direct-drive refrigerators maintain vaccine potency even without national grid power.",
      "Testimonials from mothers who previously hesitated but whose vaccinated children survived seasonal outbreaks.",
      "Community mobile outreach clinics visiting remote pastoral settlements every Wednesday.",
    ],
    transcriptExcerpt: [
      {
        language: "Hausa",
        text: "“Rigakafi ba maganin haihuwa bane, garkuwa ce da ke kare rayukan jarirai daga cututtuka masu kisa kamar kyanda, ciwon sanyi da shan inna. Dukkan rigakafin da ake bayarwa gwamnati da kungiyoyin duniya sun tabbatar da tsaftarsu.” — Dr. Zulaihat Sanusi",
      },
    ],
    helpline: "Immunization Information Desk: 0800-PHC-SHOTS",
  },
  {
    id: "wsr-ep-19",
    episodeNumber: 19,
    title: "Women in Civic Governance & Community Decision-Making",
    subtitle: "Amplifying women's voices in local council budgets and development planning",
    language: "English",
    languageCode: "en",
    primaryLanguage: "English",
    thematicArea: "social-inclusion",
    thematicLabel: "Civic Governance & Leadership",
    broadcastDate: "August 14, 2026",
    duration: "27:15",
    durationSeconds: 1635,
    stations: ["Rima FM 97.1 Sokoto", "Peace FM 102.5 Maiduguri", "Yobe FM Damaturu"],
    host: "Zainab Bello (Governance & Policy Lead, LHI)",
    guests: [
      "Hon. Fatima Dasuki (Former Local Government Council Vice Chair)",
      "Kudirat Adeleke (Civic Engagement Specialist, IRI/NDI Partner)",
    ],
    summary:
      "Supported by the EU-ACT and IRI governance initiatives. Explores how women can step beyond voting into active legislative candidacy, community development committees, and monitoring public expenditures on clinics and schools.",
    keyPoints: [
      "Citizen Scorecards: How rural women track local government budget allocations for clean water and maternal beds.",
      "Overcoming cultural intimidation through mentorship, public speaking coaching, and cross-party networks.",
      "Ensuring women with disabilities are formally included in community development advisory councils.",
      "The proven positive correlation between female local councillors and increased public investment in health.",
    ],
    transcriptExcerpt: [
      {
        language: "English",
        text: "“Decisions made without women are decisions that overlook half of society's reality. When women participate in planning rural health allocations, infant deaths drop, clean water boreholes are maintained, and communities flourish. Leadership is not about dominance; it is about service.” — Hon. Fatima Dasuki",
      },
    ],
    helpline: "Civic Action Hotline: 0800-CIVIC-VOICE",
  },
];

export const BROADCAST_STATIONS = [
  {
    station: "Rima FM 97.1",
    location: "Sokoto, Sokoto State",
    schedule: "Fridays, 4:00 PM – 5:00 PM",
    languages: "Hausa & English",
    reach: "Sokoto, Kebbi, Southern Niger Republic",
  },
  {
    station: "Pride FM 103.5",
    location: "Gusau, Zamfara State",
    schedule: "Saturdays, 10:00 AM – 11:00 AM",
    languages: "Hausa",
    reach: "Zamfara, Southern Katsina, Eastern Sokoto",
  },
  {
    station: "Peace FM 102.5",
    location: "Maiduguri, Borno State",
    schedule: "Sundays, 3:30 PM – 4:30 PM",
    languages: "Hausa & Kanuri",
    reach: "Borno, Northern Adamawa, Lake Chad Basin",
  },
  {
    station: "Yobe State Radio Corporation",
    location: "Damaturu, Yobe State",
    schedule: "Mondays, 5:00 PM – 6:00 PM",
    languages: "Hausa & Kanuri",
    reach: "Yobe, Western Borno, Northern Bauchi",
  },
  {
    station: "Vision FM 92.1",
    location: "Birnin Kebbi, Kebbi State",
    schedule: "Wednesdays, 2:00 PM – 3:00 PM",
    languages: "Hausa & English",
    reach: "Kebbi, Northern Niger State, Benin Republic border",
  },
];
