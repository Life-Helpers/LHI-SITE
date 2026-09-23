import Link from "next/link";

import { Card, formatDate, PageHeader } from "@/components/cms/ui";
import { COURSES } from "@/data/training/courses";
import { requirePageUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Training Certificates" };

export default async function CertificatesPage({ searchParams }: { searchParams: Promise<{ course?: string; q?: string }> }) {
  await requirePageUser("editor");
  const { course = "all", q = "" } = await searchParams;
  const all = await readStore("certificates");
  const query = q.trim().toLowerCase();
  const list = all.filter(
    (c) =>
      (course === "all" || c.courseId === course) &&
      (!query || [c.id, c.name, c.email, c.organization ?? ""].some((v) => v.toLowerCase().includes(query))),
  );

  return (
    <>
      <PageHeader
        title="Training Certificates"
        description="Certificates issued by the Humanitarian Training centre. Anyone can verify a code on the public training page."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Certificates" }]}
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">Total issued</p>
          <p className="mt-1 text-2xl font-bold">{all.length}</p>
        </Card>
        {COURSES.map((c) => (
          <Card key={c.id}>
            <p className="truncate text-xs uppercase tracking-wider text-admin-muted">{c.title}</p>
            <p className="mt-1 text-2xl font-bold">{all.filter((x) => x.courseId === c.id).length}</p>
          </Card>
        ))}
      </div>
      <Card bodyClassName="p-0">
        <form className="flex flex-col gap-3 border-b border-admin-border p-4 sm:flex-row sm:items-center">
          <select name="course" defaultValue={course} className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm">
            <option value="all">All courses</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input name="q" defaultValue={q} placeholder="Search name, email, code…" className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm" />
          <button className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white">Filter</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Issued</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-admin-border last:border-0">
                  <td className="px-5 py-2.5 font-mono text-xs">
                    <a href={`/api/training/certificates/${c.id}`} target="_blank" rel="noreferrer" className="text-admin-primary hover:underline">{c.id}</a>
                  </td>
                  <td className="px-5 py-2.5">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-admin-muted">
                      <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                      {c.organization ? ` · ${c.organization}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-2.5">{c.courseTitle}</td>
                  <td className="px-5 py-2.5">{c.score}%</td>
                  <td className="whitespace-nowrap px-5 py-2.5 text-admin-muted">{formatDate(c.issuedAt, true)}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-admin-muted">
                    No certificates yet. <Link href="/get-involved/training" className="text-admin-primary hover:underline">View the training centre</Link>
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
