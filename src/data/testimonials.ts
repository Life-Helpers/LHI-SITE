/**
 * Seed testimonials for the home page (Admin → Testimonials). Quotes published in LHI's
 * project magazines (Gidan Arziki Vol. 2, Cultivating Resilience Vol. 1 and the ABEP magazine); each links to the full story.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  href: string;
  tone: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Coming here every morning gives me hope and makes me feel healthy. Before, the process was very tedious. Now with the machine, we finish in minutes.",
    name: "Arajana Suleiman, 70",
    role: "Gidan Arziki centre, Batagarawa, Katsina State",
    href: "/blog/arajana-finding-purpose-at-70",
    tone: "from-primary to-[#a80f14]",
  },
  {
    quote: "Life Helpers Initiative has helped us a lot in supporting farmers, especially in the local government areas. Government alone cannot reach every community.",
    name: "Engr. Salim Suleiman",
    role: "Managing Director, Katsina State Irrigation Development Authority",
    href: "/blog/voices-from-batagarawa-gidan-arziki",
    tone: "from-accent to-[#7a3605]",
  },
  {
    quote: "Even children who did not receive school bags still come to class every day because they genuinely want to learn.",
    name: "Alhaji Rufai Maccido Salah",
    role: "Village Head of Dogon Daji, Tambuwal LGA, Sokoto State",
    href: "/blog/abep-impact-beyond-the-classroom",
    tone: "from-[#7d0c10] to-[#4a0709]",
  },
  {
    quote: "I thought it was a lie. But when I finally received the ₦75,000 WFP Cash-Based Transfer support, it felt like someone had given me one million naira.",
    name: "Murja Yari",
    role: "WFP cash transfer beneficiary, Katsina State",
    href: "/blog/murja-eight-years-of-struggle-to-renewed-hope",
    tone: "from-[#b45309] to-[#7c2d12]",
  },
  {
    quote: "In my lifetime, I have never seen maize with four cobs on one stalk. Dry-season farming allows you to harvest twice instead of remaining idle.",
    name: "Karba Mohamad, 65",
    role: "Farmer, Dabaibayawa Ward, Batagarawa LGA, Katsina State",
    href: "/blog/karba-four-cobs-on-one-stalk",
    tone: "from-[#15803d] to-[#14532d]",
  },
  {
    quote: "When my youngest son told me that my shop looks more beautiful now, I felt very proud.",
    name: "Mustafa Almajiri, 44",
    role: "Cap seller, Batagarawa, Katsina State",
    href: "/blog/mustafa-saving-a-family-business",
    tone: "from-[#1d4ed8] to-[#1e3a8a]",
  },
];
