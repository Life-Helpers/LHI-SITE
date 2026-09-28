import "server-only";

import postgres from "postgres";

/**
 * Postgres backing for the CMS store. Each collection (posts, users, settings…) is one
 * JSON document in the `cms_store` table, so the store keeps exactly the same shape it
 * had as JSON files. Enabled by DATABASE_URL (or POSTGRES_URL, as set by Vercel's Neon
 * and Supabase integrations).
 */
export function databaseUrl() {
  return process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || "";
}

/**
 * The connection URL with the options the driver doesn't understand removed. Neon's
 * connection strings end in `channel_binding=require`, which the driver would otherwise send to
 * the server as a setting and fail with "unrecognized configuration parameter". TLS is still
 * required by `sslmode=require`.
 */
export function connectionUrl(raw = databaseUrl()) {
  try {
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    return url.toString();
  } catch {
    return raw;
  }
}

type Sql = ReturnType<typeof postgres>;

let client: Sql | null = null;
let ready: Promise<void> | null = null;

function sql(): Sql {
  if (!client) {
    client = postgres(connectionUrl(), {
      // Serverless functions each hold a small pool; the provider's pooler does the rest.
      max: 3,
      idle_timeout: 20,
      connect_timeout: 15,
      // Transaction-mode poolers (Neon, Supabase) don't support prepared statements.
      prepare: false,
      onnotice: () => {},
    });
  }
  return client;
}

async function ensureTable() {
  ready ??= sql()`
    create table if not exists cms_store (
      name text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `.then(() => undefined);
  try {
    await ready;
  } catch (err) {
    ready = null;
    throw err;
  }
}

/** The stored document, or undefined when the collection has never been saved. */
export async function dbRead<T>(name: string): Promise<T | undefined> {
  await ensureTable();
  const rows = await sql()<{ data: T }[]>`select data from cms_store where name = ${name}`;
  return rows[0]?.data;
}

/**
 * Read-modify-write one collection in a transaction. An advisory lock per collection
 * serialises concurrent saves across every server instance.
 */
export async function dbUpdate<T, R>(name: string, fallback: () => T, mutate: (current: T) => { data: T; result?: R }): Promise<R | undefined> {
  await ensureTable();
  return sql().begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtext(${`cms:${name}`}))`;
    const rows = await tx<{ data: T }[]>`select data from cms_store where name = ${name}`;
    const current = rows.length ? rows[0].data : fallback();
    const { data, result } = mutate(current);
    await tx`
      insert into cms_store (name, data, updated_at) values (${name}, ${tx.json(data as never)}, now())
      on conflict (name) do update set data = excluded.data, updated_at = now()
    `;
    return result;
  }) as Promise<R | undefined>;
}

/** Every saved collection, for backups. */
export async function dbDumpAll(): Promise<{ name: string; data: unknown }[]> {
  await ensureTable();
  return sql()<{ name: string; data: unknown }[]>`select name, data from cms_store order by name`;
}

/* ---------------------------------------------------------------- Files */

let filesReady: Promise<void> | null = null;

async function ensureFilesTable() {
  await ensureTable();
  filesReady ??= sql()`
    create table if not exists cms_files (
      key text primary key,
      content_type text not null,
      size integer not null,
      data bytea not null,
      updated_at timestamptz not null default now()
    )
  `.then(() => undefined);
  try {
    await filesReady;
  } catch (err) {
    filesReady = null;
    throw err;
  }
}

/** Store (or replace) an uploaded file in the database. */
export async function dbPutFile(key: string, data: Buffer, contentType: string) {
  await ensureFilesTable();
  await sql()`
    insert into cms_files (key, content_type, size, data, updated_at)
    values (${key}, ${contentType}, ${data.length}, ${data}, now())
    on conflict (key) do update set content_type = excluded.content_type, size = excluded.size, data = excluded.data, updated_at = now()
  `;
}

export async function dbDeleteFile(key: string) {
  await ensureFilesTable();
  await sql()`delete from cms_files where key = ${key}`;
}

export async function dbFileInfo(key: string): Promise<{ size: number; updatedAt: Date } | null> {
  await ensureFilesTable();
  const rows = await sql()<{ size: number; updated_at: Date }[]>`select size, updated_at from cms_files where key = ${key}`;
  return rows[0] ? { size: rows[0].size, updatedAt: new Date(rows[0].updated_at) } : null;
}

/** Bytes `start`…`end` (inclusive) of a stored file. */
export async function dbReadFile(key: string, start = 0, end?: number): Promise<Buffer | null> {
  await ensureFilesTable();
  const rows =
    end === undefined
      ? await sql()<{ data: Buffer }[]>`select data from cms_files where key = ${key}`
      : await sql()<{ data: Buffer }[]>`select substring(data from ${start + 1} for ${end - start + 1}) as data from cms_files where key = ${key}`;
  return rows[0] ? Buffer.from(rows[0].data) : null;
}

/** Total size of stored files, for the admin's storage notice. */
export async function dbFilesSize(): Promise<number> {
  await ensureFilesTable();
  const rows = await sql()<{ total: string | null }[]>`select sum(size)::text as total from cms_files`;
  return Number(rows[0]?.total ?? 0);
}
