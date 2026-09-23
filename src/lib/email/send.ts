import "server-only";

import { randomUUID } from "node:crypto";
import { after } from "next/server";

import type { OutboxEmail } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";
import { renderEmail, type EmailContent } from "@/lib/email/template";

/**
 * Outgoing email. Every message is written to the outbox store first. When an email
 * provider is configured (EMAIL_PROVIDER + EMAIL_API_KEY + EMAIL_FROM) it is delivered
 * straight away; otherwise it stays "queued" and can be sent later from Admin → Email Outbox
 * once the provider is connected.
 */

const MAX_OUTBOX = 10_000;
const PROVIDERS = ["resend", "sendgrid", "postmark", "brevo"] as const;
type Provider = (typeof PROVIDERS)[number];

export function emailProvider(): Provider | null {
  const p = process.env.EMAIL_PROVIDER?.trim().toLowerCase() as Provider | undefined;
  if (!p || !PROVIDERS.includes(p) || !process.env.EMAIL_API_KEY || !process.env.EMAIL_FROM) return null;
  return p;
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function sendEmail(input: {
  to: string;
  subject: string;
  content: EmailContent;
  kind: string;
  campaignId?: string;
  /** Deliver in the background after the response (default) or wait for delivery. */
  wait?: boolean;
}): Promise<OutboxEmail | null> {
  const to = input.to.trim().toLowerCase();
  if (!isEmail(to)) return null;
  const { text, html } = renderEmail(input.content);
  const record: OutboxEmail = {
    id: randomUUID(),
    to,
    subject: input.subject.slice(0, 300),
    text,
    html,
    kind: input.kind,
    status: "queued",
    attempts: 0,
    createdAt: new Date().toISOString(),
    ...(input.campaignId ? { campaignId: input.campaignId } : {}),
  };
  await updateStore("outbox", (items) => ({ items: [record, ...items].slice(0, MAX_OUTBOX) }));
  if (emailProvider()) {
    if (input.wait) await deliver([record.id]);
    else schedule(() => deliver([record.id]));
  }
  return record;
}

/** Queue many emails in one write (e.g. a newsletter) and deliver them in the background. */
export async function queueEmails(
  emails: { to: string; subject: string; content: EmailContent; kind: string; campaignId?: string }[],
): Promise<number> {
  const now = new Date().toISOString();
  const records: OutboxEmail[] = emails
    .filter((e) => isEmail(e.to.trim()))
    .map((e) => {
      const { text, html } = renderEmail(e.content);
      return {
        id: randomUUID(),
        to: e.to.trim().toLowerCase(),
        subject: e.subject.slice(0, 300),
        text,
        html,
        kind: e.kind,
        status: "queued",
        attempts: 0,
        createdAt: now,
        ...(e.campaignId ? { campaignId: e.campaignId } : {}),
      };
    });
  if (!records.length) return 0;
  await updateStore("outbox", (items) => ({ items: [...records, ...items].slice(0, MAX_OUTBOX) }));
  if (emailProvider()) schedule(() => deliver(records.map((r) => r.id)));
  return records.length;
}

/** Run work after the response has been sent when inside a request; otherwise fire and forget. */
export function schedule(task: () => Promise<unknown>) {
  const run = () => task().catch((err) => console.error("[email]", err));
  try {
    after(run);
  } catch {
    void run();
  }
}

const inFlight = new Set<string>();

/** Deliver the given outbox emails (or every queued/failed one) through the configured provider. */
export async function deliver(ids?: string[]): Promise<{ sent: number; failed: number }> {
  const provider = emailProvider();
  if (!provider) return { sent: 0, failed: 0 };
  const wanted = ids ? new Set(ids) : null;
  const pending = (await readStore("outbox"))
    .filter((e) => e.status !== "sent" && !inFlight.has(e.id) && (!wanted || wanted.has(e.id)))
    .reverse(); // oldest first
  pending.forEach((e) => inFlight.add(e.id));
  let sent = 0;
  let failed = 0;
  let results = new Map<string, string | undefined>();

  const flush = async () => {
    if (!results.size) return;
    const batch = results;
    results = new Map();
    const at = new Date().toISOString();
    await updateStore("outbox", (items) => ({
      items: items.map((e) => {
        if (!batch.has(e.id)) return e;
        const error = batch.get(e.id);
        return { ...e, attempts: e.attempts + 1, status: error ? "failed" : "sent", error, sentAt: error ? e.sentAt : at };
      }),
    }));
  };

  try {
    for (const email of pending) {
      try {
        await sendViaProvider(provider, email);
        results.set(email.id, undefined);
        sent++;
      } catch (err) {
        results.set(email.id, err instanceof Error ? err.message.slice(0, 500) : "Unknown error");
        failed++;
      }
      if (results.size >= 25) await flush();
    }
    await flush();
  } finally {
    pending.forEach((e) => inFlight.delete(e.id));
  }
  return { sent, failed };
}

function parseFrom(from: string) {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].replace(/^"|"$/g, ""), email: m[2] } : { name: "", email: from.trim() };
}

async function sendViaProvider(provider: Provider, email: OutboxEmail) {
  const key = process.env.EMAIL_API_KEY!;
  const from = process.env.EMAIL_FROM!;
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;
  const sender = parseFrom(from);
  let res: Response;
  const opts = (url: string, headers: Record<string, string>, body: unknown): [string, RequestInit] => [
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    },
  ];

  switch (provider) {
    case "resend":
      res = await fetch(
        ...opts(
          "https://api.resend.com/emails",
          { Authorization: `Bearer ${key}` },
          { from, to: [email.to], subject: email.subject, html: email.html, text: email.text, reply_to: replyTo },
        ),
      );
      break;
    case "sendgrid":
      res = await fetch(
        ...opts(
          "https://api.sendgrid.com/v3/mail/send",
          { Authorization: `Bearer ${key}` },
          {
            personalizations: [{ to: [{ email: email.to }] }],
            from: sender.name ? sender : { email: sender.email },
            ...(replyTo ? { reply_to: { email: replyTo } } : {}),
            subject: email.subject,
            content: [
              { type: "text/plain", value: email.text },
              { type: "text/html", value: email.html },
            ],
          },
        ),
      );
      break;
    case "postmark":
      res = await fetch(
        ...opts(
          "https://api.postmarkapp.com/email",
          { "X-Postmark-Server-Token": key },
          { From: from, To: email.to, Subject: email.subject, HtmlBody: email.html, TextBody: email.text, ReplyTo: replyTo },
        ),
      );
      break;
    case "brevo":
      res = await fetch(
        ...opts(
          "https://api.brevo.com/v3/smtp/email",
          { "api-key": key },
          {
            sender: sender.name ? sender : { email: sender.email },
            to: [{ email: email.to }],
            ...(replyTo ? { replyTo: { email: replyTo } } : {}),
            subject: email.subject,
            htmlContent: email.html,
            textContent: email.text,
          },
        ),
      );
      break;
  }
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    throw new Error(`${provider} responded ${res.status}${detail ? `: ${detail}` : ""}`);
  }
}
