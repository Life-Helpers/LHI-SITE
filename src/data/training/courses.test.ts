import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { ANSWER_KEYS } from "./answer-keys";
import { COURSES } from "./courses";
import { LHI_PHOTOS } from "../lhi-photos";

describe("training courses", () => {
  it.each(COURSES.map((c) => [c.id, c] as const))("%s has a complete, valid answer key", (_id, course) => {
    const key = ANSWER_KEYS[course.id];
    expect(key).toBeDefined();
    expect(Object.keys(key).sort()).toEqual(course.exam.map((q) => q.id).sort());
    for (const q of course.exam) {
      expect(key[q.id]).toBeGreaterThanOrEqual(0);
      expect(key[q.id]).toBeLessThan(q.options.length);
    }
  });

  it.each(COURSES.map((c) => [c.id, c] as const))("%s lessons are well-formed", (_id, course) => {
    expect(LHI_PHOTOS[course.photo]).toBeDefined();
    const ids = new Set<string>();
    for (const lesson of course.lessons) {
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);
      expect(LHI_PHOTOS[lesson.photo]).toBeDefined();
      expect(lesson.check.length).toBeGreaterThan(0);
      for (const q of lesson.check) expect(q.answer).toBeLessThan(q.options.length);
    }
  });
});
