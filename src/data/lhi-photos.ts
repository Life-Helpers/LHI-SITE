/**
 * Real Life Helpers Initiative field photography, taken from the Organisational
 * Profile, the Strategic Plan 2026–2030, the project magazines (Cultivating Resilience
 * Vol. 1, Gidan Arziki Vol. 2, ABEP) and the LHI newsletter.
 * Files live in /public/images/lhi. Use these instead of stock imagery.
 */
export interface LhiPhoto {
  src: string;
  alt: string;
}

const p = (file: string, alt: string): LhiPhoto => ({ src: `/images/lhi/${file}.jpg`, alt });

export const LHI_PHOTOS = {
  // Food security & livelihoods (FCDO/WFP Resilience project, Sokoto & Katsina)
  farmerWomanHarvest: p("farmer-woman-harvest", "Smiling woman farmer holding fresh produce on her farm in Sokoto State"),
  maizeFarmerWoman: p("maize-farmer-woman", "Woman farmer tending her irrigated maize and onion plot"),
  jafaroCabbage: p("jafaro-cabbage-harvest", "Farmer beaming as he holds a large cabbage from his dry-season harvest"),
  cabbageFarmerWaving: p("cabbage-farmer-waving", "Smallholder farmer waving from his thriving cabbage field"),
  cabbageFarm: p("cabbage-farm", "Farmer inspecting healthy cabbages grown with improved seeds"),
  riceField: p("rice-field", "Farmer walking through a lush green rice field"),
  solarRadioFarmer: p("solar-radio-farmer", "Farmer receiving a solar-powered radio for agricultural information"),
  beneficiaryRegistration: p("beneficiary-registration", "LHI staff registering beneficiaries at a community distribution point"),
  vsla: p("vsla-savings-box", "Women VSLA members with their savings box at a project training"),
  vslaWomenMeeting: p("vsla-women-meeting", "Village Savings and Loan Association members at a group meeting"),
  murja: p("murja-food-business", "Murja Yari and her daughter smiling beside the food she now sells"),
  mustafa: p("mustafa-cap-business", "Mustafa Almajiri showing a traditional Hausa cap in his shop in Batagarawa"),
  atika: p("atika-rice-processing", "Atika Abas processing rice for her small business in Wammako"),
  womanShop: p("woman-shop-livelihood", "Woman entrepreneur standing proudly in front of her provisions shop"),
  womanTailoring: p("woman-tailoring", "Young woman sewing garments after vocational tailoring training"),
  girlSewing: p("girl-sewing-vocational", "Adolescent girl working on a sewing machine received through a vocational programme"),
  vegetableTrader: p("woman-vegetable-trader", "Woman arranging fresh vegetables for sale in her compound"),
  cucumberTrader: p("cucumber-trader", "Woman trader selling cucumbers and vegetables under a shade tree"),
  kolaTrader: p("kola-nut-trader", "Man selling kola nuts at a roadside stall"),
  shoeTrader: p("shoe-trader", "Trader displaying shoes and household goods for sale"),
  womanCooking: p("woman-cooking", "Woman preparing food in her outdoor kitchen"),

  // Farmer Service Centres (Noma Tushen Arziki, Wamakko; Gidan Arziki, Batagarawa)
  hubAerial: p("noma-tushen-arziki-aerial", "Aerial view of the Noma Tushen Arziki farmer service hub in Wamakko LGA"),
  hubAerialBuilding: p("hub-aerial-building", "Aerial view of a farmer service centre and its surroundings"),
  hubCourtyard: p("hub-courtyard", "Courtyard of the farmer service centre with red-roofed buildings"),
  hubTreePlanting: p("hub-tree-planting", "Tree planting at the farmer service centre commissioning"),
  serviceCentreVisit: p("farmer-service-centre-visit", "Officials touring the farmer service centre"),
  serviceCentreBriefing: p("farmer-service-centre-briefing", "Community leaders being briefed on the farmer service centre in Wamakko"),

  // Health & nutrition
  healthScreening: p("health-screening-clinic", "Health workers attending to women at an integrated emergency health clinic"),
  healthOutreach: p("health-outreach", "Health workers conducting screening during a community health outreach"),
  muacScreening: p("child-muac-screening", "Health worker screening a child for malnutrition with a MUAC tape"),
  motherChildNutrition: p("mother-child-nutrition", "Mother feeding her child during a nutrition session"),
  nutritionDemo: p("nutrition-demo-fruits", "Fresh fruits prepared for a community nutrition demonstration"),
  childrenWater: p("children-water-wash", "Children carrying water containers received through a WASH intervention"),

  // Education
  girlsLearning: p("girls-learning", "Three girls studying together in a learning centre"),
  learningCentre: p("learning-centre-children", "Facilitator teaching a large group of children at a community learning centre"),
  schoolchildrenBooks: p("schoolchildren-books", "Pupils holding learning materials in a classroom"),
  schoolAssembly: p("school-assembly", "LHI staff member addressing a school assembly"),
  pledgeSchool: p("pledge-to-remain-in-school", "Girl wearing a hijab printed with 'I pledge to remain in school'"),
  smilingGirls: p("smiling-girls", "Smiling adolescent girls at an LHI girls' empowerment event"),

  // Protection & social inclusion
  activismMarch: p("16-days-activism-march", "16 Days of Activism against GBV march at Government House, Sokoto"),
  activismWomen: p("16-days-activism-women", "Women at a 16 Days of Activism against gender-based violence event"),
  dignityKits: p("dignity-kits-women", "Women receiving and unpacking dignity kits"),
  kitDistribution: p("women-kit-distribution", "Women collecting kits at a community distribution"),
  mirpDistribution: p("mirp-distribution", "LHI team distributing kits under the FCDO/UNICEF MIRP programme"),
  sifKit: p("sif-lhi-kit", "Emergency kit box branded Secours Islamique France and Life Helpers"),
  caseManagement: p("case-management-home-visit", "LHI caseworkers on a confidential home visit"),
  communityDialogue: p("community-dialogue", "Community dialogue session under a shade in a rural village"),
  womenGroup: p("women-group-meeting", "Women's group meeting in a village compound"),
  womenGathering: p("women-community-gathering", "Women gathered at a community outreach event"),
  communityLeaders: p("community-leaders-meeting", "Community and religious leaders meeting LHI officials"),
  nidakeBeneficiary: p("nidake-pad-beneficiary", "Young woman holding a pack of NIDAKE reusable sanitary pads"),

  // Organisation
  teamStrategicPlan: p("lhi-team-strategic-plan", "Life Helpers Initiative staff and leadership at the Strategic Plan workshop"),
  staffGroup: p("lhi-staff-group", "Life Helpers Initiative staff group photograph"),
  staffEvent: p("lhi-staff-event", "LHI staff at an organisational event"),
  teamOutdoors: p("lhi-team-outdoors", "LHI team members standing together outdoors"),
  hqOffice: p("lhi-hq-office", "Life Helpers Initiative headquarters at Goshen Development Centre, Sokoto"),
  strategyWorkshop1: p("strategy-workshop-1", "Staff working in groups during the 2026–2030 strategy review workshop"),
  strategyWorkshop2: p("strategy-workshop-2", "Participants at the LHI strategic planning workshop"),
  strategyWorkshop3: p("strategy-workshop-3", "Senior leadership reviewing the draft strategic plan"),
  staffTraining: p("staff-training-session", "LHI staff taking part in a training exercise"),
  conference: p("stakeholder-conference", "Stakeholders at an LHI conference session"),
  partnersEvent: p("partners-event", "LHI team with partners at a USAID-supported event"),
  wfpMeeting: p("wfp-stakeholder-meeting", "Stakeholder meeting with WFP and government representatives"),
  wallOfFame: p("partners-wall-of-fame", "LHI's Wall of Fame displaying partner logos at the head office"),
  theoryOfChange: p("theory-of-change", "LHI Theory of Change diagram, Strategic Plan 2026–2030"),
  organogram: p("organogram", "Life Helpers Initiative organogram"),

  // ABEP magazine, Gidan Arziki magazine (Vol. 2) and the LHI newsletter
  abepGirlBag: p("abep-girl-school-bag", "Smiling girl holding her new school bag at an ABEP learning centre in Sokoto State"),
  abepLearnerClassroom: p("abep-learner-classroom", "ABEP learner showing her EU and UNICEF school bag in a learning centre classroom"),
  abepLearnersCelebrate: p("abep-learners-celebrate", "Out-of-school children celebrating with their new learning materials at an ABEP centre"),
  abepStakeholders: p("abep-stakeholder-engagement", "Community and education stakeholders at an ABEP engagement meeting in a Sokoto classroom"),
  abepGirls: p("abep-girls-bags", "Girls enrolled in the Accelerated Basic Education Programme with their school bags"),
  abepWriting: p("abep-girl-writing", "ABEP learner writing in her exercise book"),
  abepBoy: p("abep-boy-school-bag", "Boy carrying his ABEP school bag into the learning centre"),
  abepLearningCentre: p("abep-learning-centre", "Children learning to write at a non-formal learning centre in Sokoto State"),
  nasiru: p("nasiru-learning", "Nasiru Umar, 18, studying at his ABEP learning centre"),
  saudatu: p("saudatu-school-bag", "Saudatu Aliyu, 14, from Wurno LGA, with the school bag that symbolises her dream"),
  abepFacilitatorTraining: p("abep-facilitator-training", "ABEP facilitators at a three-day capacity-strengthening workshop"),
  dogonDajiVillageHead: p("dogon-daji-village-head", "Alhaji Rufai Maccido Salah, village head of Dogon Daji, Tambuwal LGA"),
  cbmcMeeting: p("cbmc-meeting", "Community-Based Management Committee members meeting with community leaders"),
  abepCommunity: p("abep-community-women", "Women and girls at an ABEP community mobilisation session"),
  abepOutdoorSession: p("abep-outdoor-session", "Community session outside an ABEP learning centre"),
  abepCommunityMeeting: p("abep-community-meeting", "Parents and community members at an ABEP learning centre meeting"),
  gidanArzikiTailoring: p("gidan-arziki-tailoring", "Trainee at the Gidan Arziki vocational centre showing fabric she sewed"),
  gidanArzikiAerial: p("gidan-arziki-aerial", "Aerial view of the solar-powered Gidan Arziki Farmers Service Hub in Batagarawa, Katsina State"),
  gidanArzikiCommissioning: p("gidan-arziki-commissioning", "Katsina State Deputy Governor Faruk Lawal Jobe commissioning the Gidan Arziki centre"),
  gidanArzikiProcessing: p("gidan-arziki-processing", "Agro-processing machines in the Gidan Arziki processing centre"),
  gidanArzikiCharging: p("gidan-arziki-charging", "Phones charging at the Gidan Arziki solar charging station"),
  gidanArzikiSewing: p("gidan-arziki-sewing", "Young woman learning to sew at the Gidan Arziki business incubation unit"),
  groundnutProcessing: p("groundnut-processing", "Woman using a groundnut processing machine at the Gidan Arziki hub"),
  sewingTrainee: p("sewing-trainee", "Sewing trainee at work on an industrial sewing machine"),
  batagarawaWoman: p("batagarawa-woman-food", "Smiling woman beside food she prepared in Batagarawa"),
  batagarawaLeader: p("batagarawa-community-leader", "Community leader speaking at the Gidan Arziki commissioning ceremony"),
  gidanArzikiCeremony: p("gidan-arziki-ceremony-aerial", "Aerial view of the Gidan Arziki commissioning ceremony"),
  arajana: p("arajana-groundnuts", "Arajana Suleiman, 70, sorting groundnuts at the Gidan Arziki centre"),
  gidanArzikiGarden: p("gidan-arziki-garden", "Gidan Arziki hub with its demonstration garden and solar roofs"),
  kuliKuli: p("kuli-kuli-production", "Woman frying groundnut paste to make kuli-kuli"),
  womenAgroProcessing: p("women-agro-processing", "Women processing groundnuts with modern equipment at the hub"),
  hubOfficeWall: p("hub-office-partners-wall", "LHI office at the farmers hub with a wall of partner logos"),
  nidakePad: p("nidake-reusable-pad", "Young woman holding a NIDAKE reusable sanitary pad pack"),
  nidakeKit: p("nidake-pad-kit", "NIDAKE reusable sanitary pad kit"),
  fctTeam: p("lhi-fct-team", "LHI staff in branded vests at an FCT community event"),
  ace3Mother: p("ace3-mother-hope", "Two women embracing and smiling outside their home in Shagari LGA"),
  azima: p("azima-tailoring", "Azima Bello at her sewing machine after tailoring training"),
  vslaGroup: p("vsla-group-sokoto", "Village savings group members seated on mats during a meeting"),
} satisfies Record<string, LhiPhoto>;

export type LhiPhotoKey = keyof typeof LHI_PHOTOS;

export const LEADERSHIP_TEAM = [
  { name: "Tayo Fatinikun", role: "Executive Director", email: "tayof@lhinigeria.org", photo: "/images/lhi/team/tayo-fatinikun.jpg" },
  { name: "Hadiza Ibrahim Yaro", role: "Director, Safeguarding, Accountability & Gender", email: "hadizay@lhinigeria.org", photo: "/images/lhi/team/hadiza-ibrahim-yaro.jpg" },
  { name: "Kolawole Adeniyi Famokun", role: "Director, Program", email: "knfamokun@lhinigeria.org", photo: "/images/lhi/team/kolawole-famokun.jpg" },
  { name: "Taiye Lawal", role: "Director, Business Development, Partnership & Grants", email: "lawalt@lhinigeria.org", photo: "/images/lhi/team/taiye-lawal.jpg" },
  { name: "Precious Afuaman", role: "Director, Monitoring, Evaluation, Research & Learning", email: "precious@lhinigeria.org", photo: "/images/lhi/team/precious-afuaman.jpg" },
  { name: "Dapo Ogunyemi", role: "Director, Compliance & Internal Audit", email: "ogunyemi@lhinigeria.org", photo: "/images/lhi/team/dapo-ogunyemi.jpg" },
  { name: "James Olasunkanmi David", role: "Director, Operations", email: "kanmidav@lhinigeria.org", photo: "/images/lhi/team/james-olasunkanmi-david.jpg" },
  { name: "Ijeoma Beatrice Ekpunobi", role: "Director, Finance", email: "ijeoma@lhinigeria.org", photo: "/images/lhi/team/ijeoma-ekpunobi.jpg" },
] as const;

export const STATE_COORDINATORS = [
  { name: "Dr Yakubu Lawali", state: "Zamfara", email: "yakubu@lhinigeria.org" },
  { name: "Habakkuk Ohu", state: "Kebbi", email: "ohuh@lhinigeria.org" },
  { name: "Nankwat Joseph", state: "Bauchi", email: "nankwatj@lhinigeria.org" },
  { name: "Fatima Ibrahim Nikau", state: "Borno", email: "fatimaibrahim@lhinigeria.org" },
  { name: "Najaatu Ali Ibrahim", state: "Yobe", email: "najaatuali@lhinigeria.org" },
  { name: "Jumbu Luka", state: "Adamawa", email: "jumbuluka@lhinigeria.org" },
  { name: "Lawal Musa", state: "Katsina", email: "lawal.musa@lhinigeria.org" },
  { name: "Martina Nuwan Alex", state: "Plateau", email: "malex@lhinigeria.org" },
  { name: "Ndidi Nkadi", state: "Ebonyi", email: "ndidi@lhinigeria.org" },
  { name: "Emelda Augustine", state: "FCT (Liaison Office)", email: "emelda.augustine@lhinigeria.org" },
] as const;
