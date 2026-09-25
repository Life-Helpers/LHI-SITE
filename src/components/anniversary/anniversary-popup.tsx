"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteData } from "@/components/site-data-provider";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, PartyPopper, X } from "lucide-react";

import { firePoppers } from "@/components/anniversary/confetti";
import { useNewsletterSignup } from "@/components/news/use-newsletter";
import { ANNIVERSARY } from "@/config/anniversary";
import { LHI_PHOTOS } from "@/data/lhi-photos";

const STORAGE_KEY = `lhi_anniversary_${ANNIVERSARY.years}`;
const SNOOZE_MS = 3 * 24 * 3600_000;

function lagosToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
}

function daysUntil(date: string) {
  const diff = Date.parse(`${date}T00:00:00+01:00`) - Date.now();
  return Math.ceil(diff / 86_400_000);
}

function readState(): { subscribed?: boolean; dismissedAt?: number } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeState(state: { subscribed?: boolean; dismissedAt?: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the popup simply shows again next visit */
  }
}

export function AnniversaryPopup() {
  const { stats } = useSiteData();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { status, error, subscribe } = useNewsletterSignup(`anniversary-${ANNIVERSARY.years}`);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stopConfetti = useRef<() => void>(() => {});

  useEffect(() => {
    if (!ANNIVERSARY.enabled || pathname?.startsWith("/admin")) return;
    const today = lagosToday();
    if (today < ANNIVERSARY.showFrom || today > ANNIVERSARY.showUntil) return;
    const state = readState();
    if (state.subscribed || (state.dismissedAt && Date.now() - state.dismissedAt < SNOOZE_MS)) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      stopConfetti.current = firePoppers();
    }, 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    stopConfetti.current();
    const state = readState();
    writeState({ ...state, dismissedAt: Date.now() });
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("a, button, input");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  const days = daysUntil(ANNIVERSARY.date);
  const eyebrow =
    days > 1 ? `${days} days to go · 1 October` : days === 1 ? "Tomorrow · 1 October" : days === 0 ? "Today · 1 October" : "Celebrating this October";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (await subscribe(email, name)) {
      writeState({ subscribed: true });
      stopConfetti.current = firePoppers(2200);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="anniversary-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#6b4a1f] md:col-span-2 md:aspect-auto md:min-h-[460px]">
            <Image
              src={LHI_PHOTOS.anniversaryBadge.src}
              alt={`${LHI_PHOTOS.anniversaryBadge.alt}, ${ANNIVERSARY.foundedYear}–${ANNIVERSARY.foundedYear + ANNIVERSARY.years}`}
              fill
              priority
              sizes="(min-width: 768px) 310px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 md:col-span-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <PartyPopper className="h-3.5 w-3.5" /> {eyebrow}
            </p>
            <h2 id="anniversary-title" className="mt-3 font-serif-display text-3xl font-light leading-tight text-foreground sm:text-4xl">
              Celebrating {ANNIVERSARY.years} years of <em className="italic text-primary">touching lives.</em>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Since 1 October {ANNIVERSARY.foundedYear}, Life Helpers Initiative has grown from a small initiative in Sokoto into an organisation working
              across {stats.statesActive.replace(/\+$/, "")} states, with {stats.projects} projects and {stats.peopleReached} people reached. Thank you
              to every community, partner, volunteer and staff member who made it possible.
            </p>

            {status === "done" ? (
              <div role="status" className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-2 font-semibold text-foreground">You&apos;re on the list. Thank you for celebrating with us!</p>
                <button type="button" onClick={close} className="mt-4 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                  Continue to the website
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-foreground">Subscribe to our news updates</p>
                <label className="sr-only" htmlFor="anniv-name">Your name</label>
                <input
                  id="anniv-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  autoComplete="name"
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="anniv-email">Email address</label>
                  <input
                    id="anniv-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  >
                    {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                    Subscribe
                  </button>
                </div>
                {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
                <button type="button" onClick={close} className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline">
                  Maybe later
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
