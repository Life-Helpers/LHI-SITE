import { notFound, redirect } from "next/navigation";

import { CourseEditor } from "@/components/cms/course-editor";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { getAllCourses } from "@/lib/training/catalog";
import { toDraft } from "@/lib/training/to-draft";

export const metadata = { title: "Edit course" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const [canWrite, canExam, canPublish] = [can(user, "training.content"), can(user, "training.exams"), can(user, "training.publish")];
  if (!canWrite && !canExam && !canPublish) redirect("/admin?denied=1");
  const { id } = await params;
  const course = (await getAllCourses()).find((c) => c.id === id);
  if (!course) notFound();
  return (
    <>
      <PageHeader
        title={course.title}
        description={course.status === "published" ? "Live: learners can take this course." : "Draft: only people who edit courses can see it."}
        site={course.status === "published" ? [{ label: "Course page", href: `/get-involved/training/${course.id}` }] : undefined}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Courses & Exams", href: "/admin/training" }, { label: course.title }]}
      />
      <CourseEditor initial={toDraft(course, canExam)} canWrite={canWrite} canExam={canExam} canPublish={canPublish} />
    </>
  );
}
