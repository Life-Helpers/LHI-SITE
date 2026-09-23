import "server-only";

import { randomUUID } from "node:crypto";

import { readStore, updateStore } from "@/lib/cms/store";

export interface Subscriber {
  email: string;
  name: string;
  source: string;
  subscribedAt: string;
}

/** Active newsletter subscribers: newsletter sign-ups, de-duplicated, minus anyone who unsubscribed. */
export async function getSubscribers(): Promise<Subscriber[]> {
  const [submissions, unsubscribes] = await Promise.all([readStore("submissions"), readStore("unsubscribes")]);
  const gone = new Set(unsubscribes.map((u) => u.email));
  const seen = new Map<string, Subscriber>();
  for (const s of submissions) {
    if (s.type !== "newsletter") continue;
    const email = s.email.trim().toLowerCase();
    if (gone.has(email) || seen.has(email)) continue;
    seen.set(email, {
      email,
      name: s.fields.name && s.fields.name !== email ? s.fields.name : "",
      source: s.fields.source ?? "website",
      subscribedAt: s.createdAt,
    });
  }
  return [...seen.values()].sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt));
}

export async function unsubscribe(email: string) {
  const e = email.trim().toLowerCase();
  await updateStore("unsubscribes", (items) =>
    items.some((u) => u.email === e) ? { items } : { items: [...items, { id: randomUUID(), email: e, at: new Date().toISOString() }] },
  );
}
