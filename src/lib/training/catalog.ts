import "server-only";

import type { Course } from "@/data/training/courses";
import { readStore } from "@/lib/cms/store";

/** A training course as stored: the course itself, its exam answer key and whether it is live. */
export interface StoredCourse extends Course {
  /** Exam question id -> index of the correct option. Never sent to the browser. */
  answers: Record<string, number>;
  status: "published" | "draft";
  order: number;
  updatedAt?: string;
  updatedBy?: string;
}

const byOrder = (a: StoredCourse, b: StoredCourse) => a.order - b.order || a.title.localeCompare(b.title);

/** The course without its answer key (safe for pages and the browser). */
export function publicCourse(c: StoredCourse): Course {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { answers, status, order, updatedAt, updatedBy, ...course } = c;
  return course;
}

/** Courses learners can take (published), in the order set in the admin. */
export async function getCourses(): Promise<Course[]> {
  return (await readStore("courses")).filter((c) => c.status === "published").sort(byOrder).map(publicCourse);
}

export async function getCourse(id: string): Promise<Course | undefined> {
  const c = (await readStore("courses")).find((x) => x.id === id && x.status === "published");
  return c ? publicCourse(c) : undefined;
}

/** Every course, drafts included, for admin lists and reports. */
export async function getAllCourses(): Promise<StoredCourse[]> {
  return (await readStore("courses")).sort(byOrder);
}

export async function getAnswerKey(id: string) {
  return (await readStore("courses")).find((c) => c.id === id)?.answers;
}
