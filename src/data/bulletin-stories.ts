import { LHI_PHOTOS } from "@/data/lhi-photos";
import type { CmsPost } from "@/lib/cms/types";

/**
 * Stories from LHI's Helpers Digest bulletins (September 2022, October 2023) and the
 * August and September 2023 newsletters, plus an anonymised summary of the August 2022
 * survivor-support newsletter. That newsletter named child survivors of sexual violence,
 * so under LHI's Child Safeguarding Policy it is not republished and no identifying
 * details are used. Also: Helpers Digest December 2023 (IPT-G champions of change),
 * the IHP success stories compendium, "Reaching for the Stars" (September 2021) and
 * "CBHVs, Agents of Change" (4th bulletin, September 2019).
 * Seeded as CMS posts; editable in Admin → Posts.
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

With renewed vigour she restarted her business. Within five months her profits reached **₦5,000**, and she diversified: she now sells a bag of rice each week, earning about **₦4,500** a week from it, and sells fresh tomatoes from the farm in the harvest season.

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
  /* ------------------------------------------------ Helpers Digest, December 2023 */
  {
    ...base,
    id: "digest-dec-2023",
    slug: "helpers-digest-december-2023",
    title: "Helpers Digest, December 2023: Champions of Change",
    category: "Newsletter",
    date: "2023-12-21",
    featuredImage: LHI_PHOTOS.iptgMasud.src,
    tags: ["Newsletter", "Helpers Digest", "Plan International", "Mental health", "IPT-G", "Sokoto"],
    excerpt:
      "Five young people in Sokoto find their way out of depression and isolation through Interpersonal Psychotherapy for Groups (IPT-G), with Plan International and LHI.",
    updatedAt: "2023-12-21",
    content: `The December 2023 **Helpers Digest** shares *Champion of Change* stories from **Interpersonal Psychotherapy for Groups (IPT-G)**, delivered by **Plan International in partnership with Life Helpers Initiative** in Sokoto State.

[Read the flipbook](/project-magazines/helpers-digest-december-2023) · [Download the PDF](/documents/helpers-digest-december-2023.pdf)

## In this edition

- [Champions of change: young people overcoming depression through group therapy](/blog/ipt-g-champions-of-change-sokoto)

## Editorial team

Tayo Fatinikun, Joy Dauda Dogo, Oluwafemi Tanimowo, Adetola Olabode, Tade Adeogo and Nosa Ojo.`,
  },
  {
    ...base,
    id: "story-ipt-g-champions",
    slug: "ipt-g-champions-of-change-sokoto",
    title: "Champions of Change: Young People Overcoming Depression Through Group Therapy",
    category: "Success Stories",
    date: "2023-12-20",
    featuredImage: LHI_PHOTOS.iptgHalima.src,
    tags: ["Health", "Mental health", "IPT-G", "Plan International", "Youth", "Sokoto", "Helpers Digest"],
    excerpt:
      "Through Interpersonal Psychotherapy for Groups, young people in Sokoto who had withdrawn from school, work and friends found support, skills and hope again.",
    updatedAt: "2023-12-20",
    content: `Depression can quietly take young people away from school, work and the people who love them. In 2023, **Plan International and Life Helpers Initiative** brought **Interpersonal Psychotherapy for Groups (IPT-G)** to communities in Sokoto State. Trained facilitators screen young people with the PHQ questionnaire, bring them into small peer groups, visit their homes and follow up until they are well.

## Mas'ud: from isolation to a tailor's bench

Mas'ud, 21, from **Bodinga LGA**, finished secondary school in 2018 but could not secure admission anywhere. He stopped talking to people and shut himself indoors. His facilitator introduced him to an IPT-G group; he resisted at first, but found comfort in the sessions, and singing and dancing with the group became his turning point. He is now active, happy and learning new sewing designs at work.

> "Duk abin da aka ce ya kamata maki, ko kasance mai laushi." (Whatever you are told is right for you, be gentle with yourself.)

## Babangida: back on the path to school

Babangida, from **Toma ward, Bodinga LGA**, lost his father during his first year at the School of Health in Sokoto and had to drop out when the family could no longer pay. Mocked by friends, he spent nights in tears. A friend referred him to an IPT-G group; the facilitator, Fahad, visited his home, and Babangida went on to volunteer to lead the group and learn to sew. He now plans to return to school and to start a group of his own for young people facing depression.

## Halima: from darkness to light

Halima, 19, was sent from Zamfara to live with her uncle in **Sokoto South LGA** as insecurity grew at home. Cut off from her parents, she fell from a B student to failing grades and withdrew completely. One-on-one counselling helped her open up, and with support from her group mentor and uncle her parents moved to Sokoto. Reunited with her family, her results have recovered and she hopes to become a doctor.

> "Ina so ka yi rayuwa! Kada ka yi kyau a damuwa…" (I want you to live! Don't let your troubles hold you down; people around you can help.)

## Hadiza: triumph over trials

Hadiza, a young woman from Zamfara State, was sent to Sokoto because of insecurity, then carried a heavy family crisis alone and left school. After she took the PHQ-2 and joined a group, counselling and her facilitators helped her and her family through it. She learned hair braiding as a source of income, returned to school, set aside early-marriage plans and now dreams of becoming a lawyer or teacher.

> "I have seen a sad-looking young lady turn into a joyful, active and skilful young lady." Her facilitator

## Abubakar: breaking chains

Abubakar, from **Magajin Gari ward, Sokoto South LGA**, grew up with a widowed mother who worked as a cleaner for 17 years. He graduated from the College of Education, Sokoto, at 25, but broken promises left him in deep despair. In the IPT-G group he found "love, care and attention" he had never known, and now helps neighbours with errands to support his family.

> "Sometimes you need other people's troubles to change you… don't be afraid of change; everything you do will help you." Abubakar's advice to other young men

*From [Helpers Digest, December 2023](/blog/helpers-digest-december-2023). [Read it as a flipbook](/project-magazines/helpers-digest-december-2023).*`,
  },

  /* ------------------------------------------------ Compendium of IHP success stories */
  {
    ...base,
    id: "ihp-compendium",
    slug: "compendium-of-ihp-success-stories",
    title: "Compendium of IHP Success Stories: Better Child Health Care in Sokoto and Kebbi",
    category: "Newsletter",
    date: "2022-12-01",
    featuredImage: LHI_PHOTOS.ihpTrainingSession.src,
    tags: ["Health", "IHP", "USAID", "Child health", "Malaria", "Nutrition", "Sokoto", "Kebbi", "Helpers Digest"],
    excerpt:
      "Health workers at 17 facilities in Sokoto and Kebbi describe how LDHF clinical skills training changed the way they test, treat, counsel and refer sick children.",
    updatedAt: "2022-12-01",
    content: `Pneumonia, diarrhoea and malaria, together with preterm birth, birth asphyxia and congenital anomalies, remain the leading causes of death for children under five, and nutrition-related factors contribute to about **45%** of these deaths. Through the **USAID Integrated Health Program (IHP)**, Life Helpers Initiative facilitated facility-based clinical skills training for health workers on integrated child health, nutrition, malaria and routine immunisation, using the **low-dose, high-frequency (LDHF)** approach in Sokoto, Kebbi and Bauchi States.

This Helpers Digest compendium gathers what trainees and trainers told us during follow-up visits to facilities in **Sokoto** (Chimola, Salame, Tambagarka, Mammade, Gidan Diya, Gumbi, Wammakko, Binji and Jamali) and **Kebbi** (Dakin Gari, Barbarejo, Aljannare, Bandam, Tungar Magaji, MCH Koko, Koko Town and K/Damba).

[Read the flipbook](/project-magazines/ihp-success-stories-compendium) · [Download the PDF](/documents/ihp-success-stories-compendium.pdf)

## What changed in the clinics

- **Test before treating malaria.** Facilities that once treated fever "blindly" with chloroquine or quinine now confirm malaria with a rapid diagnostic test and treat with ACT, reading each kit's leaflet for the right number of drops.
- **The right drugs for diarrhoea and pneumonia.** Diarrhoea is now classified and treated with ORS and zinc instead of antibiotics; pneumonia with amoxicillin.
- **Assess, classify, treat, refer.** The Chart Booklet and Sick Child Recording Form guide every step: green to counsel, yellow to treat at the facility, pink to give pre-referral treatment and refer with a referral form and follow-up.
- **Danger signs.** Workers can now tell a cough or cold from pneumonia, count breathing with a timer and recognise a convulsing or drowsy child.
- **Nutrition.** Weighing scales, height rulers and MUAC tapes that once sat unused are part of every visit. Mothers are counselled on colostrum, exclusive breastfeeding for six months and complementary feeding.
- **Immunisation and antenatal care.** Teams track defaulters, plan immunisation sessions and give SP and tetanus toxoid to pregnant women.

> "This training has changed our professional and even our personal lives." Health workers at Binji Health Post, Sokoto

> "I just placed the MUAC tape anyhow on the arm and didn't understand the colours. Now I use it well and give the right counsel." A health worker at Aljannare, Kebbi

At Tungar Magaji, a mother who had refused immunisation after hearing of a friend's baby's death was counselled during our visit and changed her mind: a small example of how better-trained health workers build trust in their communities.

## Editorial team

Tayo Fatinikun, Maria Oyebimpe Oyedeji, Joy Dauda Dogo, James Bassey and Oluwafemi Tanimowo.`,
  },

  /* ------------------------------------------------ Reaching for the Stars, September 2021 */
  {
    ...base,
    id: "digest-reaching-for-the-stars",
    slug: "reaching-for-the-stars-g4g-yobe",
    title: "Reaching for the Stars: A Girl's Road Back to School in Yobe",
    category: "Success Stories",
    date: "2021-09-22",
    featuredImage: LHI_PHOTOS.g4gReadingFestival.src,
    tags: ["Education", "Girls' education", "G4G", "UNICEF", "KfW", "Yobe", "Helpers Digest"],
    excerpt:
      "A 13-year-old who hawked to support her family watched Girls for Girls sessions through a classroom window, then persuaded her parents to let her enrol.",
    updatedAt: "2021-09-22",
    content: `**Fatima**, 13, lives in **Damagum, Fune LGA, Yobe State**. Her parents had no formal education, could barely afford two meals a day and saw schooling for a girl as a waste of money. So Fatima hawked goods and did chores in other people's homes to help support her siblings.

Then **Girls for Girls (G4G)**, a **UNICEF** programme delivered with **Life Helpers Initiative** and funded by **KfW**, came to the only government primary school in her community, promoting girls' education through quality learning in a safe environment and life skills that help girls overcome everyday challenges.

On her hawking rounds, Fatima would slip into **Dogon Rijiya Primary School** to watch the pupils learning and singing G4G songs.

> "Hearing them sing and speak in English amused me, but being able to sing and speak a few words like them makes me feel bigger and better."

She found the courage to tell her parents she wanted to go back to school, promising to keep up her duties at home and to hawk after school. Her father agreed. The transition wasn't easy, but with determination, patience and her parents' support, Fatima is now a lively member of the G4G group in her school.

## Photo news

G4G activities this quarter included quarterly review meetings with G4G reading facilitators, monthly review meetings with G4G mentors, a spelling bee and reading festival, supportive supervision for G4G and He4She, and the biannual G4G radio programme.

[Read the flipbook](/project-magazines/helpers-digest-reaching-for-the-stars) · [Download the PDF](/documents/helpers-digest-reaching-for-the-stars.pdf)`,
  },

  /* ------------------------------------------------ 4th bulletin: CBHVs, September 2019 */
  {
    ...base,
    id: "digest-cbhvs-agents-of-change",
    slug: "cbhvs-agents-of-change-show-sokoto",
    title: "CBHVs, Agents of Change: 770 Women Improving Maternal and Child Health in Sokoto",
    category: "News",
    date: "2019-09-03",
    featuredImage: LHI_PHOTOS.cbhvCounselling.src,
    tags: ["Health", "MNCH", "SHOW", "Plan International", "Global Affairs Canada", "Sokoto", "Helpers Digest"],
    excerpt:
      "Under the SHOW project, 770 women community-based health volunteers help mothers use health services, and pass life-saving community data to the State Ministry of Health.",
    updatedAt: "2019-09-03",
    content: `The **Supporting Health Outcomes for Women and Children (SHOW)** project, funded by **Global Affairs Canada** and delivered by **Plan International with Life Helpers Initiative**, aims to reduce maternal and child deaths across all 23 LGAs of **Sokoto State**. One of its first goals is for more women of childbearing age, adolescent girls, newborns and children under five living in poverty to use essential health services.

LHI delivers the project in **seven LGAs: Tureta, Shagari, Bodinga, Yabo, Dange Shuni, Kware and Rabah**, through capacity building, community mobilisation, referrals and follow-up, strengthened by **Community-Based Health Volunteers (CBHVs)**.

## Who the CBHVs are

CBHVs are local women, of reproductive age or past childbearing, from the communities the project serves. Using counselling cards and a gender lens, they promote household practices for maternal, newborn and child health (MNCH) and sexual and reproductive health (SRH), including child spacing, nutrition and hygiene, and encourage women to attend health facilities.

## What they have achieved

The **770 CBHVs, all women,** have been active for almost three years. They have:

- helped women understand why and how to use health services, and removed barriers by talking openly with women, husbands, families and the wider community about maternal, newborn and child health and family planning;
- **saved lives** of pregnant women and children, including malnourished children, by identifying, referring and following them up;
- kept counselling cards in use and advocated for community systems that support healthy behaviour, leaving local capacity for government and other partners;
- collected community data on MNCH and family planning services, sent to the **State Ministry of Health** through LGA health directorates.

These women have truly become agents of change in their communities.

[Read the flipbook](/project-magazines/helpers-digest-cbhvs-agents-of-change) · [Download the PDF](/documents/helpers-digest-cbhvs-agents-of-change.pdf)`,
  },
];
