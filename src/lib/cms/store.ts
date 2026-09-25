import "server-only";

import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  ActivityEntry,
  Certificate,
  CmsRole,
  CmsSettings,
  CmsUser,
  CmsMagazine,
  Learner,
  MediaItem,
  NewsletterCampaign,
  OutboxEmail,
  PostComment,
  PostLikes,
  ResetToken,
  Submission,
  Unsubscribe,
} from "@/lib/cms/schema";
import { BUILT_IN_ROLES } from "@/lib/cms/schema";
import { databaseUrl, dbRead, dbUpdate } from "@/lib/cms/db";
import { DATA_DIR } from "@/lib/cms/paths";
import {
  seedDocuments,
  seedInterventions,
  seedMilestones,
  seedPartners,
  seedPosts,
  seedSettings,
  seedStates,
  seedTeam,
} from "@/lib/cms/seed";
import type { CollectionRecords } from "@/lib/cms/types";

/**
 * JSON content store. Each collection (posts, users, settings…) is one JSON document:
 * - in Postgres (table cms_store) when DATABASE_URL / POSTGRES_URL is set: use this on
 *   Vercel and any serverless or multi-instance hosting;
 * - otherwise one JSON file per collection in CMS_DATA_DIR (default ./cms-data), which
 *   needs a persistent, writable disk (VPS, Docker volume).
 * Until a collection is first saved it is served from the seed data, so a fresh
 * deployment shows the original site content. Everything else talks to the store only
 * through these functions.
 */

export { DATA_DIR, UPLOADS_DIR } from "@/lib/cms/paths";

const USE_DATABASE = Boolean(databaseUrl());

/** Where content and files are kept, for the admin's storage notice. */
export function storageStatus() {
  const onVercel = Boolean(process.env.VERCEL);
  return {
    content: USE_DATABASE ? "database" : onVercel ? "temporary" : "disk",
    files: process.env.BLOB_READ_WRITE_TOKEN ? "blob" : onVercel ? "temporary" : "disk",
    sessionSecret: Boolean(process.env.CMS_SESSION_SECRET) || USE_DATABASE || !onVercel,
  } as const;
}

interface StoreShape extends CollectionRecords {
  users: CmsUser;
  media: MediaItem;
  submissions: Submission;
  activity: ActivityEntry;
  certificates: Certificate;
  likes: PostLikes;
  comments: PostComment;
  learners: Learner;
  roles: CmsRole;
  outbox: OutboxEmail;
  campaigns: NewsletterCampaign;
  resetTokens: ResetToken;
  unsubscribes: Unsubscribe;
  magazines: CmsMagazine;
}

export type StoreName = keyof StoreShape;

const SEEDS: { [K in StoreName]: () => StoreShape[K][] } = {
  posts: seedPosts,
  interventions: seedInterventions,
  states: seedStates,
  partners: seedPartners,
  documents: seedDocuments,
  jobs: () => [],
  tenders: () => [],
  episodes: () => [],
  events: () => [],
  milestones: seedMilestones,
  team: seedTeam,
  users: () => [],
  media: () => [],
  submissions: () => [],
  activity: () => [],
  certificates: () => [],
  likes: () => [],
  comments: () => [],
  learners: () => [],
  roles: () => structuredClone(BUILT_IN_ROLES),
  outbox: () => [],
  campaigns: () => [],
  resetTokens: () => [],
  unsubscribes: () => [],
  magazines: () => [],
};

const cache = new Map<string, { mtimeMs: number; data: unknown }>();
const locks = new Map<string, Promise<unknown>>();

function fileFor(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

/** Seed content, built once per process and cloned for each read. */
function seeded<T>(name: string, fallback: () => T): T {
  const key = `seed:${name}`;
  const hit = cache.get(key);
  if (hit) return structuredClone(hit.data as T);
  const data = fallback();
  cache.set(key, { mtimeMs: -1, data });
  return structuredClone(data);
}

async function readJson<T>(name: string, fallback: () => T): Promise<T> {
  if (USE_DATABASE) {
    const stored = await dbRead<T>(name);
    return stored === undefined ? seeded(name, fallback) : stored;
  }
  const file = fileFor(name);
  try {
    const { mtimeMs } = await stat(file);
    const hit = cache.get(file);
    if (hit && hit.mtimeMs === mtimeMs) return structuredClone(hit.data as T);
    const data = JSON.parse(await readFile(file, "utf8")) as T;
    cache.set(file, { mtimeMs, data });
    return structuredClone(data);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // No file yet: build the seed content once and reuse it until the first save.
      const hit = cache.get(file);
      if (hit && hit.mtimeMs === -1) return structuredClone(hit.data as T);
      const data = fallback();
      cache.set(file, { mtimeMs: -1, data });
      return structuredClone(data);
    }
    throw err;
  }
}

async function writeJson(name: string, data: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  const file = fileFor(name);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, file);
  cache.delete(file);
}

/** Serialise read-modify-write cycles per file so concurrent saves don't clobber each other. */
function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const previous = locks.get(name) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(fn);
  locks.set(name, next);
  return next;
}

export function readStore<K extends StoreName>(name: K): Promise<StoreShape[K][]> {
  return readJson(name, SEEDS[name]);
}

/** Replace a whole collection document (settings). */
async function writeDocument(name: string, data: unknown) {
  if (USE_DATABASE) {
    await dbUpdate(name, () => data, () => ({ data }));
    return;
  }
  await withLock(name, () => writeJson(name, data));
}

export function updateStore<K extends StoreName, R = void>(
  name: K,
  mutate: (items: StoreShape[K][]) => { items: StoreShape[K][]; result?: R },
): Promise<R | undefined> {
  if (USE_DATABASE) {
    return dbUpdate(name, () => seeded(name, SEEDS[name]), (current) => {
      const { items, result } = mutate(current);
      return { data: items, result };
    });
  }
  return withLock(name, async () => {
    const current = await readStore(name);
    const { items, result } = mutate(current);
    await writeJson(name, items);
    return result;
  });
}

export async function readSettings(): Promise<CmsSettings> {
  const defaults = seedSettings();
  const stored = await readJson<Partial<CmsSettings>>("settings", () => ({}));
  return {
    homeFeature: { ...defaults.homeFeature, ...stored.homeFeature },
    nidake: { ...defaults.nidake, ...stored.nidake },
    contact: { ...defaults.contact, ...stored.contact },
    donations: { ...defaults.donations, ...stored.donations },
    engagement: { ...defaults.engagement, ...stored.engagement },
    homeText: stored.homeText ?? {},
  };
}

export function writeSettings(settings: CmsSettings) {
  return writeDocument("settings", settings);
}

/** Small key/value file for server secrets (e.g. the session signing key). */
export async function readSecret(key: string, create: () => string): Promise<string> {
  if (USE_DATABASE) {
    const value = await dbUpdate<Record<string, string>, string>("secrets", () => ({}), (secrets) =>
      secrets[key] ? { data: secrets, result: secrets[key] } : (() => {
        const created = create();
        return { data: { ...secrets, [key]: created }, result: created };
      })(),
    );
    return value!;
  }
  return withLock("secrets", async () => {
    const secrets = await readJson<Record<string, string>>("secrets", () => ({}));
    if (secrets[key]) return secrets[key];
    secrets[key] = create();
    await writeJson("secrets", secrets);
    return secrets[key];
  });
}
