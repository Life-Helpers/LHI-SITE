import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, Gavel, Scale, ShieldCheck } from "lucide-react";

import { ListingCard } from "@/components/careers/listing-card";
import { VendorRegistrationForm } from "@/components/procurement/vendor-registration-form";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { getPublicTenders } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/procurement" },
  title: "Procurement & Vendor Requests",
  description:
    "Open requests for quotation, tenders and expressions of interest from Life Helpers Initiative, and vendor registration for suppliers and service providers.",
};

const principles = [
  { icon: Scale, title: "Fair and competitive", text: "Requests are published openly and responses are evaluated against the criteria stated in each request." },
  { icon: ShieldCheck, title: "Safeguarding applies to vendors", text: "Suppliers, contractors and consultants working with LHI must uphold its safeguarding and PSEA standards." },
  { icon: FileCheck2, title: "Due diligence", text: "Registered vendors may be asked for CAC registration, tax clearance and other documents before award." },
];

export default async function ProcurementPage() {
  const { open, past } = await getPublicTenders();

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Procurement"
        title={
          <>
            Supply to <em className="font-light italic text-primary">Life Helpers Initiative.</em>
          </>
        }
        subtitle="Requests for quotation, tenders and vendor registration."
        description="LHI buys goods, works and services for its projects across Nigeria. Open requests are listed below; submit your response online before the deadline."
        image={{ ...LHI_PHOTOS.kitDistribution, tag: "Field distribution" }}
      />

      <section className="py-16 md:py-20" aria-labelledby="open-requests">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Open requests</p>
          <h2 id="open-requests" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">Current vendor requests</h2>
          {open.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {open.map((t) => (
                <ListingCard
                  key={t.id}
                  href={`/procurement/${t.id}`}
                  eyebrow={`${t.reference} · ${t.procurementType}`}
                  badge={t.category}
                  title={t.title}
                  summary={t.summary}
                  location={t.location}
                  deadline={t.deadline}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center">
              <Gavel className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground">No open requests at the moment</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                Register your company below and LHI&apos;s procurement team can reach you when a matching request is published.
              </p>
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-14">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Closed &amp; awarded</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {past.map((t) => (
                  <ListingCard
                    key={t.id}
                    href={`/procurement/${t.id}`}
                    eyebrow={`${t.reference} · ${t.procurementType}`}
                    badge={t.category}
                    title={t.title}
                    summary={t.summary}
                    location={t.location}
                    deadline={t.deadline}
                    closed={t.status === "awarded" ? "Awarded" : "Closed"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {principles.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-5">
              <p.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="register" className="py-16 md:py-20" aria-labelledby="register-heading">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Vendor database</p>
            <h2 id="register-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground">Register as a vendor</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tell us what you supply and where. Registration does not guarantee business, but it helps LHI invite qualified vendors to relevant
              requests.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Looking for LHI&apos;s own registration and compliance documents?{" "}
              <Link href="/partner-portal" className="font-medium text-primary hover:underline">Visit the Partner &amp; Bidder Portal</Link>.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:col-span-2">
            <VendorRegistrationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
