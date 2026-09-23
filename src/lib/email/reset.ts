import "server-only";

import { createHash, randomBytes } from "node:crypto";

import type { ResetToken } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";

const TTL_MS = 60 * 60 * 1000;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");

/** Create a one-time reset token; only its hash is stored. Older tokens for the account are revoked. */
export async function createResetToken(kind: ResetToken["kind"], accountId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  await updateStore("resetTokens", (items) => ({
    items: [
      ...items.filter((t) => new Date(t.expiresAt).getTime() > now && !(t.kind === kind && t.accountId === accountId)),
      { id: hash(token), kind, accountId, expiresAt: new Date(now + TTL_MS).toISOString() },
    ],
  }));
  return token;
}

/** Check a token without using it. */
export async function peekResetToken(kind: ResetToken["kind"], token: string) {
  const id = hash(token);
  const found = (await readStore("resetTokens")).find(
    (t) => t.id === id && t.kind === kind && !t.usedAt && new Date(t.expiresAt).getTime() > Date.now(),
  );
  return found?.accountId ?? null;
}

/** Use a token (once). Returns the account id, or null if invalid/expired/used. */
export async function consumeResetToken(kind: ResetToken["kind"], token: string) {
  const id = hash(token);
  return (
    (await updateStore("resetTokens", (items) => {
      const t = items.find((x) => x.id === id && x.kind === kind && !x.usedAt && new Date(x.expiresAt).getTime() > Date.now());
      if (!t) return { items, result: null };
      return { items: items.map((x) => (x.id === id ? { ...x, usedAt: new Date().toISOString() } : x)), result: t.accountId };
    })) ?? null
  );
}
