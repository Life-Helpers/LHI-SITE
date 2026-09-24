import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCourse } from "@/data/training/courses";
import { getCurrentLearner, updateLearnerProgress } from "@/lib/training/learners";

export const dynamic = "force-dynamic";

/** GET ?course=id → the signed-in learner's progress in that course (null for visitors who are not signed in). */
export async function GET(req: NextRequest) {
  const learner = await getCurrentLearner();
  if (!learner) return NextResponse.json({ progress: null, signedIn: false }, { headers: { "Cache-Control": "no-store" } });
  const courseId = req.nextUrl.searchParams.get("course") ?? "";
  return NextResponse.json({ progress: learner.progress[courseId] ?? { completed: [] } }, { headers: { "Cache-Control": "no-store" } });
}

const schema = z.object({ courseId: z.string().max(80), lessonId: z.string().max(120) });

/** POST {courseId, lessonId} → mark a lesson complete (after its knowledge check is passed). */
export async function POST(req: NextRequest) {
  const learner = await getCurrentLearner();
  if (!learner) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  const course = parsed.success ? getCourse(parsed.data.courseId) : undefined;
  if (!parsed.success || !course?.lessons.some((l) => l.id === parsed.data.lessonId)) {
    return NextResponse.json({ error: "Invalid lesson." }, { status: 400 });
  }
  const { lessonId } = parsed.data;
  const progress = await updateLearnerProgress(learner.id, course.id, (p) =>
    p.completed.includes(lessonId) ? p : { ...p, completed: [...p.completed, lessonId] },
  );
  return NextResponse.json({ progress });
}
