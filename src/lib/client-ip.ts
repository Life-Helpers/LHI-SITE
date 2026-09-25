/**
 * The visitor's IP for rate limiting. The left-most X-Forwarded-For entry is whatever the
 * client sent and can be forged, so by default this uses the right-most entry: the address
 * our own reverse proxy (Vercel, nginx, a load balancer) appended. Hosts that put the real IP
 * in a dedicated header can name it in CLIENT_IP_HEADER (e.g. "cf-connecting-ip").
 */
export function clientIp(req: Request): string {
  const header = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  if (header) {
    const value = req.headers.get(header)?.split(",")[0]?.trim();
    if (value) return value;
  }
  const forwarded = req.headers.get("x-forwarded-for");
  const last = forwarded?.split(",").map((s) => s.trim()).filter(Boolean).pop();
  return last || "local";
}
