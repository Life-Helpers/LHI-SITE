"use client";

import { Languages } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { localeMeta, locales } from "@/i18n";
import { useLocale } from "@/i18n/locale-context";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t.language.label}
          className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-foreground hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          {locale.toUpperCase()}
        </button>
      </PopoverTrigger>
      <PopoverContent aria-label={t.language.label} className="w-56">
        <ul className="flex flex-col gap-1" role="listbox" aria-label={t.language.label}>
          {locales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => setLocale(code)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-foreground/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  locale === code ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {localeMeta[code].nativeLabel}
                <span className="text-xs text-muted-foreground">
                  {code.toUpperCase()}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {t.language.disclaimer}
        </p>
      </PopoverContent>
    </Popover>
  );
}
