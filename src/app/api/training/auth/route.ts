import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { readStore } from "@/lib/cms/store";
import { addSubmission, rateLimited } from "@/lib/cms/submissions";
import { authenticateLearner, createLearnerSession, registerLearner } from "@/lib/training/learners";

const signup = z.object({
  mode: z.literal("signup"),
  name: z.string().trim().min(2, "Enter your full name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  organization: z.string().trim().max(120).optional(),
  password: z.string().min(8, "Use at least 8 characters for your password.").max(200),
  newsletter: z.boolean().optional(),
});
const login = z.object({
  mode: z.literal("login"),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  password: z.string().min(1, "Enter your password.").max(200),
});

export async function POST(req: NextRequest) {
  if (rateLimited(req, "learner-auth", 30)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = z.discriminatedUnion("mode", [signup, login]).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });

  if (parsed.data.mode === "login") {
    const learner = await authenticateLearner(parsed.data.email, parsed.data.password);
    if (!learner) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    await createLearnerSession(learner.id);
    return NextResponse.json({ ok: true, name: learner.name });
  }

  const { name, email, organization, password, newsletter } = parsed.data;
  const learner = await registerLearner({ name, email, organization, password });
  if (!learner) {
    return NextResponse.json({ error: "An account with this email already exists. Sign in instead." }, { status: 409 });
  }
  await createLearnerSession(learner.id);
  if (newsletter) {
    const already = (await readStore("submissions")).some((s) => s.type === "newsletter" && s.email === learner.email);
    if (!already) {
      await addSubmission({
        type: "newsletter",
        name,
        email: learner.email,
        subject: "Newsletter subscription",
        fields: { email: learner.email, name, source: "training-signup" },
      });
    }
  }
  return NextResponse.json({ ok: true, name: learner.name });
}
