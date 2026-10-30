import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { CourseRowActions } from "@/components/cms/course-editor";
import { Badge, buttonClass, Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can, SITE_LOCATIONS } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { getAllCourses } from "@/lib/training/catalog";

export const metadata = { title: "Courses & Exams" };

export default async function TrainingCoursesPage() {
  const user = await requirePageUser();
  if (!can(user, "training.content") && !can(user, "training.exams") && !can(user, "training.publish")) redirect("/admin?denied=1");
  const [courses, certificates, learners] = await Promise.all([getAllCourses(), readStore("certificates"), readStore("learners")]);
  const yourWork = [
    can(user, "training.content") && "write courses and lessons",
    can(user, "training.exams") && "set final exams and pass marks",
    can(user, "training.publish") && "publish, order and delete courses",
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        title="Courses & Exams"
        description={`The Humanitarian Training centre's courses: their lessons, practice questions and final exams. Your role can ${yourWork.join(", ")}.`}
        site={SITE_LOCATIONS.training}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Courses & Exams" }]}
        actions={
          can(user, "training.content") && (
            <Link href="/admin/training/new" className={buttonClass.primary}>
              <Plus className="h-4 w-4" /> New course
            </Link>
          )
        }
      />
      <Card bodyClassName="divide-y divide-admin-border p-0">
        {courses.map((c, i) => {
          const started = learners.filter((l) => l.progress?.[c.id]).length;
          const issued = certificates.filter((x) => x.courseId === c.id).length;
          return (
            <div key={c.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center" data-course={c.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/training/${c.id}`} className="font-semibold hover:text-admin-primary">
                    {c.title}
                  </Link>
                  <Badge tone={c.status === "published" ? "success" : "warning"}>{c.status === "published" ? "Live" : "Draft"}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-admin-muted">
                  {c.lessons.length} lessons · {c.exam.length} exam questions · pass mark {c.passMark}% · {started} learners · {issued} certificates
                  {c.updatedAt ? ` · updated ${formatDate(c.updatedAt)}${c.updatedBy ? ` by ${c.updatedBy}` : ""}` : ""}
                </p>
              </div>
              <CourseRowActions id={c.id} title={c.title} live={c.status === "published"} first={i === 0} last={i === courses.length - 1} canPublish={can(user, "training.publish")} />
            </div>
          );
        })}
        {courses.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No courses yet.</p>}
      </Card>
    </>
  );
}
