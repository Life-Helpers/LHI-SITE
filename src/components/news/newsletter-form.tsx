"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { useNewsletterSignup } from "@/components/news/use-newsletter";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { status, error, subscribe } = useNewsletterSignup("news-updates");
  const loading = status === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) await subscribe(email);
  };

  if (status === "done") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-2 text-xs font-semibold text-foreground">
          Subscribed Successfully!
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          We will send LHI news and newsletters to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@domain.org"
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {error && <p role="alert" className="text-[11px] text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <Send className="h-3 w-3" />
            Subscribe Now
          </>
        )}
      </button>
    </form>
  );
}
