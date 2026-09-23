"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary";
const buttonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60";

async function post(body: unknown) {
  const res = await fetch("/api/training/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
}

function ErrorText({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {error}
    </p>
  ) : null;
}

export function LearnerForgotForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <div role="status" className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-foreground">
        <CheckCircle2 className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
        If an account exists for <strong>{email}</strong>, we&apos;ve sent it a link to reset your password. The link expires in one hour.
      </div>
    );
  }
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        try {
          await post({ mode: "request", email });
          setDone(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="block text-sm font-medium text-foreground">
        Account email
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </label>
      <ErrorText error={error} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send reset link
      </button>
    </form>
  );
}

export function LearnerResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        This link is incomplete. <Link href="/get-involved/training/forgot" className="font-medium text-primary hover:underline">Request a new reset link</Link>.
      </p>
    );
  }
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password !== confirm) return setError("The two passwords don't match.");
        setPending(true);
        setError("");
        try {
          await post({ mode: "reset", token, password });
          router.push("/get-involved/training");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
          setPending(false);
        }
      }}
    >
      <label className="block text-sm font-medium text-foreground">
        New password
        <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-foreground">
        Confirm new password
        <input type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
      </label>
      <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      <ErrorText error={error} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save new password
      </button>
    </form>
  );
}
