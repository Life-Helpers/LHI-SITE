import { en } from "@/i18n/en";
import { fr } from "@/i18n/fr";
import { ha } from "@/i18n/ha";
import { yo } from "@/i18n/yo";
import { ig } from "@/i18n/ig";
import type { Dictionary, Locale } from "@/i18n/types";

export const dictionaries: Record<Locale, Dictionary> = { en, fr, ha, yo, ig };

export const localeMeta: Record<Locale, { label: string; nativeLabel: string }> = {
  en: { label: "English", nativeLabel: "English" },
  fr: { label: "French", nativeLabel: "Français" },
  ha: { label: "Hausa", nativeLabel: "Hausa" },
  yo: { label: "Yoruba", nativeLabel: "Yorùbá" },
  ig: { label: "Igbo", nativeLabel: "Igbo" },
};

export const locales = Object.keys(dictionaries) as Locale[];

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const candidates = navigator.languages ?? [navigator.language];
  for (const candidate of candidates) {
    const code = candidate.toLowerCase().split("-")[0];
    if ((locales as string[]).includes(code)) return code as Locale;
  }
  return "en";
}

export type { Dictionary, Locale };
