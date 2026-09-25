import "server-only";

import { NextResponse } from "next/server";

import { rateLimited } from "@/lib/cms/submissions";
import { clientIp } from "@/lib/client-ip";

/**
 * Shared protection for public forms: a per-IP rate limit, a hidden "website" honeypot and,
 * when TURNSTILE_SECRET_KEY is set, a Cloudflare Turnstile check. Without the key the site
 * still works (rate limit + honeypot), so Turnstile can be switched on later.
 */
export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

async function verifyTurnstile(token: string, ip: string) {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, ...(ip !== "local" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export type SpamCheck = { blocked: NextResponse } | { drop: true } | { ok: true };

/**
 * Call at the start of a public POST handler.
 * - `blocked`: return this response.
 * - `drop`: a bot filled the honeypot; pretend success without saving.
 */
export async function checkSpam(
  req: Request,
  { key, max, honeypot, token }: { key: string; max: number; honeypot?: unknown; token?: unknown },
): Promise<SpamCheck> {
  if (rateLimited(req, key, max)) {
    return { blocked: NextResponse.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 }) };
  }
  if (typeof honeypot === "string" && honeypot.trim()) return { drop: true };
  if (turnstileEnabled()) {
    const t = (typeof token === "string" && token) || req.headers.get("x-turnstile-token") || "";
    const ip = clientIp(req);
    if (!t || !(await verifyTurnstile(t, ip))) {
      return { blocked: NextResponse.json({ error: "Please complete the security check and try again." }, { status: 400 }) };
    }
  }
  return { ok: true };
}
