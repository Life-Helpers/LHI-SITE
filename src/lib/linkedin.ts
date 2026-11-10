/**
 * The embed address for a LinkedIn post link, or null. Accepts the links LinkedIn's "Copy link to post"
 * and "Embed this post" give: /posts/...-activity-123..., /feed/update/urn:li:activity:123... and
 * /embed/feed/update/urn:li:share:123... (also ugcPost).
 */
export function linkedinEmbed(link: string): string | null {
  try {
    const u = new URL(link.trim());
    if (!/(^|\.)linkedin\.com$/.test(u.hostname)) return null;
    const path = decodeURIComponent(u.pathname);
    const urn = /urn:li:(activity|share|ugcPost):(\d{10,25})/.exec(path);
    if (urn) return `https://www.linkedin.com/embed/feed/update/urn:li:${urn[1]}:${urn[2]}`;
    const activity = /-activity-(\d{10,25})(?:-|\/|$)/.exec(path);
    return activity ? `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activity[1]}` : null;
  } catch {
    return null;
  }
}
