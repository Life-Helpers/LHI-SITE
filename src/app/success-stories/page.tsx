import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, MapPin, Quote, Sparkles } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Success Stories | Life Helpers Initiative",
  description:
    "Real stories of hope, health recovery, and economic resilience from beneficiaries across Nigeria through Life Helpers Initiative programs.",
};

const stories = [
  {
    id: "fatima-nutrition",
    title: "How Tom Brown Restored Fatima's Vitality",
    beneficiary: "Amina & baby Fatima (14 months)",
    location: "Gusau LGA, Zamfara State",
    program: "MIYCN Nutrition & Child Survival",
    image: africanFulfillmentImages.healthHero.src,
    imageAlt: "Smiling African mother holding her healthy recovered baby full of life and joy",
    quote:
      "When Fatima fell severely sick and lost weight rapidly, I feared the worst. The LHI community health workers screened her, enrolled us in the CMAM program, and taught me how to make nutrient-rich Tom Brown at home. Today, she is vibrant, healthy, and laughing.",
    outcome:
      "Fatima achieved full weight stabilization within 6 weeks; Amina now trains other mothers in her village support group.",
  },
  {
    id: "aisha-tb-recovery",
    title: "A Second Chance: Beating TB and Launching a Micro-Grocery",
    beneficiary: "Aisha Mohammed (34 years)",
    location: "Wamakko LGA, Sokoto State",
    program: "Community Health & Livelihood Grants",
    image: africanFulfillmentImages.livelihoodHero.src,
    imageAlt: "Radiant African woman smiling broadly in front of her local micro-grocery kiosk",
    quote:
      "I was debilitated by chronic coughing and stigmatized. LHI's community surveillance volunteers identified me, facilitated free clinical diagnosis and medication adherence support. Once cured, they provided me with a livelihood start-up grant.",
    outcome:
      "Full medical recovery, accompanied by an operating provisions kiosk that pays school fees for her three children.",
  },
  {
    id: "clean-water-farming",
    title: "From Parched Earth to Flourishing Vegetable Fields",
    beneficiary: "Community Leader Mallam Usman",
    location: "Gujba LGA, Yobe State",
    program: "WASH & Climate-Smart Agriculture",
    image: africanFulfillmentImages.foodSecurityHero.src,
    imageAlt: "African community farmers smiling with satisfaction in thriving green vegetable fields",
    quote:
      "Our women and daughters walked over four kilometers every morning for turbid river water. LHI rehabilitated our defunct borehole with solar power. Now we have potable water right in our village square, and we use the surplus for dry-season onion and tomato farming.",
    outcome:
      "Zero reported water-borne cholera cases in 24 months, with 40 farmers harvesting year-round cash crops.",
  },
  {
    id: "zainab-nidake",
    title: "Breaking the Silence: From Out-of-School to Master Tailor",
    beneficiary: "Zainab Ibrahim (19 years)",
    location: "Sokoto South, Sokoto State",
    program: "REACH & NIDAKE Social Enterprise",
    image: africanFulfillmentImages.nidakeHero.src,
    imageAlt: "Confident smiling African young woman empowered through vocational tailoring skills",
    quote:
      "I dropped out of junior secondary school because my family couldn't afford sanitary items. Through LHI's REACH program, I learned literacy and tailoring. Now I work at the NIDAKE production center making reusable pads for younger girls so they never have to drop out.",
    outcome:
      "Graduated from accelerated literacy; earns an independent monthly income supporting her siblings.",
  },
  {
    id: "idp-resilience-borno",
    title: "Rebuilding Dignity in Jere After Displacement",
    beneficiary: "Hadiza Mustapha (42 years)",
    location: "Jere LGA, Borno State",
    program: "Emergency Protection & Multipurpose Cash",
    image: africanFulfillmentImages.emergenciesHero.src,
    imageAlt: "Relieved and smiling African mother receiving dignified humanitarian support",
    quote:
      "Arriving at the host community with nothing, life was overwhelming. The LHI protection team provided our family with dignity kits, emotional support in their child-friendly space, and multipurpose cash assistance to restart our lives with dignity.",
    outcome:
      "Re-established a home cooking business; all three school-age children enrolled in neighborhood public school.",
  },
  {
    id: "bello-vsla",
    title: "The Power of Savings: Multiplying Smallholder Harvests",
    beneficiary: "Mallam Bello Garba (48 years)",
    location: "Damaturu, Yobe State",
    program: "Village Savings & Loan Association (VSLA)",
    image: africanFulfillmentImages.socialInclusionHero.src,
    imageAlt: "Proud African farmer smiling warmly in community gathering",
    quote:
      "Commercial banks were impossible for small farmers like me. Joining LHI's VSLA group taught us financial discipline and group solidarity. I took a ₦50,000 credit loan to purchase certified drought-resistant seeds and organic fertilizer.",
    outcome:
      "Tripled crop yield in one harvest cycle; fully repaid the loan while maintaining emergency savings in the group box.",
  },
];

export default function SuccessStoriesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Real People, Real Impact"
        title={
          <>
            Stories of <em className="font-light italic text-primary">Fulfilled Smiles.</em>
          </>
        }
        subtitle="Putting a smile on a face: from severe vulnerability to radiant joy and self-reliance."
        description="Behind every statistic is a human face. Read how Life Helpers Initiative's integrated health, education, livelihood, and protection interventions transform households and build lasting resilience across Nigeria."
        image={africanFulfillmentImages.successStoriesHero}
      />

      {/* Stories Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                {/* Story Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={story.image}
                    alt={story.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-medium drop-shadow-sm">{story.location}</span>
                    <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
                      Restored Smile
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {story.program}
                      </span>
                      <h2 className="mt-1 text-xl font-bold text-foreground">
                        {story.title}
                      </h2>
                    </div>
                    <Quote className="h-8 w-8 shrink-0 text-primary/20" />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin size={13} className="text-primary" />
                    <span className="font-medium text-foreground">{story.beneficiary}</span>
                  </div>

                  <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-muted-foreground">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>

                  <div className="mt-6 rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs">
                    <div className="flex items-start gap-2 text-primary font-medium">
                      <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                      <span>Outcome: {story.outcome}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-primary fill-primary/20" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Help Us Write the Next Story
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Your support directly funds clinic treatments, clean water installations, school books, and livelihood seed grants for vulnerable families.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Donate Today →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                Volunteer or Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
