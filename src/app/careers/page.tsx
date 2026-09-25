import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, GraduationCap, HandHeart, ShieldCheck } from "lucide-react";

import { ListingCard } from "@/components/careers/listing-card";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { siteConfig } from "@/config/site";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { getPublicJobs } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers & Vacancies",
  description: "Current job vacancies at Life Helpers Initiative. Apply online for roles across LHI's offices in Nigeria.",
};

export default async function CareersPage() {
  const { open, closed } = await getPublicJobs();

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Careers at LHI"
        title={
          <>
            Build a career in <em className="font-light italic text-primary">humanitarian service.</em>
          </>
        }
        subtitle={`${siteConfig.stats.staff} staff and ${siteConfig.stats.volunteers} volunteers across 11 states.`}
        description="Life Helpers Initiative recruits people who share our commitment to dignity, integrity and accountability to the communities we serve. All current vacancies are listed here and applications are made online."
        image={{ ...LHI_PHOTOS.annualTeamEvent, tag: "The LHI team" }}
      />

      <section className="py-16 md:py-20" aria-labelledby="open-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Open positions</p>
              <h2 id="open-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                Current vacancies
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">{open.length === 1 ? "1 open vacancy" : `${open.length} open vacancies`}</p>
          </div>

          {open.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {open.map((job) => (
                <ListingCard
                  key={job.id}
                  href={`/careers/${job.id}`}
                  eyebrow={job.department}
                  badge={job.employmentType}
                  title={job.title}
                  summary={job.summary}
                  location={job.location}
                  deadline={job.deadline}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground">No open vacancies right now</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                New positions are published here as soon as they open. Follow LHI on social media to hear about them first, or explore volunteering and
                our free training in the meantime.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/get-involved#volunteer-form" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                  <HandHeart className="h-4 w-4" /> Volunteer
                </Link>
                <Link href="/get-involved/training" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card">
                  <GraduationCap className="h-4 w-4" /> Free training
                </Link>
              </div>
            </div>
          )}

          {closed.length > 0 && (
            <div className="mt-14">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recently closed</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {closed.map((job) => (
                  <ListingCard
                    key={job.id}
                    href={`/careers/${job.id}`}
                    eyebrow={job.department}
                    badge={job.employmentType}
                    title={job.title}
                    summary={job.summary}
                    location={job.location}
                    deadline={job.deadline}
                    closed="Closed"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-start sm:px-6 lg:px-8">
          <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Safe recruitment and equal opportunity</p>
            <p className="mt-1 max-w-3xl">
              LHI is committed to safeguarding the children and adults we work with. Recruitment includes reference and background checks, and every
              staff member signs and is trained on LHI&apos;s safeguarding policies. Only applications made through this page or an official LHI email
              are considered. Never pay anyone to be shortlisted or employed; report such requests to{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-primary hover:underline">{siteConfig.contact.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
