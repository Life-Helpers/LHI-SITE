import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Assessment } from "@/components/training/assessment";
import { COURSES, getCourse } from "@/data/training/courses";

export function generateStaticParams() {
  return COURSES.map((c) => ({ courseId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const course = getCourse((await params).courseId);
  return course ? { title: `Final assessment | ${course.title}` } : {};
}

export default async function AssessmentPage({ params }: { params: Promise<{ courseId: string }> }) {
  const course = getCourse((await params).courseId);
  if (!course) notFound();

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/get-involved/training" className="hover:text-primary">Training</Link>
          <span aria-hidden>/</span>
          <Link href={`/get-involved/training/${course.id}`} className="hover:text-primary">{course.title}</Link>
        </nav>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Final assessment</p>
        <h1 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">{course.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {course.exam.length} questions · pass mark {course.passMark}% · unlimited attempts. Your certificate is issued in the name you enter below.
        </p>
        <div className="mt-8">
          <Assessment
            courseId={course.id}
            courseTitle={course.title}
            lessonIds={course.lessons.map((l) => l.id)}
            questions={course.exam}
            passMark={course.passMark}
          />
        </div>
      </div>
    </main>
  );
}
