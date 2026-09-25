"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/locale-context";
import { applyGoogleTranslatePatch } from "@/lib/google-translate-patch";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
            layout?: number;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateBridge() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const scriptLoadedRef = useRef(false);

  // Apply monkey patch to prevent React DOM removal crashes
  useEffect(() => {
    applyGoogleTranslatePatch();
  }, []);

  // Load Google Translate only once a visitor picks another language: English
  // visitors never download it.
  useEffect(() => {
    if (typeof window === "undefined" || locale === "en") return;

    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,fr,ha,yo,ig",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      } catch (err) {
        console.error("Failed to initialize Google Translate element:", err);
      }
    };

    if (!scriptLoadedRef.current && !document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  }, [locale]);

  // Page by page: When pathname changes, re-trigger translation if non-English
  useEffect(() => {
    if (locale === "en") return;

    const timeout = setTimeout(() => {
      try {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (select && select.value !== locale) {
          select.value = locale;
          select.dispatchEvent(new Event("change"));
        } else if (select) {
          select.dispatchEvent(new Event("change"));
        }
      } catch {
        // Silently handle if element not ready yet
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [pathname, locale]);

  return (
    <div
      id="google_translate_element"
      className="hidden"
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}
