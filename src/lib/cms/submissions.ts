import "server-only";

import { randomUUID } from "node:crypto";

import type { Submission, SubmissionType } from "@/lib/cms/schema";
import { updateStore } from "@/lib/cms/store";

const MAX_SUBMISSIONS = 5000;

/** Record a public form submission in the admin inbox. Returns the stored submission. */
export async function addSubmission(input: {
  type: SubmissionType;
  name: string;
  email: string;
  subject: string;
  organization?: string;
  fields: Record<string, unknown>;
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
    createdAt: new Date().toISOString(),
  };
  await updateStore("submissions", (items) => ({ items: [submission, ...items].slice(0, MAX_SUBMISSIONS) }));
  return submission;
}
