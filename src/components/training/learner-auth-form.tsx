"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { rememberSubscriber } from "@/lib/subscriber";

const input =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

export function LearnerAuthForm({ next, initialMode }: { next: string; initialMode: "login" | "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/training/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "signup" ? { mode, name, email, organization, password, newsletter } : { mode, email, password }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok) {
      setError(data?.error || "Something went wrong. Please try again.");
      setPending(false);
      return;
    }
    if (mode === "signup" && newsletter) rememberSubscriber(email);
    window.location.assign(next);
  }

  const tab = (m: "login" | "signup", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => {
        setMode(m);
        setError("");
      }}
      className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div role="tablist" aria-label="Account" className="flex gap-1 rounded-full bg-muted p-1">
        {tab("signup", "Create account")}
        {tab("login", "Sign in")}
      </div>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <label className="block text-sm font-medium text-foreground">
            Full name
            <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} className={input} placeholder="As it should appear on your certificate" />
          </label>
        )}
        <label className="block text-sm font-medium text-foreground">
          Email address
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={input} />
        </label>
        {mode === "signup" && (
          <label className="block text-sm font-medium text-foreground">
            Organisation <span className="font-normal text-muted-foreground">(optional)</span>
            <input value={organization} onChange={(e) => setOrganization(e.target.value)} autoComplete="organization" maxLength={120} className={input} />
          </label>
        )}
        <div>
          <label htmlFor="learner-password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="learner-password"
              required
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={mode === "signup" ? 8 : 1}
              aria-describedby={mode === "signup" ? "learner-password-help" : undefined}
              className={`${input} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mode === "signup" && (
            <p id="learner-password-help" className="mt-1 text-xs text-muted-foreground">
              At least 8 characters.
            </p>
          )}
        </div>
        {mode === "signup" && (
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            Send me LHI news, magazines and new courses by email.
          </label>
        )}
        {error && (
          <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account & start learning" : "Sign in"}
        </button>
        {mode === "login" && (
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/get-involved/training/forgot" className="font-medium text-primary hover:underline">
              Forgot your password?
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
