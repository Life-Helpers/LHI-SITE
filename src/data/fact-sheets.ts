/**
 * Fact sheets shown on /fact-sheet.
 *
 * 1. Resilience Building and Smallholder Farmers Support Project in Northwest Nigeria (Katsina and
 *    Sokoto), funded by FCDO (UK aid) through the World Food Programme and implemented by LHI.
 *    Figures come from the project's progress dashboard (WFP_Progress.pptx, final slide).
 * 2. The Integrated Health Program (IHP) presentation "Work done, achievement, success stories"
 *    from the IHP Partners Summit. One slide showing counselling of an HIV-positive mother is
 *    left out to protect her privacy.
 */

export const WFP_FACT_SHEET = {
  title: "Resilience Building and Smallholder Farmers Support Project in Northwest Nigeria",
  states: "Katsina and Sokoto",
  fundedBy: "UK aid (FCDO)",
  partner: "World Food Programme (WFP)",
  pptx: "/documents/wfp-resilience-project-progress-dashboard.pptx",
  pdf: "/documents/wfp-resilience-project-fact-sheet.pdf",
  households: 5700,
  householdMembers: 37050,
  coverage: { states: 2, lgas: 4, wards: 42 },
  personsWithDisabilities: { count: 1384, pct: 24.2 },
  headOfHousehold: [
    { label: "Female-headed households", value: 1657, pct: 29.1 },
    { label: "Male-headed households", value: 4043, pct: 70.9 },
  ],
  residence: [
    { label: "Host community", value: 4807, pct: 84.3 },
    { label: "Internally displaced (IDPs)", value: 830, pct: 14.6 },
    { label: "Returnees", value: 63, pct: 1.1 },
  ],
  supportCategory: [
    { label: "Smallholder farmer (SHF) support", pct: 70 },
    { label: "Cash-based transfers (CBT)", pct: 30 },
  ],
  maritalStatus: [
    { label: "Married", pct: 78 },
    { label: "Widowed", pct: 17 },
    { label: "Single", pct: 3 },
    { label: "Divorced", pct: 2 },
  ],
  ageGroups: [
    { label: "Youth", pct: 16 },
    { label: "Adults", pct: 51 },
    { label: "Elderly", pct: 34 },
  ],
  cashTransfer: {
    women: { value: 996, pct: 58.2 },
    men: { value: 714, pct: 41.8 },
    personsWithDisabilities: { value: 278, pct: 16.3 },
    averageHouseholdSize: 8,
    linkedWithNimc: { value: 292, pct: 17.1 },
    linkedWithBank: 1075,
    banks: ["Taj Bank", "Keystone Bank", "Polaris Bank", "UBA"],
    residence: [
      { label: "Host community", pct: 84.2 },
      { label: "IDPs", pct: 12.7 },
      { label: "Returnees", pct: 2.1 },
    ],
    maritalStatus: [
      { label: "Married", pct: 64 },
      { label: "Widowed", pct: 27 },
      { label: "Divorced", pct: 5 },
      { label: "Single", pct: 4 },
    ],
  },
  smallholderFarmers: {
    women: { value: 661, pct: 16.6 },
    men: { value: 3229, pct: 83.4 },
    averageFarmSizeHa: 0.3,
    firstSeedChoice: [
      { label: "Maize", value: 2052 },
      { label: "Tomatoes", value: 1181 },
      { label: "Cabbage", value: 670 },
      { label: "Pepper", value: 87 },
    ],
  },
};

export const IHP_PRESENTATION = {
  title: "Integrated Health Program: work done, achievements and success stories",
  event: "IHP Partners Summit",
  pdf: "/documents/ihp-presentation-work-done-and-success-stories.pdf",
  slides: [
    {
      "src": "/fact-sheet/ihp/01.webp",
      "caption": "Participants reviewing appropriate sections in the IMCI chart at Chidera Clinic Maternity Amechi Okposi"
    },
    {
      "src": "/fact-sheet/ihp/02.webp",
      "caption": "PHC Giron Masa"
    },
    {
      "src": "/fact-sheet/ihp/03.webp",
      "caption": "Mentoring at Shanga"
    },
    {
      "src": "/fact-sheet/ihp/04.webp",
      "caption": "Women testing the food"
    },
    {
      "src": "/fact-sheet/ihp/05.webp",
      "caption": "At Grace Clinic - trainer taking them through the various mentoring checklist forms"
    },
    {
      "src": "/fact-sheet/ihp/06.webp",
      "caption": "Mentee taking the weight of a 9-month-old baby at Okaria MDGs PHC"
    },
    {
      "src": "/fact-sheet/ihp/07.webp",
      "caption": "Trainee during monitoring season on immunization at UG Clinic"
    },
    {
      "src": "/fact-sheet/ihp/08.webp",
      "caption": "CBHV during house to house visit"
    },
    {
      "src": "/fact-sheet/ihp/09.webp",
      "caption": "Trainees being put through MRDT process"
    },
    {
      "src": "/fact-sheet/ihp/10.webp",
      "caption": "Health workers attending to patients"
    },
    {
      "src": "/fact-sheet/ihp/11.webp",
      "caption": "Trainee giving an IM injection under a steady pressure and withdrawing needle at angle of insertion at Chidera Clinic Maternity"
    },
    {
      "src": "/fact-sheet/ihp/12.webp",
      "caption": "A trainee checking the expiry date and VVM before use"
    },
    {
      "src": "/fact-sheet/ihp/13.webp",
      "caption": "Trainer attending to a sick child using MUAC tape at Akpameka HC"
    },
    {
      "src": "/fact-sheet/ihp/14.webp",
      "caption": "A trainee documenting the vaccine given at PHC Onicha"
    },
    {
      "src": "/fact-sheet/ihp/16.webp",
      "caption": "Trainer Udu Simon clarifying some important issues on the forms at Abomege"
    },
    {
      "src": "/fact-sheet/ihp/17.webp",
      "caption": "Trainee during mentoring, checking the nutrition status of a sick child"
    },
    {
      "src": "/fact-sheet/ihp/18.webp",
      "caption": "Trainees at Onicha Health Center, during the post-test"
    },
    {
      "src": "/fact-sheet/ihp/19.webp",
      "caption": "Supervisor addressing the doctor's concerns on anaemia classification with only palmar pallor at Chidera Clinic Maternity"
    },
    {
      "src": "/fact-sheet/ihp/20.webp",
      "caption": "Work done, achievements and success stories: IHP Partners Summit"
    },
    {
      "src": "/fact-sheet/ihp/21.webp",
      "caption": "Trainee checking the nutritional status of outpatient at Ndiachi PHC"
    },
    {
      "src": "/fact-sheet/ihp/22.webp",
      "caption": "Mentoring trainer examining trainees on the use of IMCI tools at Akpameka HC"
    },
    {
      "src": "/fact-sheet/ihp/23.webp",
      "caption": "At Umuka MDGs HC trainees doing exercises 1, 2 and 3 in Module 4 on follow up care"
    },
    {
      "src": "/fact-sheet/ihp/24.webp",
      "caption": "Participant explaining to client how to give oral drugs on mentoring day at Urban HC"
    },
    {
      "src": "/fact-sheet/ihp/25.webp",
      "caption": "Trainer counseling parents during the mentoring session at Urban HC"
    },
    {
      "src": "/fact-sheet/ihp/26.webp",
      "caption": "Completion of nutrition and post-test conducted at Ndiunuhu HC"
    },
    {
      "src": "/fact-sheet/ihp/27.webp",
      "caption": "Role play- counselling on exclusive breastfeeding at UG Clinic Maternity"
    },
    {
      "src": "/fact-sheet/ihp/28.webp",
      "caption": "Pre-test on Nutrition at Chidera Clinic and Maternity"
    },
    {
      "src": "/fact-sheet/ihp/29.webp",
      "caption": "A trainee brainstorming on RI at Ojigwe health"
    },
    {
      "src": "/fact-sheet/ihp/30.webp",
      "caption": "Trainee counselling the mother of a baby with the ZScore of underweight drawing her attention as to why the baby was so classified at Okaria MDGs PHC"
    },
    {
      "src": "/fact-sheet/ihp/31.webp",
      "caption": "A care giver during counseling session at Ohaozara LGA"
    },
    {
      "src": "/fact-sheet/ihp/32.webp",
      "caption": "Cross section of trainers in Ohaozara LGA at the MNP orientation meeting"
    },
    {
      "src": "/fact-sheet/ihp/33.webp",
      "caption": "Trainee during a mentoring session on nutrition. Ndiunuhu HC"
    },
    {
      "src": "/fact-sheet/ihp/34.webp",
      "caption": "A session on ways to assess and classify UG Clinic Maternity"
    },
    {
      "src": "/fact-sheet/ihp/35.webp",
      "caption": "Trainee counselling a mother on complementary feeding and breastfeeding at UG Clinic Maternity"
    },
    {
      "src": "/fact-sheet/ihp/36.webp",
      "caption": "Trainees at Onicha Clinic brainstorming on supportive supervision by clarifying the components of breast milk among others"
    },
    {
      "src": "/fact-sheet/ihp/37.webp",
      "caption": "Trainees at Onicha Clinic brainstorming on supportive supervision by clarifying the components of breast milk among others"
    },
    {
      "src": "/fact-sheet/ihp/38.webp",
      "caption": "Trainee performing MRDT on a patient while assessing the child with sick child recording form. At Chidera Clinic Maternity"
    }
  ],
};

export const GSLA_PRESENTATION = {
  title: "Group Savings and Loan Associations (GSLA): Small Steps, Big Impact",
  partners: "ZOA · Secours Islamique France · Canadian Foodgrains Bank · World Renew",
  pdf: "/documents/sif-zoa-gsla-presentation.pdf",
  report: { pdf: "/documents/gsla-data-report-2024.pdf", image: "/fact-sheet/gsla-data-report.webp", width: 1600, height: 1333 },
  membersByLga: [
    { label: "Gusau", value: 100 },
    { label: "Talata Mafara", value: 90 },
    { label: "Tsafe", value: 87 },
    { label: "Anka", value: 79 },
  ],
  slides: [
    {
      "src": "/fact-sheet/gsla/01.webp",
      "caption": "Group Savings and Loan Association (GSLA), with ZOA, Secours Islamique France, Canadian Foodgrains Bank and World Renew"
    },
    {
      "src": "/fact-sheet/gsla/02.webp",
      "caption": "Members by age group: savings open to young and old alike"
    },
    {
      "src": "/fact-sheet/gsla/03.webp",
      "caption": "Malama Halima after share-out in the market, and Aliyu, a farmer, after share-out"
    },
    {
      "src": "/fact-sheet/gsla/04.webp",
      "caption": "Members gather by lantern light in Biu for their long-awaited share-out meeting"
    },
    {
      "src": "/fact-sheet/gsla/05.webp",
      "caption": "A GSLA facilitator in Anka taking records"
    },
    {
      "src": "/fact-sheet/gsla/06.webp",
      "caption": "GSLA members in Zamfara: Gusau 100, Talata Mafara 90, Tsafe 87, Anka 79"
    },
    {
      "src": "/fact-sheet/gsla/07.webp",
      "caption": "Members checking their savings during a weekly meeting"
    },
    {
      "src": "/fact-sheet/gsla/08.webp",
      "caption": "GSLA groups formed in 11 communities in Biu, including Kasalabata IDP camp"
    },
    {
      "src": "/fact-sheet/gsla/09.webp",
      "caption": "Baba Amina starting a business after receiving his savings"
    },
    {
      "src": "/fact-sheet/gsla/10.webp",
      "caption": "Opening the savings box at the first meeting of the year"
    },
    {
      "src": "/fact-sheet/gsla/11.webp",
      "caption": "Members checking their savings during a meeting"
    },
    {
      "src": "/fact-sheet/gsla/12.webp",
      "caption": "Five-day training and orientation for the GSLA group in Anka: budgeting, saving and investment"
    },
    {
      "src": "/fact-sheet/gsla/13.webp",
      "caption": "The GSLA share-out process"
    },
    {
      "src": "/fact-sheet/gsla/14.webp",
      "caption": "Men and women at the end-of-year GSLA meeting in Buriya community"
    },
    {
      "src": "/fact-sheet/gsla/15.webp",
      "caption": "Alheri Daga Allah group at the five-day GSLA training"
    },
    {
      "src": "/fact-sheet/gsla/16.webp",
      "caption": "Share-out with LHI staff for members in Yobe, Zamfara and Biu"
    },
    {
      "src": "/fact-sheet/gsla/17.webp",
      "caption": "Meeting community leaders to introduce the project and its benefits for women"
    },
    {
      "src": "/fact-sheet/gsla/18.webp",
      "caption": "The savings box with three locks, each key held by a different member"
    }
  ],
};

export const AGRIC_ASSESSMENT = {
  title: "Agric-Led Livelihood Needs Assessment",
  where: "Kware and Wamakko LGAs, Sokoto State",
  when: "March 2026",
  pdf: "/documents/agric-livelihood-needs-assessment-2026.pdf",
  cover: "/fact-sheet/agric-assessment-cover.webp",
  story: "/blog/agric-livelihood-needs-assessment-kware-wamakko",
  households: 120,
  farming: [
    { label: "Kware: households engaged in farming", pct: 82 },
    { label: "Wamakko: households engaged in farming", pct: 85 },
  ],
  householdSize: { kware: 8, wamakko: 9 },
  incomeFromAgriculture: "70–80%",
  farmSize: "1–3 ha",
  recommendations: [
    "Improved irrigation for year-round farming",
    "Farmer cooperatives for collective bargaining",
    "Climate-smart agriculture and stronger extension services",
    "Value-chain development: processing and branding",
    "Microfinance for smallholders and women",
    "Rural roads, storage and youth-focused agribusiness",
  ],
};
