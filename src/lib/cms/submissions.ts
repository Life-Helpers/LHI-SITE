import "server-only";

import { randomUUID } from "node:crypto";

import type { Submission, SubmissionType } from "@/lib/cms/schema";
import { updateStore } from "@/lib/cms/store";
import { notifySubmission } from "@/lib/email/notifications";
import { clientIp } from "@/lib/client-ip";

const MAX_SUBMISSIONS = 5000;

/** Record a public form submission in the admin inbox. Returns the stored submission. */
export async function addSubmission(input: {
  type: SubmissionType;
  name: string;
  email: string;
  subject: string;
  organization?: string;
  fields: Record<string, unknown>;
  attachments?: Submission["attachments"];
}): Promise<Submission> {
  const fields = Object.fromEntries(
    Object.entries(input.fields)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : String(v).slice(0, 5000)]),
  );
  const submission: Submission = {
    id: randomUUID(),
    type: input.type,
    status: "new",
    name: input.name.slice(0, 200),
    email: input.email.slice(0, 200),
    subject: input.subject.slice(0, 300),
    organization: input.organization?.slice(0, 200),
    fields,
    ...(input.attachments?.length ? { attachments: input.attachments } : {}),
    createdAt: new Date().toISOString(),
  };
  await updateStore("submissions", (items) => ({ items: [submission, ...items].slice(0, MAX_SUBMISSIONS) }));
  await notifySubmission(submission);
  return submission;
}

/** Simple per-process rate limit for public forms: `max` requests per IP per hour. */
const buckets = new Map<string, { count: number; until: number }>();

export function rateLimited(req: Request, key: string, max: number) {
  const ip = clientIp(req);
  const id = `${key}:${ip}`;
  const entry = buckets.get(id);
  const fresh = !entry || entry.until < Date.now();
  const count = fresh ? 1 : entry.count + 1;
  buckets.set(id, { count, until: fresh ? Date.now() + 3600_000 : entry.until });
  return count > max;
}
