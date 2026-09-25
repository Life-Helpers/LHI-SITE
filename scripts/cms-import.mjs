#!/usr/bin/env node
/**
 * Copy CMS content from a data folder (a CMS_DATA_DIR from a server, or an unpacked admin
 * backup) into the production storage:
 *   - every <collection>.json → the Postgres table cms_store (DATABASE_URL or POSTGRES_URL)
 *   - uploads/ and private/ files → Vercel Blob (BLOB_READ_WRITE_TOKEN), when set
 *
 * Usage:
 *   DATABASE_URL=… BLOB_READ_WRITE_TOKEN=… node scripts/cms-import.mjs ./cms-data [--overwrite]
 *
 * Without --overwrite, collections that already exist in the database are left untouched.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import postgres from "postgres";

const [dir, ...flags] = process.argv.slice(2);
const overwrite = flags.includes("--overwrite");
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!dir || !url) {
  console.error("Usage: DATABASE_URL=… [BLOB_READ_WRITE_TOKEN=…] node scripts/cms-import.mjs <data-folder> [--overwrite]");
  process.exit(1);
}

const MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
  pdf: "application/pdf", mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg",
  mp4: "video/mp4", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
await sql`create table if not exists cms_store (name text primary key, data jsonb not null, updated_at timestamptz not null default now())`;

let imported = 0;
let skipped = 0;
for (const entry of await readdir(dir)) {
  if (!entry.endsWith(".json")) continue;
  const name = entry.slice(0, -5);
  const data = JSON.parse(await readFile(path.join(dir, entry), "utf8"));
  const exists = (await sql`select 1 from cms_store where name = ${name}`).length > 0;
  if (exists && !overwrite) {
    console.log(`skip   ${name} (already in the database; use --overwrite to replace)`);
    skipped++;
    continue;
  }
  await sql`
    insert into cms_store (name, data, updated_at) values (${name}, ${sql.json(data)}, now())
    on conflict (name) do update set data = excluded.data, updated_at = now()
  `;
  console.log(`import ${name}`);
  imported++;
}
await sql.end();
console.log(`Content: ${imported} collections imported, ${skipped} skipped.`);

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.log("BLOB_READ_WRITE_TOKEN not set: uploaded files were not copied.");
  process.exit(0);
}

const { put } = await import("@vercel/blob");
const access = process.env.BLOB_ACCESS === "public" ? "public" : "private";

async function* walk(folder) {
  let entries = [];
  try {
    entries = await readdir(folder, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(folder, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && !e.name.endsWith(".tmp")) yield full;
  }
}

let files = 0;
for (const top of ["uploads", "private"]) {
  for await (const full of walk(path.join(dir, top))) {
    const key = path.relative(dir, full).split(path.sep).join("/");
    const ext = path.extname(full).slice(1).toLowerCase();
    await put(key, await readFile(full), {
      access,
      contentType: MIME[ext] ?? "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 31536000,
    });
    files++;
    if (files % 25 === 0) console.log(`files: ${files}…`);
  }
}
console.log(`Files: ${files} copied to Vercel Blob (${access}).`);
