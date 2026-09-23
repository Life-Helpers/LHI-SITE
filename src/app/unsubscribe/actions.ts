"use server";

import { timingSafeEqual } from "node:crypto";

import { unsubscribeToken } from "@/lib/email/notifications";
import { unsubscribe } from "@/lib/email/subscribers";

export async function unsubscribeAction(_prev: { done?: boolean; error?: string } | null, form: FormData) {
  const email = String(form.get("e") ?? "").trim().toLowerCase();
  const token = String(form.get("t") ?? "");
  const expected = await unsubscribeToken(email);
  if (!email || token.length !== expected.length || !timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
    return { error: "This unsubscribe link isn't valid. Please use the link from your most recent email." };
  }
  await unsubscribe(email);
  return { done: true };
}
