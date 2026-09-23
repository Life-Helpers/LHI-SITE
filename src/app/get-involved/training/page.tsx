import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, BookOpenCheck, Clock, GraduationCap, ShieldCheck, Users } from "lucide-react";

import { VerifyCertificateForm } from "@/components/training/verify-form";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { COURSES, coursePhoto } from "@/data/training/courses";

export const metadata: Metadata = {
  title: "Humanitarian Training & Certificates",
  description:
    "Free self-paced safeguarding training from Life Helpers Initiative. Complete the lessons, pass the final assessment and download a verifiable certificate.",
};

const steps = [
  { icon: BookOpenCheck, title: "Study the lessons", text: "Short, self-paced lessons drawn from LHI's safeguarding training and policies." },
  { icon: ShieldCheck, title: "Pass each knowledge check", text: "Answer every practice question correctly to complete a lesson." },
  { icon: GraduationCap, title: "Take the final assessment", text: "Score 80% or more on the final assessment. You can retake it as often as you need." },
  { icon: Award, title: "Download your certificate", text: "Receive a PDF certificate with a unique code anyone can verify on this page." },
];

export default function TrainingPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Get Involved · Humanitarian Training"
        title={
          <>
            Learn to keep people <em className="font-light italic text-primary">safe.</em>
          </>
        }
        subtitle="Free, self-paced courses with verifiable certificates."
        description="Everyone who works with or for Life Helpers Initiative (staff, volunteers, interns, consultants, vendors and partners) shares responsibility for preventing harm. Our training centre makes LHI's safeguarding standards available to all."
        image={{ ...LHI_PHOTOS.staffTraining, tag: "LHI Training Centre" }}
      />

      <section className="py-16 md:py-20" aria-labelledby="courses-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Course catalogue</p>
          <h2 id="courses-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Available courses
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {COURSES.map((course) => {
              const photo = coursePhoto(course);
              const minutes = course.lessons.reduce((sum, l) => sum + l.minutes, 0);
              return (
                <article key={course.id} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif-display text-2xl font-light text-foreground">{course.title}</h3>
                    <p className="mt-1 text-sm font-medium text-accent">{course.subtitle}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                      <li className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4 text-primary" /> {course.lessons.length} lessons</li>
                      <li className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> About {minutes} min</li>
                      <li className="inline-flex items-center gap-1.5"><Award className="h-4 w-4 text-primary" /> Certificate · pass mark {course.passMark}%</li>
                      <li className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> {course.audience}</li>
                    </ul>
                    <Link
                      href={`/get-involved/training/${course.id}`}
                      className="mt-6 inline-flex w-fit items-center rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      View course
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 py-16" aria-labelledby="how-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="how-heading" className="font-serif-display text-3xl font-light text-foreground">How it works</h2>
          <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Step {i + 1}</p>
                <h3 className="mt-1 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted-foreground">
            Your lesson progress is saved in this browser. Certificates are recorded by LHI and can be re-downloaded with their code.
          </p>
        </div>
      </section>

      <section className="py-16" aria-labelledby="verify-heading">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="verify-heading" className="font-serif-display text-3xl font-light text-foreground">Verify a certificate</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the code printed on an LHI training certificate (for example LHI-SG-ABCD2345).
          </p>
          <VerifyCertificateForm />
        </div>
      </section>
    </main>
  );
}
