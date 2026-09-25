import "server-only";

import { getSiteData } from "@/lib/cms/content";

/** Account links from Admin → Settings → Social media accounts. */
const accounts = async () => (await getSiteData()).social;

/**
 * Recent posts from LHI's official social media accounts, for the home page social wall.
 * Each network is read on the server and cached for 15 minutes; a network that isn't
 * connected (no token) or doesn't answer is simply left out, so the page never waits long
 * or breaks.
 *
 * - YouTube: the two newest videos from the channel's public RSS feed. No key needed; set YOUTUBE_CHANNEL_ID, or it is
 *   looked up once a day from the YouTube link in Admin → Settings.
 * - Facebook: FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN (a long-lived Page token).
 * - Instagram: INSTAGRAM_ACCESS_TOKEN (Instagram API with Instagram Login, professional account).
 * - X: X_BEARER_TOKEN (+ optional X_USER_ID; otherwise looked up from the handle). Needs an X API
 *   plan that allows reading posts.
 */

export type SocialNetwork = "facebook" | "instagram" | "youtube" | "x";

export interface SocialItem {
  id: string;
  network: SocialNetwork;
  url: string;
  text: string;
  image?: string;
  /** ISO date. */
  date: string;
  /** Video posts get a play badge. */
  video?: boolean;
}

const REVALIDATE = 900;
const TIMEOUT = 4000;
const PER_NETWORK = 6;
/** YouTube videos on the wall (the newest ones). */
const YOUTUBE_ITEMS = 2;

async function getJson<T>(url: string, init: RequestInit = {}, revalidate = REVALIDATE): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT), next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getText(url: string, revalidate = REVALIDATE): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), next: { revalidate } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const tag = (xml: string, name: string) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(xml);
  return m ? decode(m[1].trim()) : "";
};

async function youtubeChannelId(): Promise<string | null> {
  if (process.env.YOUTUBE_CHANNEL_ID) return process.env.YOUTUBE_CHANNEL_ID;
  const youtube = (await accounts()).youtube;
  if (!youtube) return null;
  const html = await getText(youtube, 86_400);
  const m = html && (/"externalId":"(UC[\w-]{22})"/.exec(html) ?? /channel\/(UC[\w-]{22})/.exec(html));
  return m ? m[1] : null;
}

export async function youtubeItems(): Promise<SocialItem[]> {
  const channel = await youtubeChannelId();
  if (!channel) return [];
  const xml = await getText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`);
  if (!xml) return [];
  return xml
    .split("<entry>")
    .slice(1, YOUTUBE_ITEMS + 1)
    .map((entry) => {
      const id = tag(entry, "yt:videoId");
      return {
        id: `yt-${id}`,
        network: "youtube" as const,
        url: `https://www.youtube.com/watch?v=${id}`,
        text: tag(entry, "title"),
        image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        date: tag(entry, "published"),
        video: true,
      };
    })
    .filter((i) => i.id !== "yt-");
}

async function facebookItems(): Promise<SocialItem[]> {
  const page = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!page || !token) return [];
  const data = await getJson<{ data?: { id: string; message?: string; permalink_url?: string; full_picture?: string; created_time: string }[] }>(
    `https://graph.facebook.com/v21.0/${encodeURIComponent(page)}/posts?fields=message,permalink_url,full_picture,created_time&limit=${PER_NETWORK}&access_token=${encodeURIComponent(token)}`,
  );
  const pageUrl = (await accounts()).facebook;
  return (data?.data ?? [])
    .filter((p) => p.message || p.full_picture)
    .map((p) => ({
      id: `fb-${p.id}`,
      network: "facebook" as const,
      url: p.permalink_url ?? pageUrl,
      text: p.message ?? "",
      image: p.full_picture,
      date: p.created_time,
    }));
}

async function instagramItems(): Promise<SocialItem[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];
  const data = await getJson<{
    data?: { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string; timestamp: string }[];
  }>(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${PER_NETWORK}&access_token=${encodeURIComponent(token)}`,
  );
  return (data?.data ?? []).map((p) => ({
    id: `ig-${p.id}`,
    network: "instagram" as const,
    url: p.permalink,
    text: p.caption ?? "",
    image: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
    date: p.timestamp,
    video: p.media_type === "VIDEO",
  }));
}

async function xItems(): Promise<SocialItem[]> {
  const bearer = process.env.X_BEARER_TOKEN;
  if (!bearer) return [];
  const headers = { Authorization: `Bearer ${bearer}` };
  const handle = (await accounts()).x.split("/").pop();
  if (!handle) return [];
  let userId = process.env.X_USER_ID;
  if (!userId) {
    const user = await getJson<{ data?: { id: string } }>(`https://api.x.com/2/users/by/username/${handle}`, { headers }, 86_400);
    userId = user?.data?.id;
  }
  if (!userId) return [];
  const data = await getJson<{
    data?: { id: string; text: string; created_at: string; attachments?: { media_keys?: string[] } }[];
    includes?: { media?: { media_key: string; url?: string; preview_image_url?: string; type: string }[] };
  }>(
    `https://api.x.com/2/users/${userId}/tweets?max_results=${Math.max(5, PER_NETWORK)}&exclude=replies,retweets&tweet.fields=created_at,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,type`,
    { headers },
  );
  const media = new Map((data?.includes?.media ?? []).map((m) => [m.media_key, m]));
  return (data?.data ?? []).slice(0, PER_NETWORK).map((t) => {
    const m = t.attachments?.media_keys?.map((k) => media.get(k)).find(Boolean);
    return {
      id: `x-${t.id}`,
      network: "x" as const,
      url: `https://x.com/${handle}/status/${t.id}`,
      text: t.text.replace(/\s*https:\/\/t\.co\/\w+$/, ""),
      image: m?.url ?? m?.preview_image_url,
      date: t.created_at,
      video: m?.type === "video",
    };
  });
}

/** Newest first, across every connected network. */
export async function getSocialFeed(limit = 12): Promise<{ items: SocialItem[]; connected: SocialNetwork[] }> {
  const sources: [SocialNetwork, () => Promise<SocialItem[]>][] = [
    ["facebook", facebookItems],
    ["instagram", instagramItems],
    ["youtube", youtubeItems],
    ["x", xItems],
  ];
  const results = await Promise.all(sources.map(([, load]) => load().catch(() => [] as SocialItem[])));
  const connected = sources.filter((_, i) => results[i].length > 0).map(([n]) => n);
  const items = results
    .flat()
    .filter((i) => !Number.isNaN(Date.parse(i.date)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
  return { items, connected };
}
