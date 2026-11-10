import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { courseCsvToText, courseTextToCsv, decodeCsv, parseCsv } from "@/lib/training/course-csv";
import { BLANK_COURSE_TEMPLATE, textToCourse } from "@/lib/training/course-file";

const dir = new URL("../../../content/training-courses/", import.meta.url);
const courses = readdirSync(dir).filter((f) => f.endsWith(".txt"));

describe("course files as CSV spreadsheets", () => {
  it.each(courses)("%s survives download as CSV and upload again", (file) => {
    const text = readFileSync(new URL(file, dir), "utf8");
    expect(textToCourse(courseCsvToText(courseTextToCsv(text)))).toEqual(textToCourse(text));
  });

  it("the blank template round-trips too", () => {
    expect(textToCourse(courseCsvToText(courseTextToCsv(BLANK_COURSE_TEMPLATE)))).toEqual(textToCourse(BLANK_COURSE_TEMPLATE));
  });

  it("reads a sheet filled in by hand: any column order, letters for answers, a question mid-lesson", () => {
    const csv = [
      "Text,Type,Title,Minutes,Option 1,Option 2,Option 3,Correct option,Explanation",
      "Fuel records,Title,,,,,,,",
      "Keeping fuel honest.,Description,,,,,,,",
      "Why we log fuel.,Lesson,Fuel logs,4,,,,,",
      "Every litre is recorded.,Paragraph,,,,,,,",
      "What do you keep?,Practice question,,,Nothing,The receipt,A photo,b,Receipts prove it.",
      '"Date\nLitres\n- Odometer",List,Record these,,,,,,',
      'Receipts go to Finance.,Warning box,"Don\'t lose them",,,,,,',
      "Log what?,Exam question,,,Music,Litres,,Litres,",
    ].join("\r\n");
    const c = textToCourse(courseCsvToText(csv));
    expect(c).toMatchObject({ title: "Fuel records", description: "Keeping fuel honest." });
    expect(c.lessons[0]).toMatchObject({ title: "Fuel logs", summary: "Why we log fuel.", minutes: 4 });
    expect(c.lessons[0].text).toBe("Every litre is recorded.\n\n## Record these\n- Date\n- Litres\n- Odometer\n\n[!warning] Don't lose them\nReceipts go to Finance.");
    expect(c.lessons[0].check[0]).toMatchObject({ prompt: "What do you keep?", options: ["Nothing", "The receipt", "A photo"], answer: 1, explain: "Receipts prove it." });
    expect(c.exam?.[0]).toMatchObject({ prompt: "Log what?", options: ["Music", "Litres"], answer: 1 });
  });

  it("accepts semicolon-separated sheets and Excel's older Windows encoding", () => {
    expect(parseCsv("Type;Text\r\nTitle;Café\r\n")).toEqual([["Type", "Text"], ["Title", "Café"]]);
    const windows1252 = new Uint8Array([0x4e, 0x61, 0x69, 0x72, 0x61, 0x20, 0x80, 0x35]); // "Naira €5" in Windows-1252
    expect(decodeCsv(windows1252)).toBe("Naira €5");
    expect(decodeCsv(new TextEncoder().encode("₦500"))).toBe("₦500");
  });

  it("names the row with the problem", () => {
    expect(() => courseCsvToText("Type,Title,Text\r\nTitle,,T\r\nParagraph,,Text before any lesson\r\n")).toThrow(/Row 3: add a Lesson row/);
    expect(() => courseCsvToText("Type,Title,Text,Option 1,Option 2,Correct option\r\nLesson,L,s,,,\r\nPractice question,,Q?,A,B,3\r\n")).toThrow(/Row 3: put the number of the right answer/);
    expect(() => courseCsvToText("Type,Title,Text\r\nLesson,L,s\r\nVideo,,x\r\n")).toThrow(/Row 3: "Video" isn't a row type/);
    expect(() => courseCsvToText("Name,Email\r\nA,b\r\n")).toThrow(/header row/);
  });
});
