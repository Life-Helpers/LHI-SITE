import { LHI_PHOTOS } from "@/data/lhi-photos";
import type { CmsPost } from "@/lib/cms/types";

/**
 * Stories from "Cultivating Resilience: A New Harvest in Northwest Nigeria", Project
 * Magazine Vol. 1 (FCDO/WFP Resilience Building and Smallholder Farmers Support
 * Project, Sept 2025 – Feb 2026). Seeded as CMS posts; editable in Admin → Posts.
 */

export const MAGAZINE_PDF = "/documents/cultivating-resilience-magazine-vol-1.pdf";

const base = {
  author: "LHI Communications",
  authorId: "",
  status: "published" as const,
  featured: false,
};

export const MAGAZINE_POSTS: CmsPost[] = [
  {
    ...base,
    id: "mag-cultivating-resilience-vol-1",
    slug: "cultivating-resilience-magazine-vol-1",
    title: "Cultivating Resilience: A New Harvest in Northwest Nigeria (Magazine Vol. 1)",
    category: "Magazine",
    date: "2026-03-15",
    featuredImage: LHI_PHOTOS.farmerWomanHarvest.src,
    featured: true,
    tags: ["FCDO", "WFP", "Resilience", "Sokoto", "Katsina"],
    excerpt:
      "A special feature on the FCDO-funded Resilience Building and Smallholder Farmers Support Project, implemented by Life Helpers Initiative and WFP across Sokoto and Katsina States.",
    updatedAt: "2026-03-15",
    content: `Welcome to the first edition of **Cultivating Resilience**. This feature tells the story of a transformative journey unfolding across the farmlands of Sokoto and Katsina States. Over six months, from inception to impact, the Resilience Building and Smallholder Farmers Support Project, a partnership between the Foreign, Commonwealth and Development Office (FCDO), the World Food Programme (WFP) and Life Helpers Initiative (LHI), has moved from planning to profound action.

Covering September 2025 to February 2026, the magazine captures a season of laying strong foundations and celebrating the first fruits of resilience, growth and renewed hope.

[Download the full magazine (PDF)](${MAGAZINE_PDF}) · [Project fact sheet](/fact-sheet#resilience) · [Farmer Service Center brochure](/brochure)

## Executive message

> "The journey is not only about numbers; it is about dignity. Farmers who once struggled to access financial services now have bank accounts. Women are organizing into savings groups and leading their communities toward economic independence."
>
> Uzo Okpara, Project Manager (LHI)

## The big picture

The project addresses unpredictable rainfall, limited access to quality farming inputs, weak market linkages and limited financial services through four reinforcing pathways:

- **Immediate support:** cash-based transfers provide a safety net and seed capital for small businesses.
- **Agricultural strengthening:** quality seeds and fertilizer with training on Good Agronomic Practices boost yields and support dry-season farming.
- **Financial inclusion:** Village Savings and Loan Associations help communities, especially women, save, borrow and build a financial identity.
- **Infrastructure and digital innovation:** Farmer Service Centres and the AgriFMIS digital platform create long-term systems for market access, processing and data-driven support.

## In data we trust

- **5,700** households supported directly, **37,050** household members indirectly
- **70%** smallholder farmers, **30%** cash-based transfer beneficiaries
- **42** wards across **4** LGAs in Sokoto and Katsina
- **29.1%** female-headed households; **1,384** people with disabilities (24.2%)
- Maize (51.4%), tomatoes (29.6%) and cabbage (16.8%) were farmers' first seed choices

## Coordination success

A courtesy visit to the Katsina State Ministry of Agriculture and an advocacy visit to the Kware LGA secretariat solidified local ownership. In January 2026, WFP and FCDO conducted a joint monitoring visit with gender-segregated focus group discussions with 23 women and 17 men.

## Also in this issue

- [Jamila's daily miracle](/blog/jamila-from-hunger-to-hope)
- [Harvesting prosperity twice a year](/blog/jafaro-harvesting-prosperity-twice-a-year)
- [From eight years of struggle to renewed hope](/blog/murja-eight-years-of-struggle-to-renewed-hope)
- [Four cobs on one stalk](/blog/karba-four-cobs-on-one-stalk)
- [Saving a family business](/blog/mustafa-saving-a-family-business)
- [A group that grows together](/blog/bankanu-vsla-a-group-that-grows-together)
- [Atika's journey from hopelessness to healing](/blog/atika-from-silence-to-strength)
- [Noma Tushen Arziki: the farming wealth hub](/blog/noma-tushen-arziki-farming-wealth-hub)`,
  },
  {
    ...base,
    id: "mag-jamila",
    slug: "jamila-from-hunger-to-hope",
    title: "From Hunger to Hope: Jamila's Daily Miracle",
    category: "Success Stories",
    date: "2026-03-14",
    featuredImage: LHI_PHOTOS.vsla.src,
    tags: ["VSLA", "Wammako", "Sokoto", "Women"],
    excerpt:
      "A ₦10,000 VSLA loan helped Jamila Malami, a mother of seven in Wammako, start a soya bean cake business. She now earns over ₦3,000 a day and all her children are in school.",
    updatedAt: "2026-03-14",
    content: `Jamila Malami, a 50-year-old mother of seven from Wammako LGA, transformed her family's life through a **₦10,000 loan from her VSLA group**.

Previously struggling with food insecurity and able to send only four of her children to school, Jamila used the loan to start a soya bean cake business. She now earns **over ₦3,000 daily**, supports her husband, and has enrolled all her children in school.

Beyond financial gain, she credits the VSLA training and group support for bringing peace and stability to her home.

> "Gidana yanzu yana da salama, muna cin abinci sosai." (My home is now peaceful, and we eat well.)

> "Na gode wa WFP da LHI. Sun ba mu damar rayuwa mai kyau." (Thank you to WFP and LHI. You gave us a chance at a better life.)

Jamila's journey shows how small, well-supported investments can restore dignity, strengthen families and build resilient communities.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-jafaro",
    slug: "jafaro-harvesting-prosperity-twice-a-year",
    title: "Harvesting Prosperity Twice a Year",
    category: "Success Stories",
    date: "2026-03-13",
    featuredImage: LHI_PHOTOS.jafaroCabbage.src,
    tags: ["Seeds", "Katsina", "Dry-season farming"],
    excerpt:
      "Improved seeds that mature in 60 days instead of 80 let Jafaro Baro harvest twice in the time of one, and his cabbages now sell for ₦500–₦600 each.",
    updatedAt: "2026-03-13",
    content: `Jafaro Baro, a 44-year-old father of nine from Katsina LGA, has transformed his farming through improved seeds and training from the WFP/LHI project.

Previously limited by poor seeds and low yields, he now uses high-quality cabbage and tomato seeds that **mature in just 60 days, compared to 80 days** previously, allowing two harvests in the time of one.

> "Wannan irin da aka ba mu yana girma cikin kwanaki sittin kacal." (This new seed matures in just sixty days.)

His cabbages are larger and healthier, selling for **₦500 to ₦600 each** compared to ₦175 to ₦200 before. Buyers now come directly to his farm, and he returns home with money daily.

> "Yanzu babu rana da zan koma gida babu kudi a hannu na." (Now there is no day I return home without money in my hand.)

With improved practices and strategic mono-cropping, Jafaro expects to double his seasonal income, a powerful example of how quality inputs and training build resilience.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-murja",
    slug: "murja-eight-years-of-struggle-to-renewed-hope",
    title: "From Eight Years of Struggle to Renewed Hope",
    category: "Success Stories",
    date: "2026-03-12",
    featuredImage: LHI_PHOTOS.murja.src,
    tags: ["Cash transfer", "Katsina", "Widows"],
    excerpt:
      "Widowed and raising 11 children, Murja Yari invested her ₦75,000 WFP cash transfer in a food business that now runs from morning until evening.",
    updatedAt: "2026-03-12",
    content: `For eight years, Murja Yari, a 50-year-old widow and mother of 11 from Katsina, struggled to survive. After her husband's death she was left with no steady income, business or savings.

> "There were times when we spent up to five days without anything to eat. I was afraid my children would be forced to beg."

She took in laundry for neighbours, but the small payments were never enough. Her turning point came through the World Food Programme's Cash-Based Transfer, implemented with LHI.

> "I thought it was a lie. But when I finally received the ₦75,000 WFP Cash-Based Transfer support, it felt like someone had given me one million naira."

With her children, Murja invested in food supplies (rice, beans, cooking oil and soya beans) to start a small food-selling business, building on an idea her son had years earlier.

Today Murja sells food from morning until evening and saves weekly with a **Village Savings and Loan Association**. She is moving forward one meal, one sale and one hopeful day at a time.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-karba",
    slug: "karba-four-cobs-on-one-stalk",
    title: "Four Cobs on One Stalk",
    category: "Success Stories",
    date: "2026-03-11",
    featuredImage: LHI_PHOTOS.maizeFarmerWoman.src,
    tags: ["Maize", "Batagarawa", "Katsina"],
    excerpt:
      "Improved maize and tomato seeds gave 65-year-old Karba Mohamad yields he had never seen in a lifetime of farming, and his farm is now a learning point for neighbours.",
    updatedAt: "2026-03-11",
    content: `At 65, Karba Mohamad, a father of 13 from Dabaibayawa Ward, Batagarawa LGA, has farmed since childhood. Despite years of experience, inconsistent seed quality and rising input costs limited his dry-season potential.

Through the WFP-supported Resilience Project implemented by LHI and funded by FCDO, Karba received improved maize and tomato seeds, fertilizer and technical guidance.

> "A rayuwata ban taba ganin masara mai kwaya hudu a jiki daya ba." (In my lifetime, I have never seen maize with four cobs on one stalk.)

He anticipates **at least ten additional bags of maize** this season and has already sold four baskets of tomatoes while maintaining household consumption.

> "Noman rani yana sa ka girbi sau biyu maimakon zama babu aiki." (Dry-season farming allows you to harvest twice instead of remaining idle.)

Karba's thriving farm now serves as a learning point for neighbouring farmers.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-mustafa",
    slug: "mustafa-saving-a-family-business",
    title: "Saving a Family Business",
    category: "Success Stories",
    date: "2026-03-10",
    featuredImage: LHI_PHOTOS.mustafa.src,
    tags: ["Cash transfer", "Batagarawa", "Small business"],
    excerpt:
      "With ₦75,000 in livelihood support, cap-washer Mustafa Almajiri diversified into selling caps and turned a failing shop into a growing enterprise.",
    updatedAt: "2026-03-10",
    content: `For over 15 years, Mustafa Almajiri, a 44-year-old father of five from Batagarawa, earned a living washing and selling traditional Hausa caps. By March 2025 his business was failing.

> "The market was very slow and my family's needs were increasing. I was already thinking about closing my shop because I could not keep up."

He received **₦75,000** through a WFP livelihood initiative, funded by the UK Government and implemented with LHI. Mustafa bought a ram and cap-cleaning supplies, later sold the ram, and used the profit to expand into buying and selling caps.

> "When my youngest son told me that my shop looks more beautiful now, I felt very proud."

Mustafa now offers both cap sales and washing services and hopes to enrol his younger children in formal education.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-bankanu-vsla",
    slug: "bankanu-vsla-a-group-that-grows-together",
    title: "A Group That Grows Together: The Bankanu VSLA",
    category: "Success Stories",
    date: "2026-03-09",
    featuredImage: LHI_PHOTOS.vslaWomenMeeting.src,
    tags: ["VSLA", "Kware", "Sokoto", "Women"],
    excerpt:
      "25 women in Bankanu, Kware LGA, saved ₦196,000 in their first cycle and chose to invest together in maize for resale.",
    updatedAt: "2026-03-09",
    content: `In Bankanu community, Kware LGA, Sokoto State, **25 women** formed a Village Savings and Loan Association to strengthen their financial resilience. Through weekly savings they mobilised **₦196,000, plus a ₦3,390 social fund**, in their first cycle.

Rather than lending to individual members, the group decided to pool resources and invest jointly: they bought three bags of maize, stored safely for resale. The strategy reduces individual risk, builds trust and generates profit that benefits everyone equally.

The Bankanu VSLA shows how empowered women can use savings and solidarity to create shared economic opportunities.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-atika",
    slug: "atika-from-silence-to-strength",
    title: "From Silence to Strength: Atika's Journey from Hopelessness to Healing",
    category: "Success Stories",
    date: "2026-03-08",
    featuredImage: LHI_PHOTOS.atika.src,
    tags: ["VSLA", "Wammako", "Rice processing"],
    excerpt:
      "A ₦20,000 loan from the Gabashi VSLA restarted Atika Abas's rice-processing business. Two months later she buys five bags at a time and her children are back in school.",
    updatedAt: "2026-03-08",
    content: `Atika Abas, a 40-year-old mother of six from Gabashi Ward in Wammako LGA, Sokoto State, has faced profound loss. Without capital her rice-processing business had fallen apart.

> "A wancan lokacin, rayuwa ta tsaya cak. Ina zaune kawai a gida ba tare da aiki ba." (At that time, my life was stuck. I was just sitting at home doing nothing.)

After joining the **Gabashi VSLA**, supported by LHI and WFP, she took a **₦20,000 loan** to buy water, firewood and a bag of unprocessed rice.

> "Cikin sati guda na sayar, na sake sayen wani buhu. Gida ya fara samun abinci." (Within one week I sold and bought another bag. Food returned to our home.)

Two months later she can afford five bags of rice at a time, and community members pay her to process rice for them. For the first time she pays her children's PTA and school fees herself.

> "Yanzu mamanmu kullum tana murmushi." (Now our mother is always smiling.) Her daughter

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "mag-noma-tushen-arziki",
    slug: "noma-tushen-arziki-farming-wealth-hub",
    title: "Noma Tushen Arziki: The Farming Wealth Hub in Wamakko",
    category: "News",
    date: "2026-03-07",
    featuredImage: LHI_PHOTOS.hubAerial.src,
    tags: ["Farmer Service Centre", "Wamakko", "Sokoto"],
    excerpt:
      "Commissioned on 27 November 2025, the Noma Tushen Arziki hub offers milling, cold storage, a fish farm, hire services and training, run by a community management committee.",
    updatedAt: "2026-03-07",
    content: `What began as a construction site in October 2025 has become a bustling community asset. The **Noma Tushen Arziki Hub** (meaning "Farming Wealth" in Hausa) in Wamakko LGA, Sokoto State, was officially commissioned on **27 November 2025** and began operations on **10 December 2025**.

By February 2026, monitoring confirmed all units functioning at full capacity, with daily supervision by a Facility Management Committee.

## Services

- **Milling:** upgraded from 1 to 3 rice milling machines, a 200% capacity increase
- **Cold storage:** produce preservation, cooling and ice blocks
- **Fish farm:** 500–700 fingerlings per cycle
- **Hire services:** farm tools rented through a hire-to-use model
- **Mobile solar irrigation:** a solar-powered wheelbarrow pump for all-season farming
- **Demonstration farm, training space, car wash and solar charging dock**

## Gidan Arziki, Batagarawa

The second hub, the **Gidan Arziki Farmer Service Centre** in Batagarawa LGA, Katsina State, reached 95% completion by February 2026. Its 20-member Facility Management Committee (12 men, 8 women) was established before construction finished.

## AgriFMIS

The Agricultural Farmer Management Information System, deployed on AWS at agrifims.ng, is building a geo-referenced database of smallholder farmers with NIN, GPS farm locations and farm sizes.

*From [Cultivating Resilience, Vol. 1](/blog/cultivating-resilience-magazine-vol-1).*`,
  },
  {
    ...base,
    id: "news-wespeak-radio",
    slug: "wespeak-muyi-magana-radio",
    title: "WeSpeak (Muyi Magana): LHI's Weekly Radio Programme",
    category: "News",
    date: "2026-03-05",
    featuredImage: LHI_PHOTOS.solarRadioFarmer.src,
    tags: ["Radio", "Sokoto", "Accountability"],
    excerpt:
      "Aired every Tuesday, 11 AM–12 PM, on Radio Nigeria Royal FM 101.5, WeSpeak covers health, education, livelihood, agriculture and gender equity, and gives listeners space for questions and complaints.",
    updatedAt: "2026-03-05",
    content: `**WeSpeak**, also known as **Muyi Magana**, is a weekly radio programme implemented by Life Helpers Initiative in Sokoto State and aired by Radio Nigeria (**Royal FM 101.5**). It cuts across all thematic areas: health, education, livelihood, agriculture and gender equity.

The platform provides timely information, encourages dialogue and creates space for questions, feedback and complaints. Community members share concerns, receive referrals and learn about available services. Civil society organisations are also invited to raise awareness about their work.

The programme has touched many lives across Sokoto State by increasing awareness, promoting positive behaviour change and strengthening accountability.

**Listen:** Radio Nigeria, Royal FM 101.5 (Sokoto State), **every Tuesday, 11:00 AM – 12:00 PM (GMT)**.

For feedback, suggestions, appreciation or complaints, WhatsApp or SMS **0201 330 9033** or email feedback@lhinigeria.org.`,
  },
  {
    ...base,
    id: "news-strategic-plan-2026-2030",
    slug: "strategic-plan-2026-2030-launched",
    title: "LHI Adopts Its Strategic Plan 2026–2030",
    category: "Press Release",
    date: "2026-04-30",
    featuredImage: LHI_PHOTOS.teamStrategicPlan.src,
    tags: ["Strategic Plan", "Governance"],
    excerpt:
      "LHI's third strategic plan sets the goal of improved well-being, resilience and inclusion of vulnerable populations, building on over ₦8 billion in grants secured in 2021–2025.",
    updatedAt: "2026-04-30",
    content: `Life Helpers Initiative has adopted its **Strategic Plan 2026–2030**, "A plan towards Consolidation of Programme Impact, and Organisational Sustainability". It is the organisation's third strategic plan, developed at a strategy review and planning workshop at Goshen Development Centre, Sokoto, from 23 to 27 February 2026.

## Goal

Improved well-being, resilience, and inclusion of vulnerable populations in communities where LHI operates.

## Building on 2022–2025

- Over **₦8 billion** in grants secured between 2021 and 2025
- Migration to an ERP financial system and digital data collection with Kobo Collect
- Owned office complexes in Sokoto, Kebbi and Yobe
- A dedicated Communications Unit producing videos, documentaries and radio

> "This Strategic Plan is more than a document, it is a promise." Engr. Godfrey Mayoku, Chairman, Board of Trustees

[Read about our strategies and the plan](/our-strategies) · [Download the Strategic Plan (PDF)](/documents/lhi-strategic-plan-2026-2030.pdf)`,
  },
];
