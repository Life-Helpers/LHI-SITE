"use client";

import { Check, Languages, Loader2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { localeMeta, locales } from "@/i18n";
import { useLocale } from "@/i18n/locale-context";

export function LanguageSwitcher() {
  const { locale, setLocale, t, isTranslating } = useLocale();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t.language.label}
          title={t.language.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:border-accent hover:bg-muted/50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors shrink-0"
        >
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
          ) : (
            <Languages className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent aria-label={t.language.label} className="w-60 p-2 shadow-xl border-border bg-popover/95 backdrop-blur-xl">
        <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1">
          {t.language.label}
        </div>
        <ul className="flex flex-col gap-0.5" role="listbox" aria-label={t.language.label}>
          {locales.map((code) => {
            const isSelected = locale === code;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setLocale(code)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-muted/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    isSelected ? "font-semibold text-primary bg-primary/10" : "text-foreground"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium leading-tight">
                      {localeMeta[code].nativeLabel}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {localeMeta[code].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-muted-foreground uppercase px-1.5 py-0.5 rounded bg-muted/60">
                      {code}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2.5 border-t border-border/60 pt-2 px-1 text-[11px] leading-snug text-muted-foreground">
          {t.language.disclaimer}
        </p>
      </PopoverContent>
    </Popover>
  );
}
