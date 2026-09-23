const OPTIMIZABLE_HOSTS = new Set(["images.pexels.com", "images.unsplash.com", "lhinigeria.org"]);

/**
 * CMS editors can paste any https image URL, but next/image only optimizes the hosts
 * whitelisted in next.config.ts. Everything else is served as-is instead of erroring.
 */
export function isUnoptimized(src: string) {
  if (src.startsWith("/")) return false;
  try {
    return !OPTIMIZABLE_HOSTS.has(new URL(src).hostname);
  } catch {
    return true;
  }
}
