import type { Metadata } from "next";
import { CheckCircle2, Mail, ShieldAlert, Sparkles, Target } from "lucide-react";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Management Team | Life Helpers Initiative",
  description:
    "Meet the executive leadership and management team executing Life Helpers Initiative (LHI) programs across 11 Nigerian states.",
};

const leaders = [
  {
    name: "Mr. Tayo Fatinikun",
    title: "National Executive Director",
    credentials: "FICA, FIMC, CMC",
    department: "Executive Directorate",
    overview:
      "Leads overall strategic trajectory, institutional partnerships, and multi-state operations. With over 20 years guiding LHI from its grassroots inception to a premier national NGO, he spearheads high-level stakeholder engagement with UN agencies, bilateral donors, and government ministries.",
  },
  {
    name: "Taiye Lawal",
    title: "Director of Business Development, Partnership & Grant",
    credentials: "MBA, PMP",
    department: "Business Development & Partnerships",
    overview:
      "Directs proposal formulation, institutional fundraising, donor relationship management, and strategic partnerships with global bodies including UNICEF, Plan International, ActionAid, and the Nigeria Humanitarian Fund.",
  },
  {
    name: "Hadiza Ibrahim Yaro",
    title: "Director of Gender and Social Inclusion",
    credentials: "M.Sc Gender Studies",
    department: "Gender & Social Inclusion (GESI)",
    overview:
      "Champions gender mainstreaming, Protection Against Sexual Exploitation and Abuse (PSEA), the LHI Disability Fund, and community-level survivor protection hubs across Northern Nigeria.",
  },
  {
    name: "Kolawole Famokun",
    title: "Director of Programs",
    credentials: "MPH, Project Lead",
    department: "Programs & Field Implementation",
    overview:
      "Oversees technical design and multi-sectoral execution across Health, Nutrition, Education in Emergencies, Livelihoods, and Climate-Smart Agriculture throughout all 11 operational state offices.",
  },
  {
    name: "James Olasunkanmi David",
    title: "Director of Operations",
    credentials: "MCILT, Logistics Lead",
    department: "Operations, Logistics & Security",
    overview:
      "Manages field logistics, procurement, human resources, fleet operations, and safety protocols in high-stakes and remote hard-to-reach humanitarian operational corridors.",
  },
  {
    name: "Precious Andrew",
    title: "Director of Monitoring, Evaluation, Accountability & Feedback (MEAL)",
    credentials: "M.Sc Biostatistics, MEAL Specialist",
    department: "MEAL & Quality Assurance",
    overview:
      "Directs data governance, digital data collection, Community-Based Surveillance, beneficiary feedback desks, and impact evaluations ensuring verifiable donor accountability.",
  },
  {
    name: "Ijeoma Ekpunobi",
    title: "Director of Finance",
    credentials: "FCA, ACCA",
    department: "Finance & Accounts",
    overview:
      "Leads fiscal planning, treasury operations, sub-grant financial compliance, and budget tracking in strict accordance with International Financial Reporting Standards (IFRS).",
  },
  {
    name: "Oladapo Ogunyemi",
    title: "Internal Audit and Compliance",
    credentials: "CIA, CFE",
    department: "Audit & Risk Mitigation",
    overview:
      "Safeguards organizational integrity through independent continuous audits, internal controls verification, fraud prevention, and strict statutory compliance.",
  },
];

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
        description="Our management team brings deep technical expertise in public health, humanitarian logistics, gender inclusion, financial compliance, and monitoring & evaluation. Together, they steer over 350 full-time staff and hundreds of community volunteers in frontline communities across 11 states."
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
                <div className="border-b border-border pb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    {leader.department}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{leader.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {leader.title}
                    </p>
                    <span className="text-xs text-muted-foreground">· {leader.credentials}</span>
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {leader.overview}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CheckCircle2 size={13} className="text-primary" />
                    Life Helpers Initiative
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.officialEmail}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Mail size={12} /> Contact Directorate
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Accountability Banner */}
          <div className="mt-16 grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Field Operational Rigor</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active field presence in 11 states ensuring swift humanitarian response and continuous service delivery.
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
