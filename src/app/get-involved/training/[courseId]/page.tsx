import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, BookOpenCheck, Clock, UserRound, Users } from "lucide-react";

import { CourseOutline } from "@/components/training/course-outline";
import { COURSES, coursePhoto, getCourse } from "@/data/training/courses";

export function generateStaticParams() {
  return COURSES.map((c) => ({ courseId: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const course = getCourse((await params).courseId);
  return course ? { title: `${course.title} | Humanitarian Training`, description: course.description } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const course = getCourse((await params).courseId);
  if (!course) notFound();
  const photo = coursePhoto(course);
  const minutes = course.lessons.reduce((sum, l) => sum + l.minutes, 0);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <section className="relative overflow-hidden bg-foreground text-background">
        <Image src={photo.src} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <Link href="/get-involved/training" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-background/80 hover:text-background">
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">{course.level} course</p>
          <h1 className="mt-2 max-w-3xl font-serif-display text-4xl font-light sm:text-5xl">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-background/85">{course.description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-background/85">
            <li className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4" /> {course.lessons.length} lessons</li>
            <li className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> About {minutes} minutes</li>
            <li className="inline-flex items-center gap-1.5"><Award className="h-4 w-4" /> Pass mark {course.passMark}%</li>
          </ul>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <CourseOutline
              courseId={course.id}
              lessons={course.lessons.map(({ id, title, summary, minutes }) => ({ id, title, summary, minutes }))}
            />
          </div>
          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">About this course</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex gap-3">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <dt className="font-semibold text-foreground">Facilitator</dt>
                    <dd className="text-muted-foreground">{course.facilitator}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <dt className="font-semibold text-foreground">Who it is for</dt>
                    <dd className="text-muted-foreground">{course.audience}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <dt className="font-semibold text-foreground">Certificate</dt>
                    <dd className="text-muted-foreground">
                      Complete every lesson, then score {course.passMark}% or more on the {course.exam.length}-question final assessment.
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-sm">
              <p className="font-semibold text-foreground">Need to report a concern?</p>
              <p className="mt-1 text-muted-foreground">
                Use LHI&apos;s confidential feedback and complaints channels at any time, even before finishing the course.
              </p>
              <Link href="/contact" className="mt-3 inline-block font-semibold text-primary hover:underline">Contact &amp; reporting channels →</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
