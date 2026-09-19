import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

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
