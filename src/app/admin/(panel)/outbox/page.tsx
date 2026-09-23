import Link from "next/link";

import { DeliverOutboxButton, DiscardEmailButton } from "@/components/cms/outbox-actions";
import { Badge, Card, formatDate, PageHeader, type Tone } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import type { OutboxStatus } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { emailProvider } from "@/lib/email/send";

export const metadata = { title: "Email Outbox" };

const TONE: Record<OutboxStatus, Tone> = { queued: "warning", sent: "success", failed: "danger" };
const KIND_LABELS: Record<string, string> = {
  confirmation: "Confirmation",
  "team-alert": "Team alert",
  "password-reset": "Password reset",
  certificate: "Certificate",
  newsletter: "Newsletter",
  "newsletter-test": "Newsletter test",
};
const PAGE = 50;

export default async function OutboxPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requirePageUser("email");
  const { status = "", page = "1" } = await searchParams;
  const provider = emailProvider();
  const all = await readStore("outbox");
  const counts = { queued: 0, sent: 0, failed: 0 } as Record<OutboxStatus, number>;
  for (const e of all) counts[e.status]++;
  const filtered = all.filter((e) => !status || e.status === status);
  const current = Math.max(1, Number(page) || 1);
  const list = filtered.slice((current - 1) * PAGE, current * PAGE);
  const tab = (value: string, label: string) => (
    <Link
      href={value ? `/admin/outbox?status=${value}` : "/admin/outbox"}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${status === value ? "bg-admin-primary text-white" : "text-admin-muted hover:bg-admin-bg"}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <PageHeader
        title="Email Outbox"
        description="Every email the website sends: confirmations, team alerts, password resets, certificates and newsletters."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Email Outbox" }]}
        actions={<DeliverOutboxButton pending={counts.queued + counts.failed} connected={Boolean(provider)} />}
      />
      {provider ? (
        <p className="mb-6 rounded-xl border border-admin-success/30 bg-admin-success-soft px-4 py-3 text-sm text-admin-success">
          Connected to <strong className="capitalize">{provider}</strong>. New emails are sent automatically.
        </p>
      ) : (
        <div className="mb-6 rounded-xl border border-admin-warning/30 bg-admin-warning-soft px-4 py-3 text-sm text-admin-warning">
          <p className="font-semibold">Email is not connected yet — emails are being kept here safely.</p>
          <p className="mt-1">
            To connect, set <code>EMAIL_PROVIDER</code> (resend, sendgrid, postmark or brevo), <code>EMAIL_API_KEY</code> and{" "}
            <code>EMAIL_FROM</code> on the server and restart, then press &ldquo;Send queued now&rdquo;. Until then, you can open a
            password-reset email below and pass the link on personally.
          </p>
        </div>
      )}
      <Card bodyClassName="p-0">
        <div className="flex flex-wrap gap-1 border-b border-admin-border p-3">
          {tab("", `All (${all.length})`)}
          {tab("queued", `Queued (${counts.queued})`)}
          {tab("failed", `Failed (${counts.failed})`)}
          {tab("sent", `Sent (${counts.sent})`)}
        </div>
        {list.length === 0 ? (
          <p className="p-6 text-sm text-admin-muted">No emails here.</p>
        ) : (
          <ul className="divide-y divide-admin-border">
            {list.map((e) => (
              <li key={e.id} className="p-4">
                <details>
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1">
                    <Badge tone={TONE[e.status]}>{e.status}</Badge>
                    <span className="font-semibold">{e.subject}</span>
                    <span className="text-sm text-admin-muted">to {e.to}</span>
                    <span className="ml-auto text-xs text-admin-muted">
                      {KIND_LABELS[e.kind] ?? e.kind} · {formatDate(e.createdAt, true)}
                    </span>
                  </summary>
                  <div className="mt-3 space-y-3">
                    {e.error && <p className="rounded-lg bg-admin-danger-soft px-3 py-2 text-xs text-admin-danger">{e.error}</p>}
                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-admin-bg p-3 font-sans text-sm">{e.text}</pre>
                    <div className="flex items-center justify-between text-xs text-admin-muted">
                      <span>
                        {e.attempts} attempt{e.attempts === 1 ? "" : "s"}
                        {e.sentAt ? ` · sent ${formatDate(e.sentAt, true)}` : ""}
                      </span>
                      {e.status !== "sent" && <DiscardEmailButton id={e.id} />}
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
        {filtered.length > PAGE && (
          <div className="flex justify-between border-t border-admin-border p-3 text-sm">
            {current > 1 ? <Link href={`/admin/outbox?status=${status}&page=${current - 1}`}>← Newer</Link> : <span />}
            {current * PAGE < filtered.length && <Link href={`/admin/outbox?status=${status}&page=${current + 1}`}>Older →</Link>}
          </div>
        )}
      </Card>
    </>
  );
}
