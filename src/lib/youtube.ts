/** The 11-character video id from a YouTube link (watch, youtu.be, shorts, embed or live), or null. */
export function youtubeId(link: string): string | null {
  try {
    const u = new URL(link.trim());
    const host = u.hostname.replace(/^(www|m)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = u.searchParams.get("v") ?? /^\/(?:shorts|embed|live)\/([^/?#]+)/.exec(u.pathname)?.[1] ?? null;
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
