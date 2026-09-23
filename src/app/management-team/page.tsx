import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, ShieldAlert, Sparkles, Target } from "lucide-react";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { LEADERSHIP_TEAM, STATE_COORDINATORS } from "@/data/lhi-photos";

export const metadata: Metadata = {
  title: "Management Team | Life Helpers Initiative",
  description:
    "Meet the executive leadership and management team executing Life Helpers Initiative (LHI) programs across 11 Nigerian states.",
};

/** Directors per the Organisational Profile; unit descriptions from the Strategic Plan 2026–2030. */
const UNIT_OVERVIEWS: Record<string, { department: string; overview: string; credentials?: string }> = {
  "Tayo Fatinikun": {
    department: "Executive Directorate",
    credentials: "FICA, FIMC, CMC",
    overview:
      "Provides overall leadership of LHI, working with the Board of Trustees and the National Management Team to deliver the vision of “a more fulfilled life for everyone”.",
  },
  "Hadiza Ibrahim Yaro": {
    department: "Safeguarding, Accountability & Gender (SAG)",
    overview:
      "Coordinates safeguarding, accountability to affected populations, feedback mechanisms and inclusive gender programming across all projects.",
  },
  "Kolawole Adeniyi Famokun": {
    department: "Programmes",
    overview: "Coordinates and provides leadership across all six thematic areas of LHI's work.",
  },
  "Taiye Lawal": {
    department: "Business Development, Partnership & Grant Management (BuDPaGM)",
    overview:
      "Leads resource mobilisation, partner relationships, research into fundable opportunities and overall grant management.",
  },
  "Precious Afuaman": {
    department: "Monitoring, Evaluation, Research & Learning (MERL)",
    overview:
      "Coordinates data management, operational and programmatic research and assessment, knowledge management and learning.",
  },
  "Dapo Ogunyemi": {
    department: "Compliance & Internal Audit (CIA)",
    overview: "Ensures policy and procedural compliance across the organisation and upholds internal financial integrity.",
  },
  "James Olasunkanmi David": {
    department: "Operations",
    overview: "Oversees administration, security, supply chain and general logistics.",
  },
  "Ijeoma Beatrice Ekpunobi": {
    department: "Finance",
    overview: "Coordinates and manages all financial transactions and documentation.",
  },
};

const leaders = LEADERSHIP_TEAM.map((person) => ({ ...person, ...UNIT_OVERVIEWS[person.name] }));

export default function ManagementTeamPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Executive Leadership"
        title={
          <>
            Management <em className="font-light italic text-primary">Team.</em>
          </>
        }
        subtitle="Dedicated professionals driving impact and putting smiles on communities across Nigeria."
        description="LHI has over 350 staff members and more than 700 community volunteers, with an active Board of Trustees and a National Management Team made up of the Senior Leadership Team and the State Office Coordinators, who run day-to-day operations."
        image={africanFulfillmentImages.teamHero}
      />

      {/* Organizational Structure Note */}

      {/* Leadership Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image src={leader.photo} alt={`Portrait of ${leader.name}`} fill sizes="80px" className="object-cover object-top" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                      {leader.department}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-foreground">{leader.name}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      {leader.role}
                      {leader.credentials && <span className="ml-1 font-normal normal-case text-muted-foreground">· {leader.credentials}</span>}
                    </p>
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {leader.overview}
                </p>

                <div className="mt-6 border-t border-border pt-4 text-xs">
                  <a href={`mailto:${leader.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                    <Mail size={12} /> {leader.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* State Office Coordinators */}
          <div className="mt-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">National Management Team</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">State Office Coordinators</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Responsible for the day-to-day operations of LHI in each state, working with the Senior Leadership Team.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STATE_COORDINATORS.map((c) => (
                <li key={c.email} className="rounded-2xl border border-border bg-card p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <MapPin size={12} /> {c.state}
                  </p>
                  <p className="mt-1.5 font-bold text-foreground">{c.name}</p>
                  <a href={`mailto:${c.email}`} className="mt-1 inline-block break-all text-xs text-primary hover:underline">
                    {c.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Accountability Banner */}
          <div className="mt-16 grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Field Operational Rigor</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Offices in 11 states, over 350 staff and 700+ community volunteers ensuring continuous service delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Zero Tolerance (PSEA)</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Strict safeguarding guidelines enforced across every staff member, contractor, and volunteer.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">People-Centered Impact</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Putting a smile on every face — touching lives, transforming households, and impacting communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
