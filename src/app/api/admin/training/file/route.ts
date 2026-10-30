import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { getAllCourses } from "@/lib/training/catalog";
import { BLANK_COURSE_TEMPLATE, courseToText } from "@/lib/training/course-file";
import { toDraft } from "@/lib/training/to-draft";

export const dynamic = "force-dynamic";

/**
 * GET ?id=<course> downloads that course as an editable file; with no id, a blank template.
 * Exam answers are included only for people who set exams.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.mustChangePassword || !["training.content", "training.exams", "training.publish"].some((p) => can(user, p as never))) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  const id = req.nextUrl.searchParams.get("id");
  let body = BLANK_COURSE_TEMPLATE;
  let name = "lhi-course-template.txt";
  if (id) {
    const course = (await getAllCourses()).find((c) => c.id === id);
    if (!course) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const withAnswers = can(user, "training.exams");
    body = courseToText(toDraft(course, withAnswers), withAnswers);
    name = `${course.id}.txt`;
  }
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
