import type { RadioEpisode } from "@/components/radio/use-radio";
import type { CmsEpisode } from "@/lib/cms/types";

/**
 * Google Drive share links ("…/file/d/<id>/view", "open?id=<id>") point at Drive's viewer page,
 * which an audio player can't play. Turn them into the direct download link so the file streams.
 * The file must be shared as "Anyone with the link". Other links are returned unchanged.
 */
export function playableAudioUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname !== "drive.google.com" && u.hostname !== "docs.google.com") return url;
    const id = /\/file\/d\/([\w-]{10,})/.exec(u.pathname)?.[1] ?? u.searchParams.get("id");
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
  } catch {
    return url;
  }
}

/** Plain, client-safe shape of a published episode. */
export function toRadioEpisode(e: CmsEpisode): RadioEpisode {
  return {
    id: e.id,
    title: e.title,
    audio: playableAudioUrl(e.audio),
    summary: e.summary,
    programme: e.programme,
    date: e.date,
    language: e.language,
    duration: e.duration ?? "",
    station: e.station || "Radio Nigeria Royal FM 101.5, Sokoto",
    cover: e.cover ?? "",
    topics: e.topics ?? [],
    guests: e.guests ?? [],
  };
}
