import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Heart, Sparkles } from "lucide-react";

import { ProgramCard } from "@/components/program-card";
import { impactReports } from "@/data/impact-reports";
import { programs } from "@/data/programs";

function getReport(id: string) {
  return impactReports.find((report) => report.id === id);
}

export function generateStaticParams() {
  return impactReports.map((report) => ({ id: report.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const report = getReport(id);
  if (!report) return {};
  return {
    title: report.title,
    description: report.summary,
  };
}

export default async function ImpactReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = getReport(id);
  if (!report) notFound();

  const relatedPrograms = programs.filter((program) =>
    report.relatedProgramIds.includes(program.id),
  );

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/impact"
          className="mb-6 inline-flex items-center gap-1 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All reports
        </Link>

        {report.image && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[21/9]">
              <Image
                src={report.image}
                alt={report.imageAlt || report.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-md shadow-sm">
                <Sparkles className="h-3 w-3" />
                Putting A Smile On A Face
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="font-medium drop-shadow-sm flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
                  Life Helpers Initiative — Verified Impact
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-0.5 backdrop-blur-md border border-white/20">
                  {report.period}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {report.period}
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {report.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Published {report.publishedAt}
        </p>

        <div className="mt-8 flex flex-col gap-4 text-muted-foreground">
          {report.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {report.stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {report.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-border p-4"
              >
                <dt className="text-sm text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="text-xl font-bold text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {relatedPrograms.length > 0 && (
          <section aria-labelledby="covered-programs-heading" className="mt-14">
            <h2
              id="covered-programs-heading"
              className="mb-4 text-xl font-semibold"
            >
              Programs covered
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
