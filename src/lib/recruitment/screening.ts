import type { Screening } from "@/lib/cms/schema";

const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whether `text` mentions `term` as a whole word or phrase, ignoring case, accents and extra spaces. */
function mentions(text: string, term: string): boolean {
  const words = fold(term).trim().split(/\s+/).filter(Boolean).map(escape);
  if (!words.length) return false;
  // Letters/digits on either side would make it part of another word ("Excel" in "excellent").
  return new RegExp(`(?<![\\p{L}\\p{N}])${words.join("[\\s\\-_/]+")}(?![\\p{L}\\p{N}])`, "u").test(text);
}

/**
 * Score a CV against a vacancy's keywords. Each keyword line counts once; alternatives on one
 * line ("M&E / MEAL") count when any of them is mentioned. The score is the share matched, 0–100.
 */
export function screenCv(text: string, keywords: readonly string[], at = new Date().toISOString()): Screening {
  const lines = keywords.map((k) => k.trim()).filter(Boolean);
  const folded = fold(text);
  const matched: string[] = [];
  const missing: string[] = [];
  for (const line of lines) (line.split(/\s+\/\s+/).some((alt) => mentions(folded, alt)) ? matched : missing).push(line);
  const readable = text.trim().length >= 50;
  return { score: lines.length && readable ? Math.round((100 * matched.length) / lines.length) : 0, matched, missing, readable, at };
}
