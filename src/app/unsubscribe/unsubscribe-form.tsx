"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

import { unsubscribeAction } from "./actions";

export function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [state, action, pending] = useActionState(unsubscribeAction, null);
  if (state?.done) {
    return (
      <div role="status" className="space-y-3">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
        <p className="text-foreground">
          <strong>{email}</strong> has been unsubscribed. You won&apos;t receive any more newsletters from us.
        </p>
        <p className="text-sm text-muted-foreground">
          Changed your mind? You can subscribe again at the bottom of any page. <Link href="/" className="text-primary hover:underline">Go to the homepage</Link>
        </p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="e" value={email} />
      <input type="hidden" name="t" value={token} />
      <p className="text-foreground">
        Stop sending newsletters to <strong>{email}</strong>?
      </p>
      {state?.error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Unsubscribe
      </button>
    </form>
  );
}
