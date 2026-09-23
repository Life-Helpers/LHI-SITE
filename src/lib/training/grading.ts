import "server-only";

import { randomInt } from "node:crypto";

import { ANSWER_KEYS } from "@/data/training/answer-keys";
import { getCourse } from "@/data/training/courses";
import type { Certificate } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function certificateCode(courseId: string) {
  const prefix = ({ "comprehensive-safeguarding": "SG", "child-safeguarding-policy": "CS", "gbv-in-humanitarian-settings": "GBV" } as Record<string, string>)[courseId] ?? "TR";
  let code = "";
  for (let i = 0; i < 8; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `LHI-${prefix}-${code}`;
}

export function gradeExam(courseId: string, answers: Record<string, number>) {
  const course = getCourse(courseId);
  const key = ANSWER_KEYS[courseId];
  if (!course || !key) return null;
  const results = course.exam.map((q) => ({ id: q.id, correct: answers[q.id] === key[q.id] }));
  const correct = results.filter((r) => r.correct).length;
  const score = Math.round((correct / course.exam.length) * 100);
  return { course, score, correct, total: course.exam.length, passed: score >= course.passMark, results };
}

export async function issueCertificate(input: Omit<Certificate, "id" | "issuedAt">) {
  const certificate: Certificate = { ...input, id: certificateCode(input.courseId), issuedAt: new Date().toISOString() };
  await updateStore("certificates", (items) => ({ items: [certificate, ...items] }));
  return certificate;
}

export async function findCertificate(code: string) {
  const normalized = code.trim().toUpperCase();
  return (await readStore("certificates")).find((c) => c.id === normalized);
}
