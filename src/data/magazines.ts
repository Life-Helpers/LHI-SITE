/**
 * Project magazines shown in the flipbook reader (/project-magazines). Page images are
 * pre-rendered WebP files in /public/magazines/<slug>/01.webp … (A4 portrait).
 */
export interface Magazine {
  slug: string;
  title: string;
  kind: string;
  period: string;
  description: string;
  pages: number;
  pdf: string;
  story: string;
  partners: string;
}

export const MAGAZINES: Magazine[] = [
  {
    slug: "abep-learning-for-a-brighter-future",
    title: "Learning for a Brighter Future",
    kind: "ABEP Project Magazine",
    period: "February – May 2026",
    description:
      "The Accelerated Basic Education Programme for out-of-school children in six LGAs of Sokoto State: 3,255 learners enrolled, 105 facilitators and 164 CBMC members trained.",
    pages: 20,
    pdf: "/documents/abep-project-magazine.pdf",
    story: "/blog/abep-magazine-learning-for-a-brighter-future",
    partners: "European Union · UNICEF",
  },
  {
    slug: "gidan-arziki-vol-2",
    title: "Empowering Communities Through Innovation, Skills & Livelihood Support",
    kind: "Project Magazine Vol. 2",
    period: "April 2026",
    description:
      "The Gidan Arziki Farmers Service Hub in Batagarawa, Katsina State: commissioning, facility operations, revenue and voices of change.",
    pages: 25,
    pdf: "/documents/gidan-arziki-magazine-vol-2.pdf",
    story: "/blog/gidan-arziki-magazine-vol-2",
    partners: "FCDO · World Food Programme",
  },
  {
    slug: "cultivating-resilience-vol-1",
    title: "Cultivating Resilience: A New Harvest in Northwest Nigeria",
    kind: "Project Magazine Vol. 1",
    period: "September 2025 – February 2026",
    description:
      "The Resilience Building and Smallholder Farmers Support Project in Sokoto and Katsina: 5,700 households, VSLAs, farmer stories and the Noma Tushen Arziki hub.",
    pages: 28,
    pdf: "/documents/cultivating-resilience-magazine-vol-1.pdf",
    story: "/blog/cultivating-resilience-magazine-vol-1",
    partners: "FCDO · World Food Programme",
  },
  {
    slug: "lhi-newsletter-2025",
    title: "Strengthening Resilience, Restoring Dignity, Transforming Lives",
    kind: "LHI Newsletter",
    period: "2025 highlights",
    description: "Learning for displaced children in Goronyo, the FCT office's year, SEMA coordination, and stories of hope from Shagari and Zamfara.",
    pages: 4,
    pdf: "/documents/lhi-newsletter-2025.pdf",
    story: "/blog/lhi-newsletter-strengthening-resilience",
    partners: "Life Helpers Initiative",
  },
  {
    slug: "helpers-digest-october-2023",
    title: "Helpers Digest: Resilience, Renewal and Nutrition",
    kind: "Helpers Digest bulletin",
    period: "October 2023",
    description:
      "Two Borno women rebuild their businesses through ZOA/LHI savings groups, and two Ebonyi children recover from malnutrition through the IHP nutrition project.",
    pages: 4,
    pdf: "/documents/helpers-digest-october-2023.pdf",
    story: "/blog/helpers-digest-october-2023",
    partners: "ZOA · Integrated Health Program",
  },
  {
    slug: "lhi-newsletter-september-2023",
    title: "Transforming Lives Through Nutrition: Rejoice's Journey",
    kind: "LHI Newsletter",
    period: "September 2023",
    description: "A child in Onicha LGA, Ebonyi State, moves from severe to moderate acute malnutrition through counselling, an IMAM referral and the food bank.",
    pages: 1,
    pdf: "/documents/lhi-newsletter-september-2023.pdf",
    story: "/blog/rejoice-transforming-lives-through-nutrition",
    partners: "Integrated Health Program",
  },
  {
    slug: "lhi-newsletter-august-2023",
    title: "Chinwendu's Nutrition Triumph in Ebonyi State",
    kind: "LHI Newsletter",
    period: "August 2023",
    description: "Nutrition counselling and fortified Tom Brown help an 11-month-old gain weight and grow within five weeks.",
    pages: 1,
    pdf: "/documents/lhi-newsletter-august-2023.pdf",
    story: "/blog/chinwendu-nutrition-triumph-ebonyi",
    partners: "Integrated Health Program",
  },
  {
    slug: "helpers-digest-september-2022",
    title: "Helpers Digest: Inner Peace and a Journey of a Mile",
    kind: "Helpers Digest bulletin",
    period: "September 2022",
    description: "A young man in Dapchi turns away from drugs through peer educators, and Dumsai PHC staff grow a garden to keep medicines available in Yobe State.",
    pages: 4,
    pdf: "/documents/helpers-digest-september-2022.pdf",
    story: "/blog/helpers-digest-september-2022",
    partners: "Plan International · BMZ",
  },
];

export const pageImage = (slug: string, page: number) => `/magazines/${slug}/${String(page).padStart(2, "0")}.webp`;

export function getMagazine(slug: string) {
  return MAGAZINES.find((m) => m.slug === slug);
}
