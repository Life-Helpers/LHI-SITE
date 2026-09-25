import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, ShieldAlert, Sparkles, Target } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { getTeam } from "@/lib/cms/content";

export const metadata: Metadata = {
  alternates: { canonical: "/management-team" },
  title: "Management Team",
  description:
    "Meet the executive leadership and management team executing Life Helpers Initiative (LHI) programs across 11 Nigerian states.",
};

/** Profiles come from Admin → Team; saves refresh the page instantly, this is a safety net. */
export const revalidate = 300;

export default async function ManagementTeamPage() {
  const [leaders, coordinators] = await Promise.all([getTeam("management"), getTeam("coordinator")]);
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
                key={leader.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image src={leader.photo || "/icon.png"} alt={`Portrait of ${leader.name}`} fill sizes="80px" className="object-cover object-top" />
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

                {leader.email && (
                  <div className="mt-6 border-t border-border pt-4 text-xs">
                    <a href={`mailto:${leader.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                      <Mail size={12} /> {leader.email}
                    </a>
                  </div>
                )}
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
              {coordinators.map((c) => (
                <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <MapPin size={12} /> {c.state}
                  </p>
                  <p className="mt-1.5 font-bold text-foreground">{c.name}</p>
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="mt-1 inline-block break-all text-xs text-primary hover:underline">
                      {c.email}
                    </a>
                  )}
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
