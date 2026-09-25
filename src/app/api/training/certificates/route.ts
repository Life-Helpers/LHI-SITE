import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendCertificateEmail } from "@/lib/email/notifications";
import { gradeExam, issueCertificate } from "@/lib/training/grading";
import { getCurrentLearner, updateLearnerProgress } from "@/lib/training/learners";
import { rateLimited } from "@/lib/rate-limit";
import { formError } from "@/lib/validation";

const schema = z.object({
  courseId: z.string().min(1).max(80),
  name: z.string().trim().min(2, "Enter your full name as it should appear on the certificate.").max(80),
  organization: z.string().trim().max(120).optional(),
  answers: z.record(z.string(), z.number().int().min(0).max(10)),
});

export async function POST(req: NextRequest) {
  // Light abuse protection: 20 attempts per IP per hour.
  if (await rateLimited(req, "certificates", 20)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in an hour." }, { status: 429 });
  }

  const learner = await getCurrentLearner();
  if (!learner) return NextResponse.json({ error: "Sign in to take the assessment." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: formError(parsed.error, "Invalid submission.") }, { status: 400 });
  }
  const { courseId, name, organization, answers } = parsed.data;
  const graded = gradeExam(courseId, answers);
  if (!graded) return NextResponse.json({ error: "Unknown course." }, { status: 404 });
  const done = learner.progress[courseId]?.completed ?? [];
  if (!graded.course.lessons.every((l) => done.includes(l.id))) {
    return NextResponse.json({ error: "Complete every lesson before taking the final assessment." }, { status: 403 });
  }

  const incorrect = graded.results.filter((r) => !r.correct).map((r) => r.id);
  await updateLearnerProgress(learner.id, courseId, (p) => ({ ...p, attempts: (p.attempts ?? 0) + 1, lastScore: graded.score }));
  if (!graded.passed) {
    return NextResponse.json({ passed: false, score: graded.score, passMark: graded.course.passMark, incorrect });
  }

  const certificate = await issueCertificate({
    courseId,
    courseTitle: graded.course.title,
    name,
    email: learner.email,
    organization: organization || learner.organization || undefined,
    score: graded.score,
  });
  const alreadyHad = learner.progress[courseId]?.certificateId === certificate.id;
  await updateLearnerProgress(learner.id, courseId, (p) => ({ ...p, certificateId: certificate.id, score: graded.score }));
  if (!alreadyHad) {
    await sendCertificateEmail({ name: certificate.name, email: learner.email, courseTitle: certificate.courseTitle, code: certificate.id, score: graded.score });
  }
  return NextResponse.json({ passed: true, score: graded.score, incorrect, certificateId: certificate.id });
}
