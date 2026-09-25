import "server-only";

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createGzip } from "node:zlib";
import { Readable } from "node:stream";

/** Minimal POSIX (ustar) tar writer: enough for a backup of the CMS data folder. */
function header(name: string, size: number, mtime: Date) {
  const buf = Buffer.alloc(512, 0);
  const write = (value: string, offset: number, length: number) => buf.write(value.slice(0, length), offset, length, "utf8");
  const octal = (n: number, length: number) => n.toString(8).padStart(length - 1, "0") + "\0";
  let prefix = "";
  let base = name;
  if (Buffer.byteLength(name) > 100) {
    const cut = name.lastIndexOf("/", 154);
    prefix = name.slice(0, cut);
    base = name.slice(cut + 1);
  }
  write(base, 0, 100);
  write(octal(0o644, 8), 100, 8);
  write(octal(0, 8), 108, 8);
  write(octal(0, 8), 116, 8);
  write(octal(size, 12), 124, 12);
  write(octal(Math.floor(mtime.getTime() / 1000), 12), 136, 12);
  write("        ", 148, 8);
  write("0", 156, 1);
  write("ustar\0", 257, 6);
  write("00", 263, 2);
  write(prefix, 345, 155);
  let sum = 0;
  for (const b of buf) sum += b;
  write(octal(sum, 7) + " ", 148, 8);
  return buf;
}

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && !entry.name.endsWith(".tmp")) yield full;
  }
}

/** Streams a .tar.gz of everything in `dir` (JSON collections, uploads and private files). */
export function backupStream(dir: string) {
  async function* tar() {
    for await (const file of walk(dir)) {
      const info = await stat(file);
      const data = await readFile(file);
      yield header(path.relative(dir, file).split(path.sep).join("/"), data.length, info.mtime);
      yield data;
      const pad = (512 - (data.length % 512)) % 512;
      if (pad) yield Buffer.alloc(pad, 0);
    }
    yield Buffer.alloc(1024, 0);
  }
  return Readable.from(tar()).pipe(createGzip());
}

/** Streams a .tar.gz of in-memory documents (the database-backed store: one JSON file per collection). */
export function backupDocumentsStream(docs: { name: string; data: unknown }[]) {
  async function* tar() {
    const now = new Date();
    for (const doc of docs) {
      const data = Buffer.from(JSON.stringify(doc.data, null, 2), "utf8");
      yield header(`${doc.name}.json`, data.length, now);
      yield data;
      const pad = (512 - (data.length % 512)) % 512;
      if (pad) yield Buffer.alloc(pad, 0);
    }
    yield Buffer.alloc(1024, 0);
  }
  return Readable.from(tar()).pipe(createGzip());
}
