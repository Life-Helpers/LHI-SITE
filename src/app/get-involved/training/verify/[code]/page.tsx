import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Download, ShieldAlert } from "lucide-react";

import { VerifyCertificateForm } from "@/components/training/verify-form";
import { findCertificate } from "@/lib/training/grading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify a training certificate",
  robots: { index: false },
};

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const code = decodeURIComponent((await params).code).trim().toUpperCase();
  const cert = await findCertificate(code);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        {cert ? (
          <div className="rounded-3xl border border-emerald-600/30 bg-emerald-600/5 p-8">
            <BadgeCheck className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-4 font-serif-display text-3xl font-light text-foreground">Valid certificate</h1>
            <dl className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-3 text-left text-sm sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Awarded to</dt><dd className="font-semibold text-foreground">{cert.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Course</dt><dd className="font-semibold text-foreground">{cert.courseTitle}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Score</dt><dd className="font-semibold text-foreground">{cert.score}%</dd></div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Issued</dt>
                <dd className="font-semibold text-foreground">
                  {new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </dd>
              </div>
              <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wider text-muted-foreground">Code</dt><dd className="font-mono font-semibold text-foreground">{cert.id}</dd></div>
            </dl>
            <a href={`/api/training/certificates/${cert.id}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </div>
        ) : (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 font-serif-display text-3xl font-light text-foreground">Certificate not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No LHI training certificate matches <span className="font-mono font-semibold text-foreground">{code}</span>. Check the code and try again.
            </p>
          </div>
        )}
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">Verify another code</p>
          <VerifyCertificateForm />
          <Link href="/get-involved/training" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">← Back to training</Link>
        </div>
      </div>
    </main>
  );
}
