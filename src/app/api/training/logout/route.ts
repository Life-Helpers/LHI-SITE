import { NextResponse } from "next/server";

import { destroyLearnerSession } from "@/lib/training/learners";

export async function POST() {
  await destroyLearnerSession();
  return NextResponse.json({ ok: true });
}
