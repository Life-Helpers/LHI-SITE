import { LearnerActions } from "@/components/cms/learner-actions";
import { Card, formatDate, PageHeader } from "@/components/cms/ui";
import { COURSES } from "@/data/training/courses";
import { requirePageUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Learners" };

export default async function LearnersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await requirePageUser("training");
  const { q = "" } = await searchParams;
  const all = (await readStore("learners")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const query = q.trim().toLowerCase();
  const list = all.filter((l) => !query || [l.name, l.email, l.organization ?? ""].some((v) => v.toLowerCase().includes(query)));
  const certified = all.filter((l) => Object.values(l.progress).some((p) => p.certificateId)).length;

  return (
    <>
      <PageHeader
        title="Learners"
        description="People who signed up for the Humanitarian Training centre, with their course progress."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Learners" }]}
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">Learners</p>
          <p className="mt-1 text-2xl font-bold">{all.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">With a certificate</p>
          <p className="mt-1 text-2xl font-bold">{certified}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">Joined in the last 30 days</p>
          <p className="mt-1 text-2xl font-bold">{all.filter((l) => Date.now() - Date.parse(l.createdAt) < 30 * 86400_000).length}</p>
        </Card>
      </div>
      <Card bodyClassName="p-0">
        <form className="flex gap-3 border-b border-admin-border p-4">
          <input name="q" defaultValue={q} placeholder="Search name, email or organisation…" className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm" />
          <button className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white">Search</button>
        </form>
        <ul className="divide-y divide-admin-border">
          {list.map((l) => (
            <li key={l.id} className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-[1fr_1.4fr_auto]">
              <div>
                <p className="font-semibold">{l.name}</p>
                <a href={`mailto:${l.email}`} className="text-sm text-admin-primary hover:underline">
                  {l.email}
                </a>
                {l.organization && <p className="text-xs text-admin-muted">{l.organization}</p>}
                <p className="mt-1 text-xs text-admin-muted">
                  Joined {formatDate(l.createdAt)}
                  {l.lastLoginAt ? ` · last sign-in ${formatDate(l.lastLoginAt, true)}` : ""}
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                {COURSES.map((c) => {
                  const p = l.progress[c.id];
                  if (!p) return null;
                  const pct = Math.round((p.completed.length / c.lessons.length) * 100);
                  return (
                    <li key={c.id}>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate font-medium">{c.title}</span>
                        <span className="shrink-0 text-admin-muted">
                          {p.certificateId ? (
                            <a href={`/api/training/certificates/${p.certificateId}`} target="_blank" rel="noreferrer" className="font-semibold text-admin-primary hover:underline">
                              Certified · {p.score}%
                            </a>
                          ) : (
                            `${p.completed.length}/${c.lessons.length} lessons${p.attempts ? ` · ${p.attempts} attempt${p.attempts > 1 ? "s" : ""}, last ${p.lastScore}%` : ""}`
                          )}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-admin-bg">
                        <div className="h-full rounded-full bg-admin-primary" style={{ width: `${p.certificateId ? 100 : pct}%` }} />
                      </div>
                    </li>
                  );
                })}
                {Object.keys(l.progress).length === 0 && <li className="text-xs text-admin-muted">No lessons started yet.</li>}
              </ul>
              <LearnerActions id={l.id} email={l.email} canDelete={can(user, "training.manage")} />
            </li>
          ))}
          {list.length === 0 && <li className="px-5 py-12 text-center text-sm text-admin-muted">No learners yet.</li>}
        </ul>
      </Card>
    </>
  );
}
