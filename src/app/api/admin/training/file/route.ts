import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { getAllCourses } from "@/lib/training/catalog";
import { courseTextToCsv } from "@/lib/training/course-csv";
import { courseTextToDocx } from "@/lib/training/course-docx";
import { BLANK_COURSE_TEMPLATE, courseToText } from "@/lib/training/course-file";
import { toDraft } from "@/lib/training/to-draft";

export const dynamic = "force-dynamic";

/**
 * GET ?id=<course> downloads that course as a spreadsheet (CSV, for Excel) to edit; with no id, a blank
 * template. &format=docx gives a Word document and &format=txt the plain-text version instead.
 * Exam answers are included only for people who set exams.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.mustChangePassword || !["training.content", "training.exams", "training.publish"].some((p) => can(user, p as never))) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  const id = req.nextUrl.searchParams.get("id");
  let body = BLANK_COURSE_TEMPLATE;
  let name = "lhi-course-template";
  if (id) {
    const course = (await getAllCourses()).find((c) => c.id === id);
    if (!course) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const withAnswers = can(user, "training.exams");
    body = courseToText(toDraft(course, withAnswers), withAnswers);
    name = course.id;
  }
  const format = req.nextUrl.searchParams.get("format");
  const [content, type, ext] =
    format === "txt"
      ? [body, "text/plain; charset=utf-8", "txt"]
      : format === "docx"
        ? [Buffer.from(courseTextToDocx(body)), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"]
        : [courseTextToCsv(body), "text/csv; charset=utf-8", "csv"];
  return new NextResponse(content, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${name}.${ext}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
