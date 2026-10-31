import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import postgres from "postgres";

const scrypt = promisify(scryptCallback);
const email = String(process.argv[2] ?? "").trim().toLowerCase();
const name = String(process.argv[3] ?? "").trim();
const reset = process.argv[4] === '--reset';
const suppliedPassword = process.argv[5];
if (reset && (!suppliedPassword || suppliedPassword.length < 16)) throw new Error('Reset requires a strong temporary password.');
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  throw new Error("Provide a valid administrator email address.");
}
if (!name) throw new Error("Provide the administrator's display name.");
if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  const result = await sql.begin(async (tx) => {
    // Use the same collection lock as the application store so provisioning cannot
    // race with an administrator editing the user list.
    await tx`select pg_advisory_xact_lock(hashtext('cms:users'))`;
    const rows = await tx`select data from cms_store where name = 'users' for update`;
    if (rows.length > 0 && !Array.isArray(rows[0].data)) {
      throw new Error('The deployed users collection is missing or invalid; no changes were made.');
    }

    const users = rows[0]?.data ?? [];
    const matches = users.filter((user) => user?.email?.toLowerCase() === email);
    if (reset && (matches.length !== 1 || matches[0].role !== 'administrator')) throw new Error('Expected exactly one existing administrator.');
    if (!reset && matches.length) {
      throw new Error(`An account already exists for ${email}; no changes were made.`);
    }

    const password = suppliedPassword ?? `LHI-${randomBytes(9).toString('base64url')}-9`;
    const salt = randomBytes(16);
    const hash = await scrypt(password, salt, 64);
    const user = {
      id: randomUUID(),
      name,
      email,
      role: 'administrator',
      passwordHash: `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`,
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };

    const nextUsers = reset ? users.map((existing) => existing.id === matches[0].id ? { ...existing, passwordHash: user.passwordHash, mustChangePassword: true } : existing) : [...users, user];
    await tx`
      insert into cms_store (name, data, updated_at)
      values ('users', ${tx.json(nextUsers)}, now())
      on conflict (name) do update set data = excluded.data, updated_at = now()
    `;
    return { email, password, role: user.role, mustChangePassword: true };
  });

  console.log(JSON.stringify(result));
} finally {
  await sql.end();
}
