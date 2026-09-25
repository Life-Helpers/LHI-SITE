import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { impactReports } from "@/data/impact-reports";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { ANNUAL_REPORT_2024_PDF } from "@/data/publication-stories";

export const metadata: Metadata = {
  alternates: { canonical: "/impact" },
  title: "Impact Reports",
  description:
    "Annual reports and organisation-wide results from Life Helpers Initiative across 11 states in Nigeria.",
};

export default function ImpactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Evidence of Joy & Transformation"
        title={
          <>
            Measuring Smiles, <em className="font-light italic text-primary">Impacting Lives.</em>
          </>
        }
        subtitle="Annual reports and results: over 1.5 million people reached since 2004."
        description="Life Helpers Initiative accounts openly for every resource entrusted to us. Download our annual report and see our cumulative results since 2004."
        image={africanFulfillmentImages.impactHero}
      />

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border md:col-span-2">
            <Image src={LHI_PHOTOS.lhiFamily.src} alt={LHI_PHOTOS.lhiFamily.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Annual Report</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground">Life Helpers Initiative 2024 Annual Report</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Our aim, vision, mission and values, and our work in health, education, livelihood, gender and governance, and agriculture.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={ANNUAL_REPORT_2024_PDF} download className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4" /> Download the 2024 report (PDF)
              </a>
              <Link href="/blog#publications" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card">
                All publications
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-serif-display text-2xl font-light text-foreground sm:text-3xl">
            Published Impact Reports
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Annual and multi-year results across every field program and emergency response,
            reported openly.
          </p>
        </div>

        {impactReports.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impactReports.map((report) => (
              <Card key={report.id} className="flex flex-col overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg">
                {report.image && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src={report.image}
                      alt={report.imageAlt || report.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-medium drop-shadow-sm">Life Helpers Initiative</span>
                      <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
                        Verified Impact
                      </span>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {report.period}
                  </div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription>{report.summary}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <p className="text-sm text-muted-foreground">
                    Published: {report.publishedAt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/impact/${report.id}`}
                    className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Read report
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No impact reports have been published yet.
          </p>
        )}
      </div>

    </main>
  );
}
