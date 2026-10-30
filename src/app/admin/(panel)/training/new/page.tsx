import { redirect } from "next/navigation";

import { CourseEditor } from "@/components/cms/course-editor";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";

export const metadata = { title: "New course" };

export default async function NewCoursePage() {
  const user = await requirePageUser("training.content");
  if (!can(user, "training.content")) redirect("/admin?denied=1");
  return (
    <>
      <PageHeader title="New course" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Courses & Exams", href: "/admin/training" }, { label: "New course" }]} />
      <CourseEditor
        initial={{ id: "", title: "", subtitle: "", description: "", level: "Foundation", audience: "", facilitator: "", photo: "caseManagement", image: "", passMark: 80, lessons: [], exam: [], status: "draft" }}
        isNew
        canWrite
        canExam={can(user, "training.exams")}
        canPublish={can(user, "training.publish")}
      />
    </>
  );
}
