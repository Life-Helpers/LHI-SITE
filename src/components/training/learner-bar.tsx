"use client";

import Link from "next/link";
import { GraduationCap, LogOut, UserRound } from "lucide-react";

/** Small account strip shown on training pages. */
export function LearnerBar({ learner, next }: { learner: { name: string; email: string } | null; next: string }) {
  if (!learner) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-sm">
        <span className="text-muted-foreground">Sign in with your email to take courses and earn certificates.</span>
        <span className="flex gap-2">
          <Link href={`/get-involved/training/login?next=${encodeURIComponent(next)}&mode=signup`} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
            Create account
          </Link>
          <Link href={`/get-involved/training/login?next=${encodeURIComponent(next)}`} className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted">
            Sign in
          </Link>
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-sm">
      <span className="inline-flex items-center gap-2 text-foreground">
        <UserRound className="h-4 w-4 text-primary" /> Signed in as <strong>{learner.name}</strong>
        <span className="hidden text-muted-foreground sm:inline">({learner.email})</span>
      </span>
      <span className="flex items-center gap-4">
      <Link href="/get-involved/training/my-learning" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
        <GraduationCap className="h-3.5 w-3.5" /> My learning
      </Link>
      <button
        type="button"
        onClick={async () => {
          await fetch("/api/training/logout", { method: "POST" }).catch(() => null);
          window.location.assign("/get-involved/training");
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
      >
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
      </span>
    </div>
  );
}
