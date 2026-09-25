import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { FEEDBACK_TYPES, RESPONSE_CHANNELS } from "@/data/feedback";
import { addSubmission } from "@/lib/cms/submissions";
import { checkSpam } from "@/lib/spam";
import { formError } from "@/lib/validation";

const schema = z
  .object({
    feedbackType: z.enum(FEEDBACK_TYPES, { message: "Choose the kind of feedback." }),
    programme: z.string().trim().max(80).optional(),
    state: z.string().trim().max(60).optional(),
    message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters).").max(3000),
    anonymous: z.boolean().optional(),
    name: z.string().trim().max(120).optional(),
    email: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(40).optional(),
    responseChannel: z.enum(RESPONSE_CHANNELS).optional(),
    consent: z.literal(true, { message: "Please confirm you agree to how we handle your feedback." }),
    website: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.anonymous) return;
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) ctx.addIssue({ code: "custom", message: "Enter a valid email address, or leave it empty." });
    if (d.responseChannel === "Email" && !d.email) ctx.addIssue({ code: "custom", message: "Add your email address so we can reply by email." });
    if ((d.responseChannel === "Phone call" || d.responseChannel === "WhatsApp / SMS") && !d.phone)
      ctx.addIssue({ code: "custom", message: "Add your phone number so we can call or message you." });
  });

/** Community feedback and response mechanism: compliments, suggestions, complaints and questions. */
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: formError(parsed.error, "Invalid feedback.") }, { status: 400 });
  const d = parsed.data;
  const spam = await checkSpam(req, { key: "feedback", max: 10, honeypot: d.website });
  if ("blocked" in spam) return spam.blocked;
  if ("drop" in spam) return NextResponse.json({ ok: true, reference: "RECEIVED" });

  const anonymous = Boolean(d.anonymous);
  const submission = await addSubmission({
    type: "feedback",
    name: anonymous ? "Anonymous" : d.name || "Not given",
    email: anonymous ? "" : d.email || "",
    subject: `${d.feedbackType}${d.programme ? `: ${d.programme}` : ""}${d.state ? ` (${d.state})` : ""}`,
    fields: {
      feedbackType: d.feedbackType,
      programme: d.programme,
      state: d.state,
      message: d.message,
      anonymous: anonymous ? "Yes" : "No",
      phone: anonymous ? undefined : d.phone,
      responseChannel: anonymous ? "No response possible (anonymous)" : d.responseChannel,
    },
  });
  return NextResponse.json({ ok: true, reference: submission.id.slice(0, 8).toUpperCase() });
}
