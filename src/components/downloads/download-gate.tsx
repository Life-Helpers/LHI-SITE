"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, FileText, Loader2, X } from "lucide-react";

import { useNewsletterSignup } from "@/components/news/use-newsletter";
import { isSubscriber } from "@/lib/subscriber";

const GATED_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i;

type Pending = { href: string; download: string | null; newTab: boolean; label: string };

/** Links that should be gated: documents (annual report, magazines, job ads, vendor request packs). */
function gatedAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  const a = (target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || a.dataset.gate === "off") return null;
  let url: URL;
  try {
    url = new URL(a.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return null;
  return a.dataset.gate === "on" || GATED_EXT.test(url.pathname) ? a : null;
}

function fileLabel(a: HTMLAnchorElement) {
  const text = a.textContent?.replace(/\s+/g, " ").trim();
  const name = decodeURIComponent(new URL(a.href).pathname.split("/").pop() ?? "document");
  return a.dataset.title || (text && text.length > 3 && !/^(pdf|download)$/i.test(text) ? text : name);
}

function startDownload({ href, download, newTab }: Pending) {
  const a = document.createElement("a");
  a.href = href;
  a.dataset.gate = "off";
  if (download !== null) a.download = download;
  if (newTab) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Site-wide gate: the first time a visitor downloads a document, ask them to subscribe
 * to LHI news. Subscribers (remembered in this browser) download straight away.
 * Add data-gate="on" to force gating on any link, or data-gate="off" to skip it.
 */
export function DownloadGate() {
  const pathname = usePathname();
  const [pending, setPending] = useState<Pending | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { status, error, subscribe } = useNewsletterSignup("download");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = gatedAnchor(e.target);
      if (!a || isSubscriber()) return;
      e.preventDefault();
      setPending({ href: a.href, download: a.getAttribute("download"), newTab: a.target === "_blank", label: fileLabel(a) });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  const close = useCallback(() => setPending(null), []);

  useEffect(() => {
    if (!pending) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [pending, close]);

  if (!pending) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    if (await subscribe(email, name || undefined)) {
      startDownload(pending);
      window.setTimeout(close, 1500);
    }
  }

  const input =
    "w-full rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-gate-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </span>
        <h2 id="download-gate-title" className="mt-4 font-serif-display text-2xl font-light text-foreground">
          Subscribe to download
        </h2>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{pending.label}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to get this document and receive LHI news, magazines and reports. You only need to do this once.
        </p>
        {status === "done" ? (
          <p role="status" className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
            Thank you for subscribing! Your download is starting…
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <label className="block">
              <span className="sr-only">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" autoComplete="name" maxLength={80} className={input} />
            </label>
            <label className="block">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className={input}
              />
            </label>
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Subscribe &amp; download
            </button>
            <p className="text-center text-[11px] text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
          </form>
        )}
      </div>
    </div>
  );
}
