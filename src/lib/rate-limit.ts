import { clientIp } from "@/lib/client-ip";

/**
 * Fixed-window rate limiting per visitor IP. When a Redis REST store is configured
 * (Upstash, or Vercel's Redis/KV integration: UPSTASH_REDIS_REST_URL + _TOKEN or
 * KV_REST_API_URL + _TOKEN) the counts are shared by every server instance; otherwise
 * each instance counts in memory, which is fine for a single server.
 */
const WINDOW_SECONDS = 3600;

const memory = new Map<string, { count: number; until: number }>();

function memoryCount(id: string, windowSeconds: number) {
  const entry = memory.get(id);
  const fresh = !entry || entry.until < Date.now();
  const count = fresh ? 1 : entry.count + 1;
  memory.set(id, { count, until: fresh ? Date.now() + windowSeconds * 1000 : entry.until });
  if (memory.size > 10_000) {
    for (const [k, v] of memory) if (v.until < Date.now()) memory.delete(k);
  }
  return count;
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisCount(id: string, windowSeconds: number): Promise<number | null> {
  const config = redisConfig();
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", id],
        ["EXPIRE", id, String(windowSeconds), "NX"],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const [incr] = (await res.json()) as { result?: number }[];
    return typeof incr?.result === "number" ? incr.result : null;
  } catch {
    return null;
  }
}

/** True when this visitor has made more than `max` requests for `key` in the current window. */
export async function rateLimited(req: Request, key: string, max: number, windowSeconds = WINDOW_SECONDS): Promise<boolean> {
  const id = `lhi:rl:${key}:${clientIp(req)}`;
  // If the shared store is unreachable, fall back to this instance's own count rather than failing open.
  const count = (await redisCount(id, windowSeconds)) ?? memoryCount(id, windowSeconds);
  return count > max;
}
