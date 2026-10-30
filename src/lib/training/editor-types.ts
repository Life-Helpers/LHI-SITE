import type { LhiPhotoKey } from "@/data/lhi-photos";

/** A course as the admin editor sends and receives it (lesson text in the plain-text format of blocks.ts). */
export interface CourseDraft {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  audience: string;
  facilitator: string;
  photo: LhiPhotoKey;
  image: string;
  passMark: number;
  lessons: LessonDraft[];
  /** Only filled for people who may set exams. */
  exam: ExamDraft[];
  status: "published" | "draft";
}

export interface LessonDraft {
  /** Empty for a new lesson: the id is made from its title. */
  id: string;
  title: string;
  summary: string;
  minutes: number;
  photo: LhiPhotoKey;
  image: string;
  text: string;
  check: { prompt: string; options: string[]; answer: number; explain: string }[];
}

export interface ExamDraft {
  /** Empty for a new question. */
  id: string;
  prompt: string;
  options: string[];
  /** Index of the correct option, or -1 when not yet marked. */
  answer: number;
}

export interface CourseActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}
