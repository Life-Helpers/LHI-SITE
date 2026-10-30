// One-time copy of the website's data from Neon (or any Postgres) into the bundled database.
//
// Runs at container start (scripts/docker-entrypoint.sh) when MIGRATE_FROM_DATABASE_URL is set:
//   - copies every row of cms_store (all content, users, settings…) and cms_files (uploads);
//   - does nothing if the local database already has content, so restarts never overwrite
//     newer local data (set MIGRATE_FORCE=true to copy again and replace what is there);
//   - exits with an error if the local database is empty and the copy fails, so the site never
//     starts on an empty database by mistake (Coolify restarts the container and it tries again).
//
// Manual use:  MIGRATE_FROM_DATABASE_URL=… DATABASE_URL=… node scripts/migrate-from-neon.mjs
import postgres from "postgres";

const source = process.env.MIGRATE_FROM_DATABASE_URL?.trim();
const target = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
const force = process.env.MIGRATE_FORCE === "true";
const log = (msg) => console.log(`[migrate] ${msg}`);

/** Neon adds channel_binding, which the driver would pass on to the server as a setting. */
function clean(url) {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url;
  }
}

if (!source) {
  log("MIGRATE_FROM_DATABASE_URL not set: nothing to copy.");
  process.exit(0);
}
if (!target) {
  console.error("[migrate] DATABASE_URL is not set.");
  process.exit(1);
}
if (clean(source) === clean(target)) {
  log("Source and target are the same database: nothing to copy.");
  process.exit(0);
}

const src = postgres(clean(source), { max: 1, prepare: false, connect_timeout: 30, onnotice: () => {} });
const dst = postgres(clean(target), { max: 1, connect_timeout: 30, onnotice: () => {} });

// Wait for the bundled database to accept connections (up to ~60 s).
for (let i = 0; ; i++) {
  try {
    await dst`select 1`;
    break;
  } catch (err) {
    if (i >= 30) throw err;
    await new Promise((r) => setTimeout(r, 2000));
  }
}

await dst`create table if not exists cms_store (name text primary key, data jsonb not null, updated_at timestamptz not null default now())`;
await dst`create table if not exists cms_files (key text primary key, content_type text not null, size integer not null, data bytea not null, updated_at timestamptz not null default now())`;

const [{ n: existing }] = await dst`select count(*)::int as n from cms_store`;
if (existing > 0 && !force) {
  log(`Local database already has ${existing} collections: skipping (set MIGRATE_FORCE=true to copy again).`);
  await Promise.all([src.end(), dst.end()]);
  process.exit(0);
}

try {
  const rows = await src`select name, data, updated_at from cms_store order by name`;
  const fileKeys = await src`select key, size from cms_files order by key`.catch(() => []);
  log(`Copying ${rows.length} collections and ${fileKeys.length} files…`);
  await dst.begin(async (tx) => {
    for (const r of rows) {
      await tx`
        insert into cms_store (name, data, updated_at) values (${r.name}, ${tx.json(r.data)}, ${r.updated_at})
        on conflict (name) do update set data = excluded.data, updated_at = excluded.updated_at`;
    }
  });
  // Files one at a time so a large upload is never held twice in memory.
  for (const { key } of fileKeys) {
    const [f] = await src`select key, content_type, size, data, updated_at from cms_files where key = ${key}`;
    if (!f) continue;
    await dst`
      insert into cms_files (key, content_type, size, data, updated_at)
      values (${f.key}, ${f.content_type}, ${f.size}, ${f.data}, ${f.updated_at})
      on conflict (key) do update set content_type = excluded.content_type, size = excluded.size, data = excluded.data, updated_at = excluded.updated_at`;
  }
  const [{ n: copied }] = await dst`select count(*)::int as n from cms_store`;
  const [{ n: files }] = await dst`select count(*)::int as n from cms_files`;
  log(`Done: ${copied} collections and ${files} files in the local database. You can now remove MIGRATE_FROM_DATABASE_URL.`);
} catch (err) {
  console.error(`[migrate] Copy failed: ${err instanceof Error ? err.message : err}`);
  await Promise.all([src.end({ timeout: 1 }), dst.end({ timeout: 1 })]);
  process.exit(1);
}
await Promise.all([src.end(), dst.end()]);
