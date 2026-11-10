import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { textToCourse } from "@/lib/training/course-file";

// Every course file in content/training-courses must upload cleanly in Admin -> Courses & Exams.
const dir = new URL("../../../content/training-courses/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".txt"));

describe("training course files", () => {
  it.each(files)("%s parses as a complete course", (file) => {
    const c = textToCourse(readFileSync(new URL(file, dir), "utf8"));
    expect(c.id).toBe("");
    expect(c.title.length).toBeGreaterThan(10);
    expect(c.passMark).toBe(80);
    expect(c.lessons.length).toBeGreaterThanOrEqual(4);
    for (const l of c.lessons) {
      expect(l.text.length, `${l.title} text`).toBeGreaterThan(400);
      expect(l.check.length, `${l.title} practice questions`).toBeGreaterThanOrEqual(2);
    }
    expect(c.exam?.length).toBe(10);
    // Right answers spread across positions, so "always pick B" doesn't pass.
    expect(new Set(c.exam!.map((q) => q.answer)).size).toBeGreaterThan(1);
  });
});
