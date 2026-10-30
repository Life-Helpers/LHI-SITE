import type { CourseDraft, ExamDraft, LessonDraft } from "@/lib/training/editor-types";

/**
 * A course as one plain-text file, so trainers can write or update a course in Word or Notepad
 * and upload it in Admin → Courses & Exams. Lesson text uses the format of blocks.ts.
 *
 *   Title: ...            (course details, one per line; Description may run over several lines)
 *   === LESSON: Lesson title ===
 *   Summary: ... / Minutes: 6
 *   ...lesson text...
 *   --- PRACTICE QUESTION ---
 *   Q: question
 *   - wrong option
 *   * right option
 *   Why: explanation
 *   === FINAL EXAM ===
 *   --- QUESTION ---
 *   Q: question / - option / * right option
 *
 * Lines starting with // are notes and are ignored.
 */

const LESSON = /^===\s*LESSON\s*:\s*(.*?)\s*===\s*$/i;
const EXAM = /^===\s*FINAL EXAM\s*===\s*$/i;
const QUESTION = /^---\s*(PRACTICE QUESTION|QUESTION)\s*---\s*$/i;
const FIELD = /^([A-Za-z][A-Za-z ]{1,20}):\s*(.*)$/;

export const COURSE_TEMPLATE_HELP = [
  "// LHI TRAINING COURSE FILE",
  "// Fill this in, save it as a .txt file and upload it in Admin -> Courses & Exams.",
  "// Lines starting with // are notes and are ignored.",
  "// Keep 'Course ID' as it is to update an existing course; leave it empty for a new course.",
  "// Lesson text: leave a blank line between paragraphs. Start lines with '- ' for bullets or",
  "// '1. ' for steps, put '## Title' above a list to name it, and start a block with",
  "// '[!info] Title', '[!warning] Title' or '[!success] Title' for a highlighted box.",
  "// Questions: '- ' marks a wrong option and '* ' the right one.",
];

function questionText(q: { prompt: string; options: string[]; answer: number; explain?: string }, label: string, withAnswer: boolean) {
  return [
    `--- ${label} ---`,
    `Q: ${q.prompt}`,
    ...q.options.map((o, i) => `${withAnswer && i === q.answer ? "*" : "-"} ${o}`),
    ...(q.explain !== undefined && q.explain ? [`Why: ${q.explain}`] : []),
  ].join("\n");
}

/** The course as a file. Without answers the final exam is left out, so uploading it back keeps the exam. */
export function courseToText(c: CourseDraft, withAnswers: boolean): string {
  const lines = [
    ...COURSE_TEMPLATE_HELP,
    "",
    `Course ID: ${c.id}`,
    `Title: ${c.title}`,
    `Subtitle: ${c.subtitle}`,
    `Level: ${c.level}`,
    `Audience: ${c.audience}`,
    `Facilitator: ${c.facilitator}`,
    ...(withAnswers ? [`Pass mark: ${c.passMark}`] : []),
    `Description: ${c.description}`,
  ];
  for (const l of c.lessons) {
    lines.push("", `=== LESSON: ${l.title} ===`, ...(l.id ? [`Lesson ID: ${l.id}`] : []), `Summary: ${l.summary}`, `Minutes: ${l.minutes}`, "", l.text);
    for (const q of l.check) lines.push("", questionText(q, "PRACTICE QUESTION", true));
  }
  if (withAnswers) {
    lines.push("", "=== FINAL EXAM ===");
    for (const q of c.exam) lines.push("", questionText(q, "QUESTION", true));
  } else {
    lines.push("", "// The final exam is managed by people who set exams; uploading this file keeps it unchanged.");
  }
  return lines.join("\n") + "\n";
}

export const BLANK_COURSE_TEMPLATE = courseToText(
  {
    id: "",
    title: "Course title",
    subtitle: "One line on what learners will be able to do",
    description: "Two or three sentences describing the course.",
    level: "Foundation",
    audience: "Staff, volunteers and partners",
    facilitator: "Name, title",
    photo: "caseManagement",
    image: "",
    passMark: 80,
    status: "draft",
    lessons: [
      {
        id: "",
        title: "First lesson title",
        summary: "What this lesson covers.",
        minutes: 6,
        photo: "caseManagement",
        image: "",
        text: "Write the lesson here.\n\n## Key points\n- First point\n- Second point\n\n[!info] Remember\nA short highlighted note.",
        check: [{ prompt: "A practice question?", options: ["A wrong answer", "The right answer", "Another wrong answer"], answer: 1, explain: "Why the right answer is right." }],
      },
    ],
    exam: [{ id: "", prompt: "A final exam question?", options: ["Option A", "Option B (right)", "Option C", "Option D"], answer: 1 }],
  },
  true,
);

/** What a course file contains. `exam` is null when the file has no FINAL EXAM section. */
export interface ParsedCourseFile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  audience: string;
  facilitator: string;
  passMark: number | null;
  lessons: Omit<LessonDraft, "photo" | "image">[];
  exam: ExamDraft[] | null;
}

function parseQuestion(lines: string[], where: string) {
  let prompt = "";
  let explain = "";
  const options: string[] = [];
  let answer = -1;
  for (const line of lines) {
    if (/^Q\s*:/i.test(line)) prompt = line.replace(/^Q\s*:\s*/i, "");
    else if (/^Why\s*:/i.test(line)) explain = line.replace(/^Why\s*:\s*/i, "");
    else if (/^[*-]\s+/.test(line)) {
      if (line.startsWith("*")) {
        if (answer >= 0) throw new Error(`${where}: only one option can be marked with *.`);
        answer = options.length;
      }
      options.push(line.replace(/^[*-]\s+/, ""));
    } else if (prompt && !options.length) prompt += ` ${line}`;
  }
  if (!prompt) throw new Error(`${where}: the question needs a line starting with "Q:".`);
  if (options.length < 2) throw new Error(`${where}: give at least two options, each on a line starting with "- " or "* ".`);
  if (answer < 0) throw new Error(`${where}: mark the right option with "* " instead of "- ".`);
  return { prompt, options, answer, explain };
}

/** Reads a course file. Throws an Error with a plain explanation when something is missing. */
export function textToCourse(text: string): ParsedCourseFile {
  const lines = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n").filter((l) => !l.trim().startsWith("//"));
  const sections: { kind: "head" | "lesson" | "exam"; title: string; lines: string[] }[] = [{ kind: "head", title: "", lines: [] }];
  for (const line of lines) {
    const lesson = LESSON.exec(line.trim());
    if (lesson) sections.push({ kind: "lesson", title: lesson[1], lines: [] });
    else if (EXAM.test(line.trim())) sections.push({ kind: "exam", title: "", lines: [] });
    else sections[sections.length - 1].lines.push(line);
  }

  // Course details: "Key: value" lines; Description continues until the first blank line.
  const head: Record<string, string> = {};
  let current = "";
  for (const raw of sections[0].lines) {
    const line = raw.trim();
    const m = FIELD.exec(line);
    if (m) {
      current = m[1].toLowerCase().trim();
      head[current] = m[2].trim();
    } else if (line && current === "description") head.description += ` ${line}`;
    else if (!line) current = "";
  }
  if (!head.title) throw new Error('The file needs a "Title:" line near the top.');
  const passMark = head["pass mark"] ? Number(head["pass mark"].replace("%", "")) : null;
  if (passMark !== null && !(passMark >= 1 && passMark <= 100)) throw new Error("Pass mark must be a number from 1 to 100.");

  const split = (body: string[]) => {
    const parts: { label: string; lines: string[] }[] = [{ label: "", lines: [] }];
    for (const line of body) {
      const q = QUESTION.exec(line.trim());
      if (q) parts.push({ label: q[1].toUpperCase(), lines: [] });
      else parts[parts.length - 1].lines.push(line);
    }
    return parts;
  };

  const lessons = sections
    .filter((s) => s.kind === "lesson")
    .map((s, i) => {
      const where = `Lesson ${i + 1} (“${s.title}”)`;
      if (!s.title) throw new Error(`Lesson ${i + 1} needs a title: === LESSON: Title ===`);
      const [body, ...questions] = split(s.lines);
      const meta: Record<string, string> = {};
      const content: string[] = [];
      let inMeta = true;
      for (const line of body.lines) {
        const m = FIELD.exec(line.trim());
        if (inMeta && m && ["summary", "minutes", "lesson id"].includes(m[1].toLowerCase().trim())) meta[m[1].toLowerCase().trim()] = m[2].trim();
        else if (inMeta && !line.trim()) continue;
        else {
          inMeta = false;
          content.push(line);
        }
      }
      const text = content.join("\n").trim();
      if (!text) throw new Error(`${where} has no lesson text.`);
      return {
        id: meta["lesson id"] ?? "",
        title: s.title,
        summary: meta.summary ?? "",
        minutes: Math.max(1, Math.min(240, Math.round(Number(meta.minutes) || 5))),
        text,
        check: questions.map((q, n) => parseQuestion(q.lines.map((l) => l.trim()).filter(Boolean), `${where}, practice question ${n + 1}`)),
      };
    });

  const examSection = sections.find((s) => s.kind === "exam");
  const exam = examSection
    ? split(examSection.lines)
        .slice(1)
        .map((q, n) => {
          const { prompt, options, answer } = parseQuestion(q.lines.map((l) => l.trim()).filter(Boolean), `Exam question ${n + 1}`);
          return { id: "", prompt, options, answer };
        })
    : null;

  return {
    id: head["course id"] ?? "",
    title: head.title,
    subtitle: head.subtitle ?? "",
    description: head.description ?? "",
    level: head.level ?? "",
    audience: head.audience ?? "",
    facilitator: head.facilitator ?? "",
    passMark,
    lessons,
    exam,
  };
}
