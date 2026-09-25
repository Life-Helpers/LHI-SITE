import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpenCheck, Cloud } from "lucide-react";

import { LearnerAuthForm } from "@/components/training/learner-auth-form";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { getCurrentLearner } from "@/lib/training/learners";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/get-involved/training/login" },
  title: "Sign in to Humanitarian Training",
  robots: { index: false },
};

const safeNext = (v?: string) => (v && v.startsWith("/get-involved/training") && !v.startsWith("//") ? v : "/get-involved/training");

export default async function LearnerLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string }> }) {
  const { next, mode } = await searchParams;
  const target = safeNext(next);
  if (await getCurrentLearner()) redirect(target);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-28">
      <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card shadow-xl md:grid-cols-2">
        <div className="relative hidden min-h-[520px] md:block">
          <Image src={LHI_PHOTOS.staffTraining.src} alt={LHI_PHOTOS.staffTraining.alt} fill sizes="480px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">LHI Humanitarian Training</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light">Free courses. Real certificates.</h2>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2"><BookOpenCheck className="h-4 w-4" /> Safeguarding, child safeguarding and GBV courses</li>
              <li className="flex items-center gap-2"><Cloud className="h-4 w-4" /> Progress saved to your account on any device</li>
              <li className="flex items-center gap-2"><Award className="h-4 w-4" /> Verifiable certificate when you pass</li>
            </ul>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <h1 className="font-serif-display text-3xl font-light text-foreground">Welcome, learner</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in or create a free account with your email to start learning.</p>
          <div className="mt-6">
            <LearnerAuthForm next={target} initialMode={mode === "signup" ? "signup" : "login"} />
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/get-involved/training" className="hover:text-primary">← Back to all courses</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
