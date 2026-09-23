"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

/** Shared newsletter signup: posts to /api/newsletter (stored in the admin Submissions inbox). */
export function useNewsletterSignup(source: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function subscribe(email: string, name?: string) {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not subscribe. Please try again.");
      setStatus("done");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not subscribe. Please try again.");
      setStatus("error");
      return false;
    }
  }

  return { status, error, subscribe };
}
