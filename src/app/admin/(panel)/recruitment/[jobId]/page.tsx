import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock } from "lucide-react";

import { RescreenButton } from "@/components/cms/recruitment-controls";
import { Badge, Card, formatDate, PageHeader, type Tone } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { REVIEW_STAGES, type Submission } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { interviewWhen, isFor } from "@/lib/recruitment/applications";

export const metadata = { title: "Applicants" };

const STAGES = REVIEW_STAGES["job-application"]!;

const matchTone = (s: Submission): Tone => (!s.screening?.readable ? "neutral" : s.screening.score >= 70 ? "success" : s.screening.score >= 40 ? "warning" : "danger");

/** One vacancy's applicants, in a column per stage, best keyword match first. */
export default async function VacancyApplicantsPage({ params }: { params: Promise<{ jobId: string }> }) {
  await requirePageUser("submissions");
  const { jobId } = await params;
  const [jobs, submissions] = await Promise.all([readStore("jobs"), readStore("submissions")]);
  const job = jobs.find((j) => j.id === jobId);
  if (!job) notFound();
  const apps = submissions
    .filter((s) => isFor(s, job) && s.status !== "archived")
    .sort((a, b) => (b.screening?.score ?? -1) - (a.screening?.score ?? -1) || b.createdAt.localeCompare(a.createdAt));
  const stageOf = (s: Submission) => s.review?.stage ?? STAGES[0];
  const unscreened = apps.filter((s) => !s.screening).length;

  return (
    <>
      <PageHeader
        title={job.title}
        description={`${apps.length} applicant${apps.length === 1 ? "" : "s"} · ${job.status === "open" ? `closes ${formatDate(job.deadline)}` : job.status}${job.reference ? ` · ${job.reference}` : ""}`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Recruitment", href: "/admin/recruitment" }, { label: job.title }]}
        actions={<RescreenButton jobId={job.id} />}
      />

      <Card className="mb-6" bodyClassName="flex flex-col gap-2 p-5 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Screening keywords</p>
          {job.keywords?.length ? (
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {job.keywords.map((k) => (
                <Badge key={k}>{k}</Badge>
              ))}
            </p>
          ) : (
            <p className="mt-1.5 text-admin-muted">None yet, so no CV can be scored. Add them to the vacancy, then press Re-screen CVs.</p>
          )}
          {unscreened > 0 && job.keywords?.length ? <p className="mt-2 text-xs text-admin-warning">{unscreened} applicant(s) haven&apos;t been screened yet. Press Re-screen CVs.</p> : null}
        </div>
        <Link href={`/admin/content/jobs/${job.id}`} className="shrink-0 text-sm font-semibold text-admin-primary hover:underline">
          Edit vacancy and keywords
        </Link>
      </Card>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {STAGES.map((stage) => {
            const here = apps.filter((s) => stageOf(s) === stage);
            return (
              <section key={stage} aria-labelledby={`stage-${stage}`} className="w-64 shrink-0 rounded-xl border border-admin-border bg-admin-bg/50">
                <h2 id={`stage-${stage}`} className="flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-admin-muted">
                  {stage} <span className="tabular-nums">{here.length}</span>
                </h2>
                <ul className="space-y-2 px-2 pb-2">
                  {here.map((s) => (
                    <li key={s.id}>
                      <Link href={`/admin/submissions/${s.id}`} className="block rounded-lg border border-admin-border bg-admin-card p-3 text-sm hover:border-admin-primary">
                        <span className="flex items-start justify-between gap-2">
                          <span className={`min-w-0 truncate ${s.status === "new" ? "font-bold" : "font-semibold"}`}>{s.name}</span>
                          {s.screening && <Badge tone={matchTone(s)}>{s.screening.pending ? "Reading scan…" : s.screening.readable ? `${s.screening.score}%` : "CV unreadable"}</Badge>}
                        </span>
                        {s.screening?.matched.length ? <span className="mt-1 line-clamp-2 block text-xs text-admin-muted">{s.screening.matched.join(" · ")}</span> : null}
                        {s.review?.interview && (
                          <span className="mt-1.5 flex items-center gap-1 text-xs text-admin-primary">
                            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> {interviewWhen(s.review.interview.at)}
                          </span>
                        )}
                        <span className="mt-1.5 flex items-center justify-between text-[11px] text-admin-muted">
                          <span>Applied {formatDate(s.createdAt)}</span>
                          {s.review?.score !== undefined && <span>Panel score {s.review.score}</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {here.length === 0 && <li className="px-1 py-3 text-center text-xs text-admin-muted">No one</li>}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
