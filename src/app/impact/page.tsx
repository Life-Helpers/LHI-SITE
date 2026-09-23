import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";

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

export const metadata: Metadata = {
  title: "Impact Reports | Life Helpers Initiative",
  description:
    "Audited impact and verified accountability metrics published by Life Helpers Initiative across 11 states in Nigeria.",
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
        subtitle="Transparent results, verified metrics, and over 1.5 million fulfilled lives."
        description="Life Helpers Initiative accounts openly for every resource entrusted to us. We evaluate our programs against measurable improvements in child survival, maternal health, female literacy, and household resilience."
        image={africanFulfillmentImages.impactHero}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="font-serif-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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
