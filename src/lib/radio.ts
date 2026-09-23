import type { RadioEpisode } from "@/components/radio/use-radio";
import type { CmsEpisode } from "@/lib/cms/types";

/** Plain, client-safe shape of a published episode. */
export function toRadioEpisode(e: CmsEpisode): RadioEpisode {
  return {
    id: e.id,
    title: e.title,
    audio: e.audio,
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
