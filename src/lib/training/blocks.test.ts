import { describe, expect, it } from "vitest";

import { COURSES } from "@/data/training/courses";
import { blocksToText, textToBlocks } from "./blocks";

describe("lesson text format", () => {
  it.each(COURSES.flatMap((c) => c.lessons.map((l) => [`${c.id}/${l.id}`, l] as const)))("%s survives a round trip", (_id, lesson) => {
    expect(textToBlocks(blocksToText(lesson.blocks))).toEqual(lesson.blocks);
  });

  it("reads lists, steps, callouts and paragraphs", () => {
    const text = "Hello there.\n\n## Do\n- one\n- two\n\n1. first\n2. second\n\n[!warning] Careful\nMind the gap.";
    expect(textToBlocks(text)).toEqual([
      { type: "p", text: "Hello there." },
      { type: "list", title: "Do", items: ["one", "two"] },
      { type: "steps", items: ["first", "second"] },
      { type: "callout", tone: "warning", title: "Careful", text: "Mind the gap." },
    ]);
  });
});
