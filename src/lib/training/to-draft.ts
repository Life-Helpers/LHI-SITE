import "server-only";

import { blocksToText } from "@/lib/training/blocks";
import type { StoredCourse } from "@/lib/training/catalog";
import type { CourseDraft } from "@/lib/training/editor-types";

/** A stored course as the editor shows it. The answer key is only included for those who set exams. */
export function toDraft(c: StoredCourse, withAnswers: boolean): CourseDraft {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    level: c.level,
    audience: c.audience,
    facilitator: c.facilitator,
    photo: c.photo,
    image: c.image ?? "",
    passMark: c.passMark,
    status: c.status,
    lessons: c.lessons.map((l) => ({ id: l.id, title: l.title, summary: l.summary, minutes: l.minutes, photo: l.photo, image: l.image ?? "", text: blocksToText(l.blocks), check: l.check })),
    exam: c.exam.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options, answer: withAnswers ? (c.answers[q.id] ?? -1) : -1 })),
  };
}
