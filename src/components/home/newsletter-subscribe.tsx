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
    <section
      aria-labelledby="newsletter-heading"
      className="border-t border-border/60"
    >
      <ScrollReveal>
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="glass-surface flex flex-col items-start gap-4 p-8">
            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2
              id="newsletter-heading"
              className="font-serif-display text-3xl font-light sm:text-4xl"
            >
              {t.home.newsletter.heading}
            </h2>
            <p className="max-w-xl text-muted-foreground">
              {t.home.newsletter.body}
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {t.home.newsletter.placeholder}
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                placeholder={t.home.newsletter.placeholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="bg-background/60"
              />
              <Button type="submit" className="shrink-0" disabled={status === "loading"}>
                {t.home.newsletter.subscribeCta}
              </Button>
            </form>
            <p role="status" aria-live="polite" className="text-sm">
              {status === "done" && <span className="text-primary">Thank you, you are subscribed to LHI news updates.</span>}
              {status === "error" && <span className="text-destructive">{error}</span>}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
