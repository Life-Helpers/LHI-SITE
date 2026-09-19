import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, ShieldCheck, Users } from "lucide-react";

import { siteConfig } from "@/config/site";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Board of Trustees | Life Helpers Initiative",
  description:
    "Meet the Board of Trustees providing strategic governance, fiduciary stewardship, and mission alignment for Life Helpers Initiative (LHI).",
};

const trustees = [
  {
    name: "Engr. Godfrey Mayoku",
    role: "Board Chairman",
    qualification: "FNSE, COREN Registered",
    bio: "Brings extensive strategic leadership, engineering management, and governance experience. Provides high-level strategic direction, ensuring institutional resilience, infrastructure integrity, and corporate accountability across all LHI operations.",
  },
  {
    name: "Mr. Tayo Fatinikun",
    role: "National Executive Director & Trustee",
    qualification: "FICA, FIMC, CMC",
    bio: "Founding visionary of Life Helpers Initiative (originally Beulah Projects in 2004). With over two decades of humanitarian programming, civil society leadership, and public policy advocacy, he steers LHI's mission, field expansions, and donor partnerships across 11 states.",
  },
  {
    name: "Pharm. Iyabo Adebisi",
    role: "Board Secretary",
    qualification: "FPSN, Public Health Specialist",
    bio: "A seasoned healthcare administrator and pharmaceutical leader overseeing board compliance, statutory secretarial duties, and health-sector intervention strategies, championing maternal-infant health and clinical quality assurance.",
  },
  {
    name: "Barr. Joy Ihenacho",
    role: "Board Member & Legal Counsel",
    qualification: "LL.B, B.L, Human Rights Advocate",
    bio: "Leads legal governance, human rights compliance, and safeguarding oversight. Guides statutory corporate compliance with CAC guidelines, statutory audits, and beneficiary protection mechanisms.",
  },
  {
    name: "Pharm. Sam Olaoye",
    role: "Board Member",
    qualification: "M.Pharm, Supply Chain Consultant",
    bio: "Specialist in humanitarian logistics, medical supply chain management, and clinical intervention protocols. Advises on cold-chain vaccine delivery, essential drug distribution, and emergency health readiness.",
  },
  {
    name: "Mrs. Bukola Fatinikun",
    role: "Board Member",
    qualification: "M.Ed, Social Development Advocate",
    bio: "A dedicated educationist and social development practitioner focused on girl-child empowerment, early childhood development, vulnerable household livelihoods, and community-level social inclusion.",
  },
];

export default function BoardOfTrusteesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Governance &amp; Stewardship"
        title={
          <>
            Board of <em className="font-light italic text-primary">Trustees.</em>
          </>
        }
        subtitle="Guiding our mission to put smiles and long-term fulfillment on faces across Nigeria."
        description={`Life Helpers Initiative is governed by a distinguished, independent Board of Trustees registered under Part C of the Companies and Allied Matters Act (${siteConfig.cacRegistration}). The Board provides non-executive strategic guidance, fiduciary oversight, and programmatic accountability across all 11 operational states.`}
        image={africanFulfillmentImages.boardHero}
      />

      {/* Governance Charter Highlights */}
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Fiduciary Oversight</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Rigorous independent external audits, donor grant compliance, and anti-fraud monitoring.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
              <Users className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Mission Stewardship</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Guiding organizational priorities towards the most vulnerable, marginalized, and underserved.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
              <Award className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">Statutory Compliance</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Strict adherence to CAC regulations, PSEA standards, and national humanitarian protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trustees Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {trustees.map((trustee) => (
              <div
                key={trustee.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-baseline justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{trustee.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {trustee.role}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {trustee.qualification}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {trustee.bio}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-primary">
                  <CheckCircle2 size={14} />
                  <span>Trustee Member · Life Helpers Initiative</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
            <h2 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Meet our Operational Management Team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Our executive directors and departmental heads translate strategic board mandates into daily field impact across health, education, livelihoods, and protection.
            </p>
            <div className="mt-6">
              <Link
                href="/management-team"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90"
              >
                View Management Team →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
