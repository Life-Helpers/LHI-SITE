import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Briefcase, CalendarClock, CheckCircle2, FileDown, Hash, MapPin, Users } from "lucide-react";

import { ApplicationForm } from "@/components/careers/application-form";
import { formatDeadline } from "@/components/careers/listing-card";
import { getJob } from "@/lib/cms/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const found = await getJob((await params).id);
  return found ? { title: `${found.job.title} | Careers`, description: found.job.summary } : {};
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const found = await getJob((await params).id);
  if (!found) notFound();
  const { job, open } = found;

  const facts = [
    { icon: Briefcase, label: "Department", value: job.department },
    { icon: MapPin, label: "Duty station", value: job.location },
    { icon: Users, label: "Contract", value: job.positions > 1 ? `${job.employmentType} · ${job.positions} positions` : job.employmentType },
    { icon: CalendarClock, label: "Deadline", value: formatDeadline(job.deadline) },
    ...(job.reference ? [{ icon: Hash, label: "Reference", value: job.reference }] : []),
  ];

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/careers" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All vacancies
        </Link>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">{job.department}</p>
            <h1 className="mt-2 font-serif-display text-4xl font-light text-foreground">{job.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{job.summary}</p>

            <div className="prose-post mt-8">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>

            {job.requirements.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif-display text-2xl font-light text-foreground">Qualifications &amp; requirements</h2>
                <ul className="mt-4 space-y-2.5">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section id="apply" className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif-display text-2xl font-light text-foreground">Apply for this role</h2>
              {open ? (
                <div className="mt-6">
                  <ApplicationForm jobId={job.id} jobTitle={job.title} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Applications for this vacancy have closed.</p>
              )}
            </section>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <dl className="space-y-4 rounded-3xl border border-border bg-card p-6 text-sm">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</dt>
                    <dd className="font-semibold text-foreground">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {open && (
              <a href="#apply" className="block rounded-full bg-primary px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                Apply now
              </a>
            )}
            {job.attachment && (
              <a href={job.attachment} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
                <FileDown className="h-4 w-4" /> Full job description
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
