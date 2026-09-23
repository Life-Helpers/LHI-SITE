import type { Metadata } from "next";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { PartnerPortal } from "@/components/partner-portal/partner-portal";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { getDocuments, getStates } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Partner & Bidder Portal",
  description:
    "Institutional donor and consortium bidding hub: CAC registration, tax clearance, audited financial statements, PSEA, child safeguarding and anti-fraud policies, plus an expedited RFP expression-of-interest intake.",
};

const DONORS = ["USAID", "European Union", "United Nations", "FCDO", "GIZ / BMZ"];

export default async function PartnerPortalPage() {
  const [documents, states] = await Promise.all([getDocuments(), getStates()]);
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Institutional Donor & Consortium Bidding Hub"
        title={
          <>
            Partner &amp; <em className="font-light italic text-primary">Bidder Portal.</em>
          </>
        }
        subtitle="A single gateway for multilateral agencies, bilateral donors and lead applicants."
        description="Access LHI's registration, tax, financial and safeguarding documentation for due diligence, and fast-track a consortium partnership or RFP expression of interest with our partnerships team."
        image={africanFulfillmentImages.interventionsHero}
      />

      <section className="border-b border-border bg-card/40 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:px-6 lg:px-8">
          <span className="text-foreground">Built for</span>
          {DONORS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </section>

      <PartnerPortal documents={documents} states={states} />
    </main>
  );
}
