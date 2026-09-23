import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { KnowledgeCheck } from "@/components/training/knowledge-check";
import { LessonContent } from "@/components/training/lesson-content";
import { coursePhoto, getCourse } from "@/data/training/courses";
import { requireLearnerPage } from "@/lib/training/learners";

type Params = Promise<{ courseId: string; lessonId: string }>;

export const dynamic = "force-dynamic";

async function load(params: Params) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const index = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  if (!course || index < 0) return null;
  return { course, lesson: course.lessons[index], index };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await load(params);
  return data ? { title: `${data.lesson.title} | ${data.course.title}`, description: data.lesson.summary } : {};
}

export default async function LessonPage({ params }: { params: Params }) {
  const data = await load(params);
  if (!data) notFound();
  const { course, lesson, index } = data;
  await requireLearnerPage(`/get-involved/training/${course.id}/${lesson.id}`);
  const next = course.lessons[index + 1];
  const photo = coursePhoto(lesson);
  const base = `/get-involved/training/${course.id}`;

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/get-involved/training" className="hover:text-primary">Training</Link>
          <span aria-hidden>/</span>
          <Link href={base} className="hover:text-primary">{course.title}</Link>
        </nav>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
          Lesson {index + 1} of {course.lessons.length}
        </p>
        <h1 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">{lesson.title}</h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" /> {lesson.minutes} min read
        </p>

        <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-3xl border border-border">
          <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>

        <div className="mt-8">
          <LessonContent blocks={lesson.blocks} />
        </div>

        <div className="mt-12">
          <KnowledgeCheck
            courseId={course.id}
            lessonId={lesson.id}
            questions={lesson.check}
            nextHref={next ? `${base}/${next.id}` : `${base}/assessment`}
            nextLabel={next ? `Next: ${next.title}` : "Go to the final assessment"}
          />
        </div>

        <div className="mt-10 flex justify-between gap-4 border-t border-border pt-6 text-sm">
          {index > 0 ? (
            <Link href={`${base}/${course.lessons[index - 1].id}`} className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Previous lesson
            </Link>
          ) : (
            <Link href={base} className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Course overview
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
