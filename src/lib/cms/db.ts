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

type Sql = ReturnType<typeof postgres>;

let client: Sql | null = null;
let ready: Promise<void> | null = null;

function sql(): Sql {
  if (!client) {
    client = postgres(databaseUrl(), {
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
