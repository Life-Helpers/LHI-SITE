"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import { updateStore } from "@/lib/cms/store";
import { unsubscribeUrl } from "@/lib/email/notifications";
import { deliver, emailProvider, queueEmails } from "@/lib/email/send";
import { getSubscribers } from "@/lib/email/subscribers";
import type { EmailContent } from "@/lib/email/template";

export interface EmailActionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

const people = (n: number) => `${n} subscriber${n === 1 ? "" : "s"}`;

async function run(fn: () => Promise<EmailActionResult>): Promise<EmailActionResult> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    console.error("[email action]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

function newsletterContent(form: FormData): { subject: string; content: Omit<EmailContent, "footer"> } | string {
  const subject = String(form.get("subject") ?? "").trim();
  const heading = String(form.get("heading") ?? "").trim() || subject;
  const body = String(form.get("body") ?? "").trim();
  const ctaLabel = String(form.get("ctaLabel") ?? "").trim();
  const ctaUrl = String(form.get("ctaUrl") ?? "").trim();
  if (subject.length < 3) return "Enter a subject.";
  if (body.length < 10) return "Write the newsletter message.";
  if (body.length > 20_000) return "The message is too long (20,000 characters maximum).";
  if (ctaUrl && !/^https?:\/\//.test(ctaUrl)) return "The button link must start with https://";
  return {
    subject: subject.slice(0, 200),
    content: {
      heading: heading.slice(0, 200),
      paragraphs: body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      ...(ctaLabel && ctaUrl ? { cta: { label: ctaLabel.slice(0, 60), url: ctaUrl } } : {}),
    },
  };
}

/** Send a newsletter to every active subscriber, or a test copy to the signed-in user. */
export async function sendNewsletterAction(_prev: EmailActionResult | null, form: FormData): Promise<EmailActionResult> {
  return run(async () => {
    const user = await requireUser("newsletter");
    const parsed = newsletterContent(form);
    if (typeof parsed === "string") return { ok: false, error: parsed };
    const test = form.get("mode") === "test";
    const footer = (url: string) => ({ text: "You're receiving this because you subscribed to LHI updates.", url, linkLabel: "Unsubscribe" });

    if (test) {
      await queueEmails([
        { to: user.email, subject: `[Test] ${parsed.subject}`, kind: "newsletter-test", content: { ...parsed.content, footer: footer(await unsubscribeUrl(user.email)) } },
      ]);
      revalidatePath("/admin/outbox");
      return { ok: true, message: `Test sent to ${user.email}.${emailProvider() ? "" : " It is queued in the Email Outbox until email is connected."}` };
    }

    const subscribers = await getSubscribers();
    if (!subscribers.length) return { ok: false, error: "There are no subscribers yet." };
    const campaignId = randomUUID();
    const emails = await Promise.all(
      subscribers.map(async (s) => ({
        to: s.email,
        subject: parsed.subject,
        kind: "newsletter",
        campaignId,
        content: { ...parsed.content, ...(s.name ? { greeting: `Hello ${s.name.split(/\s+/)[0]},` } : {}), footer: footer(await unsubscribeUrl(s.email)) },
      })),
    );
    const count = await queueEmails(emails);
    await updateStore("campaigns", (items) => ({
      items: [
        { id: campaignId, subject: parsed.subject, body: String(form.get("body") ?? ""), recipients: count, sentBy: user.name, sentAt: new Date().toISOString() },
        ...items,
      ],
    }));
    await logActivity(user, `sent a newsletter to ${people(count)}:`, parsed.subject);
    revalidatePath("/admin/newsletter");
    revalidatePath("/admin/outbox");
    return {
      ok: true,
      message: emailProvider()
        ? `Sending to ${people(count)}. Progress shows in the Email Outbox.`
        : `Queued for ${people(count)}. It will be delivered as soon as email is connected.`,
    };
  });
}

/** Deliver every queued or failed email through the configured provider. */
export async function deliverOutboxAction(): Promise<EmailActionResult> {
  return run(async () => {
    const user = await requireUser("email");
    if (!emailProvider()) return { ok: false, error: "Email isn't connected yet. Set EMAIL_PROVIDER, EMAIL_API_KEY and EMAIL_FROM on the server." };
    const { sent, failed } = await deliver();
    await logActivity(user, `delivered queued emails (${sent} sent, ${failed} failed)`, "Email Outbox");
    revalidatePath("/admin/outbox");
    return { ok: failed === 0, message: `${sent} sent${failed ? `, ${failed} failed` : ""}.`, ...(failed ? { error: `${failed} failed — see the error on each email.` } : {}) };
  });
}

/** Remove queued emails that should never go out (e.g. test messages). */
export async function discardOutboxEmailAction(id: string): Promise<EmailActionResult> {
  return run(async () => {
    await requireUser("email");
    await updateStore("outbox", (items) => ({ items: items.filter((e) => !(e.id === id && e.status !== "sent")) }));
    revalidatePath("/admin/outbox");
    return { ok: true };
  });
}
