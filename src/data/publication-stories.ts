import { LHI_PHOTOS } from "@/data/lhi-photos";
import type { CmsPost } from "@/lib/cms/types";

/**
 * Stories and updates from three LHI publications:
 * - "Empowering Communities Through Innovation, Skills & Livelihood Support",
 *   Project Magazine Vol. 2 (Gidan Arziki, FCDO/WFP project, April 2026)
 * - "Learning for a Brighter Future", ABEP Project Magazine (EU/UNICEF, Feb–May 2026)
 * - The LHI Newsletter ("Strengthening Resilience, Restoring Dignity, Transforming Lives")
 * Seeded as CMS posts; editable in Admin → Posts.
 */

export const GIDAN_ARZIKI_PDF = "/documents/gidan-arziki-magazine-vol-2.pdf";
export const ABEP_PDF = "/documents/abep-project-magazine.pdf";
export const NEWSLETTER_PDF = "/documents/lhi-newsletter-2025.pdf";
export const ANNUAL_REPORT_2024_PDF = "/documents/lhi-annual-report-2024.pdf";
export const GSLA_REPORT_PDF = "/documents/gsla-data-report-2024.pdf";
export const AGRIC_ASSESSMENT_PDF = "/documents/agric-livelihood-needs-assessment-2026.pdf";

const FEEDBACK = `For feedback, suggestions, appreciation or complaints, WhatsApp or SMS **0201 330 9033** or email feedback@lhinigeria.org.`;

const base = {
  author: "LHI Communications",
  authorId: "",
  status: "published" as const,
  featured: false,
};

export const PUBLICATION_POSTS: CmsPost[] = [
  /* ------------------------------------------------ Gidan Arziki, Vol. 2 */
  {
    ...base,
    id: "mag-gidan-arziki-vol-2",
    slug: "gidan-arziki-magazine-vol-2",
    title: "Empowering Communities Through Innovation, Skills & Livelihood Support (Magazine Vol. 2)",
    category: "Magazine",
    date: "2026-05-15",
    featuredImage: LHI_PHOTOS.gidanArzikiTailoring.src,
    featured: true,
    tags: ["FCDO", "WFP", "Gidan Arziki", "Katsina", "Batagarawa"],
    excerpt:
      "The Gidan Arziki Impact Magazine: how the Farmers Service Hub in Batagarawa, Katsina State, became a community enterprise centre for women, youths and smallholder farmers.",
    updatedAt: "2026-05-15",
    content: `Welcome to the **Gidan Arziki Impact Magazine**, a special feature on the FCDO-funded Resilience Building and Smallholder Farmers Support Project, implemented by Life Helpers Initiative and the World Food Programme. It captures the transformation unfolding through the Gidan Arziki centre in Batagarawa, Katsina State, from commissioning to full operation.

[Download the full magazine (PDF)](${GIDAN_ARZIKI_PDF})

## Leadership lens

> "The journey goes beyond infrastructure and statistics; it is about restoring dignity, building confidence, and creating sustainable opportunities for individuals and families."
>
> Hannah Kidzi, Gidan Arziki Facility Manager (LHI)

Youths are acquiring vocational and tailoring skills, smallholder farmers are accessing improved processing services that reduce post-harvest losses, and community members are benefiting from affordable services that support their daily livelihoods.

## The big picture

The Gidan Arziki centre in Batagarawa LGA was commissioned on **27 April 2026** by the Deputy Governor of Katsina State, **Faruk Lawal Jobe**, representing the Executive Governor. He described it as a transformative initiative with the potential to strengthen livelihoods and empower women and youths across the state. The ceremony included facility inspections, interactions with beneficiaries and a ceremonial tree planting. Stakeholders advocated for similar centres in other LGAs of Katsina State.

## Built in four weeks, governed by the community

The Batagarawa Farmer Service Centre is the **second major agricultural hub** under the FCDO-funded project in Northwest Nigeria, replicating the success of the Wamakko model. Construction reached **100% completion within four weeks**, and by April the facility was fully operational.

A **Facility Management Committee** of **20 members (12 male, 8 female)** was established even before construction finished, and selected farming equipment was formally handed over to the committee lead.

**Services:** core agricultural services, agro-processing, extension and advisory services, a meeting room, farm equipment and mechanisation, tool rental, cold room, car wash and a charging dock.

## Facility operations

- **Agro-processing:** a busy grinding section and a groundnut oil extraction section producing groundnut oil and *kuli-kuli*. Women were trained on modern equipment, hygiene, and product branding and packaging. A new groundnut grinding machine was added.
- **Cold room:** water chilling and ice block production, plus *fura da nono*, a locally consumed dairy product.
- **Charging station:** additional equipment procured; popular with youths for affordable, safe charging.
- **Business incubation:** sewing lessons (**30 trainees**), paid use of sewing machines by tailors without equipment, and the sewing and sale of hijabs, veils and bedsheets.
- **Car wash and tool rental:** fully operational, creating income opportunities for youths.

## Data digest: April 2026

| Revenue by unit | Amount (₦) |
|---|---|
| Cold room | 457,985 |
| Processing centre | 237,210 |
| Charging station | 151,000 |
| Car wash | 76,860 |
| Business incubation | 38,100 |
| Tool rentals | 11,200 |

**Total income ₦1,075,365 · total expenditure ₦588,370 · profit ₦486,995.**

## Voices of change

- [Finding purpose at 70: Arajana Suleiman](/blog/arajana-finding-purpose-at-70)
- [Voices from Batagarawa: leaders on the Gidan Arziki hub](/blog/voices-from-batagarawa-gidan-arziki)
- [A modern slaughterhouse for Batagarawa](/blog/modern-slaughterhouse-batagarawa)

## Also in this issue

The NIDAKE reusable sanitary pad (Goshen Development Centre, Tamaje Bye Pass, Sokoto) and **WeSpeak (Muyi Magana)**, LHI's weekly radio programme on Radio Nigeria Royal FM 101.5.

${FEEDBACK}`,
  },
  {
    ...base,
    id: "news-gidan-arziki-commissioned",
    slug: "gidan-arziki-hub-commissioned-batagarawa",
    title: "Katsina Deputy Governor Commissions the Gidan Arziki Farmers Service Hub in Batagarawa",
    category: "News",
    date: "2026-04-27",
    featuredImage: LHI_PHOTOS.gidanArzikiAerial.src,
    tags: ["FCDO", "WFP", "Katsina", "Gidan Arziki"],
    excerpt:
      "On 27 April 2026, Deputy Governor Faruk Lawal Jobe commissioned the Gidan Arziki centre, the second farmers service hub under the FCDO-funded resilience project.",
    updatedAt: "2026-04-27",
    content: `The Gidan Arziki Center in Batagarawa Local Government Area of Katsina State was commissioned on **27 April 2026**. The ceremony attracted dignitaries from the state government, development partners, community leaders and stakeholders committed to sustainable livelihood development.

Representing the Executive Governor, the Deputy Governor, **Faruk Lawal Jobe**, officially commissioned the centre and applauded the collaborative efforts of **WFP, FCDO and LHI** in establishing a facility capable of creating lasting social and economic impact.

During the inspection tour he expressed satisfaction with the vocational training unit, the agro-processing activities and the overall quality of the centre, and commended the initiative for equipping young women with practical, income-generating skills. The event also featured interactions with beneficiaries and a ceremonial tree planting.

The commissioning strengthened community trust and government ownership, and stakeholders advocated for similar centres in other LGAs across Katsina State.

Read more in the [Gidan Arziki Impact Magazine](/blog/gidan-arziki-magazine-vol-2).`,
  },
  {
    ...base,
    id: "story-arajana",
    slug: "arajana-finding-purpose-at-70",
    title: "Finding Purpose at 70: Arajana Suleiman",
    category: "Success Stories",
    date: "2026-05-14",
    featuredImage: LHI_PHOTOS.arajana.src,
    tags: ["WFP", "Katsina", "Gidan Arziki", "Older people"],
    excerpt:
      "Insecurity had cut a 70-year-old mother of eight off from her farmland. At the Gidan Arziki centre she found safe work, income, new skills and better health.",
    updatedAt: "2026-05-14",
    content: `At 70 years old, **Arajana Suleiman**, a mother of eight from Batagarawa community, never expected to regain a strong sense of purpose. Through the community agricultural centre implemented by the World Food Programme and Life Helpers Initiative, she has found renewed meaning in daily life.

> "Coming here every morning gives me hope and makes me feel healthy."

Insecurity had limited her access to her farmland, but the centre provided a safe environment where she can work, earn an income, learn new skills and connect with others.

Before joining, Arajana struggled with stress and high blood pressure. She now reports improved wellbeing, supported by a consistent routine and social engagement.

> "Being around people every morning and having something to look forward to makes me happy."

Labour-saving equipment has also transformed production, reducing time and effort.

> "Before, the process was very tedious. Now with the machine, we finish in minutes."

*From the [Gidan Arziki Impact Magazine, Vol. 2](/blog/gidan-arziki-magazine-vol-2).*`,
  },
  {
    ...base,
    id: "news-voices-batagarawa",
    slug: "voices-from-batagarawa-gidan-arziki",
    title: "Voices from Batagarawa: Government and Community Leaders on the Gidan Arziki Hub",
    category: "News",
    date: "2026-05-12",
    featuredImage: LHI_PHOTOS.batagarawaLeader.src,
    tags: ["Katsina", "Gidan Arziki", "Government"],
    excerpt:
      "The Katsina State Irrigation Development Authority, the District Head of Batagarawa and the LGA Chairman describe what the partnership is changing.",
    updatedAt: "2026-05-12",
    content: `## "Government alone cannot reach every community"

For **Engr. Salim Suleiman**, Managing Director of the Katsina State Irrigation Development Authority (KSIDA), the partnership between LHI and government institutions is yielding visible results. Farmers have received improved seeds, fertilizers, water pumping machines and access to farm support centres that provide continuous technical assistance.

> "Life Helpers Initiative has helped us a lot in supporting farmers, especially in the local government areas. They have done very well in complementing government efforts because government alone cannot reach every community."
>
> "We all know that farmers in rural areas are the backbone of the economy. Life Helpers and WFP have done a lot, and we hope to see more of their work going forward."

## "It has brought joy and ease to our people"

**Alhaji Hassan Isa Batagarawa**, District Head (Magaji of Batagarawa), says the multi-purpose centre offers affordable services and reliable 24-hour electricity. Women have easier access to milling and processing, reducing waiting time and physical strain.

> "Our women can go there without stress, process what they need, and return home quickly."

Cash assistance has enabled residents to start small businesses and build savings, while car-wash services and other activities are engaging youths and reducing idleness.

## Commitment from the local government

The Chairman of Batagarawa Local Government Area reaffirmed the LGA's commitment to sustained collaboration, noting that agriculture remains a key priority for the Katsina State Government. He observed that turning a piece of land into a productive, well-developed site within a short period reflects tangible growth, thanked FCDO, LHI and WFP, and expressed hope that similar interventions will be expanded across the state.

*From the [Gidan Arziki Impact Magazine, Vol. 2](/blog/gidan-arziki-magazine-vol-2).*`,
  },
  {
    ...base,
    id: "news-slaughterhouse-batagarawa",
    slug: "modern-slaughterhouse-batagarawa",
    title: "A Modern Slaughterhouse Enhances Hygiene and Community Wellbeing in Batagarawa",
    category: "News",
    date: "2026-05-10",
    featuredImage: LHI_PHOTOS.gidanArzikiGarden.src,
    tags: ["Katsina", "Public health", "Gidan Arziki"],
    excerpt:
      "Reconstructed beside the Gidan Arziki hub, the slaughterhouse replaces informal slaughtering with a safe, hygienic and well-regulated facility.",
    updatedAt: "2026-05-10",
    content: `As part of LHI's commitment to strengthening community infrastructure and public health, a modern slaughterhouse was reconstructed beside the Gidan Arziki Farmers Service Hub to serve Batagarawa and surrounding communities.

The facility provides a safe, hygienic and well-regulated environment for meat processing during celebrations, cultural events and everyday use. It features **proper drainage, washable surfaces and clearly designated processing areas** that support sanitation and food safety.

Community members have embraced the facility during social gatherings and festive periods. Local leaders describe it as a timely and practical addition to the hub that brings dignity to food preparation while reducing environmental waste and contamination.

*From the [Gidan Arziki Impact Magazine, Vol. 2](/blog/gidan-arziki-magazine-vol-2).*`,
  },

  /* ------------------------------------------------------------- ABEP */
  {
    ...base,
    id: "mag-abep-learning-brighter-future",
    slug: "abep-magazine-learning-for-a-brighter-future",
    title: "Learning for a Brighter Future: ABEP Project Magazine",
    category: "Magazine",
    date: "2026-06-15",
    featuredImage: LHI_PHOTOS.abepLearnersCelebrate.src,
    featured: true,
    tags: ["EU", "UNICEF", "Education", "Sokoto", "ABEP"],
    excerpt:
      "The first quarter of the EU/UNICEF Accelerated Basic Education Programme in six LGAs of Sokoto State: 3,255 out-of-school children enrolled, 105 facilitators and 164 CBMC members trained.",
    updatedAt: "2026-06-15",
    content: `The **Accelerated Basic Education Programme (ABEP)** expands access to quality learning for out-of-school and over-aged children. It is implemented by Life Helpers Initiative with funding from the **European Union through UNICEF**, in six LGAs of Sokoto State: **Goronyo, Rabah, Tambuwal, Tangaza, Tureta and Wurno**. This edition covers the first quarter of implementation, **February to May 2026**.

[Download the full magazine (PDF)](${ABEP_PDF})

## Message from LHI

> "Education cannot wait. The progress achieved demonstrates what is possible when communities and development partners work together toward a common goal: ensuring that every child has the opportunity to learn."
>
> Isa Usman, Project Lead (LHI)

## Building a strong foundation

Before roll-out, LHI engaged the Ministry of Education, the State Agency for Mass Education (SAME), the Sokoto State Universal Basic Education Board (SUBEB), local government authorities, traditional and religious leaders and Community-Based Management Committees to align priorities and clarify roles.

## Q1 performance at a glance

| Indicator | Q1 target | Achieved | % |
|---|---|---|---|
| Facilitators and LGA officers trained | 105 | 105 (79 M / 26 F) | 100% |
| CBMC members trained | 164 | 164 (124 M / 40 F) | 100% |
| Out-of-school children enrolled | 3,083 | 3,255 (1,410 M / 1,845 F) | 105.6% |
| Children with disabilities enrolled | – | 44 (16 M / 28 F) | – |
| Children who received teaching and learning materials | 3,083 | 3,255 | 105.6% |

### Learner enrolment by LGA

| LGA | Male | Female | Total |
|---|---|---|---|
| Goronyo | 240 | 318 | 558 |
| Rabah | 190 | 368 | 558 |
| Tambuwal | 297 | 168 | 465 |
| Tangaza | 229 | 329 | 558 |
| Tureta | 220 | 338 | 558 |
| Wurno | 234 | 324 | 558 |
| **Total** | **1,410** | **1,845** | **3,255** |

Learning takes place in **35 learning centres**.

## Ready to respond: the crisis modifier

ABEP includes a **crisis modifier**, a rapid-response mechanism to keep children learning during displacement, violence or natural disasters. No emergency was triggered this quarter, so the team focused on preparedness: **315 radio facilitators identified**, a three-day interactive radio learning curriculum designed and monthly review meetings planned. Annual targets include 5,819 learners reached through emergency radio and 924 children mainstreamed into formal schools.

> "We are not waiting for a crisis to act. Our systems are ready to switch on the moment children need remote learning."

## Strengthening accountability

Quarterly joint supportive supervision brings together the Ministry of Basic and Secondary Education, SAME, SUBEB, UNICEF desk officers, LGA scheme organisers and CBMCs. Facilitators share experiences and solutions at bi-monthly review meetings.

## Stories in this issue

- [Official launch in Tambuwal](/blog/abep-launched-in-tambuwal)
- [From wheelbarrow to classroom: Nasiru Umar](/blog/nasiru-from-wheelbarrow-to-classroom)
- [A bag, a dream: Saudatu Aliyu](/blog/saudatu-a-bag-a-dream)
- [105 facilitators trained](/blog/abep-105-facilitators-trained)
- [The impact beyond the classroom](/blog/abep-impact-beyond-the-classroom)

${FEEDBACK}`,
  },
  {
    ...base,
    id: "news-abep-launch",
    slug: "abep-launched-in-tambuwal",
    title: "Accelerated Basic Education Programme Launched in Tambuwal, Sokoto State",
    category: "News",
    date: "2026-04-21",
    featuredImage: LHI_PHOTOS.abepGirls.src,
    tags: ["EU", "UNICEF", "Education", "Sokoto", "ABEP"],
    excerpt:
      "The EU/UNICEF-funded ABEP was flagged off on 21 April 2026 at Makarantar Malam Bala Liman Salah Centre, Tambuwal LGA, starting learning across 35 centres.",
    updatedAt: "2026-04-21",
    content: `The Accelerated Basic Education Programme was officially launched on **21 April 2026** at the Makarantar Malam Bala Liman Salah Centre in **Tambuwal LGA**, Sokoto State.

The event was led by the Permanent Secretary of the Ministry of Basic and Secondary Education, representing the Honourable Commissioner, and brought together government officials, education stakeholders, community leaders, facilitators, learners, development partners and the media.

The Permanent Secretary commended the **European Union and UNICEF** for their support and praised Life Helpers Initiative for its technical support and the distribution of teaching and learning materials, emphasising that ABEP gives a second chance to thousands of children denied education by poverty, displacement or cultural barriers. The UNICEF desk officer noted that ABEP "is about building a future for Sokoto State," and community leaders pledged their full support.

The flag-off marked the start of learning in all **35 ABEP centres**, with a symbolic distribution of learning materials to the first cohort of learners.

Read more in the [ABEP Project Magazine](/blog/abep-magazine-learning-for-a-brighter-future).`,
  },
  {
    ...base,
    id: "story-nasiru",
    slug: "nasiru-from-wheelbarrow-to-classroom",
    title: "From Wheelbarrow to Classroom: Nasiru Umar",
    category: "Success Stories",
    date: "2026-06-12",
    featuredImage: LHI_PHOTOS.nasiru.src,
    tags: ["Education", "ABEP", "Sokoto", "EU", "UNICEF"],
    excerpt:
      "After losing his father, Nasiru left school to push wheelbarrows in the market. At 18, ABEP has given him the chance to learn again.",
    updatedAt: "2026-06-12",
    content: `**Nasiru Umar** is 18, the fourth of six children from Gaulaumbe in Kebbi State. His father, a farmer, died when Nasiru was young, and his mother raised goats and sheep to feed the family. Determined to help, Nasiru dropped out of primary school and pushed wheelbarrows in the market, carrying heavy loads for customers.

> "We ate rice only occasionally."

Three years ago he moved to Sokoto State, where his uncle enrolled him at Mohammed Kofar Gwandu Arabic School in Wamakko LGA. After Islamic school he still returns to the market to earn money for food.

When his Malam heard about the EU and UNICEF-funded Accelerated Basic Education Programme, he registered Nasiru, and that moment gave him hope.

> "Ilmi shi ne makamin rayuwa." (Education is the weapon of life.)

Today Nasiru balances study and work, carrying both loads and dreams. His journey shows that with opportunity, even children burdened by hardship can build a brighter future.

*With funding from EU Civil Protection & Humanitarian Aid in partnership with UNICEF, MOBSE, SAME and SUBEB. From the [ABEP Project Magazine](/blog/abep-magazine-learning-for-a-brighter-future).*`,
  },
  {
    ...base,
    id: "story-saudatu",
    slug: "saudatu-a-bag-a-dream",
    title: "A Bag, A Dream: Saudatu Aliyu",
    category: "Success Stories",
    date: "2026-06-11",
    featuredImage: LHI_PHOTOS.saudatu.src,
    tags: ["Education", "Girls", "ABEP", "Sokoto"],
    excerpt:
      "Fourteen-year-old Saudatu begged her father to let her attend a learning centre. Now she walks to class with her school bag and a dream of becoming a doctor.",
    updatedAt: "2026-06-11",
    content: `**Saudatu Aliyu** is 14, the second of seven children in a family from Wurno LGA, Sokoto State. Until recently only her eldest sibling had attended school. She spent her days helping at the market and learning a few words from her brother.

When she heard about the non-formal learning centre, she pleaded with her father:

> "Baba, it is free."

Inspired by the doctors she had seen healing sick children, Saudatu wants to become a doctor. The first days were hard as she struggled with reading and writing, but her determination never wavered. She cherishes her school bag, a symbol of belonging.

> "Ilmi da karatu yana daɗi." (Education is sweet.)

Saudatu believes girls should not be limited to selling foodstuffs or staying at home, and calls on parents to send their daughters to school.

> "Ilmi shi ne hasken rayuwa." (Education is the light of life.)

*Made possible by EU Civil Protection & Humanitarian Aid in partnership with UNICEF, MOBSE, SAME, SUBEB and LHI. From the [ABEP Project Magazine](/blog/abep-magazine-learning-for-a-brighter-future).*`,
  },
  {
    ...base,
    id: "news-abep-facilitators",
    slug: "abep-105-facilitators-trained",
    title: "105 Facilitators and 164 Committee Members Trained to Deliver Quality Learning",
    category: "News",
    date: "2026-04-10",
    featuredImage: LHI_PHOTOS.abepFacilitatorTraining.src,
    tags: ["Education", "ABEP", "Capacity building"],
    excerpt:
      "More than 680 people applied to become ABEP facilitators. After a three-day workshop, average knowledge scores rose from 35% to 65%.",
    updatedAt: "2026-04-10",
    content: `A competitive recruitment attracted **more than 680 applicants** from across Sokoto State. **105 facilitators** were selected and deployed across the six participating LGAs.

A three-day workshop covered the ABEP curriculum, learner-centred teaching, classroom management, child safeguarding, learner assessment and digital enrolment and reporting systems. Average knowledge scores rose from **35% before training to 65% after**.

Community ownership is just as central. **164 members of Community-Based Management Committees** were trained in community mobilisation, behaviour change communication, child protection, learner retention and local advocacy, and regular review meetings let leaders assess progress and develop local solutions.

*From the [ABEP Project Magazine](/blog/abep-magazine-learning-for-a-brighter-future).*`,
  },
  {
    ...base,
    id: "story-dogon-daji",
    slug: "abep-impact-beyond-the-classroom",
    title: "The Impact Beyond the Classroom: A Village Head's View",
    category: "Success Stories",
    date: "2026-06-10",
    featuredImage: LHI_PHOTOS.dogonDajiVillageHead.src,
    tags: ["Education", "ABEP", "Community"],
    excerpt:
      "In Dogon Daji, Tambuwal LGA, children without school bags still come to class every day, and parents are now asking for adult learning.",
    updatedAt: "2026-06-10",
    content: `For **Alhaji Rufai Maccido Salah**, village head of Dogon Daji in Tambuwal LGA, ABEP is transforming the mindset of an entire community.

> "When this programme started, we were hopeful, but today we are witnessing something truly remarkable. The children are excited about learning, eager to attend classes, and proud to be part of the programme. What touches me most is that even children who did not receive school bags still come to class every day because they genuinely want to learn."

Older out-of-school children are now seeking enrolment, and parents are requesting adult learning programmes after seeing the change in their children.

> "I regularly visit the centres and can see the difference for myself. What may appear small to others has brought significant change to our community. We are grateful to the European Union, UNICEF, Life Helpers Initiative, and the Sokoto State Government for giving our children hope, confidence, and a brighter future."

*From the [ABEP Project Magazine](/blog/abep-magazine-learning-for-a-brighter-future).*`,
  },


  /* ------------------------------------------- Healing Homes (MIRP, Zamfara) */
  {
    ...base,
    id: "mag-healing-homes",
    slug: "healing-homes-zamfara-resilience",
    title: "Healing Homes: Rebuilding Family Life in Six Zamfara Communities",
    category: "Magazine",
    date: "2026-06-20",
    featuredImage: LHI_PHOTOS.dignityKitHandover.src,
    featured: true,
    tags: ["UNICEF", "FCDO", "Zamfara", "Child protection", "Positive parenting"],
    excerpt:
      "How the UNICEF and UK aid-funded Multi-Sectoral Integrated Resilience Programme is helping parents and caregivers in six LGAs of Zamfara State talk, listen and rebuild family life.",
    updatedAt: "2026-06-20",
    content: `**Healing Homes** tells the story of the Multi-Sectoral Integrated Resilience Programme in Zamfara State, implemented by Life Helpers Initiative with funding from **UNICEF and the UK Foreign, Commonwealth & Development Office (FCDO / UK aid)**.

> "Every story here happened on a mat, under a tree, in a borrowed room. None of it required a generator, a new building, or a budget line for bricks."

## Why a family-resilience programme

Zamfara State has experienced sustained insecurity and displacement; several activities took place inside IDP camps, including **Gidan Gona IDP Camp in Shinkafi LGA** and a camp in Zurmi LGA. Caregivers under stress are more likely to rely on harsh discipline, adolescents lack safe spaces, and children without birth certificates remain invisible to protective systems.

The programme covers **Bakura, Birnin Magaji, Bungudu, Shinkafi, Tsafe and Zurmi** LGAs.

## By the numbers

| Activity | Result |
|---|---|
| Positive Parenting Session 1 (19–25 April 2026) | 597 caregivers (151 M / 446 F) |
| Positive Parenting Sessions 3–6 (6–31 May 2026) | 608 caregivers (136 M / 472 F) |
| Community facilitators and caseworkers trained | 25 |
| Baseline pre-assessment respondents | 554 (71.3% the child's biological mother) |
| Reflective Dialogues on GBV and child protection | 4, around 40 leaders each |
| Dignity kit distributions (March 2026) | Zurmi, Shinkafi, Bakura, Birnin Magaji |

Session 1 attendance was remarkably even across the six LGAs (97–101 caregivers each), and sessions continued even after a security scare in Birnin Magaji.

## Six ways the programme showed up

1. **Adolescent life skills:** gender and sex roles, protection from sexual exploitation and abuse, STI awareness and the risks of psychoactive substances (35–41 adolescents per sitting).
2. **Child-Friendly Spaces:** storytelling on honesty, hygiene and peaceful conflict resolution (16–22 children per sitting).
3. **Reflective Dialogue:** traditional and religious leaders on GBV and shared responsibility for child protection, including a session at the **Emir's Palace, Tsafe**.
4. **Positive Parenting:** caring family bonds, feelings, problem-solving and managing conflict without violence.
5. **Birth registration and CB-CPCs:** a registration officers' review at the Women & Children Welfare Clinic, Tsafe, and CB-CPC orientation and review meetings in five LGAs.
6. **Dignity and inclusion:** dignity kits with deliberate outreach to persons with disabilities; the **Zurmi LGA Chairman** personally took part in the handover, and a Chief Imam joined LHI staff in Birnin Magaji.

## What the field taught us

Participatory methods (discussion, storytelling, role-play) drove strong attendance, and training local facilitators kept sessions running through insecurity. Father participation remains low (22–26% of attendees), so the next phase will design outreach specifically for fathers, add modules on stress management and communication, and measure behaviour change at home, not only attendance.

[See the project dossier](/interventions/fcdo-unicef-mirp)`,
  },

  /* ---------------------------------------------------- GSLA (SIF / ZOA) */
  {
    ...base,
    id: "story-gsla-small-steps",
    slug: "gsla-small-steps-big-impact",
    title: "Small Steps, Big Impact: Group Savings Groups in Zamfara, Borno and Yobe",
    category: "Success Stories",
    date: "2024-04-30",
    featuredImage: LHI_PHOTOS.gslaShareOut.src,
    tags: ["GSLA", "SIF", "ZOA", "Zamfara", "Yobe", "Borno"],
    excerpt:
      "From a three-lock savings box to start-up capital: how Group Savings and Loan Associations supported by Secours Islamique France and ZOA are turning savings into businesses.",
    updatedAt: "2024-04-30",
    content: `> "The most difficult thing is your decision to act, the rest is merely tenacity."

That is why LHI acted through a sustainable project, **Group Savings and Loan Associations (GSLA)**, so that women and men can build themselves up financially. With support from **Secours Islamique France (SIF)** and **ZOA**, groups in **Zamfara, Biu (Borno) and Yobe** are turning money, "a terrible master", into an excellent servant.

[Download the GSLA data report (PDF)](${GSLA_REPORT_PDF})

## How a group works

- **Five days of training and orientation** on budgeting, saving and prudent investment before a group starts.
- **Weekly meetings** where members buy shares, contribute to a social fund and review their savings.
- **A savings box with three locks**, each key held by a different member, so no one person controls the money.
- **Share-out** at the end of the cycle, when each member receives their savings and earnings.

## Members in Zamfara

| LGA | Members |
|---|---|
| Gusau | 100 |
| Talata Mafara | 90 |
| Tsafe | 87 |
| Anka | 79 |

In Biu, groups were formed in 11 communities, including Bayan Tasha, Dashu, Pompomari, Shememwada and **Kasalabata IDP camp**. In Yobe, members enrolled in Damaturu and Potiskum.

## What share-out made possible

- **Malama Halima** took her share-out to the market.
- **Aliyu**, a farmer, invested his in his farm.
- **Baba Amina** started a business after receiving his savings.
- **Malama Amina**, a businesswoman, used her share-out as start-up capital.

Savings knows no age: older members saved alongside young people, and in Buriya community men and women met together for their end-of-year meeting.

[See the project dossier](/interventions/sif-zoa-gsla-financial-empowerment)`,
  },

  /* ------------------------------------------------------ IHP (Ebonyi) */
  {
    ...base,
    id: "news-ihp-mentoring",
    slug: "ihp-mentoring-frontline-health-workers",
    title: "Mentoring Frontline Health Workers Under the Integrated Health Program",
    category: "News",
    date: "2024-06-15",
    featuredImage: LHI_PHOTOS.ihpWeighing.src,
    tags: ["Health", "IHP", "Ebonyi", "Child health", "Nutrition"],
    excerpt:
      "Onsite training and mentoring in child health, immunisation, malaria testing and nutrition counselling for health workers in primary health centres.",
    updatedAt: "2024-06-15",
    content: `Under the **Integrated Health Program (IHP)**, LHI's trainers used the low-dose, high-frequency approach: short training followed by onsite mentoring in the health facilities where providers work every day.

Scenes from the mentoring visits include:

- Participants reviewing the **IMCI chart** at Chidera Clinic Maternity, Amechi Okposi.
- A mentee **weighing a nine-month-old baby** at Okaria MDGs PHC and counselling the mother on why her baby was classified as underweight.
- Trainees checking **vaccine expiry dates and vaccine vial monitors** and documenting vaccines at PHC Onicha.
- Trainees performing **malaria rapid diagnostic tests** while completing the sick child recording form.
- Counselling an HIV-positive mother with pictures showing how ARVs prevent mother-to-child transmission.
- **Role play on exclusive breastfeeding** and counselling on complementary feeding at UG Clinic Maternity.
- Community-based health volunteers on **house-to-house visits**, and women tasting food at a nutrition demonstration.
- Pre- and post-tests on nutrition at Chidera Clinic, Onicha and Ndiunuhu health centres, and an MNP orientation for trainers in Ohaozara LGA.

Across the programme, more than 3,200 health providers were trained across 712 PHCs and communities in Bauchi, Ebonyi, Kebbi and Sokoto States.

[See the project dossier](/interventions/palladium-ihp-child-health)`,
  },

  /* ------------------------------------------- Agric-led livelihood (2026) */
  {
    ...base,
    id: "news-agric-needs-assessment",
    slug: "agric-livelihood-needs-assessment-kware-wamakko",
    title: "Needs Assessment: Agric-Led Livelihoods in Kware and Wamakko",
    category: "News",
    date: "2026-03-31",
    featuredImage: LHI_PHOTOS.cabbageFieldGroup.src,
    tags: ["Agriculture", "Livelihoods", "Sokoto", "Research"],
    excerpt:
      "A March 2026 assessment of 120 households in Kware and Wamakko LGAs found agriculture provides 70–80% of household income but is held back by limited inputs, irrigation, markets and finance.",
    updatedAt: "2026-03-31",
    content: `LHI's project team carried out a needs assessment in **Kware and Wamakko LGAs, Sokoto State**, in March 2026, to shape an agric-led livelihood project.

[Download the report (PDF)](${AGRIC_ASSESSMENT_PDF})

## How it was done

Household surveys, focus group discussions and key informant interviews with **120 households (60 per LGA)**, community leaders, extension agents and market actors.

## What we found

| Indicator | Kware | Wamakko |
|---|---|---|
| Average household size | 8 | 9 |
| Households engaged in farming | 82% | 85% |

- Agriculture provides **70–80% of household income**; farms are mostly 1–3 hectares and rain-fed.
- Staples are millet, sorghum, maize, cowpea and groundnut, with goats, sheep and poultry.
- Middlemen dominate pricing, and poor roads and storage reduce profits. Women process and sell products but struggle to scale.
- Farmers asked for training in pest and disease management, soil fertility, post-harvest handling and financial literacy.
- Risks include erratic rainfall and dry spells, striga weed and locusts, costly credit, seasonal youth migration, and women's limited access to land and finance.

## Recommendations

Improved irrigation for year-round farming; farmer cooperatives for collective bargaining; climate-smart agriculture; stronger extension services; value-chain development (processing and branding); microfinance for smallholders and women; rural roads and storage; and youth-focused agribusiness programmes.`,
  },

  /* --------------------------------------------------- Annual Report 2024 */
  {
    ...base,
    id: "press-annual-report-2024",
    slug: "lhi-2024-annual-report",
    title: "Life Helpers Initiative 2024 Annual Report",
    category: "Press Release",
    date: "2025-06-30",
    featuredImage: LHI_PHOTOS.lhiFamily.src,
    tags: ["Annual report", "Accountability", "2024"],
    excerpt: "LHI's 2024 Annual Report covers our aim, vision, mission and values and our work in health, education, livelihood, gender and governance, and agriculture.",
    updatedAt: "2025-06-30",
    content: `The **Life Helpers Initiative 2024 Annual Report** is now available to download.

[Download the 2024 Annual Report (PDF)](${ANNUAL_REPORT_2024_PDF})

**Our aim:** to inspire every individual to reach for their goals and aspirations in life through wholesome living.

**Our vision:** a more fulfilled life for everyone.

**Our mission:** to be a leading non-governmental organisation working to maximise all opportunities to empower marginalised people.

**Our values (L.H.I.):** Love (a friendly atmosphere, kind gestures, togetherness), Honesty (openness, forthrightness, matching our words with our actions) and Inclusion (access to all, acceptance, opportunity for staff and clients).

The report is organised around our thematic areas (health, education, livelihood, gender and governance, and agriculture) with challenges, recommendations, lessons learnt and success stories.`,
  },

  /* --------------------------------------------------------- Newsletter */
  {
    ...base,
    id: "newsletter-2025",
    slug: "lhi-newsletter-strengthening-resilience",
    title: "LHI Newsletter: Strengthening Resilience, Restoring Dignity, Transforming Lives",
    category: "Newsletter",
    date: "2026-01-15",
    featuredImage: LHI_PHOTOS.vslaGroup.src,
    featured: true,
    tags: ["Newsletter", "2025"],
    excerpt:
      "Highlights of 2025: learning for displaced children in Goronyo, the FCT office's year, a new coordination drive with Sokoto SEMA, and stories of hope from Shagari and Zamfara.",
    updatedAt: "2026-01-15",
    content: `Life Helpers Initiative operates across eleven states in Nigeria, supporting populations affected by poverty, displacement, conflict and climate-related hardship with integrated programmes in health, education, livelihood, agriculture and gender equity.

[Download the newsletter (PDF)](${NEWSLETTER_PDF})

## In this edition

- [Opening doors to learning for displaced and out-of-school children in Sokoto](/blog/goronyo-learning-centres-2025)
- [FCT impact in 2025](/blog/fct-office-impact-2025)
- [The meeting that changed the response](/blog/sema-coordination-meeting-sokoto)
- [Hope restored through care in Shagari](/blog/hope-restored-through-care-shagari)
- [Azima: from early marriage to a future stitched with hope](/blog/azima-future-stitched-with-hope)
- Touching lives through agriculture: the [Noma Tushen Arziki hub](/blog/noma-tushen-arziki-farming-wealth-hub) in Wamakko

## Gender equity across every programme

Women, men, girls and boys are supported according to their specific needs. Women lead savings groups, farmer associations and community committees. Girls benefit from education support, hygiene promotion and protection awareness, while women access healthcare, livelihoods and financial inclusion. Community engagement addresses gender-based violence prevention, child protection and social inclusion.

## Economic stability and self-reliance

Through Village Savings and Loan Associations, women and men save regularly, access small loans and invest in petty trading, agro-processing and services. Cash-based transfers and cash-for-work provide short-term relief while contributing to sanitation and environmental improvement.

## WeSpeak (Muyi Magana)

LHI's weekly radio programme in Sokoto State covers health, education, livelihood, agriculture and gender equity, and gives communities space for questions, feedback and complaints. [Learn more](/blog/wespeak-muyi-magana-radio).`,
  },
  {
    ...base,
    id: "news-goronyo-nflc",
    slug: "goronyo-learning-centres-2025",
    title: "Opening Doors to Learning for Displaced and Out-of-School Children in Sokoto",
    category: "News",
    date: "2026-01-12",
    featuredImage: LHI_PHOTOS.abepLearningCentre.src,
    tags: ["Education", "Sokoto", "Goronyo", "Newsletter"],
    excerpt:
      "In 2025, non-formal learning centres in Goronyo IDP Camp and nearby communities helped more than a thousand children gain foundational literacy and numeracy.",
    updatedAt: "2026-01-12",
    content: `In 2025, Life Helpers Initiative strengthened access to education for out-of-school and displaced children across Sokoto State, with focused support in **Goronyo IDP Camp** and surrounding communities.

Through the establishment and support of **Non-Formal Learning Centres**, children who had missed years of schooling were given a second chance to learn in safe and supportive environments. **More than one thousand children** gained foundational literacy, numeracy and essential life skills.

With trained facilitators, community structures and government partners, many learners successfully transitioned into formal **Junior Secondary Schools**. Education-in-emergencies interventions also protected children from learning disruption during displacement and instability.

*From the [LHI Newsletter](/blog/lhi-newsletter-strengthening-resilience).*`,
  },
  {
    ...base,
    id: "news-fct-2025",
    slug: "fct-office-impact-2025",
    title: "LHI Strengthens Community Wellbeing in the FCT",
    category: "News",
    date: "2026-01-10",
    featuredImage: LHI_PHOTOS.fctTeam.src,
    tags: ["FCT", "Newsletter", "Advocacy"],
    excerpt:
      "In 2025 the FCT office held over 38 advocacy engagements with ministries and ran school health clubs, spelling competitions and GBV podcasts.",
    updatedAt: "2026-01-10",
    content: `In 2025, LHI's **FCT office** strengthened community wellbeing through health, education, gender and environmental initiatives.

- **Over 38 advocacy engagements** with key ministries expanded partnerships and visibility.
- **School Health Clubs** and **spelling competitions** improved literacy and hygiene awareness.
- **GBV podcasts and dialogues** promoted protection and inclusion.
- Engagement with traditional leaders and regular monitoring strengthened trust and laid the foundation for sustainable impact.

*From the [LHI Newsletter](/blog/lhi-newsletter-strengthening-resilience).*`,
  },
  {
    ...base,
    id: "news-sema-coordination",
    slug: "sema-coordination-meeting-sokoto",
    title: "The Meeting That Changed the Response: LHI and Sokoto SEMA",
    category: "News",
    date: "2026-01-08",
    featuredImage: LHI_PHOTOS.communityLeaders.src,
    tags: ["Emergency response", "Sokoto", "Newsletter"],
    excerpt:
      "LHI, the State Emergency Management Agency and the Ministry of Humanitarian Affairs pledged stronger coordination so aid reaches flood-affected families faster.",
    updatedAt: "2026-01-08",
    content: `For families like Aisha's in a flood-prone Sokoto village, past disasters meant waiting and desperation.

> "Help would come late, or not at all."

Poor coordination left her and her children without shelter or supplies for days. A renewed partnership between Life Helpers Initiative and the Sokoto State Government aims to end that.

At a high-level meeting, leaders from the **State Emergency Management Agency (SEMA)** and the **Ministry of Humanitarian Affairs** pledged to strengthen coordination so that aid, especially vital non-food items, reaches the most vulnerable quickly and with dignity. They committed to relaunch and improve the state's disaster response system.

Speaking for SEMA, Mallam Mustapha emphasised transparent communication and regular stakeholder meetings:

> "When we work as one, we save more lives."

For communities on Sokoto's climate frontline, this collaboration is a promise of security: a safety net designed so that no family is left behind when the next disaster strikes.

*From the [LHI Newsletter](/blog/lhi-newsletter-strengthening-resilience).*`,
  },
  {
    ...base,
    id: "story-ace3-shagari",
    slug: "hope-restored-through-care-shagari",
    title: "Hope Restored Through Care in Shagari",
    category: "Success Stories",
    date: "2026-01-06",
    featuredImage: LHI_PHOTOS.ace3Mother.src,
    tags: ["Health", "HIV", "ACE3", "Sokoto", "Newsletter"],
    excerpt:
      "A breastfeeding mother of twins learned her HIV status through community testing and was linked to care. Today the family is thriving.",
    updatedAt: "2026-01-06",
    content: `In **Shagari LGA** of Sokoto State, a young breastfeeding mother faced fear and uncertainty as her twin babies repeatedly fell ill.

The situation changed when Life Helpers Initiative, through **ACE3** programming, reached her community with testing, counselling and care services delivered with dignity and compassion. Through community-based testing she learned her HIV status and was immediately linked to care and treatment.

With continued support and follow-up, her health steadily improved, and her twins received the care they needed to grow stronger.

Today the family is thriving. The story reflects the power of timely intervention, community trust and compassionate care in restoring dignity and saving lives.

*From the [LHI Newsletter](/blog/lhi-newsletter-strengthening-resilience).*`,
  },
  {
    ...base,
    id: "story-azima",
    slug: "azima-future-stitched-with-hope",
    title: "From Early Marriage to a Future Stitched with Hope: Azima Bello",
    category: "Success Stories",
    date: "2026-01-05",
    featuredImage: LHI_PHOTOS.azima.src,
    tags: ["Child marriage", "UNICEF", "Zamfara", "Newsletter"],
    excerpt:
      "Forced into marriage at fifteen, Azima found a safe space, a voice and a trade through the UNICEF early child marriage project.",
    updatedAt: "2026-01-05",
    content: `**Azima Bello**'s childhood in Zamfara was defined by loss and struggle. Growing up without her mother and facing constant hunger, she was forced into marriage at fifteen. She returned to her family home broken and without hope.

A shift began when Life Helpers Initiative, through the **UNICEF Early Child Marriage Project**, created a safe space in her community. Alongside other girls with similar experiences, Azima began to heal and slowly found the courage to express herself again.

Central to her rebirth was **tailoring**. The training gave her a vocation and a purpose. She began to save diligently towards a powerful symbol of independence: her own sewing machine.

Today Azima is no longer defined as a child bride. She is a skilled apprentice, a diligent saver and a young woman becoming the author of her own life.

*From the [LHI Newsletter](/blog/lhi-newsletter-strengthening-resilience).*`,
  },
];

/** LHI publications, newest first, for the News & Updates and Success Stories pages. */
export const PUBLICATIONS = [
  {
    title: "Life Helpers Initiative 2024 Annual Report",
    kind: "Annual Report",
    period: "2024",
    description: "Our aim, vision, mission and values, and our work across LHI's thematic areas.",
    pdf: ANNUAL_REPORT_2024_PDF,
    post: "/blog/lhi-2024-annual-report",
    image: LHI_PHOTOS.lhiFamily,
  },
  {
    title: "Learning for a Brighter Future",
    kind: "ABEP Project Magazine",
    period: "February – May 2026",
    description: "The EU/UNICEF Accelerated Basic Education Programme in six LGAs of Sokoto State.",
    pdf: ABEP_PDF,
    post: "/blog/abep-magazine-learning-for-a-brighter-future",
    image: LHI_PHOTOS.abepLearnersCelebrate,
  },
  {
    title: "Empowering Communities Through Innovation, Skills & Livelihood Support",
    kind: "Project Magazine Vol. 2",
    period: "April 2026",
    description: "The Gidan Arziki Farmers Service Hub in Batagarawa, Katsina State (FCDO/WFP).",
    pdf: GIDAN_ARZIKI_PDF,
    post: "/blog/gidan-arziki-magazine-vol-2",
    image: LHI_PHOTOS.gidanArzikiTailoring,
  },
  {
    title: "Cultivating Resilience: A New Harvest in Northwest Nigeria",
    kind: "Project Magazine Vol. 1",
    period: "September 2025 – February 2026",
    description: "The FCDO/WFP Resilience Building and Smallholder Farmers Support Project in Sokoto and Katsina.",
    pdf: "/documents/cultivating-resilience-magazine-vol-1.pdf",
    post: "/blog/cultivating-resilience-magazine-vol-1",
    image: LHI_PHOTOS.farmerWomanHarvest,
  },
  {
    title: "Small Steps, Big Impact: GSLA's Journey to Financial Empowerment",
    kind: "Data report",
    period: "June 2023 – 2024",
    description: "Group Savings and Loan Associations in Zamfara, Biu and Yobe (SIF / ZOA).",
    pdf: GSLA_REPORT_PDF,
    post: "/blog/gsla-small-steps-big-impact",
    image: LHI_PHOTOS.gslaShareOut,
  },
  {
    title: "Agric-Led Livelihood Needs Assessment",
    kind: "Assessment report",
    period: "March 2026",
    description: "Farming, income, markets and risks in Kware and Wamakko LGAs, Sokoto State.",
    pdf: AGRIC_ASSESSMENT_PDF,
    post: "/blog/agric-livelihood-needs-assessment-kware-wamakko",
    image: LHI_PHOTOS.cabbageFieldGroup,
  },
  {
    title: "Strengthening Resilience, Restoring Dignity, Transforming Lives",
    kind: "LHI Newsletter",
    period: "2025 highlights",
    description: "Education in Goronyo, the FCT office's year, SEMA coordination and stories of hope.",
    pdf: NEWSLETTER_PDF,
    post: "/blog/lhi-newsletter-strengthening-resilience",
    image: LHI_PHOTOS.vslaGroup,
  },
  {
    title: "Helpers Digest: Resilience, Renewal and Nutrition",
    kind: "Helpers Digest",
    period: "October 2023",
    description: "ZOA/LHI savings groups in Borno and IHP nutrition recoveries in Ebonyi State.",
    pdf: "/documents/helpers-digest-october-2023.pdf",
    post: "/blog/helpers-digest-october-2023",
    image: LHI_PHOTOS.yaGabtuStall,
  },
  {
    title: "Transforming Lives Through Nutrition: Rejoice's Journey",
    kind: "LHI Newsletter",
    period: "September 2023",
    description: "From severe to moderate acute malnutrition in Onicha LGA, Ebonyi State.",
    pdf: "/documents/lhi-newsletter-september-2023.pdf",
    post: "/blog/rejoice-transforming-lives-through-nutrition",
    image: LHI_PHOTOS.ihpMuacScreening,
  },
  {
    title: "Chinwendu's Nutrition Triumph in Ebonyi State",
    kind: "LHI Newsletter",
    period: "August 2023",
    description: "Nutrition counselling and growth monitoring through the IHP nutrition project.",
    pdf: "/documents/lhi-newsletter-august-2023.pdf",
    post: "/blog/chinwendu-nutrition-triumph-ebonyi",
    image: LHI_PHOTOS.ihpWeighing,
  },
  {
    title: "Helpers Digest: Inner Peace and a Journey of a Mile",
    kind: "Helpers Digest",
    period: "September 2022",
    description: "Plan International (BMZ) youth and primary health care work in Yobe State.",
    pdf: "/documents/helpers-digest-september-2022.pdf",
    post: "/blog/helpers-digest-september-2022",
    image: LHI_PHOTOS.dumsaiGarden,
  },
];
