import { Loader2 } from "lucide-react";

/**
 * Shown the moment a learner clicks "Next" or opens a lesson, while the server checks their
 * account and prepares the lesson (this can take a few seconds when the server has been idle).
 */
export default function LessonLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-24" aria-busy="true">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p role="status" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Opening the lesson…
        </p>
        <div className="mt-6 h-3 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-9 w-3/4 animate-pulse rounded-xl bg-muted" />
        <div className="mt-6 aspect-[16/8] animate-pulse rounded-3xl bg-muted" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded-full bg-muted" style={{ width: `${95 - i * 12}%` }} />
          ))}
        </div>
      </div>
    </main>
  );
}
