"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
let loader: Promise<void> | null = null;

function loadScript() {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
  return loader;
}

/**
 * Cloudflare Turnstile widget. Renders nothing unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * The widget adds a hidden `cf-turnstile-response` input to the surrounding form.
 */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let id: string | undefined;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (!cancelled && ref.current && window.turnstile) id = window.turnstile.render(ref.current, { sitekey: SITE_KEY, theme: "auto" });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, []);
  if (!SITE_KEY) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}

/** Header carrying the Turnstile token for forms that post JSON. */
export function turnstileHeaders(form: HTMLFormElement | null): Record<string, string> {
  const token = form?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value;
  return token ? { "x-turnstile-token": token } : {};
}
