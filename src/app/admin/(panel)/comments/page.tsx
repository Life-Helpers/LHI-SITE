import Link from "next/link";

import { CommentActions } from "@/components/cms/comment-actions";
import { Badge, Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Comments" };

export default async function CommentsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requirePageUser("comments");
  const { view = "pending" } = await searchParams;
  const [all, likes] = await Promise.all([readStore("comments"), readStore("likes")]);
  const list = all.filter((c) => c.status === (view === "approved" ? "approved" : "pending"));
  const pendingCount = all.filter((c) => c.status === "pending").length;
  const totalLikes = likes.reduce((sum, l) => sum + l.likes, 0);
  const topLiked = [...likes].sort((a, b) => b.likes - a.likes).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Comments"
        description="Reader comments on posts are held here until approved. Likes are counted automatically."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Comments" }]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card bodyClassName="p-0" className="lg:col-span-2">
          <div className="flex gap-1 border-b border-admin-border p-4 text-sm">
            {[
              { id: "pending", label: `Pending (${pendingCount})` },
              { id: "approved", label: `Approved (${all.length - pendingCount})` },
            ].map((t) => (
              <Link
                key={t.id}
                href={`?view=${t.id}`}
                className={`rounded-lg px-3 py-1.5 font-medium ${view === t.id ? "bg-admin-primary-soft text-admin-primary" : "text-admin-muted hover:bg-admin-bg"}`}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <ul className="divide-y divide-admin-border">
            {list.map((c) => (
              <li key={c.id} className="space-y-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {c.name}{" "}
                      <a href={`mailto:${c.email}`} className="font-normal text-admin-muted hover:underline">
                        {c.email}
                      </a>
                    </p>
                    <p className="text-xs text-admin-muted">
                      on{" "}
                      <Link href={`/blog/${c.slug}`} target="_blank" className="text-admin-primary hover:underline">
                        {c.postTitle}
                      </Link>{" "}
                      · {formatDate(c.createdAt, true)}
                    </p>
                  </div>
                  <Badge tone={c.status === "approved" ? "success" : "warning"}>{c.status}</Badge>
                </div>
                <p className="whitespace-pre-line text-sm">{c.body}</p>
                <CommentActions id={c.id} status={c.status} />
              </li>
            ))}
            {list.length === 0 && <li className="px-5 py-12 text-center text-sm text-admin-muted">No {view} comments.</li>}
          </ul>
        </Card>
        <Card title="Likes">
          <p className="text-3xl font-bold">{totalLikes}</p>
          <p className="text-xs text-admin-muted">total likes across all posts</p>
          {topLiked.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {topLiked.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3">
                  <Link href={`/blog/${l.id}`} target="_blank" className="truncate text-admin-primary hover:underline">
                    {l.id}
                  </Link>
                  <span className="font-semibold tabular-nums">{l.likes}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
