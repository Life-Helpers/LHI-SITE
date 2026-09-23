import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpenCheck, CheckCircle2, Download, KeyRound, PlayCircle, RotateCcw } from "lucide-react";

import { LearnerBar } from "@/components/training/learner-bar";
import { COURSES } from "@/data/training/courses";
import { requireLearnerPage } from "@/lib/training/learners";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My learning", robots: { index: false } };

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "");

export default async function MyLearningPage() {
  const learner = await requireLearnerPage("/get-involved/training/my-learning");
  const rows = COURSES.map((course) => {
    const p = learner.progress[course.id];
    const done = p?.completed.length ?? 0;
    const pct = Math.round((done / course.lessons.length) * 100);
    const next = course.lessons.find((l) => !p?.completed.includes(l.id));
    return { course, p, done, pct, next };
  });
  const certificates = rows.filter((r) => r.p?.certificateId).length;
  const started = rows.filter((r) => r.done > 0).length;

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <LearnerBar learner={{ name: learner.name, email: learner.email }} next="/get-involved/training/my-learning" />
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Humanitarian Training</p>
        <h1 className="mt-2 font-serif-display text-4xl font-light text-foreground">My learning</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back, {learner.name.split(/\s+/)[0]}. You have started {started} of {COURSES.length} courses and earned {certificates}{" "}
          {certificates === 1 ? "certificate" : "certificates"}.
        </p>

        <ul className="mt-8 space-y-5">
          {rows.map(({ course, p, done, pct, next }) => (
            <li key={course.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">{course.title}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {done} of {course.lessons.length} lessons complete
                    {p?.attempts ? ` · ${p.attempts} assessment ${p.attempts === 1 ? "attempt" : "attempts"}` : ""}
                    {p?.lastScore !== undefined && !p.certificateId ? ` · last score ${p.lastScore}%` : ""}
                  </p>
                </div>
                {p?.certificateId ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Certified · {p.score}%
                  </span>
                ) : done === course.lessons.length ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">Ready for assessment</span>
                ) : done > 0 ? (
                  <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">In progress</span>
                ) : (
                  <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Not started</span>
                )}
              </div>
              <div
                className="mt-4 h-2 rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${course.title} progress`}
              >
                <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(pct, pct ? 2 : 0)}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p?.certificateId ? (
                  <>
                    <a
                      href={`/api/training/certificates/${p.certificateId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" /> Certificate (PDF)
                    </a>
                    <Link
                      href={`/get-involved/training/verify/${p.certificateId}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:bg-muted"
                    >
                      <Award className="h-3.5 w-3.5" aria-hidden="true" /> Verification page
                    </Link>
                    <Link
                      href={`/get-involved/training/${course.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:bg-muted"
                    >
                      <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" /> Review lessons
                    </Link>
                  </>
                ) : done === course.lessons.length ? (
                  <Link
                    href={`/get-involved/training/${course.id}/assessment`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                  >
                    {p?.attempts ? <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> : <Award className="h-3.5 w-3.5" aria-hidden="true" />}
                    {p?.attempts ? "Retake the assessment" : "Take the assessment"}
                  </Link>
                ) : (
                  <Link
                    href={next ? `/get-involved/training/${course.id}/${next.id}` : `/get-involved/training/${course.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                  >
                    <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> {done ? "Continue" : "Start"}: {next?.title ?? "course"}
                  </Link>
                )}
              </div>
              {p?.certificateId && <p className="mt-3 text-xs text-muted-foreground">Certificate {p.certificateId}</p>}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5 text-sm">
          <KeyRound className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="flex-1 text-muted-foreground">
            Account: {learner.email}
            {learner.organization ? ` · ${learner.organization}` : ""} · joined {fmt(learner.createdAt)}
          </span>
          <Link href="/get-involved/training/forgot" className="font-semibold text-primary hover:underline">
            Change password
          </Link>
        </div>
      </div>
    </main>
  );
}
