import { describe, expect, it } from "vitest";

import { COURSES } from "@/data/training/courses";
import { blocksToText } from "./blocks";
import { BLANK_COURSE_TEMPLATE, courseToText, textToCourse } from "./course-file";
import type { CourseDraft } from "./editor-types";

const draftOf = (i: number): CourseDraft => {
  const c = COURSES[i];
  return {
    ...c,
    image: "",
    status: "published",
    lessons: c.lessons.map((l) => ({ ...l, image: "", text: blocksToText(l.blocks) })),
    exam: c.exam.map((q, n) => ({ ...q, answer: n % q.options.length })),
  };
};

describe("course file", () => {
  it.each(COURSES.map((c, i) => [c.id, i] as const))("%s survives a round trip", (_id, i) => {
    const draft = draftOf(i);
    const parsed = textToCourse(courseToText(draft, true));
    expect(parsed.id).toBe(draft.id);
    expect(parsed.title).toBe(draft.title);
    expect(parsed.description).toBe(draft.description);
    expect(parsed.passMark).toBe(draft.passMark);
    expect(parsed.lessons.map((l) => [l.id, l.title, l.summary, l.minutes, l.text, l.check])).toEqual(
      draft.lessons.map((l) => [l.id, l.title, l.summary, l.minutes, l.text, l.check]),
    );
    expect(parsed.exam?.map((q) => [q.prompt, q.options, q.answer])).toEqual(draft.exam.map((q) => [q.prompt, q.options, q.answer]));
  });

  it("leaves the exam out without answers, so an upload keeps it", () => {
    const parsed = textToCourse(courseToText(draftOf(0), false));
    expect(parsed.exam).toBeNull();
    expect(parsed.passMark).toBeNull();
  });

  it("reads the blank template", () => {
    const parsed = textToCourse(BLANK_COURSE_TEMPLATE);
    expect(parsed.id).toBe("");
    expect(parsed.lessons).toHaveLength(1);
    expect(parsed.exam?.[0].answer).toBe(1);
  });

  it("explains what is missing", () => {
    expect(() => textToCourse("Subtitle: x")).toThrow(/Title/);
    expect(() => textToCourse("Title: T\n=== LESSON: L ===\nSome text\n--- PRACTICE QUESTION ---\nQ: q\n- a\n- b")).toThrow(/mark the right option/);
  });
});
