"use server";

import { revalidatePath } from "next/cache";

import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";
import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import { can, slugify } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";
import { textToBlocks } from "@/lib/training/blocks";
import type { StoredCourse } from "@/lib/training/catalog";
import type { CourseActionResult, CourseDraft } from "@/lib/training/editor-types";

async function run(fn: () => Promise<CourseActionResult>): Promise<CourseActionResult> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[training action]", err);
    return { ok: false, error: "Something went wrong while saving. Please try again." };
  }
}

/** Someone who works on courses: any of the three training content permissions. */
async function requireTrainer() {
  const user = await requireUser();
  if (!["training.content", "training.exams", "training.publish"].some((p) => can(user, p as never))) throw new AuthError("Your role can't edit training courses.");
  return user;
}

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const photoKey = (v: unknown, fallback: LhiPhotoKey): LhiPhotoKey => (typeof v === "string" && v in LHI_PHOTOS ? (v as LhiPhotoKey) : fallback);
/** An uploaded photo: a site path (/media/...) or an https link, nothing else. */
const imageUrl = (v: unknown) => {
  const s = text(v, 500);
  return /^(\/(?!\/)[^\s"'<>]*|https:\/\/[^\s"'<>]+)$/.test(s) ? s : "";
};
const uniqueId = (base: string, taken: Set<string>, fallback: string) => {
  let id = slugify(base).slice(0, 60) || fallback;
  for (let n = 2; taken.has(id); n++) id = `${slugify(base).slice(0, 56) || fallback}-${n}`;
  taken.add(id);
  return id;
};

/**
 * Saves a course. What is applied depends on the person's role: course text and lessons need
 * "Write courses & lessons", the final exam and pass mark need "Set final exams", and going live
 * needs "Publish courses". Anything else they send is ignored and the stored version kept.
 */
export async function saveCourseAction(originalId: string | null, draft: CourseDraft): Promise<CourseActionResult> {
  return run(async () => {
    const user = await requireTrainer();
    const writes = can(user, "training.content");
    const setsExams = can(user, "training.exams");
    const publishes = can(user, "training.publish");
    const courses = await readStore("courses");
    const existing = originalId ? courses.find((c) => c.id === originalId) : undefined;
    if (originalId && !existing) return { ok: false, error: "This course no longer exists." };
    if (!existing && !writes) return { ok: false, error: "Your role can't create courses." };

    const next: StoredCourse = existing
      ? structuredClone(existing)
      : { id: "", title: "", subtitle: "", description: "", level: "Foundation", audience: "", facilitator: "", photo: "caseManagement", passMark: 80, lessons: [], exam: [], answers: {}, status: "draft", order: courses.length + 1 };

    if (writes) {
      next.title = text(draft.title, 140);
      if (!next.title) return { ok: false, error: "Give the course a title." };
      // The address is fixed once created: learners' progress and certificates point at it.
      if (!existing) {
        next.id = uniqueId(draft.id || draft.title, new Set(courses.map((c) => c.id)), "course");
      }
      next.subtitle = text(draft.subtitle, 200);
      next.description = text(draft.description, 2000);
      next.level = text(draft.level, 60) || "Foundation";
      next.audience = text(draft.audience, 300);
      next.facilitator = text(draft.facilitator, 200);
      next.photo = photoKey(draft.photo, next.photo);
      next.image = imageUrl(draft.image) || undefined;

      const lessonIds = new Set<string>();
      const lessons = (Array.isArray(draft.lessons) ? draft.lessons : []).slice(0, 60);
      next.lessons = [];
      for (const [i, l] of lessons.entries()) {
        const title = text(l.title, 160);
        if (!title) return { ok: false, error: `Lesson ${i + 1} needs a title.` };
        const blocks = textToBlocks(String(l.text ?? "").slice(0, 40000));
        if (!blocks.length) return { ok: false, error: `Lesson ${i + 1} (“${title}”) has no content.` };
        const check = (Array.isArray(l.check) ? l.check : []).slice(0, 20).map((q, n) => {
          const options = (Array.isArray(q.options) ? q.options : []).map((o) => text(o, 300)).filter(Boolean).slice(0, 6);
          const answer = Number(q.answer);
          if (!text(q.prompt, 400) || options.length < 2 || !(answer >= 0 && answer < options.length)) {
            throw new AuthError(`Lesson ${i + 1}, practice question ${n + 1}: write the question, at least two options and mark the right one.`);
          }
          return { prompt: text(q.prompt, 400), options, answer, explain: text(q.explain, 600) };
        });
        const kept = l.id && existing?.lessons.some((x) => x.id === l.id) && !lessonIds.has(l.id) ? l.id : "";
        if (kept) lessonIds.add(kept);
        next.lessons.push({
          id: kept || uniqueId(title, lessonIds, `lesson-${i + 1}`),
          title,
          summary: text(l.summary, 400),
          minutes: Math.max(1, Math.min(240, Math.round(Number(l.minutes) || 5))),
          photo: photoKey(l.photo, next.photo),
          image: imageUrl(l.image) || undefined,
          blocks,
          check,
        });
      }
    }

    if (setsExams) {
      const passMark = Math.round(Number(draft.passMark));
      if (!(passMark >= 1 && passMark <= 100)) return { ok: false, error: "The pass mark must be between 1 and 100%." };
      next.passMark = passMark;
      const ids = new Set<string>();
      const exam: StoredCourse["exam"] = [];
      const answers: Record<string, number> = {};
      for (const [n, q] of (Array.isArray(draft.exam) ? draft.exam : []).slice(0, 100).entries()) {
        const prompt = text(q.prompt, 500);
        const options = (Array.isArray(q.options) ? q.options : []).map((o) => text(o, 300)).filter(Boolean).slice(0, 6);
        const answer = Number(q.answer);
        if (!prompt || options.length < 2) return { ok: false, error: `Exam question ${n + 1}: write the question and at least two options.` };
        if (!(answer >= 0 && answer < options.length)) return { ok: false, error: `Exam question ${n + 1}: mark the correct answer.` };
        const kept = q.id && existing?.exam.some((x) => x.id === q.id) && !ids.has(q.id) ? q.id : "";
        if (kept) ids.add(kept);
        const id = kept || uniqueId(`q-${n + 1}`, ids, `q${n + 1}`);
        exam.push({ id, prompt, options });
        answers[id] = answer;
      }
      next.exam = exam;
      next.answers = answers;
    }

    if (publishes && (draft.status === "published" || draft.status === "draft")) next.status = draft.status;
    if (next.status === "published") {
      if (!next.lessons.length) return { ok: false, error: "A live course needs at least one lesson." };
      if (!next.exam.length || next.exam.some((q) => next.answers[q.id] === undefined)) return { ok: false, error: "A live course needs a final exam with every correct answer marked." };
    }

    next.updatedAt = new Date().toISOString();
    next.updatedBy = user.name;
    await updateStore("courses", (items) => ({ items: existing ? items.map((c) => (c.id === existing.id ? next : c)) : [...items, next] }));
    const changed = [writes && "content", setsExams && "exam", publishes && existing?.status !== next.status && (next.status === "published" ? "published" : "unpublished")].filter(Boolean).join(", ");
    await logActivity(user, existing ? `updated course (${changed})` : "created course", next.title, `/admin/training/${next.id}`);
    revalidatePath("/get-involved/training", "layout");
    revalidatePath("/admin/training", "layout");
    return { ok: true, id: next.id };
  });
}

/** Deletes a course that isn't live. Certificates already issued for it stay valid. */
export async function deleteCourseAction(id: string): Promise<CourseActionResult> {
  return run(async () => {
    const user = await requireUser("training.publish");
    const course = (await readStore("courses")).find((c) => c.id === id);
    if (!course) return { ok: false, error: "This course no longer exists." };
    if (course.status === "published") return { ok: false, error: "Take the course down (set it to Draft) before deleting it." };
    await updateStore("courses", (items) => ({ items: items.filter((c) => c.id !== id) }));
    await logActivity(user, "deleted course", course.title);
    revalidatePath("/admin/training", "layout");
    return { ok: true };
  });
}

/** Moves a course up or down in the order learners see. */
export async function moveCourseAction(id: string, dir: -1 | 1): Promise<CourseActionResult> {
  return run(async () => {
    await requireUser("training.publish");
    await updateStore("courses", (items) => {
      const list = [...items].sort((a, b) => a.order - b.order);
      const i = list.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return { items };
      [list[i], list[j]] = [list[j], list[i]];
      return { items: list.map((c, n) => ({ ...c, order: n + 1 })) };
    });
    revalidatePath("/get-involved/training", "layout");
    revalidatePath("/admin/training", "layout");
    return { ok: true };
  });
}
