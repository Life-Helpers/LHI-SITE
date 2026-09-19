import type { Metadata } from "next";
import Link from "next/link";
import {
  Baby,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  MapPin,
  Radio,
  ShieldCheck,
  Users,
  Wheat,
} from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Projects & Interventions | Life Helpers Initiative",
  description:
    "Explore active and past humanitarian, health, education, and livelihood interventions implemented by Life Helpers Initiative across 11 Nigerian states.",
};

const interventions = [
  {
    id: "plan-aspired",
    title: "ASPIRED: Adolescent Sexual and Reproductive Health and Rights",
    donor: "Funded by Global Affairs Canada & Canadian Donors, via Plan International",
    category: "Health & Gender",
    locations: "Bauchi & Sokoto States",
    duration: "5-Year Multi-Phase Project",
    icon: HeartPulse,
    summary:
      "A flagship initiative improving adolescent sexual and reproductive health outcomes. LHI establishes youth-friendly health corners, trains frontline health workers on respectful adolescent care, and mobilizes peer educators to dismantle taboos and counter early child marriage.",
    stats: "Over 85,000 adolescents reached with youth-friendly healthcare and rights education.",
  },
  {
    id: "plan-bmz",
    title: "PLAN BMZ Community Resilience & Livelihoods Project",
    donor: "German Federal Ministry for Economic Cooperation and Development (BMZ) via Plan International",
    category: "Livelihoods & Food Security",
    locations: "Yobe State (Conflict-Affected LGAs)",
    duration: "Multi-Year Humanitarian-Development Nexus",
    icon: Wheat,
    summary:
      "Strengthening economic resilience in communities recovering from insurgency. Delivers Village Savings and Loan Associations (VSLA), climate-resilient dry-season farming inputs, small ruminant livestock transfers to female-headed households, and local peace committees.",
    stats: "120+ Village Savings groups established, supporting over 3,200 households.",
  },
  {
    id: "unicef-mirp",
    title: "UNICEF Multi-Sectoral Integrated Resilience Programme (MIRP)",
    donor: "UNICEF Nigeria",
    category: "Resilience, Health & WASH",
    locations: "Zamfara State (Gusau, Maru, Kaura Namoda, Anka)",
    duration: "Active Field Program",
    icon: Baby,
    summary:
      "Combines nutrition stabilization, infant and young child feeding (IYCF), routine immunization catch-up, and community-led total sanitation (CLTS) to reverse acute malnutrition and infectious disease burdens in hard-to-reach rural wards.",
    stats: "45,000+ children screened for malnutrition; 98% cure rate in outpatient stabilization.",
  },
  {
    id: "unicef-reach",
    title: "REACH: Reaching and Empowering Adolescent Girls",
    donor: "UNICEF Nigeria",
    category: "Education & Protection",
    locations: "Northwest Nigeria (Sokoto, Kebbi, Zamfara)",
    duration: "Multi-Year Initiative",
    icon: GraduationCap,
    summary:
      "Re-enrolling out-of-school adolescent girls and survivors of violence into non-formal accelerated literacy, numeracy, and vocational skills programs. Integrates psycho-social counseling, menstrual hygiene management, and enterprise start-up kits.",
    stats: "Over 14,000 adolescent girls transitioned to formal schools or viable micro-enterprises.",
  },
  {
    id: "nhf-cpie",
    title: "NHF Emergency Child Protection & Dignity Kit Distribution",
    donor: "Nigeria Humanitarian Fund (NHF) / UN OCHA, Child Protection AoR",
    category: "Protection & Emergencies",
    locations: "Borno State (Jere LGA & Maiduguri Metropole)",
    duration: "Humanitarian Response",
    icon: ShieldCheck,
    summary:
      "Providing emergency child protection case management, identification and tracing of unaccompanied and separated children (UASC), safe spaces for children displaced by conflict, and distribution of comprehensive dignity kits to women and adolescent girls.",
    stats: "18,000+ dignity kits delivered; 2,400 vulnerable children provided psychosocial first aid.",
  },
  {
    id: "unicef-sarah",
    title: "SARAH: Strengthening Access to Reproductive & Adolescent Health",
    donor: "UNICEF Nigeria",
    category: "Health & Youth",
    locations: "Sokoto State",
    duration: "Strategic Program",
    icon: Users,
    summary:
      "Empowers adolescent girls through school health clubs, community health dialogues, and youth-tailored clinic days at primary healthcare facilities, reducing teenage pregnancy and maternal mortality.",
    stats: "110 health facility staff mentored in youth-responsive healthcare delivery.",
  },
  {
    id: "bmz-mothers",
    title: "BMZ / KfW Mothers' Associations for Girls' Education",
    donor: "German Government (BMZ) via KfW Development Bank & UNICEF",
    category: "Education in Emergencies",
    locations: "Zamfara & Sokoto States",
    duration: "Education Program",
    icon: GraduationCap,
    summary:
      "Mobilizes mothers into organized advocacy associations that monitor girl-child school attendance, conduct house-to-house enrollment drives, and manage community revolving micro-funds for school uniforms and books.",
    stats: "Over 220 functional Mothers' Associations established across 40 rural wards.",
  },
  {
    id: "nhf-wash",
    title: "NHF Integrated WASH & Cholera Outbreak Prevention",
    donor: "Nigeria Humanitarian Fund (NHF)",
    category: "WASH & Public Health",
    locations: "Adamawa & Borno States",
    duration: "Emergency Health Response",
    icon: HeartPulse,
    summary:
      "Rehabilitating dysfunctional community boreholes with solar pumps, constructing disability-accessible sanitation blocks in IDP camps, and deploying door-to-door community health volunteers for rapid cholera case detection and water chlorination.",
    stats: "Over 65,000 community members provided sustained access to safe potable water.",
  },
  {
    id: "women-situation-room",
    title: "Women Situation Room & Peace Radio Dialogues",
    donor: "Life Helpers Initiative Media Advocacy Directorate",
    category: "Advocacy & Media",
    locations: "11 States Broadcast Network",
    duration: "Weekly Flagship Broadcast",
    icon: Radio,
    summary:
      "Broadcasting weekly radio discussions in Hausa, Kanuri, and English addressing gender-based violence, civic rights, peacebuilding, routine immunization, and reproductive healthcare, reaching rural communities without internet access.",
    stats: "Over 2.5 million weekly listeners across northern and central Nigeria.",
  },
];

export default function ProjectsAndInterventionsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Evidence-Based Action"
        title={
          <>
            Projects &amp; <em className="font-light italic text-primary">Interventions.</em>
          </>
        }
        subtitle="Empowering communities with sustainable solutions that bring lasting smiles."
        description="Since 2004, Life Helpers Initiative has executed high-impact multi-sectoral projects with leading international donors including UNICEF, Plan International, the Nigeria Humanitarian Fund (NHF), BMZ Germany, and Global Affairs Canada."
        image={africanFulfillmentImages.interventionsHero}
      />

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {interventions.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <proj.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                        {proj.category}
                      </span>
                      <h2 className="text-lg font-bold text-foreground sm:text-xl">
                        {proj.title}
                      </h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {proj.duration}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <MapPin size={13} className="text-primary" />
                    {proj.locations}
                  </span>
                  <span>Donor: {proj.donor}</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {proj.summary}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs">
                  <div className="flex items-center gap-2 font-medium text-primary">
                    <CheckCircle2 size={15} />
                    <span>Impact Metric: {proj.stats}</span>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Inquire About This Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <h3 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Partner With Us on Future Interventions
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              LHI provides rapid field mobilization, extensive local trust, transparent financial auditing, and robust MEAL frameworks across 11 states in Nigeria.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Contact Partnerships Directorate
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                Support Field Operations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
