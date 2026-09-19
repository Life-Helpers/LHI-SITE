import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Our History | Life Helpers Initiative",
  description:
    "The journey of Life Helpers Initiative: from Beulah Projects in 2004 to a national humanitarian and development organization operating across 11 states in Nigeria.",
};

const milestones = [
  {
    year: "2004",
    title: "Inception as Beulah Projects",
    location: "Sokoto State",
    summary:
      "Founded on October 1, 2004 in Sokoto under the initial name 'Beulah Projects' by Mr. Tayo Fatinikun and colleagues. Began as a grassroots volunteer initiative dedicated to orphans and vulnerable children (OVC), providing joyful funfairs, educational kits, nutritional feeding, and emotional safe spaces.",
  },
  {
    year: "2006",
    title: "Structural Formalization",
    location: "Sokoto State",
    summary:
      "As community health crises and vulnerability deepened across Northwest Nigeria, the volunteer group recognized the need for a structured institutional framework. The organization restructured to address maternal mortality, childhood illnesses, and community livelihoods.",
  },
  {
    year: "2007",
    title: "Incorporation as Life Helpers Initiative",
    location: "National CAC Registration",
    summary:
      "Officially registered with the Corporate Affairs Commission (CAC) under Part C as Life Helpers Initiative (CAC/IT/NO 25301). Established formal institutional governance, an independent Board of Trustees, and secured strategic collaboration with state health ministries.",
  },
  {
    year: "2013",
    title: "Expansion to Kebbi State",
    location: "Kebbi State",
    summary:
      "Scaled programming beyond Sokoto into neighboring Kebbi State, rolling out community-based maternal and child healthcare, routine immunization campaigns, and rural Water, Sanitation, and Hygiene (WASH) infrastructure.",
  },
  {
    year: "2015",
    title: "Expansion to Zamfara State",
    location: "Zamfara State",
    summary:
      "Launched large-scale interventions in Zamfara State focusing on girls' education, community nutrition stabilization for children under five, and gender-based violence prevention through Mothers' Associations and community leaders.",
  },
  {
    year: "2017",
    title: "North-East Humanitarian Crisis Response",
    location: "Borno, Yobe, & Adamawa States",
    summary:
      "In response to the severe humanitarian emergency in North-East Nigeria, LHI deployed frontline teams to Maiduguri (Borno), Damaturu (Yobe), and Yola (Adamawa). Implemented emergency Child Protection in Emergencies (CPiE), malnutrition stabilization, and emergency psychosocial support funded by the Nigeria Humanitarian Fund (NHF) and international partners.",
  },
  {
    year: "2020",
    title: "Expansion to Bauchi State",
    location: "Bauchi State",
    summary:
      "Commenced comprehensive adolescent reproductive health, girl-child empowerment, and community resilience programs in Bauchi, including the multi-year ASPIRED project funded by Global Affairs Canada in partnership with Plan International.",
  },
  {
    year: "2021",
    title: "Abuja Liaison Office & Ebonyi State Expansion",
    location: "FCT Abuja & Ebonyi State",
    summary:
      "Established the Abuja Implementation & Liaison Office in Gwarimpa to facilitate national policy dialogue, federal ministry engagement, and donor coordination. Extended operations into Ebonyi State in Southeast Nigeria, advancing inclusive socio-economic livelihoods.",
  },
  {
    year: "2022",
    title: "Expansion to Plateau State",
    location: "Plateau State",
    summary:
      "Initiated community peacebuilding, conflict-sensitive agriculture, and social inclusion initiatives in Plateau State, bridging communal divides through youth-led dialogues and women-led savings groups.",
  },
  {
    year: "2023–Present",
    title: "Katsina Expansion & Nationwide Impact",
    location: "11 Frontline States",
    summary:
      "Expanded into Katsina State to tackle maternal health and educational barriers. Today, LHI operates across 11 states with over 350 full-time staff, 700+ community volunteers, and millions of lives touched across health, education, livelihoods, agriculture, and protection.",
  },
];

export default function OurHistoryPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Our Journey (2004 – Present)"
        title={
          <>
            Two decades of <em className="font-light italic text-primary">compassionate impact.</em>
          </>
        }
        subtitle="Putting smiles on faces across Nigeria for over 20 years."
        description="What began in 2004 as Beulah Projects — a small community effort bringing smiles to orphans and vulnerable children in Sokoto — has matured into a premier national NGO delivering lifesaving relief, sustainable healthcare, education, and economic empowerment across 11 Nigerian states."
        image={africanFulfillmentImages.historyHero}
      />

      {/* Core Numbers */}
      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">2004</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Founding Year</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">11</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Operational States</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">350+</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Full-time Staff</p>
            </div>
            <div>
              <p className="font-serif-display text-3xl font-light text-primary sm:text-4xl">20+ Yrs</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Grassroots Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative border-l-2 border-primary/20 pl-6 sm:pl-10 space-y-12">
            {milestones.map((m) => (
              <div key={m.year} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors">
                  <div className="h-2 w-2 rounded-full bg-primary group-hover:bg-background transition-colors" />
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-serif-display text-2xl font-bold text-primary sm:text-3xl">
                    {m.year}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    <MapPin size={11} className="text-accent" />
                    {m.location}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {m.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-accent fill-accent" />
            <h2 className="mt-4 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              &ldquo;Putting a smile on a face&rdquo;
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Touching lives, transforming households, and impacting communities.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/our-strategies"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Our Strategic Approach →
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
