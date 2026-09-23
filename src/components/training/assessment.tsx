"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Download, Loader2, RotateCcw, XCircle } from "lucide-react";

import type { ExamQuestion } from "@/data/training/courses";
import { useCourseProgress } from "@/components/training/use-progress";

type Result =
  | { passed: true; score: number; certificateId: string }
  | { passed: false; score: number; passMark: number; incorrect: string[] };

export function Assessment({
  courseId,
  courseTitle,
  lessonIds,
  questions,
  passMark,
  learner,
}: {
  learner: { name: string; email: string; organization?: string };
  courseId: string;
  courseTitle: string;
  lessonIds: string[];
  questions: ExamQuestion[];
  passMark: number;
}) {
  const { progress, loaded, update } = useCourseProgress(courseId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState(learner.name);
  const [organization, setOrganization] = useState(learner.organization ?? "");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const lessonsDone = lessonIds.every((id) => progress.completed.includes(id));
  const answered = Object.keys(answers).length;

  if (loaded && !lessonsDone && !progress.certificateId) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-8 text-center">
        <p className="font-semibold text-foreground">Complete every lesson first</p>
        <p className="mt-1 text-sm text-muted-foreground">The final assessment unlocks when all knowledge checks are passed.</p>
        <Link href={`/get-involved/training/${courseId}`} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          ← Back to the course
        </Link>
      </div>
    );
  }

  if (result?.passed) {
    return (
      <div className="rounded-3xl border-2 border-primary bg-primary/5 p-8 text-center sm:p-12" role="status">
        <Award className="mx-auto h-14 w-14 text-primary" />
        <h2 className="mt-4 font-serif-display text-3xl font-light text-foreground">Congratulations, {name.split(" ")[0]}!</h2>
        <p className="mt-2 text-muted-foreground">
          You scored <strong className="text-foreground">{result.score}%</strong> and passed {courseTitle}.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Certificate ID: <span className="font-mono font-semibold text-foreground">{result.certificateId}</span>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`/api/training/certificates/${result.certificateId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" /> Download certificate (PDF)
          </a>
          <Link href={`/get-involved/training/verify/${result.certificateId}`} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card">
            Verification page
          </Link>
        </div>
      </div>
    );
  }

  const submit = async () => {
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/training/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, name, organization, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setResult(data);
      if (data.passed) update((p) => ({ ...p, certificateId: data.certificateId, score: data.score }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  };

  const incorrect = result && !result.passed ? new Set(result.incorrect) : new Set<string>();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-8"
    >
      {result && !result.passed && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <XCircle className="h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-bold text-foreground">
              You scored {result.score}%. The pass mark is {result.passMark}%.
            </p>
            <p className="mt-1 text-muted-foreground">
              {result.incorrect.length} {result.incorrect.length === 1 ? "answer needs" : "answers need"} another look (highlighted below). Review the lessons and try again.
            </p>
          </div>
        </div>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => (
          <li key={q.id} className={`rounded-2xl border bg-card p-5 ${incorrect.has(q.id) ? "border-primary" : "border-border"}`}>
            <fieldset>
              <legend className="font-semibold text-foreground">
                {qi + 1}. {q.prompt}
              </legend>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => (
                  <label key={opt} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-2.5 text-sm ${answers[q.id] === oi ? "border-foreground/40 bg-muted" : "border-border hover:bg-muted/60"}`}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === oi}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className="mt-0.5 accent-primary"
                    />
                    <span className="text-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <fieldset className="rounded-3xl border border-border bg-card p-6">
        <legend className="px-2 font-bold text-foreground">Your certificate details</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-foreground">
            Full name (as on certificate)
            <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <div className="text-sm font-medium text-foreground">
            Email (your account)
            <p className="mt-1.5 truncate rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">{learner.email}</p>
          </div>
          <label className="text-sm font-medium text-foreground">
            Organisation (optional)
            <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </label>
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending || answered < questions.length || !name.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Submit assessment
        </button>
        <span className="text-sm text-muted-foreground">
          {answered} of {questions.length} answered · pass mark {passMark}%
        </span>
        {result && !result.passed && (
          <button type="button" onClick={() => setResult(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4" /> Clear result
          </button>
        )}
      </div>
    </form>
  );
}
