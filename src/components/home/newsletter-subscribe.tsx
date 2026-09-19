"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Newsletter signup");
    const body = encodeURIComponent(
      `Please add this address to the LHI newsletter list: ${email}`,
    );
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-t border-border"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
        <h2 id="newsletter-heading" className="text-2xl font-bold tracking-tight">
          Subscribe to our Newsletter
        </h2>
        <p className="max-w-xl text-muted-foreground">
          There&apos;s no automated mailing list connected yet — submitting
          this form opens your email client so we can add you manually.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" className="shrink-0">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
