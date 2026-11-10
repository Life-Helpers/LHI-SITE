import { notFound } from "next/navigation";

import Link from "next/link";

import { InterviewScheduler } from "@/components/cms/recruitment-controls";
import { SubmissionActions } from "@/components/cms/submission-actions";
import { SubmissionReview } from "@/components/cms/submission-review";
import { Badge, Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can, REVIEW_STAGES, SCORED_TYPES } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { interviewWhen, isFor } from "@/lib/recruitment/applications";

export const metadata = { title: "Submission" };

const humanize = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser("submissions");
  const { id } = await params;
  const s = (await readStore("submissions")).find((x) => x.id === id);
  if (!s) notFound();
  const job = s.type === "job-application" ? (await readStore("jobs")).find((j) => isFor(s, j)) : undefined;

  return (
    <>
      <PageHeader
        title={s.subject || "Submission"}
        description={`Received ${formatDate(s.createdAt, true)}`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Submissions", href: "/admin/submissions" }, { label: s.name }]}
        actions={
          <SubmissionActions id={s.id} status={s.status} email={s.email} subject={s.subject} canDelete={can(user, "submissions.delete")} />
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Details" className="lg:col-span-2" bodyClassName="p-0">
          <dl className="divide-y divide-admin-border">
            {Object.entries(s.fields).map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-admin-muted">{humanize(k)}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm sm:col-span-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card title="Sender">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs text-admin-muted">Name</dt><dd className="font-semibold">{s.name}</dd></div>
            <div><dt className="text-xs text-admin-muted">Email</dt><dd>{s.email ? <a className="text-admin-primary" href={`mailto:${s.email}`}>{s.email}</a> : <span className="text-admin-muted">Not given</span>}</dd></div>
            {s.organization && <div><dt className="text-xs text-admin-muted">Organization</dt><dd>{s.organization}</dd></div>}
            {s.fields.phone && <div><dt className="text-xs text-admin-muted">Phone</dt><dd>{s.fields.phone}</dd></div>}
          </dl>
          {s.attachments && s.attachments.length > 0 && (
            <div className="mt-5 border-t border-admin-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Attachments</p>
              <ul className="mt-2 space-y-2 text-sm">
                {s.attachments.map((a, i) => (
                  <li key={a.stored}>
                    <a className="font-medium text-admin-primary hover:underline" href={`/api/admin/submissions/${s.id}/files/${i}`}>
                      {a.filename}
                    </a>{" "}
                    <span className="text-xs text-admin-muted">({Math.max(1, Math.round(a.size / 1024))} KB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
        {REVIEW_STAGES[s.type] && (
          <Card title={s.type === "feedback" ? "Response tracking" : "Review"} className="lg:col-start-3">
            <SubmissionReview key={s.review?.updatedAt ?? "new"} id={s.id} stages={REVIEW_STAGES[s.type]!} scored={SCORED_TYPES.includes(s.type)} review={s.review} />
          </Card>
        )}
        {s.type === "job-application" && (
          <Card
            title="CV screening"
            className="lg:col-span-2"
            action={
              job && (
                <Link href={`/admin/recruitment/${job.id}`} className="text-xs font-semibold text-admin-primary hover:underline">
                  All applicants for this vacancy
                </Link>
              )
            }
          >
            {!s.screening ? (
              <p className="text-sm text-admin-muted">Not screened yet. Open the vacancy in Recruitment and press Re-screen CVs.</p>
            ) : !s.screening.readable ? (
              <p className="text-sm text-admin-muted">
                The CV&apos;s text couldn&apos;t be read (a scanned image or an old Word .doc file), so it has no keyword score. Read the CV yourself.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-2xl font-bold tabular-nums">{s.screening.score}%</span>{" "}
                  <span className="text-admin-muted">
                    of the vacancy&apos;s {s.screening.matched.length + s.screening.missing.length} keywords are in the CV · screened {formatDate(s.screening.at, true)}
                  </span>
                </p>
                {s.screening.matched.length > 0 && (
                  <p className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-admin-muted">Mentions</span>
                    {s.screening.matched.map((k) => (
                      <Badge key={k} tone="success">{k}</Badge>
                    ))}
                  </p>
                )}
                {s.screening.missing.length > 0 && (
                  <p className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-admin-muted">Not found</span>
                    {s.screening.missing.map((k) => (
                      <Badge key={k}>{k}</Badge>
                    ))}
                  </p>
                )}
                <p className="text-xs text-admin-muted">A guide for shortlisting, not a decision: a good candidate may describe the same skill in other words.</p>
              </div>
            )}
          </Card>
        )}
        {s.type === "job-application" && (
          <Card title={s.review?.interview ? "Interview" : "Schedule an interview"}>
            {s.review?.interview && (
              <p className="mb-4 rounded-lg bg-admin-primary-soft p-3 text-sm text-admin-primary">
                {s.review.interview.mode}, {interviewWhen(s.review.interview.at)} · {s.review.interview.minutes} min
                <span className="mt-0.5 block text-xs">
                  Booked by {s.review.interview.scheduledBy}
                  {s.review.interview.emailed ? " · invitation emailed" : " · not emailed"}
                </span>
              </p>
            )}
            <InterviewScheduler id={s.id} interview={s.review?.interview} hasEmail={Boolean(s.email)} />
          </Card>
        )}
      </div>
    </>
  );
}
