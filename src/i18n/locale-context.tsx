"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { detectBrowserLocale, dictionaries, type Dictionary, type Locale } from "@/i18n";

const STORAGE_KEY = "lhi-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  isTranslating: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function updateGoogleTranslate(target: Locale) {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const domainPart = isLocalhost ? "" : `; domain=.${hostname.replace(/^www\./, "")}`;

  if (target === "en") {
    // Clear cookies for English
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    if (domainPart) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domainPart};`;
    }
    document.cookie = `googtrans=/en/en; path=/;`;
  } else {
    document.cookie = `googtrans=/en/${target}; path=/;`;
    document.cookie = `googtrans=/en/${target}; path=/; domain=${hostname};`;
    if (domainPart) {
      document.cookie = `googtrans=/en/${target}; path=/; domain=${domainPart};`;
    }
  }

  // Trigger combo box if present
  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (select) {
    select.value = target;
    select.dispatchEvent(new Event("change"));
  } else {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const el = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (el) {
        el.value = target;
        el.dispatchEvent(new Event("change"));
        clearInterval(interval);
      } else if (attempts > 20) {
        clearInterval(interval);
      }
    }, 150);
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing
    }
    const initial =
      stored && stored in dictionaries ? (stored as Locale) : detectBrowserLocale();
    setLocaleState(initial);

    if (initial !== "en") {
      updateGoogleTranslate(initial);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = dictionaries[locale].htmlLang;
  }, [locale]);

  function setLocale(next: Locale) {
    if (next === locale) return;

    setIsTranslating(true);
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable
    }

    updateGoogleTranslate(next);

    const timer = setTimeout(() => {
      setIsTranslating(false);
    }, 600);

    return () => clearTimeout(timer);
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: dictionaries[locale],
        isTranslating,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
