import { toCsv } from "@/lib/cms/csv";
import { textToBlocks } from "@/lib/training/blocks";
import { textToCourse } from "@/lib/training/course-file";

/**
 * Course files as a spreadsheet (CSV), for people who work in Excel or Google Sheets. One row per
 * item, with the kind of item in the Type column. It converts to and from the text format in
 * course-file.ts, so both kinds of file upload the same way.
 */

const OPTIONS = 5;
export const COURSE_CSV_HEADERS = [
  "Type",
  "Title",
  "Text",
  "Minutes",
  ...Array.from({ length: OPTIONS }, (_, i) => `Option ${i + 1}`),
  "Correct option",
  "Explanation",
  "Lesson ID",
];

const FIELDS = ["Course ID", "Title", "Subtitle", "Level", "Audience", "Facilitator", "Pass mark", "Description"] as const;
const BOXES: Record<string, "info" | "warning" | "success"> = { "info box": "info", "warning box": "warning", "success box": "success" };

const NOTES = [
  "How to use this sheet: fill in the Text column (and Title, Minutes, options where a row has them), save it as CSV and upload it in Admin -> Courses & Exams.",
  "Keep the Course ID row as it is to update an existing course; leave it empty to create a new one. Note rows are ignored.",
  "Type is one of: Lesson, Paragraph, List, Steps, Info box, Warning box, Success box, Practice question, Exam question (plus the course detail rows at the top).",
  "List and Steps: put each item on its own line inside the Text cell (Alt+Enter in Excel). Title is an optional heading above the list.",
  "Questions: the question goes in Text, the answers in Option 1-5, and the number of the right answer in Correct option. Explanation is shown after practice questions.",
  "Rows after a Lesson row belong to that lesson until the next Lesson row. Exam questions can go anywhere; they form the final exam.",
];

/** The course text (course-file.ts format) as a CSV spreadsheet. */
export function courseTextToCsv(text: string): string {
  const c = textToCourse(text);
  const rows: string[][] = NOTES.map((n) => ["Note", "", n]);
  const field = (name: string, value: string | number | null) => rows.push([name, "", value === null ? "" : String(value)]);
  field("Course ID", c.id);
  field("Title", c.title);
  field("Subtitle", c.subtitle);
  field("Level", c.level);
  field("Audience", c.audience);
  field("Facilitator", c.facilitator);
  if (c.passMark !== null) field("Pass mark", c.passMark);
  field("Description", c.description);
  const question = (type: string, q: { prompt: string; options: string[]; answer: number; explain?: string }) => {
    const opts = Array.from({ length: OPTIONS }, (_, i) => q.options[i] ?? "");
    rows.push([type, "", q.prompt, "", ...opts, String(q.answer + 1), q.explain ?? "", ""]);
  };
  for (const l of c.lessons) {
    rows.push(["Lesson", l.title, l.summary, String(l.minutes), ...Array(OPTIONS + 2).fill(""), l.id]);
    for (const b of textToBlocks(l.text)) {
      if (b.type === "p") rows.push(["Paragraph", "", b.text]);
      else if (b.type === "list") rows.push(["List", b.title ?? "", b.items.join("\n")]);
      else if (b.type === "steps") rows.push(["Steps", b.title ?? "", b.items.join("\n")]);
      else rows.push([`${b.tone[0].toUpperCase()}${b.tone.slice(1)} box`, b.title, b.text]);
    }
    for (const q of l.check) question("Practice question", q);
  }
  for (const q of c.exam ?? []) question("Exam question", q);
  return toCsv(COURSE_CSV_HEADERS, rows);
}

/** Read CSV text (RFC 4180, comma or semicolon) into rows of cells. */
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const sep = firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === sep) row.push(cell), (cell = "");
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell), rows.push(row), (row = []), (cell = "");
    } else cell += ch;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  // Undo toCsv's protection against spreadsheet formulas ('=..., '-...).
  return rows.map((r) => r.map((c) => c.replace(/^'(?=[=+\-@])/, "")));
}

/** Bytes of a CSV saved by Excel: UTF-8 when it is valid UTF-8, otherwise Windows-1252 ("CSV (Comma delimited)"). */
export function decodeCsv(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}

const oneLine = (s: string) => s.replace(/\s*\n\s*/g, " ").trim();

/** A course spreadsheet (CSV text) as course text, ready for textToCourse. Throws with the row number on a problem. */
export function courseCsvToText(csv: string): string {
  const [header, ...body] = parseCsv(csv);
  const col = (name: string) => header?.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase()) ?? -1;
  if (!header || col("Type") < 0 || col("Text") < 0) throw new Error("The spreadsheet needs its header row (Type, Title, Text, …). Start from the downloaded template.");
  const get = (r: string[], name: string) => {
    const i = col(name);
    return i >= 0 ? (r[i] ?? "").trim() : "";
  };

  const head: string[] = [];
  // A lesson's text, then its questions (a question row may sit between paragraphs in the sheet).
  const lessons: { text: string[]; questions: string[] }[] = [];
  const exam: string[] = [];
  body.forEach((r, n) => {
    const where = `Row ${n + 2}`;
    const type = get(r, "Type").toLowerCase();
    const title = oneLine(get(r, "Title"));
    const text = get(r, "Text");
    if (!type || type === "note") return;
    const fieldName = FIELDS.find((f) => f.toLowerCase() === type);
    if (fieldName) return void head.push(`${fieldName}: ${oneLine(text)}`);
    if (type === "lesson") {
      if (!title) throw new Error(`${where}: a Lesson row needs the lesson's name in the Title column.`);
      const id = get(r, "Lesson ID");
      return void lessons.push({
        text: [`=== LESSON: ${title} ===`, ...(id ? [`Lesson ID: ${id}`] : []), `Summary: ${oneLine(text)}`, `Minutes: ${get(r, "Minutes") || 5}`, ""],
        questions: [],
      });
    }
    const isQuestion = type === "practice question" || type === "exam question";
    const lesson = lessons[lessons.length - 1];
    if (!lesson && type !== "exam question") throw new Error(`${where}: add a Lesson row before this ${get(r, "Type")} row.`);
    if (isQuestion) {
      const options = Array.from({ length: OPTIONS }, (_, i) => oneLine(get(r, `Option ${i + 1}`))).filter(Boolean);
      const mark = get(r, "Correct option");
      const right = /^\d+$/.test(mark) ? Number(mark) - 1 : /^[a-e]$/i.test(mark) ? mark.toUpperCase().charCodeAt(0) - 65 : options.findIndex((o) => o.toLowerCase() === mark.toLowerCase());
      if (!oneLine(text)) throw new Error(`${where}: write the question in the Text column.`);
      if (options.length < 2) throw new Error(`${where}: give at least two answers in Option 1, Option 2, …`);
      if (!(right >= 0 && right < options.length)) throw new Error(`${where}: put the number of the right answer (1 to ${options.length}) in Correct option.`);
      const lines = [type === "exam question" ? "--- QUESTION ---" : "--- PRACTICE QUESTION ---", `Q: ${oneLine(text)}`, ...options.map((o, i) => `- ${o}${i === right ? " (correct)" : ""}`)];
      const why = oneLine(get(r, "Explanation"));
      if (why && type === "practice question") lines.push(`Why: ${why}`);
      (type === "exam question" ? exam : lesson.questions).push(...lines, "");
      return;
    }
    if (!text && !title) return;
    const items = text.split(/\n/).map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim()).filter(Boolean);
    if (type === "paragraph") lesson.text.push(text.split(/\n\s*\n/).map(oneLine).join("\n\n"), "");
    else if (type === "list") lesson.text.push(...(title ? [`## ${title}`] : []), ...items.map((i) => `- ${i}`), "");
    else if (type === "steps") lesson.text.push(...(title ? [`## ${title}`] : []), ...items.map((i, k) => `${k + 1}. ${i}`), "");
    else if (BOXES[type]) lesson.text.push(`[!${BOXES[type]}] ${title || "Note"}`, oneLine(text), "");
    else throw new Error(`${where}: "${get(r, "Type")}" isn't a row type. Use Lesson, Paragraph, List, Steps, Info box, Warning box, Success box, Practice question or Exam question.`);
  });
  return [...head, "", ...lessons.flatMap((l) => [...l.text, ...l.questions]), ...(exam.length ? ["=== FINAL EXAM ===", "", ...exam] : [])].join("\n");
}
