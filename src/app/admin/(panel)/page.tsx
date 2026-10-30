import Link from "next/link";
import { AlertTriangle, BookOpenCheck, CheckCircle2, FileText, Heart, ImageIcon, Inbox, Mail, PenLine, Plus, Briefcase, Users } from "lucide-react";

import { BarList, ColumnChart, Kpi, SplitBar, type Series } from "@/components/cms/charts";
import { QuickDraft } from "@/components/cms/quick-draft";
import { TintStat } from "@/components/cms/tint-stat";
import { Badge, buttonClass, Card, formatDate, statusTone } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can, PERMISSION_HOME, PERMISSION_ITEMS, REVIEW_STAGES, SUBMISSION_TYPE_LABELS, type SubmissionType } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { emailProvider } from "@/lib/email/send";
import { getSubscribers } from "@/lib/email/subscribers";

/** The last `n` calendar months, oldest first, as "2026-10" keys with short and full labels. */
function lastMonths(n = 12) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      short: d.toLocaleDateString("en-GB", { month: "short" }),
      full: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    };
  });
}

const countBy = <T,>(items: T[], key: (item: T) => string) =>
  items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

const DAY = 86400000;
const within = (iso: string | undefined, days: number) => Boolean(iso) && Date.now() - new Date(iso!).getTime() <= days * DAY;
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string; welcome?: string }> }) {
  const user = await requirePageUser();
  const { denied, welcome } = await searchParams;
  // What this person's role lets them do, grouped as in the menu, each linking to where it's done.
  const myFunctions = PERMISSION_ITEMS.filter((i) => user.permissions.includes(i.id));
  const functionGroups = [...new Set(myFunctions.map((f) => f.group))].map((group) => ({ group, items: myFunctions.filter((f) => f.group === group) }));
  const seesInbox = can(user, "submissions");
  const seesAll = can(user, "posts.all");

  // Each panel only loads (and shows) what this person's role covers.
  const none = <T,>() => Promise.resolve([] as T[]);
  const [allPosts, media, submissions, subscribers, learners, certificates, comments, likes, outbox, jobs, activity] = await Promise.all([
    readStore("posts"),
    can(user, "media") ? readStore("media") : none<never>(),
    seesInbox ? readStore("submissions") : none<never>(),
    can(user, "newsletter") ? getSubscribers() : none<never>(),
    can(user, "training") ? readStore("learners") : none<never>(),
    can(user, "training") ? readStore("certificates") : none<never>(),
    can(user, "comments") ? readStore("comments") : none<never>(),
    can(user, "comments") ? readStore("likes") : none<never>(),
    can(user, "email") ? readStore("outbox") : none<never>(),
    can(user, "jobs") ? readStore("jobs") : none<never>(),
    can(user, "activity") ? readStore("activity") : none<never>(),
  ]);
  // Authors see their own posts; editors see everything.
  const posts = seesAll ? allPosts : allPosts.filter((p) => p.authorId === user.id);

  const months = lastMonths(12);
  const monthOf = (iso: string) => iso.slice(0, 7);
  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");
  const awaitingReview = posts.filter((p) => p.status === "review");
  const publishedThisMonth = published.filter((p) => monthOf(p.date) === months.at(-1)!.key).length;

  // Inbox: the busiest form types get their own colour; the rest fold into "Other".
  const byType = countBy(submissions, (s) => s.type);
  const topTypes = (Object.keys(byType) as SubmissionType[]).sort((a, b) => byType[b] - byType[a]).slice(0, 4);
  const inboxSeries: Series[] = [
    ...topTypes.map((t, i) => ({ name: SUBMISSION_TYPE_LABELS[t], slot: i, values: months.map((m) => submissions.filter((s) => s.type === t && monthOf(s.createdAt) === m.key).length) })),
    ...(Object.keys(byType).length > topTypes.length
      ? [{ name: "Other", slot: 8, values: months.map((m) => submissions.filter((s) => !topTypes.includes(s.type) && monthOf(s.createdAt) === m.key).length) }]
      : []),
  ];
  const newSubs = submissions.filter((s) => s.status === "new").length;
  const last30 = submissions.filter((s) => within(s.createdAt, 30)).length;
  const prev30 = submissions.filter((s) => within(s.createdAt, 60) && !within(s.createdAt, 30)).length;

  // Recruitment: job applications by review stage.
  const applications = submissions.filter((s) => s.type === "job-application");
  const stages = REVIEW_STAGES["job-application"] ?? [];
  const pipeline = stages.map((stage) => ({ label: stage, value: applications.filter((a) => (a.review?.stage ?? stages[0]) === stage).length }));
  const openJobs = jobs.filter((j) => j.status === "open");

  // Training: learners, completions and certificates.
  const completedLearners = learners.filter((l) => Object.values(l.progress ?? {}).some((p) => p.certificateId)).length;

  // Engagement: likes and moderated comments.
  const totalLikes = likes.reduce((n, l) => n + l.likes, 0);
  const pendingComments = comments.filter((c) => c.status === "pending").length;
  const titleOf = new Map(allPosts.map((p) => [p.id, p.title]));
  const topLiked = [...likes].sort((a, b) => b.likes - a.likes).slice(0, 5).map((l) => ({ label: titleOf.get(l.id) ?? l.id, value: l.likes }));

  // Email delivery.
  const mailCounts = countBy(outbox, (e) => e.status);
  const provider = emailProvider();

  // Site setup checklist for whoever runs the site.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const gaId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
  const checklist = can(user, "settings")
    ? [
        { ok: Boolean(provider), label: "Email provider connected", help: provider ? `Sending through ${provider}.` : "Password resets, alerts and newsletters wait in the Outbox until one is set up." },
        { ok: siteUrl.includes("lhinigeria.org"), label: "Site served from lhinigeria.org", help: siteUrl ? `Site address is ${siteUrl.replace(/^https?:\/\//, "")}.` : "No site address set." },
        { ok: /^G-[A-Z0-9]{4,20}$/.test(gaId), label: "Google Analytics ID valid", help: gaId ? "Visitor numbers are being collected." : "No visitor analytics yet." },
        { ok: user.twoFactor, label: "Two-step sign-in on your account", help: user.twoFactor ? "Your account is protected." : "Turn it on in Profile." },
      ]
    : [];

  const firstName = user.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const tiles = [
    { tint: "blue" as const, icon: FileText, label: seesAll ? "Published posts" : "Your published posts", value: published.length, note: `${publishedThisMonth} this month · ${drafts.length} drafts${awaitingReview.length ? ` · ${awaitingReview.length} in review` : ""}`, href: "/admin/content/posts" },
    ...(seesInbox
      ? [{ tint: "amber" as const, icon: Inbox, label: "New in inbox", value: newSubs, note: `${last30} in the last 30 days${prev30 || last30 ? ` (${last30 >= prev30 ? "+" : ""}${last30 - prev30} vs previous)` : ""}`, href: "/admin/submissions", progress: pct(newSubs, submissions.length) }]
      : []),
    ...(can(user, "newsletter") ? [{ tint: "violet" as const, icon: Mail, label: "Newsletter subscribers", value: subscribers.length, note: `${subscribers.filter((s) => within(s.subscribedAt, 30)).length} joined in the last 30 days`, href: "/admin/newsletter" }] : []),
    ...(can(user, "training") ? [{ tint: "green" as const, icon: BookOpenCheck, label: "Training learners", value: learners.length, note: `${certificates.length} certificates · ${pct(completedLearners, learners.length)}% completed`, href: "/admin/learners", progress: pct(completedLearners, learners.length) }] : []),
    ...(can(user, "jobs") ? [{ tint: "teal" as const, icon: Briefcase, label: "Open vacancies", value: openJobs.length, note: `${applications.length} applications received`, href: "/admin/content/jobs" }] : []),
    ...(can(user, "comments") ? [{ tint: "rose" as const, icon: Heart, label: "Reader likes", value: totalLikes, note: `${comments.length} comments${pendingComments ? ` · ${pendingComments} to moderate` : ""}`, href: "/admin/comments" }] : []),
    ...(can(user, "media") && !can(user, "comments") ? [{ tint: "orange" as const, icon: ImageIcon, label: "Media files", value: media.length, note: "in the library", href: "/admin/media" }] : []),
  ];

  return (
    <>
      {/* Greeting banner */}
      <section className="hr-card relative mb-6 overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-admin-primary/15 via-transparent to-emerald-400/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-admin-muted">{today}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{welcome ? `Welcome, ${firstName}` : `Welcome back, ${firstName}`}</h1>
            <p className="mt-1 text-sm text-admin-muted">
              Signed in as <span className="rounded-md bg-admin-primary-soft px-1.5 py-0.5 text-xs font-semibold text-admin-primary">{user.roleName}</span> · Here&apos;s what&apos;s happening on lhinigeria.org.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {can(user, "posts.own") && (
              <Link href="/admin/content/posts/new" className={buttonClass.primary}>
                <Plus className="h-4 w-4" /> New post
              </Link>
            )}
            {can(user, "interventions") && (
              <Link href="/admin/content/interventions/new" className={buttonClass.secondary}>
                <Plus className="h-4 w-4" /> New intervention
              </Link>
            )}
          </div>
        </div>
      </section>

      {denied && (
        <p role="alert" className="mb-6 rounded-lg bg-admin-warning-soft px-4 py-3 text-sm text-admin-warning">
          Your role doesn&apos;t have access to that page.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" data-dashboard-tiles>
        {tiles.map((t) => (
          <TintStat key={t.label} {...t} value={t.value.toLocaleString("en-US")} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {seesInbox && (
            <Card
              title="Inbox: forms received per month"
              action={
                <Link href="/admin/submissions" className="text-xs font-semibold text-admin-primary">
                  Open inbox
                </Link>
              }
              className="hr-card"
            >
              <ColumnChart labels={months.map((m) => m.short)} fullLabels={months.map((m) => m.full)} series={inboxSeries.length ? inboxSeries : [{ name: "Submissions", values: months.map(() => 0) }]} unit="submissions" />
            </Card>
          )}

          <Card title={seesAll ? "Posts published per month" : "Your posts published per month"} className="hr-card">
            <ColumnChart labels={months.map((m) => m.short)} fullLabels={months.map((m) => m.full)} series={[{ name: "Posts", values: months.map((m) => published.filter((p) => monthOf(p.date) === m.key).length) }]} unit="posts" />
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Posts by category" className="hr-card">
              <BarList rows={Object.entries(countBy(published, (p) => p.category || "Uncategorised")).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8)} unit="posts" empty="No published posts yet." />
            </Card>
            <Card title="Content status" className="hr-card">
              <SplitBar
                unit="posts"
                parts={[
                  { key: "published", label: "Published", value: published.length, color: "var(--a-success)" },
                  { key: "review", label: "Awaiting review", value: awaitingReview.length, color: "var(--a-warning)" },
                  { key: "draft", label: "Drafts", value: drafts.length, color: "var(--viz-other)" },
                ]}
              />
            </Card>
          </div>

          {seesInbox && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card title="Inbox by form" className="hr-card">
                <BarList rows={(Object.keys(byType) as SubmissionType[]).map((t) => ({ label: SUBMISSION_TYPE_LABELS[t], value: byType[t] })).sort((a, b) => b.value - a.value)} unit="submissions" empty="Nothing received yet." />
              </Card>
              <Card title="Inbox status" className="hr-card">
                <SplitBar
                  unit="submissions"
                  parts={[
                    { key: "new", label: "New", value: newSubs, color: "var(--a-warning)" },
                    { key: "read", label: "Read", value: submissions.filter((s) => s.status === "read").length, color: "var(--viz-1)" },
                    { key: "archived", label: "Archived", value: submissions.filter((s) => s.status === "archived").length, color: "var(--viz-other)" },
                  ]}
                />
              </Card>
            </div>
          )}

          {(can(user, "jobs") && seesInbox) || can(user, "training") ? (
            <div className="grid gap-6 md:grid-cols-2">
              {can(user, "jobs") && seesInbox && (
                <Card title="Recruitment pipeline" action={<span className="text-xs text-admin-muted">{applications.length} applications</span>} className="hr-card">
                  <BarList rows={pipeline} unit="applications" empty="No job applications yet." />
                </Card>
              )}
              {can(user, "training") && (
                <Card title="Humanitarian training" className="hr-card" bodyClassName="grid grid-cols-2 gap-3 p-5">
                  <Kpi label="Learners" value={String(learners.length)} hint={`${learners.filter((l) => within(l.lastLoginAt ?? l.createdAt, 30)).length} active in 30 days`} />
                  <Kpi label="Certificates" value={String(certificates.length)} hint="issued to date" />
                  <Kpi label="Completion" value={`${pct(completedLearners, learners.length)}%`} hint="of learners certified" />
                  <Kpi
                    label="Average score"
                    value={certificates.length ? `${Math.round(certificates.reduce((n, c) => n + c.score, 0) / certificates.length)}%` : "–"}
                    hint="on final assessments"
                  />
                </Card>
              )}
            </div>
          ) : null}

          {(can(user, "comments") || can(user, "email")) && (
            <div className="grid gap-6 md:grid-cols-2">
              {can(user, "comments") && (
                <Card title="Most liked posts" action={pendingComments ? <Link href="/admin/comments" className="text-xs font-semibold text-admin-primary">{pendingComments} comments to moderate</Link> : undefined} className="hr-card">
                  <BarList rows={topLiked} unit="likes" empty="No likes yet." />
                </Card>
              )}
              {can(user, "email") && (
                <Card title="Email delivery" action={<Link href="/admin/outbox" className="text-xs font-semibold text-admin-primary">Outbox</Link>} className="hr-card">
                  <SplitBar
                    unit="emails"
                    parts={[
                      { key: "sent", label: "Sent", value: mailCounts.sent ?? 0, color: "var(--a-success)" },
                      { key: "queued", label: "Waiting", value: mailCounts.queued ?? 0, color: "var(--a-warning)" },
                      { key: "failed", label: "Failed", value: mailCounts.failed ?? 0, color: "var(--a-danger)" },
                    ]}
                  />
                  {!provider && <p className="mt-3 text-xs text-admin-warning">No email provider is connected, so emails wait in the Outbox.</p>}
                </Card>
              )}
            </div>
          )}

          <Card
            title={seesAll ? "Recent posts" : "Your recent posts"}
            bodyClassName="divide-y divide-admin-border"
            className="hr-card"
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

          {seesInbox && (
            <Card title="Latest submissions" bodyClassName="divide-y divide-admin-border" className="hr-card">
              {[...submissions]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 5)
                .map((s) => (
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
              {submissions.length === 0 && <p className="px-5 py-8 text-center text-sm text-admin-muted">No submissions yet. Contact, volunteer and consortium forms land here.</p>}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card
            title={`Your role: ${user.roleName}`}
            action={<span className="text-xs text-admin-muted">{welcome ? "What you're responsible for" : "What you can do"}</span>}
            bodyClassName="space-y-4 p-5"
            className="hr-card"
          >
            <div className="space-y-4" data-your-role>
              {functionGroups.map((g) => (
                <div key={g.group}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">{g.group}</p>
                  {/* A long list (e.g. administrators) is compact; the description is on hover. */}
                  <ul className={myFunctions.length <= 12 ? "mt-2 space-y-1.5 text-sm" : "mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm"}>
                    {g.items.map((f) => (
                      <li key={f.id}>
                        <Link href={PERMISSION_HOME[f.id]} className="font-medium text-admin-primary hover:underline" title={f.help}>
                          {f.label}
                        </Link>
                        {myFunctions.length <= 12 && <span className="block text-xs text-admin-muted">{f.help}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {functionGroups.length === 0 && <p className="text-sm text-admin-muted">Your role has no permissions yet. Ask an administrator to give it some.</p>}
            </div>
          </Card>

          {checklist.length > 0 && (
            <Card title="Site setup" action={<span className="text-xs text-admin-muted">{checklist.filter((c) => c.ok).length} of {checklist.length} done</span>} className="hr-card" bodyClassName="space-y-3 p-5">
              <ul className="space-y-3" data-site-setup>
                {checklist.map((c) => (
                  <li key={c.label} className="flex gap-2.5 text-sm">
                    {c.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-admin-success" aria-label="Done" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-admin-warning" aria-label="To do" />}
                    <span>
                      <span className="block font-medium">{c.label}</span>
                      <span className="block text-xs text-admin-muted">{c.help}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {can(user, "posts.own") && (
            <Card title={<span className="inline-flex items-center gap-2"><PenLine className="h-4 w-4 text-admin-primary" /> Quick draft</span>} className="hr-card">
              <QuickDraft />
            </Card>
          )}

          {drafts.length > 0 && (
            <Card title={seesAll ? "Drafts" : "Your drafts"} bodyClassName="divide-y divide-admin-border" className="hr-card">
              {drafts.slice(0, 5).map((p) => (
                <Link key={p.id} href={`/admin/content/posts/${p.id}`} className="block px-5 py-2.5 text-sm hover:bg-admin-bg/60">
                  <span className="line-clamp-1 font-medium">{p.title}</span>
                  <span className="text-xs text-admin-muted">{formatDate(p.updatedAt ?? p.date)}</span>
                </Link>
              ))}
            </Card>
          )}

          {can(user, "users") && (
            <Card title={<span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-admin-primary" /> Team</span>} action={<Link href="/admin/users" className="text-xs font-semibold text-admin-primary">Manage users</Link>} className="hr-card">
              <p className="text-sm text-admin-muted">Give each person a login with the role for their job, so they only see what they need.</p>
            </Card>
          )}

          {/* Only administrators see the activity log. */}
          {activity.length > 0 && (
            <Card
              title="Activity"
              className="hr-card"
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
