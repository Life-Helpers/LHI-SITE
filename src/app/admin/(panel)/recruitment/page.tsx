import Link from "next/link";

import { Badge, Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { REVIEW_STAGES } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { interviewWhen, isFor } from "@/lib/recruitment/applications";

export const metadata = { title: "Recruitment" };

const STAGES = REVIEW_STAGES["job-application"]!;
const nowInLagos = () => new Date(Date.now() + 3_600_000).toISOString().slice(0, 16);

/** Every vacancy with its applicants by stage, and the interviews coming up. */
export default async function RecruitmentPage() {
  await requirePageUser("submissions");
  const [jobs, submissions] = await Promise.all([readStore("jobs"), readStore("submissions")]);
  const applications = submissions.filter((s) => s.type === "job-application" && s.status !== "archived");
  const rows = jobs
    .map((job) => ({ job, apps: applications.filter((s) => isFor(s, job)) }))
    .filter(({ job, apps }) => job.status !== "draft" || apps.length > 0)
    .sort((a, b) => Number(b.job.status === "open") - Number(a.job.status === "open") || b.job.deadline.localeCompare(a.job.deadline));
  const now = nowInLagos();
  const upcoming = applications
    .filter((s) => s.review?.interview && s.review.interview.at >= now)
    .sort((a, b) => a.review!.interview!.at.localeCompare(b.review!.interview!.at));
  const stageOf = (s: (typeof applications)[number]) => s.review?.stage ?? STAGES[0];

  return (
    <>
      <PageHeader
        title="Recruitment"
        description="Applicants for each vacancy, ranked by how well their CV matches the vacancy's screening keywords. Open a vacancy to see its applicants by stage."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Recruitment" }]}
      />

      {upcoming.length > 0 && (
        <Card title={`Upcoming interviews (${upcoming.length})`} className="mb-6" bodyClassName="p-0">
          <ul className="divide-y divide-admin-border">
            {upcoming.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/submissions/${s.id}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm hover:bg-admin-bg/60">
                  <span className="min-w-0">
                    <span className="font-semibold">{s.name}</span> <span className="text-admin-muted">· {s.fields.vacancy}</span>
                  </span>
                  <span className="flex items-center gap-2 text-admin-muted">
                    {interviewWhen(s.review!.interview!.at)} <Badge tone="primary">{s.review!.interview!.mode}</Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-admin-border text-left text-xs uppercase tracking-wider text-admin-muted">
                <th className="px-5 py-3 font-semibold">Vacancy</th>
                <th className="px-3 py-3 font-semibold">Deadline</th>
                <th className="px-3 py-3 text-right font-semibold">Applicants</th>
                {["Shortlisted", "Interview", "Offer", "Hired"].map((st) => (
                  <th key={st} className="px-3 py-3 text-right font-semibold">
                    {st}
                  </th>
                ))}
                <th className="px-5 py-3 font-semibold">Keywords</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {rows.map(({ job, apps }) => (
                <tr key={job.id} className="hover:bg-admin-bg/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/recruitment/${job.id}`} className="font-semibold text-admin-primary hover:underline">
                      {job.title}
                    </Link>
                    <span className="ml-2">
                      {job.status === "open" && job.deadline < now.slice(0, 10) ? <Badge tone="warning">deadline passed</Badge> : <Badge tone={job.status === "open" ? "success" : "neutral"}>{job.status}</Badge>}
                    </span>
                    {job.reference && <p className="text-xs text-admin-muted">{job.reference}</p>}
                  </td>
                  <td className="px-3 py-3 text-admin-muted">{formatDate(job.deadline)}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">{apps.length}</td>
                  {["Shortlisted", "Interview", "Offer", "Hired"].map((st) => (
                    <td key={st} className="px-3 py-3 text-right tabular-nums text-admin-muted">
                      {apps.filter((s) => stageOf(s) === st).length || "–"}
                    </td>
                  ))}
                  <td className="px-5 py-3">{job.keywords?.length ? <span className="text-admin-muted">{job.keywords.length} set</span> : <Badge tone="warning">None yet</Badge>}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-admin-muted">
                    No vacancies yet. Add one in Jobs &amp; Vacancies.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
