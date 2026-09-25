import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hashPassword } from "@/lib/cms/auth";
import { readStore, updateStore } from "@/lib/cms/store";
import { rateLimited } from "@/lib/cms/submissions";
import { sendPasswordResetEmail } from "@/lib/email/notifications";
import { consumeResetToken, createResetToken } from "@/lib/email/reset";
import { absoluteUrl } from "@/lib/email/template";
import { createLearnerSession, normaliseEmail } from "@/lib/training/learners";
import { formError } from "@/lib/validation";

const request = z.object({ mode: z.literal("request"), email: z.string().trim().email("Enter a valid email address.").max(200) });
const reset = z.object({
  mode: z.literal("reset"),
  token: z.string().min(20).max(200),
  password: z.string().min(8, "Use at least 8 characters for your password.").max(200),
});

/** Learner password reset: request a link by email, then set a new password with the link's token. */
export async function POST(req: NextRequest) {
  if (rateLimited(req, "learner-reset", 10)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const parsed = z.discriminatedUnion("mode", [request, reset]).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: formError(parsed.error, "Invalid request.") }, { status: 400 });

  const data = parsed.data;
  if (data.mode === "request") {
    const learner = (await readStore("learners")).find((l) => l.email === normaliseEmail(data.email));
    if (learner) {
      const token = await createResetToken("learner", learner.id);
      await sendPasswordResetEmail({
        name: learner.name,
        email: learner.email,
        url: absoluteUrl(`/get-involved/training/reset?token=${token}`),
        team: false,
      });
    }
    // Same answer either way, so the form can't be used to discover accounts.
    return NextResponse.json({ ok: true });
  }

  const learnerId = await consumeResetToken("learner", data.token);
  if (!learnerId) {
    return NextResponse.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
  }
  const passwordHash = await hashPassword(data.password);
  await updateStore("learners", (items) => ({ items: items.map((l) => (l.id === learnerId ? { ...l, passwordHash } : l)) }));
  await createLearnerSession(learnerId);
  return NextResponse.json({ ok: true });
}
