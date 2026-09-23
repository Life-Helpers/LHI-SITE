"use client";

import Link from "next/link";
import { Award, CheckCircle2, Circle, Clock, Lock, UserRound } from "lucide-react";

import { useCourseProgress } from "@/components/training/use-progress";

export function CourseOutline({
  courseId,
  lessons,
  signedIn,
  passMark,
}: {
  signedIn: boolean;
  passMark: number;
  courseId: string;
  lessons: { id: string; title: string; summary: string; minutes: number }[];
}) {
  const { progress, loaded } = useCourseProgress(courseId);
  const done = lessons.filter((l) => progress.completed.includes(l.id)).length;
  const pct = Math.round((done / lessons.length) * 100);
  const unlocked = done === lessons.length;
  const nextLesson = lessons.find((l) => !progress.completed.includes(l.id));

  const signIn = `/get-involved/training/login?next=${encodeURIComponent(`/get-involved/training/${courseId}`)}`;

  return (
    <div className="space-y-6">
      {!signedIn ? (
        <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <UserRound className="h-5 w-5 text-primary" /> Sign in to start learning
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a free learner account with your email to take the lessons, save your progress on any device and earn your certificate.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`${signIn}&mode=signup`} className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              Create free account
            </Link>
            <Link href={signIn} className="rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
              Sign in
            </Link>
          </div>
        </div>
      ) : (
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">Your progress</span>
          <span className="text-muted-foreground">
            {loaded ? done : 0} of {lessons.length} lessons
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={loaded ? pct : 0} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${loaded ? pct : 0}%` }} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {nextLesson && (
            <Link href={`/get-involved/training/${courseId}/${nextLesson.id}`} className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              {done === 0 ? "Start course" : "Continue learning"}
            </Link>
          )}
          {progress.certificateId && (
            <a href={`/api/training/certificates/${progress.certificateId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
              <Award className="h-4 w-4 text-primary" /> My certificate
            </a>
          )}
        </div>
      </div>
      )}

      <ol className="space-y-3">
        {lessons.map((lesson, i) => {
          const complete = progress.completed.includes(lesson.id);
          return (
            <li key={lesson.id}>
              <Link href={signedIn ? `/get-involved/training/${courseId}/${lesson.id}` : signIn} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
                {complete ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-label="Completed" />
                ) : (
                  <Circle className="mt-0.5 h-6 w-6 shrink-0 text-muted-foreground/50" aria-label="Not started" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Lesson {i + 1}</p>
                  <p className="mt-0.5 font-bold text-foreground group-hover:text-primary">{lesson.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{lesson.summary}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          {unlocked ? (
            <Link href={`/get-involved/training/${courseId}/assessment`} className="flex items-center gap-4 rounded-2xl border-2 border-primary bg-primary/5 p-5 hover:bg-primary/10">
              <Award className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="font-bold text-foreground">Final assessment &amp; certificate</p>
                <p className="text-sm text-muted-foreground">Score {passMark}% or more to receive your certificate. You can retake it as many times as you need.</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-5 text-muted-foreground">
              <Lock className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-bold">Final assessment &amp; certificate</p>
                <p className="text-sm">Unlocks when you complete every lesson.</p>
              </div>
            </div>
          )}
        </li>
      </ol>
    </div>
  );
}
