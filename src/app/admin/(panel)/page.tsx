import Link from "next/link";
import { FileText, FolderKanban, Handshake, ImageIcon, Inbox, PenLine, Plus } from "lucide-react";

import { QuickDraft } from "@/components/cms/quick-draft";
import { Badge, buttonClass, Card, formatDate, PageHeader, statusTone } from "@/components/cms/ui";
import { WeeklyBarChart, type WeeklyPoint } from "@/components/cms/weekly-bar-chart";
import { requirePageUser } from "@/lib/cms/auth";
import { can, SUBMISSION_TYPE_LABELS } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";


function weeklyCounts(dates: string[], weeks = 12): WeeklyPoint[] {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7);
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    return { start: d, value: 0 };
  });
  for (const iso of dates) {
    const t = new Date(iso).getTime();
    const idx = Math.floor((t - start.getTime()) / (7 * 86400000));
    if (idx >= 0 && idx < weeks) buckets[idx].value += 1;
  }
  return buckets.map((b) => ({ label: b.start.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), value: b.value }));
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requirePageUser();
  const { denied } = await searchParams;
  const isEditor = can(user, "submissions");

  const [posts, interventions, partners, media, submissions, activity] = await Promise.all([
    readStore("posts"),
    readStore("interventions"),
    readStore("partners"),
    readStore("media"),
    isEditor ? readStore("submissions") : Promise.resolve([]),
    can(user, "activity") ? readStore("activity") : Promise.resolve([]),
  ]);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft");
  const newSubs = submissions.filter((s) => s.status === "new").length;

  const tiles = [
    { label: "Published posts", value: published, sub: `${drafts.length} drafts`, icon: FileText, href: "/admin/content/posts" },
    ...(isEditor
      ? [
          {
            label: "Interventions",
            value: interventions.length,
            sub: `${interventions.filter((i) => i.status === "Active").length} active`,
            icon: FolderKanban,
            href: "/admin/content/interventions",
          },
          { label: "New submissions", value: newSubs, sub: `${submissions.length} total`, icon: Inbox, href: "/admin/submissions" },
          {
            label: "Partners on site",
            value: partners.filter((p) => p.visible).length,
            sub: `${partners.filter((p) => p.logoUrl).length} with uploaded logos`,
            icon: Handshake,
            href: "/admin/content/partners",
          },
        ]
      : []),
    { label: "Media files", value: media.length, sub: "in the library", icon: ImageIcon, href: "/admin/media" },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's what's happening on lhinigeria.org."
        actions={
          <>
            <Link href="/admin/content/posts/new" className={buttonClass.primary}>
              <Plus className="h-4 w-4" /> New post
            </Link>
            {isEditor && (
              <Link href="/admin/content/interventions/new" className={buttonClass.secondary}>
                <Plus className="h-4 w-4" /> New intervention
              </Link>
            )}
          </>
        }
      />

      {denied && (
        <p role="alert" className="mb-6 rounded-lg bg-admin-warning-soft px-4 py-3 text-sm text-admin-warning">
          Your role doesn&apos;t have access to that page.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-xl border border-admin-border bg-admin-card p-4 transition-colors hover:border-admin-primary"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-admin-muted">{t.label}</p>
              <t.icon className="h-4 w-4 text-admin-primary" aria-hidden="true" />
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight">{t.value.toLocaleString("en-US")}</p>
            <p className="mt-0.5 text-xs text-admin-muted">{t.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {isEditor && (
            <Card
              title="Form submissions per week"
              action={
                <Link href="/admin/submissions" className="text-xs font-semibold text-admin-primary">
                  Open inbox
                </Link>
              }
            >
              <WeeklyBarChart data={weeklyCounts(submissions.map((s) => s.createdAt))} unit="submissions" />
            </Card>
          )}

          <Card
            title="Recent posts"
            bodyClassName="divide-y divide-admin-border"
            action={
              <Link href="/admin/content/posts" className="text-xs font-semibold text-admin-primary">
                All posts
              </Link>
            }
          >
            {[...posts]
              .sort((a, b) => (b.updatedAt ?? b.date).localeCompare(a.updatedAt ?? a.date))
              .slice(0, 6)
              .map((p) => (
                <Link key={p.id} href={`/admin/content/posts/${p.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-admin-bg/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-admin-muted">
                      {p.category} · {formatDate(p.date)}
                    </p>
                  </div>
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                </Link>
              ))}
            {posts.length === 0 && <p className="px-5 py-8 text-center text-sm text-admin-muted">No posts yet.</p>}
          </Card>

          {isEditor && (
            <Card title="Latest submissions" bodyClassName="divide-y divide-admin-border">
              {submissions.slice(0, 5).map((s) => (
                <Link key={s.id} href={`/admin/submissions/${s.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-admin-bg/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.subject || s.name}</p>
                    <p className="truncate text-xs text-admin-muted">
                      {SUBMISSION_TYPE_LABELS[s.type]} · {s.name} · {formatDate(s.createdAt, true)}
                    </p>
                  </div>
                  <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                </Link>
              ))}
              {submissions.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-admin-muted">
                  No submissions yet. Contact, volunteer and consortium forms land here.
                </p>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title={<span className="inline-flex items-center gap-2"><PenLine className="h-4 w-4 text-admin-primary" /> Quick draft</span>}>
            <QuickDraft />
          </Card>

          {drafts.length > 0 && (
            <Card title="Your drafts" bodyClassName="divide-y divide-admin-border">
              {drafts.slice(0, 5).map((p) => (
                <Link key={p.id} href={`/admin/content/posts/${p.id}`} className="block px-5 py-2.5 text-sm hover:bg-admin-bg/60">
                  <span className="line-clamp-1 font-medium">{p.title}</span>
                  <span className="text-xs text-admin-muted">{formatDate(p.updatedAt ?? p.date)}</span>
                </Link>
              ))}
            </Card>
          )}

          {activity.length > 0 && (
            <Card
              title="Activity"
              action={
                <Link href="/admin/activity" className="text-xs font-semibold text-admin-primary">
                  View all
                </Link>
              }
            >
              <ol className="relative space-y-4 border-l border-admin-border pl-4">
                {activity.slice(0, 7).map((a) => (
                  <li key={a.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-admin-card bg-admin-primary" />
                    <p>
                      <span className="font-semibold">{a.user}</span> {a.action}{" "}
                      {a.href ? (
                        <Link href={a.href} className="text-admin-primary hover:underline">
                          {a.target}
                        </Link>
                      ) : (
                        <span className="text-admin-muted">{a.target}</span>
                      )}
                    </p>
                    <p className="text-xs text-admin-muted">{formatDate(a.at, true)}</p>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
