import "server-only";

import { randomUUID } from "node:crypto";

import type { PublicUser } from "@/lib/cms/schema";
import { updateStore } from "@/lib/cms/store";

const MAX_ENTRIES = 500;

export async function logActivity(user: Pick<PublicUser, "name">, action: string, target: string, href?: string) {
  await updateStore("activity", (items) => ({
    items: [{ id: randomUUID(), at: new Date().toISOString(), user: user.name, action, target, href }, ...items].slice(
      0,
      MAX_ENTRIES,
    ),
  }));
}
