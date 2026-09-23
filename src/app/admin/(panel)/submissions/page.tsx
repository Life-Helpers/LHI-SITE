import Link from "next/link";
import { Download } from "lucide-react";

import { Badge, buttonClass, Card, formatDate, PageHeader, statusTone } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { SUBMISSION_TYPE_LABELS, type SubmissionType } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Submissions" };

const TYPES: { id: SubmissionType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...(Object.entries(SUBMISSION_TYPE_LABELS) as [SubmissionType, string][]).map(([id, label]) => ({ id, label })),
];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; view?: string }>;
}) {
  await requirePageUser("submissions");
  const { type = "all", view = "inbox" } = await searchParams;
  const all = await readStore("submissions");
  const list = all.filter(
    (s) => (type === "all" || s.type === type) && (view === "archived" ? s.status === "archived" : s.status !== "archived"),
  );
  const label = (t: SubmissionType) => TYPES.find((x) => x.id === t)?.label ?? t;
  const qs = (next: Record<string, string>) => `?${new URLSearchParams({ type, view, ...next })}`;

  return (
    <>
      <PageHeader
        title="Submissions"
        description="Job applications, vendor bids and registrations, contact messages, volunteer sign-ups, consortium expressions of interest and newsletter subscribers."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Submissions" }]}
        actions={
          <>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page */}
            <a href={type === "all" ? "/api/admin/export/submissions" : `/api/admin/export/submissions?type=${type}`} download className={buttonClass.secondary}>
              <Download className="h-4 w-4" /> Export CSV
            </a>
          </>
        }
      />
      <Card bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-admin-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 text-sm">
            {TYPES.map((t) => (
              <Link
                key={t.id}
                href={qs({ type: t.id })}
                className={`rounded-lg px-3 py-1.5 font-medium ${
                  type === t.id ? "bg-admin-primary-soft text-admin-primary" : "text-admin-muted hover:bg-admin-bg"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-1 text-sm">
            {["inbox", "archived"].map((v) => (
              <Link
                key={v}
                href={qs({ view: v })}
                className={`rounded-lg px-3 py-1.5 font-medium capitalize ${
                  view === v ? "bg-admin-bg text-admin-text" : "text-admin-muted hover:bg-admin-bg"
                }`}
              >
                {v}
              </Link>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-admin-border">
          {list.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/submissions/${s.id}`} className="flex items-start gap-4 px-5 py-3.5 hover:bg-admin-bg/60">
                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${s.status === "new" ? "bg-admin-primary" : "bg-transparent"}`}
                  aria-label={s.status === "new" ? "Unread" : undefined}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`truncate text-sm ${s.status === "new" ? "font-bold" : "font-medium"}`}>{s.name}</p>
                    <Badge tone="primary">{label(s.type)}</Badge>
                    {s.organization && <span className="truncate text-xs text-admin-muted">{s.organization}</span>}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-admin-muted">{s.subject}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-admin-muted">{formatDate(s.createdAt, true)}</p>
                  <div className="mt-1">
                    <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {list.length === 0 && <li className="px-5 py-16 text-center text-sm text-admin-muted">Nothing here.</li>}
        </ul>
      </Card>
    </>
  );
}
