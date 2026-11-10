import { readdirSync, readFileSync } from "node:fs";
import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { courseTextToDocx, docxToCourseText, isDocx } from "@/lib/training/course-docx";
import { BLANK_COURSE_TEMPLATE, textToCourse } from "@/lib/training/course-file";

const dir = new URL("../../../content/training-courses/", import.meta.url);
const courses = readdirSync(dir).filter((f) => f.endsWith(".txt"));

/** A .docx as Word saves it: list items with numbering, no blank paragraphs, dashes autocorrected. */
function wordDoc(paragraphs: { text: string; list?: "bullet" | "number" }[]) {
  const p = ({ text, list }: { text: string; list?: string }) =>
    `<w:p>${list ? `<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${list === "number" ? 2 : 1}"/></w:numPr></w:pPr>` : ""}<w:r><w:t xml:space="preserve">${text.replace(/&/g, "&amp;")}</w:t></w:r></w:p>`;
  const numbering =
    '<w:numbering><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:numFmt w:val="bullet"/></w:lvl></w:abstractNum><w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:numFmt w:val="decimal"/></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num><w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num></w:numbering>';
  return zipSync({
    "word/document.xml": strToU8(`<w:document><w:body>${paragraphs.map(p).join("")}</w:body></w:document>`),
    "word/numbering.xml": strToU8(numbering),
  });
}

describe("course files as Word documents", () => {
  it.each(courses)("%s survives download as .docx and upload again", (file) => {
    const text = readFileSync(new URL(file, dir), "utf8");
    const docx = courseTextToDocx(text);
    expect(isDocx(docx)).toBe(true);
    expect(textToCourse(docxToCourseText(docx))).toEqual(textToCourse(text));
  });

  it("the blank template round-trips too", () => {
    expect(textToCourse(docxToCourseText(courseTextToDocx(BLANK_COURSE_TEMPLATE)))).toEqual(textToCourse(BLANK_COURSE_TEMPLATE));
  });

  it("reads a course typed in Word: lists, single Enters, autocorrected dashes and (correct)", () => {
    const c = textToCourse(
      docxToCourseText(
        wordDoc([
          { text: "Title: Fuel management" },
          { text: "Description: Keeping fuel records honest." },
          { text: "—— LESSON: Fuel logs ——" },
          { text: "Summary: Why we log fuel." },
          { text: "Minutes: 5" },
          { text: "Every litre is recorded." },
          { text: "Receipts are kept for audit." },
          { text: "## Record these" },
          { text: "Date & litres", list: "bullet" },
          { text: "Odometer", list: "bullet" },
          { text: "## Steps" },
          { text: "Fill the tank", list: "number" },
          { text: "Write the log", list: "number" },
          { text: "– PRACTICE QUESTION –" },
          { text: "Q: What do you keep?" },
          { text: "Nothing", list: "bullet" },
          { text: "The receipt (Correct)", list: "bullet" },
          { text: "Why: Receipts prove the purchase." },
          { text: "=== FINAL EXAM ===" },
          { text: "— QUESTION —" },
          { text: "Q: Log what?" },
          { text: "Litres ✓", list: "bullet" },
          { text: "Music", list: "bullet" },
        ]),
      ),
    );
    expect(c.title).toBe("Fuel management");
    const [lesson] = c.lessons;
    expect(lesson.title).toBe("Fuel logs");
    expect(lesson.minutes).toBe(5);
    expect(lesson.text).toBe("Every litre is recorded.\n\nReceipts are kept for audit.\n\n## Record these\n- Date & litres\n- Odometer\n\n## Steps\n1. Fill the tank\n1. Write the log");
    expect(lesson.check[0]).toMatchObject({ prompt: "What do you keep?", options: ["Nothing", "The receipt"], answer: 1, explain: "Receipts prove the purchase." });
    expect(c.exam?.[0]).toMatchObject({ prompt: "Log what?", options: ["Litres", "Music"], answer: 0 });
  });

  it("explains a file that isn't a Word document", () => {
    expect(() => docxToCourseText(zipSync({ "hello.txt": strToU8("hi") }))).toThrow(/Word document/);
  });
});
