import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Download, Maximize2, Sun, Users, Warehouse } from "lucide-react";

import { Infographics } from "@/components/fact-sheet/infographics";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { LHI_PHOTOS } from "@/data/lhi-photos";

export const metadata: Metadata = {
  alternates: { canonical: "/brochure" },
  title: "Brochure",
  description:
    "The Noma Tushen Arziki Farmer Service Center, a solar-powered resilience hub for smallholder farmers, women and youth under the FCDO/WFP resilience project, implemented by LHI.",
};

const PDF = "/documents/noma-tushen-arziki-farmer-service-center-brochure.pdf";

const pages = [
  {
    src: "/brochure/noma-tushen-arziki-resilience-hub.jpg",
    alt: "Brochure page: Resilience Hub, Noma Tushen Arziki Farmer Service Center 2025, with background, approach, project map and metrics",
    w: 2000,
    h: 1424,
  },
  {
    src: "/brochure/noma-tushen-arziki-core-message.jpg",
    alt: "Brochure page: core message and core focus areas of the Noma Tushen Arziki Farmer Service Center 2025",
    w: 1317,
    h: 744,
  },
];

const approach = [
  "Address gaps in extension and advisory services.",
  "Climate-smart technologies for production.",
  "Employment for youth and women along value-chain nodes, using a pay-per-use revolving model for sustainability.",
  "Better access to improved inputs, as a one-stop shop for agricultural inputs suited to each agro-ecology.",
];

const units = [
  { icon: Users, title: "Farmer service and extension centre" },
  { icon: Warehouse, title: "Community storage banks" },
  { icon: BarChart3, title: "Mechanised agro-processing centre" },
  { icon: Sun, title: "Solar cold room and mobile charging docks" },
];

const metrics = [
  { value: "63% / 37%", label: "Women / men" },
  { value: "1,000+", label: "People expected to access value-chain jobs in the hub" },
  { value: "20 kVA", label: "Solar power for horticulture and food processing" },
];

export default function BrochurePage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Accountability"
        title={
          <>
            Our <em className="font-light italic text-primary">Brochure.</em>
          </>
        }
        subtitle="Noma Tushen Arziki Farmer Service Center: a resilience hub for smallholder farmers."
        description="A solar-powered, community-run centre in Sokoto State under the FCDO/WFP Resilience Building and Smallholder Farmers Support Project, implemented by LHI."
        image={{ ...LHI_PHOTOS.hubAerial, tag: "Noma Tushen Arziki hub, Wamakko LGA" }}
      />

      <section aria-labelledby="view-heading" className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— View the brochure</p>
              <h2 id="view-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                Resilience Hub · Farmer Service Center 2025
              </h2>
            </div>
            <a
              href={PDF}
              download
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Download brochure (PDF)
            </a>
          </div>

          <div className="mt-10 space-y-8">
            {pages.map((p, i) => (
              <figure key={p.src} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <a href={p.src} target="_blank" rel="noopener noreferrer" className="group relative block" aria-label={`Open page ${i + 1} full size`}>
                  <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 1152px) 1152px, 100vw" className="h-auto w-full" priority={i === 0} />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> Full size
                  </span>
                </a>
                <figcaption className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
                  Page {i + 1} of {pages.length}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="at-a-glance" aria-labelledby="brochure-infographics-heading" className="scroll-mt-32 border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Infographics headingId="brochure-infographics-heading" />
        </div>
      </section>

      <section aria-labelledby="summary-heading" className="border-t border-border bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— In brief</p>
          <h2 id="summary-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            What the resilience hub does
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
              <p>
                The World Food Programme&apos;s Nigeria Country Office is implementing a nine-month project funded by the UK&apos;s FCDO: the{" "}
                <strong>Resilience Building and Smallholder Farmers Support Project in Sokoto and Katsina</strong>. Smallholder farmers in Northern
                Nigeria face limited access to quality inputs, extension and financial services, post-harvest storage and reliable markets. The
                project works with existing smallholder farmers through capacity building, and creates assets through cash for work for the most
                vulnerable.
              </p>
              <p>
                The <strong>Farmer Service Center</strong> is a model for changing the agri-food system: creating jobs for youth and women along
                horticulture and rain-fed value chains, raising farmers&apos; incomes through a <strong>pay-per-use model</strong>, and supporting
                state government sustainability. The solar-powered centre uses a common savings pot through village savings groups to build social
                cohesion, and focuses on professionalism and business development, diversified services and jobs along value chains, and
                digitalisation and market linkages.
              </p>
              <h3 className="pt-2 font-semibold text-foreground">Approach</h3>
              <ol className="list-decimal space-y-1.5 pl-5">
                {approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Income-generating units</h3>
                <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {units.map((u) => (
                    <li key={u.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-medium text-foreground">
                      <u.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> {u.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Metrics</h3>
                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl border border-border bg-card p-4">
                      <dt className="text-xs text-muted-foreground">{m.label}</dt>
                      <dd className="mt-1 font-serif-display text-2xl font-light text-foreground">{m.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">Designed with local partners, government and community members for maximum impact.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/fact-sheet" className="text-sm font-semibold text-primary hover:underline">
                  Project fact sheet →
                </Link>
                <Link href="/blog/noma-tushen-arziki-farming-wealth-hub" className="text-sm font-semibold text-primary hover:underline">
                  The hub&apos;s story →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
