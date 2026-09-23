"use client";

import { useState, type FormEvent } from "react";

/** Posts a form (including file inputs) as multipart data and tracks the result. */
export function useMultipartSubmit(url: string) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(url, { method: "POST", body: new FormData(event.currentTarget) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return { status, error, onSubmit };
}

export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";
export const labelClass = "block text-sm font-medium text-foreground";
