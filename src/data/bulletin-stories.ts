import { LHI_PHOTOS } from "@/data/lhi-photos";
import type { CmsPost } from "@/lib/cms/types";

/**
 * Stories from LHI's Helpers Digest bulletins (September 2022, October 2023) and the
 * August and September 2023 newsletters, plus an anonymised summary of the August 2022
 * survivor-support newsletter. That newsletter named child survivors of sexual violence,
 * so under LHI's Child Safeguarding Policy it is not republished and no identifying
 * details are used. Seeded as CMS posts; editable in Admin → Posts.
 */

export const DIGEST_OCT_2023_PDF = "/documents/helpers-digest-october-2023.pdf";
export const DIGEST_SEP_2022_PDF = "/documents/helpers-digest-september-2022.pdf";
export const NEWSLETTER_AUG_2023_PDF = "/documents/lhi-newsletter-august-2023.pdf";
export const NEWSLETTER_SEP_2023_PDF = "/documents/lhi-newsletter-september-2023.pdf";

const base = {
  author: "LHI Communications",
  authorId: "",
  status: "published" as const,
  featured: false,
};

const fromOct = `*From [Helpers Digest, October 2023](/blog/helpers-digest-october-2023). [Read it as a flipbook](/project-magazines/helpers-digest-october-2023).*`;
const fromSep22 = `*From [Helpers Digest, September 2022](/blog/helpers-digest-september-2022). [Read it as a flipbook](/project-magazines/helpers-digest-september-2022).*`;

export const BULLETIN_POSTS: CmsPost[] = [
  /* ------------------------------------------------ Helpers Digest, October 2023 */
  {
    ...base,
    id: "digest-oct-2023",
    slug: "helpers-digest-october-2023",
    title: "Helpers Digest, October 2023",
    category: "Newsletter",
    date: "2023-10-31",
    featuredImage: LHI_PHOTOS.yaGabtuStall.src,
    tags: ["Newsletter", "Helpers Digest", "GSLA", "ZOA", "IHP", "Nutrition"],
    excerpt:
      "Resilience and renewal in Borno through ZOA/LHI savings groups, and two children in Ebonyi State recovering from malnutrition through the IHP nutrition project.",
    updatedAt: "2023-10-31",
    content: `*The one thing you read that matters: it's our story, it's our life.* The October 2023 edition of **Helpers Digest**, LHI's bulletin covering education, health, governance, gender, social-economic development and agriculture.

[Read the flipbook](/project-magazines/helpers-digest-october-2023) · [Download the PDF](${DIGEST_OCT_2023_PDF})

## In this edition

- [Resilience and renewal: Ya Gabtu Shattima's journey](/blog/ya-gabtu-shattima-resilience-and-renewal)
- [From struggle to success: Falmata Bulama](/blog/falmata-bulama-from-struggle-to-success)
- [Chinwendu's nutrition triumph in Ebonyi State](/blog/chinwendu-nutrition-triumph-ebonyi)
- [Transforming lives through nutrition: Rejoice's journey](/blog/rejoice-transforming-lives-through-nutrition)

## Editorial team

Tayo Fatinikun, Joy Dauda Dogo, Oluwafemi Tanimowo, Adetola Olabode and Nosa Ojo.`,
  },
  {
    ...base,
    id: "story-ya-gabtu",
    slug: "ya-gabtu-shattima-resilience-and-renewal",
    title: "Resilience and Renewal: Ya Gabtu Shattima's Journey",
    category: "Success Stories",
    date: "2023-10-30",
    featuredImage: LHI_PHOTOS.yaGabtuStall.src,
    tags: ["Livelihood", "GSLA", "ZOA", "Borno", "Helpers Digest"],
    excerpt:
      "When insurgency cost her husband his shop, a 50-year-old grandmother rebuilt her kuli-kuli business through a ZOA/LHI savings group.",
    updatedAt: "2023-10-30",
    content: `**Ya Gabtu Shattima** is 50 years old, with five children and three grandchildren in her care. Her business began with groundnut oil and groundnut cakes (*kuli-kuli*), and it thrived until insurgency struck and her husband lost his shop in the market. Suddenly she was carrying the family's financial burden alone, on meagre resources.

With dwindling capital, her grandchildren had to leave school. That is when **ZOA, in partnership with Life Helpers Initiative**, introduced the **Group Savings and Loan Association (GSLA)** as part of an intervention to strengthen livelihoods. Ya Gabtu joined a group, and after three savings cycles ZOA/LHI provided her with business tools: 16 plates of groundnuts, a pot, a frying pan and firewood.

With renewed vigour she restarted her business. Within five months her profits grew, and she diversified: she now sells a bag of rice each week, earning about **₦4,500** a week from it, and sells fresh tomatoes from the farm in the harvest season.

Life has become significantly easier. She can provide for her children and grandchildren and keep them in school, and the LHI team found her business thriving when they visited her busy sales point.

${fromOct}`,
  },
  {
    ...base,
    id: "story-falmata-bulama",
    slug: "falmata-bulama-from-struggle-to-success",
    title: "From Struggle to Success: Falmata Bulama",
    category: "Success Stories",
    date: "2023-10-29",
    featuredImage: LHI_PHOTOS.falmataBusiness.src,
    tags: ["Livelihood", "GSLA", "ZOA", "Borno", "Jere", "Helpers Digest"],
    excerpt:
      "A widow raising ten children in Gongulong, Jere LGA, joined a savings group and turned business support into a new meat pie and doughnut venture.",
    updatedAt: "2023-10-29",
    content: `**Falmata Bulama**, 40, lives in **Gongulong community, Jere LGA, Maiduguri, Borno State**. Eight years ago she lost her husband, leaving her to raise their ten children alone. She had run a snack (*chin-chin*) business for a decade, but the rising cost of ingredients had made it unprofitable.

Her life took a positive turn through the intervention of **ZOA in partnership with Life Helpers Initiative**, which introduced the **Group Savings and Loan Association (GSLA)**. Falmata joined, and after three savings cycles she was one of the members selected to receive essential items for **meat pie and doughnut production**.

With that support she started a new venture. She bought five measures of flour and, through her own effort, made a profit of **₦3,000**. Her life has improved significantly and she can now provide for her children.

> Success is never so interesting as struggle.

${fromOct}`,
  },
  {
    ...base,
    id: "story-chinwendu-nutrition",
    slug: "chinwendu-nutrition-triumph-ebonyi",
    title: "Chinwendu's Nutrition Triumph in Ebonyi State",
    category: "Success Stories",
    date: "2023-08-31",
    featuredImage: LHI_PHOTOS.ihpMuacScreening.src,
    tags: ["Health", "Nutrition", "IHP", "Ebonyi", "Newsletter"],
    excerpt:
      "Nutrition counselling and fortified Tom Brown helped an 11-month-old girl gain weight and grow within five weeks.",
    updatedAt: "2023-08-31",
    content: `A lack of nutrition awareness and growth monitoring was holding back an 11-month-old girl, **Chinwendu**, in Ebonyi State. She was underweight and often ill despite her family's efforts to feed her.

Through the **Integrated Health Program (IHP) nutrition project**, LHI stepped in, giving her mother nutrition counselling and introducing nutrient-rich **Tom Brown**. Even financial hurdles couldn't stop the progress.

- **20 June 2023** (11 months): weight 5.6 kg, height 56 cm, MUAC 10.3 cm
- **25 July 2023** (12 months): weight 6 kg, height 60 cm, MUAC 11 cm

Beyond the numbers, the family's mindset changed: their commitment even led them to an RUTF outreach. Chinwendu's story shows the power of education and compassionate support to spark growth and change.

*From the [LHI Newsletter, August 2023](/project-magazines/lhi-newsletter-august-2023), also featured in [Helpers Digest, October 2023](/blog/helpers-digest-october-2023).*`,
  },
  {
    ...base,
    id: "story-rejoice-nutrition",
    slug: "rejoice-transforming-lives-through-nutrition",
    title: "Transforming Lives Through Nutrition: Rejoice's Journey",
    category: "Success Stories",
    date: "2023-09-30",
    featuredImage: LHI_PHOTOS.ihpMuacScreening.src,
    tags: ["Health", "Nutrition", "IHP", "Ebonyi", "Onicha", "Newsletter"],
    excerpt:
      "A 16-month-old in Onicha LGA moved from severe to moderate acute malnutrition through counselling, food demonstrations, an IMAM referral and the food bank.",
    updatedAt: "2023-09-30",
    content: `**Rejoice**, from **Onicha LGA in Ebonyi State**, arrived at the Onicha health facility severely malnourished: at 16 months she had a MUAC of just **11.2 cm**, weighed **8.6 kg** and measured **70 cm**. Her mother was worried about feeding her, mainly because of money.

Through Life Helpers Initiative and the **IHP nutrition project**, her mother received personalised guidance on preparing "five-star meals" from affordable local foods: fortified pap, potato porridge, animal-source foods such as cooked eggs, fruits and vegetables. She was also introduced to **home gardening** for quicker access to vegetables.

Rejoice was referred to an **IMAM centre** for treatment and received **Tom Brown and beans from the food bank**. Her mother took an active part in food demonstration sessions.

By the third visit, her mother, the health workers and other caregivers could all see the change: Rejoice had moved from **severe acute malnutrition (SAM) to moderate acute malnutrition (MAM)**, with a MUAC of **12.4 cm**, weight of **8.8 kg** and height of **76 cm** at 17 months.

Her journey shows what education, compassion and dedicated follow-up can achieve when communities come together for their youngest members.

*From the [LHI Newsletter, September 2023](/project-magazines/lhi-newsletter-september-2023), also featured in [Helpers Digest, October 2023](/blog/helpers-digest-october-2023).*`,
  },

  /* ------------------------------------------------ Helpers Digest, September 2022 */
  {
    ...base,
    id: "digest-sep-2022",
    slug: "helpers-digest-september-2022",
    title: "Helpers Digest, September 2022",
    category: "Newsletter",
    date: "2022-09-30",
    featuredImage: LHI_PHOTOS.dumsaiGarden.src,
    tags: ["Newsletter", "Helpers Digest", "Plan International", "BMZ", "Yobe"],
    excerpt:
      "A young man in Dapchi finds his way out of drug abuse through peer educators, and Dumsai PHC staff grow a garden to keep medicines on the shelves.",
    updatedAt: "2022-09-30",
    content: `The September 2022 edition of **Helpers Digest** brings two stories from LHI's work with **Plan International (BMZ)** in Yobe State.

[Read the flipbook](/project-magazines/helpers-digest-september-2022) · [Download the PDF](${DIGEST_SEP_2022_PDF})

## In this edition

- [Bringing back my inner peace](/blog/bringing-back-my-inner-peace-dapchi)
- [A journey of a mile begins with a step: Dumsai PHC](/blog/dumsai-phc-journey-of-a-mile)

## Editorial team

Tayo Fatinikun, Joy Dauda Dogo, Oluwafemi Tanimowo, Adetola Olabode and Nosa Ojo.`,
  },
  {
    ...base,
    id: "story-inner-peace-dapchi",
    slug: "bringing-back-my-inner-peace-dapchi",
    title: "Bringing Back My Inner Peace",
    category: "Success Stories",
    date: "2022-09-29",
    featuredImage: LHI_PHOTOS.communityDialogue.src,
    tags: ["Youth", "Health", "Plan International", "BMZ", "Yobe", "Dapchi", "Helpers Digest"],
    excerpt:
      "A 20-year-old in Dapchi turned away from drug abuse with the help of a peer educator from an adolescent and youth-friendly centre set up by Plan International and LHI.",
    updatedAt: "2022-09-29",
    content: `Drug abuse among young people increases the risk of injury and violence, road accidents, risky sexual behaviour, HIV and problems at school, and it pushes some into crime.

**Isiyaku**, 20, lives in **Dapchi LGA, Yobe State**. He dropped out of secondary school because his family could not afford it and, under peer pressure, fell in with friends who used drugs. His parents feared losing him, and the community began calling him *Dantahada* ("thug").

> "I woke up one morning and realised my life was no longer fun, watching my age mates getting married and having families and businesses of their own. It made me stop to think: what if I give change a try?"

He met a longtime friend, Isa, a member of a peer educators' group. **Plan International (BMZ), in collaboration with Life Helpers Initiative, had established an Adolescent and Youth-Friendly Centre** offering counselling to young people, with a male community-based health volunteer council. Isa referred Isiyaku for the right services, introduced him to a small vegetable business so he could support himself and his family, and began teaching him to read and write.

The change was not easy, but it was real: he eats and sleeps well, takes care of himself and his responsibilities at home, and there is no more violence. With constant follow-up Isiyaku is now drug-free, and with the group's help his friends raised funds to enrol him back in school.

> "This is the journey of my inner peace!"

${fromSep22}`,
  },
  {
    ...base,
    id: "news-dumsai-phc",
    slug: "dumsai-phc-journey-of-a-mile",
    title: "A Journey of a Mile Begins with a Step: Dumsai PHC",
    category: "News",
    date: "2022-09-28",
    featuredImage: LHI_PHOTOS.dumsaiGarden.src,
    tags: ["Health", "Agriculture", "Plan International", "BMZ", "Yobe", "Helpers Digest"],
    excerpt:
      "After Plan International and LHI rebuilt part of Dumsai primary health centre, its staff started a garden to fund medicines beyond the life of the project.",
    updatedAt: "2022-09-28",
    content: `Insurgency severely disrupted health services in **Yobe State**, and many health facilities needed rebuilding. At **Dumsai primary health centre (PHC)**, the biggest problems were lack of space and lack of drugs, which delayed emergency care, led to avoidable deaths and opened the door to fake medicines and wrong prescriptions.

Through the **Plan International (BMZ) project** promoting social cohesion by rehabilitating social infrastructure and integrating internally displaced people and refugees, LHI **built a section of the facility**, a great start to wider development in the community.

As the project was closing out, Dumsai PHC staff went further: they **grew a garden and sell its produce to buy drugs**, keeping medicines available and sustaining the outreach they had been running. The community welcomed the step and, with some of the health workers, formed a group to keep supporting the facility.

> It is a duty to complete the journey of a thousand miles with a big step.

${fromSep22}`,
  },

  /* ------------------------------------------------ August 2022 newsletter (anonymised) */
  {
    ...base,
    id: "story-spotlight-survivor-support",
    slug: "survivors-supported-to-heal-spotlight",
    title: "My Scars Don't Define Me: Standing with Child Survivors",
    category: "Success Stories",
    date: "2022-08-01",
    featuredImage: LHI_PHOTOS.activismWomen.src,
    tags: ["Protection", "GBV", "Spotlight Initiative", "UNICEF", "Child protection"],
    excerpt:
      "Under the UNICEF child protection and EU Spotlight Initiative project, LHI and community surveillance teams made sure girls who survived sexual violence received care, counselling, justice and a way back to school.",
    updatedAt: "2022-08-01",
    content: `Silence and stigma have long allowed sexual violence against children to go unchallenged. The August 2022 LHI newsletter told the stories of two young girls who survived rape and, with support, began to heal. To protect them, we do not share their names, ages, communities or photographs here.

Working on the **UNICEF child protection / EU Spotlight Initiative** project, LHI team members and **community surveillance teams**:

- made sure each girl was **rushed to hospital** and referred for specialist medical care;
- provided **counselling** and regular **home visits**, and linked them to the **survivors' forum**;
- worked with the **Nigeria Security and Civil Defence Corps (NSCDC)** and the justice system so that perpetrators were arrested and **prosecuted**;
- helped both girls **return to school**, enrolled alongside other survivors, with continued follow-up.

In her own words, one of them said she is grateful for "a second chance and a free and healthy life", and for justice that makes sure it does not happen again.

Anyone can report a concern confidentially: email **psea@lhinigeria.org** or call **+234 201 330 9033**.

*Adapted from the LHI Newsletter, 1 August 2022, in line with our [Child Safeguarding Policy](/our-commitment).*`,
  },
];
