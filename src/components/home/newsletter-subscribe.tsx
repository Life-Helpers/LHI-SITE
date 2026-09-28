"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useNewsletterSignup } from "@/components/news/use-newsletter";
import { useLocale } from "@/i18n/locale-context";

export function NewsletterSubscribe() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const { status, error, subscribe } = useNewsletterSignup("home");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await subscribe(email)) setEmail("");
  }

  return (
    <section aria-labelledby="newsletter-heading" className="relative isolate overflow-hidden border-t border-border/60 py-16 sm:py-24">
      {/* Colour behind the frosted glass */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fff4ee] via-background to-[#fdecef] dark:from-[#1a0d0e] dark:via-background dark:to-[#1d1208]" />
      <div aria-hidden="true" className="absolute -left-20 top-6 -z-10 h-72 w-72 rounded-full bg-primary/40 blur-[90px] motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
      <div aria-hidden="true" className="absolute right-0 top-1/3 -z-10 h-64 w-64 rounded-full bg-accent/40 blur-[90px]" />
      <div aria-hidden="true" className="absolute bottom-0 left-1/3 -z-10 h-56 w-56 rounded-full bg-[#f5a524]/35 blur-[90px]" />

      <ScrollReveal>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/35 p-8 shadow-[0_30px_80px_-30px_rgba(120,20,20,0.35)] backdrop-blur-2xl sm:p-12 dark:border-white/10 dark:bg-white/[0.06]">
            {/* Glass sheen */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.07]" />
            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/60 text-primary shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10">
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 id="newsletter-heading" className="mt-5 font-serif-display text-3xl font-light text-foreground sm:text-5xl">
                  {t.home.newsletter.heading}
                </h2>
                <p className="mt-3 max-w-xl text-muted-foreground">{t.home.newsletter.body}</p>
              </div>

              <div>
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full flex-col gap-2 rounded-3xl border border-white/70 bg-white/50 p-2 shadow-inner backdrop-blur-xl sm:flex-row sm:rounded-full dark:border-white/15 dark:bg-white/10"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    {t.home.newsletter.placeholder}
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t.home.newsletter.placeholder}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 border-0 bg-transparent px-5 shadow-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:rounded-full"
                  />
                  <Button type="submit" className="h-12 shrink-0 rounded-full px-7" disabled={status === "loading"}>
                    {t.home.newsletter.subscribeCta}
                  </Button>
                </form>
                <p role="status" aria-live="polite" className="mt-3 min-h-5 px-2 text-sm">
                  {status === "done" && <span className="text-primary">Thank you, you are subscribed to LHI news updates.</span>}
                  {status === "error" && <span className="text-destructive">{error}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
