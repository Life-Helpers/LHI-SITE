import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Impact Reports",
  description:
    "Audited impact and financial reports published by Life Helpers Initiative.",
};

export default function ImpactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Impact Reports
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Annual results across every field program and emergency response,
            reported openly.
          </p>
        </div>

        {impactReports.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impactReports.map((report) => (
              <Card key={report.id} className="flex flex-col">
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
                    Published {report.publishedAt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/impact/${report.id}`}
                    className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
