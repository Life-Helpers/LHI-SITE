import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";

import { readStore, updateStore } from "@/lib/cms/store";
import type { HrContext } from "@/lib/hr/session";
import type { HrToken } from "@/lib/hr/types";

const MAX_AUDIT = 5000;

/** Record a change in the HR audit trail (newest first). */
export async function hrAudit(actor: Pick<HrContext, "account" | "displayName"> | { system: string }, action: string, target: string, details = "") {
  const entry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    actorAccountId: "system" in actor ? "system" : actor.account.id,
    actorName: "system" in actor ? actor.system : `${actor.displayName} (${actor.account.email})`,
    action,
    target,
    details: details.slice(0, 2000),
  };
  await updateStore("hrAudit", (items) => ({ items: [entry, ...items].slice(0, MAX_AUDIT) }));
}

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const TOKEN_TTL: Record<HrToken["purpose"], number> = { invite: 7 * 24 * 3600_000, reset: 24 * 3600_000 };

/** A new one-time link token for an account. Earlier unused tokens for it stop working. */
export async function createHrToken(accountId: string, purpose: HrToken["purpose"]): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  await updateStore("hrTokens", (items) => ({
    items: [
      ...items.filter((t) => t.accountId !== accountId && !t.usedAt && Date.parse(t.expiresAt) > now),
      { id: randomUUID(), tokenHash: hashToken(token), accountId, purpose, expiresAt: new Date(now + TOKEN_TTL[purpose]).toISOString() },
    ],
  }));
  return token;
}

/** The token's record if it's valid and unused (doesn't use it up). */
export async function peekHrToken(token: string): Promise<HrToken | null> {
  if (!token || token.length > 200) return null;
  const hash = hashToken(token);
  const found = (await readStore("hrTokens")).find((t) => t.tokenHash === hash);
  return found && !found.usedAt && Date.parse(found.expiresAt) > Date.now() ? found : null;
}

/** Use a token up. Returns its record, or null if it was invalid, expired or already used. */
export async function consumeHrToken(token: string): Promise<HrToken | null> {
  if (!token || token.length > 200) return null;
  const hash = hashToken(token);
  const result = await updateStore("hrTokens", (items) => {
    const found = items.find((t) => t.tokenHash === hash);
    if (!found || found.usedAt || Date.parse(found.expiresAt) <= Date.now()) return { items, result: null };
    const used = { ...found, usedAt: new Date().toISOString() };
    return { items: items.map((t) => (t.id === found.id ? used : t)), result: used };
  });
  return result ?? null;
}

export async function hasAnyHrAccounts() {
  return (await readStore("hrAccounts")).length > 0;
}
