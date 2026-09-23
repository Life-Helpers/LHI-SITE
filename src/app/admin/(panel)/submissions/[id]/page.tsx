import { notFound } from "next/navigation";

import { SubmissionActions } from "@/components/cms/submission-actions";
import { SubmissionReview } from "@/components/cms/submission-review";
import { Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can, REVIEW_STAGES, SCORED_TYPES } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Submission" };

const humanize = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser("submissions");
  const { id } = await params;
  const s = (await readStore("submissions")).find((x) => x.id === id);
  if (!s) notFound();

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
            <SubmissionReview id={s.id} stages={REVIEW_STAGES[s.type]!} scored={SCORED_TYPES.includes(s.type)} review={s.review} />
          </Card>
        )}
      </div>
    </>
  );
}
