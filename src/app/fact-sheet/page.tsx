import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookMarked, Download, FileSpreadsheet, HeartPulse, PiggyBank, Sprout, Tractor } from "lucide-react";

import { Infographics } from "@/components/fact-sheet/infographics";
import { ProportionBars, StatTile } from "@/components/fact-sheet/proportion-bars";
import { SlideViewer } from "@/components/fact-sheet/slide-viewer";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { AGRIC_ASSESSMENT as A, GSLA_PRESENTATION as G, IHP_PRESENTATION, WFP_FACT_SHEET as F } from "@/data/fact-sheets";
import { LHI_PHOTOS } from "@/data/lhi-photos";

export const metadata: Metadata = {
  alternates: { canonical: "/fact-sheet" },
  title: "Fact Sheet",
  description:
    "LHI at a glance in two infographics, key results of LHI's FCDO/WFP Resilience Building and Smallholder Farmers Support Project in Sokoto and Katsina, and the Integrated Health Program presentation.",
};

const n = (v: number) => v.toLocaleString("en-GB");
const btn =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-colors";

export default function FactSheetPage() {
  const cover = IHP_PRESENTATION.slides.findIndex((s) => s.caption.includes("Partners Summit"));
  const slides = cover > 0 ? [IHP_PRESENTATION.slides[cover], ...IHP_PRESENTATION.slides.filter((_, i) => i !== cover)] : IHP_PRESENTATION.slides;
  const seedTotal = F.smallholderFarmers.firstSeedChoice.reduce((t, s) => t + s.value, 0);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Accountability"
        title={
          <>
            Fact <em className="font-light italic text-primary">Sheet.</em>
          </>
        }
        subtitle="Our results in numbers, from the field to your screen."
        description="Key figures from the FCDO/WFP resilience project in Sokoto and Katsina, and highlights from the Integrated Health Program. View them here or download them."
        image={{ ...LHI_PHOTOS.farmerWomanHarvest, tag: "Smallholder farmer, Sokoto State" }}
      />

      <nav aria-label="On this page" className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <a href="#at-a-glance" className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
            LHI at a glance
          </a>
          <a href="#resilience" className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
            Resilience project (FCDO/WFP)
          </a>
          <a href="#gsla" className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
            Savings groups (GSLA)
          </a>
          <a href="#agric" className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
            Agric-led livelihood assessment
          </a>
          <a href="#ihp" className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
            Integrated Health Program
          </a>
          <Link href="/brochure" className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
            Brochure
          </Link>
        </div>
      </nav>

      <section id="at-a-glance" aria-labelledby="infographics-heading" className="scroll-mt-32 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Infographics />
        </div>
      </section>

      <section id="resilience" aria-labelledby="resilience-heading" className="scroll-mt-32 border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                <Sprout className="h-4 w-4" aria-hidden="true" /> Food security &amp; livelihoods
              </p>
              <h2 id="resilience-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                {F.title} <span className="text-primary">({F.states})</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Funded by {F.fundedBy} through the {F.partner}, implemented by Life Helpers Initiative. Households received smallholder farmer
                support or cash-based transfers.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a href={F.pdf} download className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Fact sheet (PDF)
              </a>
              <a href={F.pptx} download className={`${btn} border border-border text-foreground hover:border-primary hover:text-primary`}>
                <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" /> Dashboard (PPTX)
              </a>
            </div>
          </div>

          <div id="wfp-fact-sheet" className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile value={n(F.households)} label="Households supported" detail="Heads of household reached directly" />
              <StatTile value={n(F.householdMembers)} label="Household members" detail="Indirect beneficiaries" />
              <StatTile
                value={`${F.coverage.states} · ${F.coverage.lgas} · ${F.coverage.wards}`}
                label="States · LGAs · wards"
                detail="Coverage across Sokoto and Katsina"
              />
              <StatTile
                value={n(F.personsWithDisabilities.count)}
                label="People with disabilities"
                detail={`${F.personsWithDisabilities.pct}% of households supported`}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ProportionBars title="Head of household" rows={F.headOfHousehold} />
              <ProportionBars title="Support by category" rows={F.supportCategory} />
              <ProportionBars title="Residence status" rows={F.residence} />
              <ProportionBars title="Age group" rows={F.ageGroups} note="Rounded shares; totals may not equal 100%." />
              <ProportionBars title="Marital status" rows={F.maritalStatus} />
              <figure className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
                <figcaption className="text-xs font-bold uppercase tracking-wider text-foreground">Funded by · implemented by</figcaption>
                <p className="mt-4 text-sm text-foreground">
                  <strong>{F.fundedBy}</strong> through the <strong>{F.partner}</strong>
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Implemented by <strong>Life Helpers Initiative</strong>
                </p>
                <Link href="/interventions/projectandintervention" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                  All our projects →
                </Link>
              </figure>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section aria-labelledby="cbt-heading" className="space-y-4 rounded-3xl border border-border bg-muted/20 p-5 sm:p-6">
                <h3 id="cbt-heading" className="font-serif-display text-2xl font-light text-foreground">
                  Cash-based transfers
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatTile value={n(F.cashTransfer.women.value)} label="Women" detail={`${F.cashTransfer.women.pct}% of recipients`} />
                  <StatTile value={n(F.cashTransfer.men.value)} label="Men" detail={`${F.cashTransfer.men.pct}% of recipients`} />
                  <StatTile
                    value={n(F.cashTransfer.personsWithDisabilities.value)}
                    label="People with disabilities"
                    detail={`${F.cashTransfer.personsWithDisabilities.pct}% of recipients`}
                  />
                  <StatTile value={String(F.cashTransfer.averageHouseholdSize)} label="Average household size" />
                  <StatTile
                    value={n(F.cashTransfer.linkedWithNimc.value)}
                    label="Linked with NIMC"
                    detail={`${F.cashTransfer.linkedWithNimc.pct}% enrolled for a national ID`}
                  />
                  <StatTile value={n(F.cashTransfer.linkedWithBank)} label="Linked with a bank" detail={F.cashTransfer.banks.join(", ")} />
                </div>
                <ProportionBars title="Recipients by residence status" rows={F.cashTransfer.residence} />
                <ProportionBars title="Recipients by marital status" rows={F.cashTransfer.maritalStatus} />
              </section>

              <section aria-labelledby="shf-heading" className="space-y-4 rounded-3xl border border-border bg-muted/20 p-5 sm:p-6">
                <h3 id="shf-heading" className="font-serif-display text-2xl font-light text-foreground">
                  Smallholder farmers
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatTile value={n(F.smallholderFarmers.women.value)} label="Women farmers" detail={`${F.smallholderFarmers.women.pct}% of farmers`} />
                  <StatTile value={n(F.smallholderFarmers.men.value)} label="Men farmers" detail={`${F.smallholderFarmers.men.pct}% of farmers`} />
                </div>
                <StatTile value={`${F.smallholderFarmers.averageFarmSizeHa} ha`} label="Average farm size" detail="Hectares per farmer" />
                <ProportionBars
                  title="Farmers' first seed choice"
                  unit="count"
                  rows={F.smallholderFarmers.firstSeedChoice.map((s) => ({ ...s, pct: Math.round((s.value / seedTotal) * 100) }))}
                />
              </section>
            </div>
            <p className="text-xs text-muted-foreground">
              Source: project progress dashboard, Resilience Building and Smallholder Farmers Support Project (FCDO/WFP), implemented by LHI.
            </p>
          </div>
        </div>
      </section>

      <section id="gsla" aria-labelledby="gsla-heading" className="scroll-mt-32 border-t border-border bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                <PiggyBank className="h-4 w-4" aria-hidden="true" /> Livelihood
              </p>
              <h2 id="gsla-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                {G.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Savings groups in Zamfara, Biu (Borno) and Yobe with {G.partners}. Members train for five days, meet weekly, keep their money in a
                three-lock savings box and share out at the end of each cycle.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a href={G.pdf} download className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Presentation (PDF)
              </a>
              <a href={G.report.pdf} download className={`${btn} border border-border text-foreground hover:border-primary hover:text-primary`}>
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Data report (PDF)
              </a>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SlideViewer slides={G.slides} label="GSLA presentation" />
            </div>
            <div className="space-y-6">
              <ProportionBars
                title="GSLA members in Zamfara, by LGA"
                unit="count"
                rows={G.membersByLga.map((m) => ({ ...m, pct: 0 }))}
                note="356 members in four LGAs, plus groups in 11 Biu communities and in Yobe."
              />
              <a href={G.report.image} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-3xl border border-border bg-card">
                <Image src={G.report.image} alt="GSLA data report: Small Steps, Big Impact, GSLA's journey to financial empowerment" width={G.report.width} height={G.report.height} sizes="(min-width: 1024px) 360px, 100vw" className="h-auto w-full" />
                <span className="block border-t border-border px-4 py-2 text-xs font-semibold text-primary">GSLA data report · open full size</span>
              </a>
              <Link href="/blog/gsla-small-steps-big-impact" className="inline-block text-sm font-semibold text-primary hover:underline">
                Read the story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="agric" aria-labelledby="agric-heading" className="scroll-mt-32 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                <Tractor className="h-4 w-4" aria-hidden="true" /> Food security &amp; livelihoods
              </p>
              <h2 id="agric-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                {A.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {A.where}, {A.when}. Household surveys, focus groups and key informant interviews to shape LHI&apos;s agric-led livelihood project.
              </p>
            </div>
            <a href={A.pdf} download className={`${btn} shrink-0 bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> Report (PDF)
            </a>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <a href={A.pdf} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-3xl border border-border bg-card lg:row-span-2">
              <Image src={A.cover} alt="Cover of the Agric-Led Livelihood Needs Assessment report" width={700} height={990} sizes="(min-width: 1024px) 260px, 100vw" className="h-auto w-full" />
            </a>
            <StatTile value={String(A.households)} label="Households surveyed" detail="60 in each LGA" />
            <StatTile value={A.incomeFromAgriculture} label="Household income from agriculture" />
            <StatTile value={A.farmSize} label="Typical farm size" detail="Mostly rain-fed" />
            <ProportionBars title="Households farming" rows={A.farming} />
            <figure className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
              <figcaption className="text-xs font-bold uppercase tracking-wider text-foreground">Recommendations</figcaption>
              <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-foreground/85 sm:grid-cols-2">
                {A.recommendations.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
              <Link href={A.story} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                Read the findings →
              </Link>
            </figure>
          </div>
        </div>
      </section>

      <section id="ihp" aria-labelledby="ihp-heading" className="scroll-mt-32 border-t border-border bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                <HeartPulse className="h-4 w-4" aria-hidden="true" /> Health
              </p>
              <h2 id="ihp-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                Integrated Health Program: work done, achievements &amp; success stories
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Presented at the {IHP_PRESENTATION.event}: mentoring, supportive supervision and training of health workers on child health (IMCI),
                immunisation, malaria testing and nutrition in health facilities across IHP states, including Ebonyi State.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a href={IHP_PRESENTATION.pdf} download className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Presentation (PDF)
              </a>
              <Link href="/blog/compendium-of-ihp-success-stories" className={`${btn} border border-border text-foreground hover:border-primary hover:text-primary`}>
                IHP success stories
              </Link>
            </div>
          </div>
          <div className="mt-10">
            <SlideViewer slides={slides} label="Integrated Health Program presentation" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link href="/brochure" className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-8 transition-colors hover:border-primary sm:flex-row sm:items-center">
            <BookMarked className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-serif-display text-2xl font-light text-foreground">Noma Tushen Arziki Farmer Service Center brochure</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                How the solar-powered resilience hub supports smallholder farmers, women and youth. View or download.
              </span>
            </span>
            <span className="text-sm font-semibold text-primary">Open the brochure →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
