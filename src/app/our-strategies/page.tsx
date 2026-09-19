import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Eye,
  HeartHandshake,
  Layers,
  Radio,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Our Strategies | Life Helpers Initiative",
  description:
    "Explore the strategic frameworks, community-led models, and multi-sectoral methodologies driving Life Helpers Initiative's impact in Nigeria.",
};

const strategies = [
  {
    icon: Users,
    title: "1. Community Gatekeeper & Grassroots Co-Ownership",
    subtitle: "Locally anchored, culturally sensitive",
    description:
      "Interventions succeed when communities own the solution. LHI engages traditional rulers, faith-based leaders, Ward Development Committees (WDCs), and women groups prior to project inception. We secure communal trust and establish community-led steering committees to oversee every facility rehabilitation and distribution.",
  },
  {
    icon: Layers,
    title: "2. Integrated Multi-Sectoral Convergence",
    subtitle: "Breaking siloes across health, education, and livelihoods",
    description:
      "A vulnerable family does not experience vulnerability in single-issue categories. Our model integrates health care (antenatal and immunization) with nutrition stabilization, clean water access (WASH), girl-child educational retention, and cash-for-livelihood grants — producing compounding positive household resilience.",
  },
  {
    icon: HeartHandshake,
    title: "3. Systems Strengthening & Institutional Sustainability",
    subtitle: "Building the capacity of local duty-bearers",
    description:
      "Rather than creating parallel structures, LHI works inside Primary Healthcare Centers (PHCs), School-Based Management Committees (SBMCs), and LGA Social Welfare departments. We train local healthcare workers, provide diagnostic tools, and mentor local officials to maintain service standards long after project cycles close.",
  },
  {
    icon: TrendingUp,
    title: "4. Women & Youth Socio-Economic Empowerment",
    subtitle: "Savings groups, vocational skills, and asset transfers",
    description:
      "We champion Village Savings and Loan Associations (VSLA) alongside technical skills acquisition. By training women and adolescent girls in financial literacy, enterprise management, and small ruminant rearing, we break cyclical intergenerational poverty and reduce reliance on emergency aid.",
  },
  {
    icon: Eye,
    title: "5. Rigorous MEAL & Digital Accountability",
    subtitle: "Evidence-based tracking and community feedback desks",
    description:
      "Our Monitoring, Evaluation, Accountability, and Feedback (MEAL) unit deploys Community-Based Surveillance, mobile digital data tools, and anonymous beneficiary feedback boxes. Real-time data informs course corrections and guarantees transparent, auditable reporting for international partners.",
  },
  {
    icon: Radio,
    title: "6. Mass Media & Community Radio Advocacy",
    subtitle: "Broadcasting civic education and behavior change",
    description:
      "Through flagship community radio programs such as the 'Women Situation Room' and weekly health dialogues, LHI broadcasts in local languages (Hausa, Kanuri, Fulfulde, Igbo) reaching millions of rural listeners with messages on child protection, immunization, and peaceful dispute resolution.",
  },
];

export default function OurStrategiesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Operational Framework"
        title={
          <>
            Our Strategic <em className="font-light italic text-primary">Approach.</em>
          </>
        }
        subtitle="Transformative methodologies that build lasting smiles, resilience, and self-reliance."
        description="At Life Helpers Initiative, sustainable transformation requires more than short-term humanitarian relief. Our strategic approach balances rapid emergency response with long-term resilience building, community empowerment, and systemic institutional change."
        image={africanFulfillmentImages.strategiesHero}
      />

      {/* Strategies Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {strategies.map((strat) => (
              <div
                key={strat.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <strat.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-foreground">{strat.title}</h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {strat.subtitle}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {strat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Cross-Cutting Pillars */}
          <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 sm:p-12">
            <h3 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Cross-Cutting Institutional Priorities
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="mt-2 text-sm font-semibold text-foreground">
                  Safeguarding & PSEA
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mandatory zero-tolerance enforcement against sexual exploitation, abuse, and harassment in every operational state.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <Scale className="h-5 w-5 text-primary" />
                <h4 className="mt-2 text-sm font-semibold text-foreground">
                  Gender & Disability Equity
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dedicated Disability Fund and affirmative inclusion quotas for women and persons living with disabilities.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <Activity className="h-5 w-5 text-primary" />
                <h4 className="mt-2 text-sm font-semibold text-foreground">
                  Climate-Smart Adaptation
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drought-resistant seed varieties, regenerative farming practices, and environmental sanitation campaigns.
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/interventions/projectandintervention"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Explore Active Interventions & Projects →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
