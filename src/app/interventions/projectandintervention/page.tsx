import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building,
  FileText,
  Handshake,
  HeartHandshake,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { InterventionsList } from "@/components/interventions-list";
import { OperationalMap } from "@/components/operational-map";
import { toMapProjects } from "@/data/operational-states";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { getInterventions, getStates } from "@/lib/cms/content";
import { jsonLdScript } from "@/lib/validation";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/interventions/projectandintervention" },
  title: "Projects & Interventions",
  description:
    "Explore active and past humanitarian, health, education, and livelihood interventions implemented by Life Helpers Initiative across 11 Nigerian states alongside MSH, Save the Children, UNICEF, Plan International, SIF, ZOA, and BMZ.",
  keywords: [
    "LHI projects",
    "interventions Nigeria",
    "Life Helpers Initiative programs",
    "MSH Zamfara malaria",
    "Save the Children Yobe early recovery",
    "Spotlight Initiative Sokoto",
    "UNICEF MIRP nutrition",
    "Plan International BMZ",
    "Secours Islamique France",
    "ZOA Borno agriculture",
  ],
  openGraph: {
    title: "Projects & Interventions | Life Helpers Initiative",
    description:
      "Comprehensive directory of LHI's evidence-based humanitarian and development projects mapped to our 6 thematic areas across 11 states in Nigeria.",
    type: "website",
    images: [{ url: "/logo.png", width: 1533, height: 440, alt: "Life Helpers Initiative (LHI) Logo" }],
  },
};

const institutionalDonors = [
  { name: "FCDO / World Food Programme", role: "Smallholder Farmers Resilience (Sokoto & Katsina)" },
  { name: "European Union / UNICEF", role: "RMNCH+N Quality of Care, Sokoto" },
  { name: "ECHO / UNICEF & IRC", role: "Education in Emergencies; Multi-Sectoral Resilience" },
  { name: "UNOCHA Nigeria Humanitarian Fund", role: "Life-saving Health & Nutrition" },
  { name: "USG BHA / Save the Children", role: "Multisectoral Lifesaving Assistance, Yobe" },
  { name: "USG OHA / International Rescue Committee", role: "Integrated Emergency Response, Sokoto" },
  { name: "FCDO / UNICEF", role: "Multi-sectoral Integrated Resilience Programme" },
  { name: "UNESCO", role: "Family Life HIV Education & Health and Wellbeing" },
  { name: "ZOA / Canadian Foodgrains Bank", role: "Food Security & Resilience" },
  { name: "UNDP", role: "Lake Chad Basin Peacebuilding" },
  { name: "CARE International", role: "EnRICH Frontline Health Workers; Child Health" },
  { name: "USG / Palladium Group", role: "Integrated Health Program" },
  { name: "Management Sciences for Health", role: "PMI-S Malaria" },
  { name: "Plan International", role: "SHOW (GAC); Peace & Health (BMZ); Protection (SIDA)" },
  { name: "UNICEF / KfW & DFID", role: "Girls' Education (GEP, G4G)" },
];

export default async function ProjectsAndInterventionsPage() {
  const [projects, states] = await Promise.all([getInterventions(), getStates()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Life Helpers Initiative Projects & Interventions",
    description:
      "Directory of evidence-based health, education, livelihoods, food security, social inclusion, and protection interventions implemented across Nigeria.",
    publisher: {
      "@type": "NGO",
      name: "Life Helpers Initiative",
      url: "https://lhinigeria.org",
    },
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      {/* Hero Banner */}
      <PageHeroBanner
        eyebrow="— Evidence-Based Action"
        title={
          <>
            Projects &amp; <em className="font-light italic text-primary">Interventions.</em>
          </>
        }
        subtitle="Empowering communities with sustainable solutions that bring lasting smiles."
        description="In the last two decades, LHI has implemented over 45 projects across Nigeria, directly reaching over 1.5 million people in more than 400,000 households, with partners including FCDO, WFP, the EU, UNICEF, UNOCHA, IRC, Save the Children, CARE, Plan International and ZOA."
        image={africanFulfillmentImages.interventionsHero}
      />

      {/* Key Numbers / Portfolio Highlights Bar */}
      <section className="border-b border-border bg-card/40 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{projects.length}</div>
                <div className="text-[11px] text-muted-foreground">Strategic Interventions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{states.length} States</div>
                <div className="text-[11px] text-muted-foreground">Operational Footprint</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">6 Thematic Areas</div>
                <div className="text-[11px] text-muted-foreground">Integrated Thematic Focus</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">1.5M+</div>
                <div className="text-[11px] text-muted-foreground">Direct Beneficiaries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 11-State Operational Map */}
      <section aria-labelledby="map-heading" className="border-b border-border py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="map-heading" className="mb-8 font-serif-display text-3xl font-light text-foreground">
            Interventions by <em className="italic text-primary">state.</em>
          </h2>
          <OperationalMap states={states} interventions={toMapProjects(projects)} />
        </div>
      </section>

      {/* Main Interactive Projects Directory */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <InterventionsList projects={projects} initialFilter="all" />
        </div>
      </section>

      {/* Institutional Partners & Donors Strip */}
      <section className="border-t border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Global Standards &middot; Local Reach
            </span>
            <h2 className="mt-2 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Trusted Institutional Partners &amp; Donors
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs text-muted-foreground">
              Our interventions undergo rigorous third-party monitoring, annual certified audits, and continuous community accountability feedback loops.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {institutionalDonors.map((donor, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 text-center shadow-2xs hover:border-primary/40 transition-colors"
              >
                <div className="font-semibold text-foreground text-xs">{donor.name}</div>
                <div className="mt-2 text-[10px] text-muted-foreground leading-snug">
                  {donor.role}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/impact"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <FileText size={14} />
              <span>Read Audited Annual Reports</span>
              <ArrowRight size={12} />
            </Link>
            <span className="text-muted-foreground">&middot;</span>
            <Link
              href="/our-commitment"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <ShieldCheck size={14} />
              <span>PSEA Safeguarding Protocols</span>
              <ArrowRight size={12} />
            </Link>
            <span className="text-muted-foreground">&middot;</span>
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <Award size={14} />
              <span>Verified Beneficiary Stories</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Consortium Bidding & Partnership CTA */}
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Partner With Life Helpers Initiative
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Looking for a battle-tested grassroots implementing partner across Northern Nigeria? LHI brings 20+ years of community trust, robust financial management (CAC/IT/NO: 20121), security risk mitigation, and proven delivery across all 6 thematic areas.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Building size={14} />
              <span>Request Consortium Partnership</span>
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Handshake size={14} />
              <span>Support Active Field Operations</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
