import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

import { sessionKey } from "@/lib/cms/auth";
import { EMAIL_PROVIDERS, type EmailProviderId } from "@/lib/cms/schema";
import { readSecret, readSettings, writeSecret } from "@/lib/cms/store";

/**
 * Where email goes out from. Set in Admin → Email & Pop-up (the API key is stored encrypted with
 * the site's session key); if nothing was set there, the EMAIL_* environment variables are used.
 */
export interface EmailConfig {
  provider: EmailProviderId;
  apiKey: string;
  from: string;
  replyTo?: string;
  /** Mailgun only. */
  domain?: string;
  region?: "us" | "eu";
  source: "admin" | "environment";
}

const SECRET = "emailApiKey";

async function cipherKey() {
  return createHash("sha256").update(`${await sessionKey()}:email-api-key`).digest();
}

export async function saveApiKey(apiKey: string) {
  if (!apiKey) return writeSecret(SECRET, "");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", await cipherKey(), iv);
  const data = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  await writeSecret(SECRET, Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64"));
}

async function loadApiKey(): Promise<string> {
  const stored = await readSecret(SECRET, () => "").catch(() => "");
  if (!stored) return "";
  try {
    const raw = Buffer.from(stored, "base64");
    const decipher = createDecipheriv("aes-256-gcm", await cipherKey(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
  } catch {
    // The session key changed since it was saved: treat as not set.
    return "";
  }
}

function fromEnvironment(): EmailConfig | null {
  const p = process.env.EMAIL_PROVIDER?.trim().toLowerCase() as EmailProviderId | undefined;
  const apiKey = process.env.EMAIL_API_KEY ?? "";
  const from = process.env.EMAIL_FROM ?? "";
  if (!p || !EMAIL_PROVIDERS.includes(p) || !apiKey || !from) return null;
  const domain = process.env.MAILGUN_DOMAIN ?? "";
  if (p === "mailgun" && !domain) return null;
  return { provider: p, apiKey, from, replyTo: process.env.EMAIL_REPLY_TO || undefined, domain, region: process.env.MAILGUN_REGION === "eu" ? "eu" : "us", source: "environment" };
}

/** The active configuration, or null when email is off or not set up (emails then wait in the Outbox). */
export async function getEmailConfig(): Promise<EmailConfig | null> {
  const { email } = await readSettings();
  // Once set up in the admin, its on/off switch decides, whatever the environment says.
  if (email.keyHint) {
    if (!email.enabled || !email.from || (email.provider === "mailgun" && !email.domain)) return null;
    const apiKey = await loadApiKey();
    if (!apiKey) return null;
    return { provider: email.provider, apiKey, from: email.from, replyTo: email.replyTo || undefined, domain: email.domain, region: email.region, source: "admin" };
  }
  return fromEnvironment();
}
