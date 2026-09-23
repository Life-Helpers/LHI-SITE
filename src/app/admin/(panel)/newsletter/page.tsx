import Link from "next/link";
import { Download, Mail } from "lucide-react";

import { NewsletterComposer } from "@/components/cms/newsletter-composer";
import {
  Badge,
  buttonClass,
  Card,
  formatDate,
  PageHeader,
} from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";
import { emailProvider } from "@/lib/email/send";
import { getSubscribers } from "@/lib/email/subscribers";

export const metadata = { title: "Newsletter" };

export default async function NewsletterPage() {
  await requirePageUser("newsletter");
  const [subscribers, campaigns, unsubscribes, outbox] = await Promise.all([
    getSubscribers(),
    readStore("campaigns"),
    readStore("unsubscribes"),
    readStore("outbox"),
  ]);
  const connected = Boolean(emailProvider());
  const sources = Object.entries(
    subscribers.reduce<Record<string, number>>(
      (acc, s) => ({ ...acc, [s.source]: (acc[s.source] ?? 0) + 1 }),
      {},
    ),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="Write to everyone who subscribed on the website, in downloads, the anniversary popup or when joining a course."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Newsletter" },
        ]}
        actions={
          <>
            { }
            <a
              href="/api/admin/export/subscribers"
              download
              className={buttonClass.secondary}
            >
              <Download className="h-4 w-4" /> Export subscribers (CSV)
            </a>
          </>
        }
      />
      {!connected && (
        <p className="mb-6 rounded-xl border border-admin-warning/30 bg-admin-warning-soft px-4 py-3 text-sm text-admin-warning">
          Email isn&apos;t connected yet. Newsletters you send now are kept in
          the{" "}
          <Link href="/admin/outbox" className="font-semibold underline">
            Email Outbox
          </Link>{" "}
          and go out as soon as the email provider is set up.
        </p>
      )}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">
            Active subscribers
          </p>
          <p className="mt-1 text-2xl font-bold">{subscribers.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">
            Unsubscribed
          </p>
          <p className="mt-1 text-2xl font-bold">{unsubscribes.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-admin-muted">
            Newsletters sent
          </p>
          <p className="mt-1 text-2xl font-bold">{campaigns.length}</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Write a newsletter">
          <NewsletterComposer
            subscriberCount={subscribers.length}
            connected={connected}
          />
        </Card>
        <div className="space-y-6">
          <Card title="Past newsletters" bodyClassName="p-0">
            {campaigns.length === 0 ? (
              <p className="p-5 text-sm text-admin-muted">Nothing sent yet.</p>
            ) : (
              <ul className="divide-y divide-admin-border">
                {campaigns.map((c) => {
                  const mine = outbox.filter((e) => e.campaignId === c.id);
                  const sent = mine.filter((e) => e.status === "sent").length;
                  const failed = mine.filter(
                    (e) => e.status === "failed",
                  ).length;
                  return (
                    <li key={c.id} className="p-4">
                      <p className="font-semibold">{c.subject}</p>
                      <p className="mt-0.5 text-xs text-admin-muted">
                        {formatDate(c.sentAt, true)} · by {c.sentBy} ·{" "}
                        {c.recipients} recipient{c.recipients === 1 ? "" : "s"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge tone="success">{sent} delivered</Badge>
                        {mine.length - sent - failed > 0 && (
                          <Badge tone="warning">
                            {mine.length - sent - failed} queued
                          </Badge>
                        )}
                        {failed > 0 && (
                          <Badge tone="danger">{failed} failed</Badge>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
          <Card title="Where subscribers came from">
            {sources.length === 0 ? (
              <p className="text-sm text-admin-muted">No subscribers yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {sources.map(([source, n]) => (
                  <li
                    key={source}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-admin-muted" /> {source}
                    </span>
                    <span className="font-semibold">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
