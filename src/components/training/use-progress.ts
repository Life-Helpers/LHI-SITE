"use client";

import { useCallback, useEffect, useState } from "react";

export interface CourseProgress {
  completed: string[];
  certificateId?: string;
  score?: number;
}

const KEY = "lhi_training_progress_v1";

function readAll(): Record<string, CourseProgress> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, CourseProgress>;
  } catch {
    return {};
  }
}

/** Per-learner course progress, kept in this browser only. */
export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgress>({ completed: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(readAll()[courseId] ?? { completed: [] });
    setLoaded(true);
  }, [courseId]);

  const update = useCallback(
    (fn: (p: CourseProgress) => CourseProgress) => {
      setProgress((prev) => {
        const next = fn(prev);
        try {
          const all = readAll();
          all[courseId] = next;
          localStorage.setItem(KEY, JSON.stringify(all));
        } catch {
          /* storage unavailable: progress lasts for this visit only */
        }
        return next;
      });
    },
    [courseId],
  );

  const completeLesson = useCallback(
    (lessonId: string) => update((p) => (p.completed.includes(lessonId) ? p : { ...p, completed: [...p.completed, lessonId] })),
    [update],
  );

  return { progress, loaded, completeLesson, update };
}
