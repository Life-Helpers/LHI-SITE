import "server-only";

import { createHmac, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ALL_PERMISSIONS, BUILT_IN_ROLES, can, type CmsRole, type CmsUser, type Permission, type PublicUser } from "@/lib/cms/schema";
import { readSecret, readStore } from "@/lib/cms/store";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const SESSION_COOKIE = "lhi_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 10) return "Password must be at least 10 characters.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "Password must contain letters and numbers.";
  return null;
}

export async function sessionKey() {
  return process.env.CMS_SESSION_SECRET || readSecret("session", () => randomBytes(32).toString("base64"));
}

export function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export async function createSession(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS, n: randomUUID() }),
  ).toString("base64url");
  const token = `${payload}.${sign(payload, await sessionKey())}`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

async function readSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload, await sessionKey()));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { uid: string; exp: number };
    if (!uid || exp < Date.now() / 1000) return null;
    return uid;
  } catch {
    return null;
  }
}

/** Resolve a role id to its definition. The Administrator role always has every permission. */
export function resolveRole(roleId: string, roles: CmsRole[]): { name: string; permissions: Permission[] } {
  if (roleId === "administrator") return { name: "Administrator", permissions: ALL_PERMISSIONS };
  const role = roles.find((r) => r.id === roleId) ?? BUILT_IN_ROLES.find((r) => r.id === roleId);
  return role ? { name: role.name, permissions: role.permissions } : { name: "No role", permissions: [] };
}

export function toPublicUser(user: CmsUser, roles: CmsRole[] = BUILT_IN_ROLES): PublicUser {
  const { id, name, email, role, createdAt, lastLoginAt } = user;
  const resolved = resolveRole(role, roles);
  return { id, name, email, role, createdAt, lastLoginAt, roleName: resolved.name, permissions: resolved.permissions };
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const uid = await readSessionUserId();
  if (!uid) return null;
  const [users, roles] = await Promise.all([readStore("users"), readStore("roles")]);
  const user = users.find((u) => u.id === uid);
  return user ? toPublicUser(user, roles) : null;
}

/** For pages: redirect to login, or to the dashboard if the user's role lacks the permission. */
export async function requirePageUser(permission?: Permission): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!can(user, permission)) redirect("/admin?denied=1");
  return user;
}

export class AuthError extends Error {}

/** For server actions and API routes: throw instead of redirecting. */
export async function requireUser(permission?: Permission): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Your session has expired. Please log in again.");
  if (!can(user, permission)) throw new AuthError("You don't have permission to do that.");
  return user;
}

export async function hasAnyUsers() {
  return (await readStore("users")).length > 0;
}

/** First-run setup is allowed only while no users exist; in production it also requires CMS_SETUP_TOKEN. */
export function setupTokenRequired() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.CMS_SETUP_TOKEN);
}

export function checkSetupToken(token: string) {
  const expected = process.env.CMS_SETUP_TOKEN;
  if (!setupTokenRequired()) return true;
  if (!expected) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Simple in-memory brute-force protection: 5 failures per email per 15 minutes.
const failures = new Map<string, { count: number; until: number }>();

export function loginLocked(email: string) {
  const entry = failures.get(email);
  return Boolean(entry && entry.count >= 5 && entry.until > Date.now());
}

export function recordLoginFailure(email: string) {
  const entry = failures.get(email);
  const fresh = !entry || entry.until < Date.now();
  failures.set(email, { count: fresh ? 1 : entry.count + 1, until: Date.now() + 15 * 60 * 1000 });
}

export function clearLoginFailures(email: string) {
  failures.delete(email);
}
