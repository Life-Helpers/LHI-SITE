import type { Metadata } from "next";
import Link from "next/link";

import { LearnerResetForm } from "@/components/training/learner-reset-forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/get-involved/training/reset" },
  title: "Choose a new password",
  robots: { index: false },
};

export default async function LearnerResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-32">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Humanitarian Training</p>
        <h1 className="mt-2 font-serif-display text-3xl font-light text-foreground">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Set a new password for your training account.</p>
        <div className="mt-6">
          <LearnerResetForm token={token ?? ""} />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/get-involved/training/login" className="hover:text-primary">← Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}
