import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { hashPassword, sessionKey, sign, verifyPassword } from "@/lib/cms/auth";
import type { Learner, LearnerCourseProgress } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";

export const LEARNER_COOKIE = "lhi_learner_session";
const TTL_SECONDS = 60 * 60 * 24 * 30;

export type PublicLearner = Omit<Learner, "passwordHash">;

const toPublic = ({ passwordHash: _omit, ...rest }: Learner): PublicLearner => rest;

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export async function createLearnerSession(learnerId: string) {
  const payload = Buffer.from(
    JSON.stringify({ lid: learnerId, kind: "learner", exp: Math.floor(Date.now() / 1000) + TTL_SECONDS, n: randomUUID() }),
  ).toString("base64url");
  (await cookies()).set(LEARNER_COOKIE, `${payload}.${sign(payload, await sessionKey())}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function destroyLearnerSession() {
  (await cookies()).delete(LEARNER_COOKIE);
}

async function sessionLearnerId() {
  const token = (await cookies()).get(LEARNER_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload, await sessionKey()));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { lid, kind, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { lid: string; kind: string; exp: number };
    return kind === "learner" && lid && exp > Date.now() / 1000 ? lid : null;
  } catch {
    return null;
  }
}

export async function getCurrentLearner(): Promise<PublicLearner | null> {
  const id = await sessionLearnerId();
  if (!id) return null;
  const learner = (await readStore("learners")).find((l) => l.id === id);
  return learner ? toPublic(learner) : null;
}

/** Pages: send visitors who are not signed in to the training sign-in page, then back. */
export async function requireLearnerPage(next: string) {
  const learner = await getCurrentLearner();
  if (!learner) redirect(`/get-involved/training/login?next=${encodeURIComponent(next)}`);
  return learner;
}

export async function registerLearner(input: { name: string; email: string; organization?: string; password: string }) {
  const email = normaliseEmail(input.email);
  const passwordHash = await hashPassword(input.password);
  return updateStore("learners", (items) => {
    if (items.some((l) => l.email === email)) return { items, result: null };
    const learner: Learner = {
      id: randomUUID(),
      name: input.name.trim(),
      email,
      organization: input.organization?.trim() || undefined,
      passwordHash,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      progress: {},
    };
    return { items: [...items, learner], result: toPublic(learner) };
  });
}

export async function authenticateLearner(email: string, password: string) {
  const learner = (await readStore("learners")).find((l) => l.email === normaliseEmail(email));
  // Verify against a dummy hash when the email is unknown so timing doesn't reveal accounts.
  const ok = await verifyPassword(password, learner?.passwordHash ?? "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==");
  if (!learner || !ok) return null;
  await updateStore("learners", (items) => ({
    items: items.map((l) => (l.id === learner.id ? { ...l, lastLoginAt: new Date().toISOString() } : l)),
  }));
  return toPublic(learner);
}

export async function updateLearnerProgress(learnerId: string, courseId: string, fn: (p: LearnerCourseProgress) => LearnerCourseProgress) {
  return updateStore("learners", (items) => {
    let result: LearnerCourseProgress | undefined;
    const next = items.map((l) => {
      if (l.id !== learnerId) return l;
      result = { ...fn(l.progress[courseId] ?? { completed: [] }), updatedAt: new Date().toISOString() };
      return { ...l, progress: { ...l.progress, [courseId]: result } };
    });
    return { items: next, result };
  });
}
