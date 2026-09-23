"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import type { CheckQuestion } from "@/data/training/courses";
import { useCourseProgress } from "@/components/training/use-progress";

export function KnowledgeCheck({
  courseId,
  lessonId,
  questions,
  nextHref,
  nextLabel,
}: {
  courseId: string;
  lessonId: string;
  questions: CheckQuestion[];
  nextHref: string;
  nextLabel: string;
}) {
  const { progress, completeLesson } = useCourseProgress(courseId);
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const allCorrect = answers.every((a, i) => a === questions[i].answer);
  const alreadyDone = progress.completed.includes(lessonId);

  const submit = () => {
    setSubmitted(true);
    if (allCorrect) completeLesson(lessonId);
  };

  return (
    <section aria-labelledby="check-heading" className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 id="check-heading" className="font-serif-display text-2xl font-light text-foreground">
        Knowledge check
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Answer every question correctly to complete this lesson.</p>

      <ol className="mt-6 space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const correct = chosen === q.answer;
          return (
            <li key={q.prompt}>
              <fieldset>
                <legend className="font-semibold text-foreground">
                  {qi + 1}. {q.prompt}
                </legend>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = chosen === oi;
                    const showState = submitted && selected;
                    return (
                      <label
                        key={opt}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                          showState
                            ? correct
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-primary bg-primary/10"
                            : selected
                              ? "border-foreground/40 bg-muted"
                              : "border-border hover:bg-muted/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          checked={selected}
                          onChange={() => {
                            setSubmitted(false);
                            setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)));
                          }}
                          className="mt-0.5 accent-primary"
                        />
                        <span className="text-foreground">{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {submitted && chosen !== null && (
                  <p
                    role="status"
                    className={`mt-2 flex items-start gap-1.5 text-sm ${correct ? "text-emerald-700 dark:text-emerald-400" : "text-primary"}`}
                  >
                    {correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                    {correct ? q.explain : "Not quite. Review the lesson above and try again."}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {submitted && allCorrect ? (
          <>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" /> Lesson complete
            </p>
            <Link href={nextHref} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              {nextLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={submit}
              className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Check answers
            </button>
            {submitted && (
              <button
                type="button"
                onClick={() => {
                  setAnswers(questions.map(() => null));
                  setSubmitted(false);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            )}
            {alreadyDone && (
              <Link href={nextHref} className="text-sm font-medium text-primary hover:underline">
                Already completed · {nextLabel} →
              </Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}
