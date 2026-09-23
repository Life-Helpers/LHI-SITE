"use client";

import { useCallback, useEffect, useState } from "react";

export interface CourseProgress {
  completed: string[];
  certificateId?: string;
  score?: number;
}

/** The signed-in learner's progress in a course, stored on their LHI training account. */
export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgress>({ completed: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/training/progress?course=${encodeURIComponent(courseId)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.progress) setProgress(data.progress);
        setLoaded(true);
      })
      .catch(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  /** Local update after the server has recorded something (e.g. a certificate). */
  const update = useCallback((fn: (p: CourseProgress) => CourseProgress) => setProgress((prev) => fn(prev)), []);

  const completeLesson = useCallback(
    async (lessonId: string) => {
      setProgress((p) => (p.completed.includes(lessonId) ? p : { ...p, completed: [...p.completed, lessonId] }));
      const res = await fetch("/api/training/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId }),
      }).catch(() => null);
      const data = await res?.json().catch(() => null);
      if (data?.progress) setProgress(data.progress);
    },
    [courseId],
  );

  return { progress, loaded, completeLesson, update };
}
