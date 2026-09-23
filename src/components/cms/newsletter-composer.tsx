"use client";

import { useActionState, useRef } from "react";
import { Loader2, Send, TestTube2 } from "lucide-react";

import { sendNewsletterAction } from "@/app/admin/email-actions";
import { buttonClass, inputClass } from "@/components/cms/ui";

export function NewsletterComposer({ subscriberCount, connected }: { subscriberCount: number; connected: boolean }) {
  const [state, action, pending] = useActionState(sendNewsletterAction, null);
  const modeRef = useRef<HTMLInputElement>(null);
  const people = `${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`;

  return (
    <form
      action={action}
      className="space-y-4"
      onSubmit={(e) => {
        const mode = modeRef.current?.value;
        if (mode === "all" && !confirm(`Send this newsletter to ${people}? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input ref={modeRef} type="hidden" name="mode" defaultValue="all" />
      <label className="block text-sm font-medium">
        Subject line
        <input name="subject" required maxLength={200} className={`mt-1.5 ${inputClass}`} placeholder="e.g. LHI Newsletter — October 2026" />
      </label>
      <label className="block text-sm font-medium">
        Heading <span className="font-normal text-admin-muted">(optional, defaults to the subject)</span>
        <input name="heading" maxLength={200} className={`mt-1.5 ${inputClass}`} />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea
          name="body"
          required
          rows={12}
          className={`mt-1.5 ${inputClass}`}
          placeholder={"Write in plain text. Leave a blank line between paragraphs.\nLinks like https://lhinigeria.org/blog become clickable."}
        />
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Button label <span className="font-normal text-admin-muted">(optional)</span>
          <input name="ctaLabel" maxLength={60} className={`mt-1.5 ${inputClass}`} placeholder="Read the stories" />
        </label>
        <label className="block text-sm font-medium">
          Button link
          <input name="ctaUrl" type="url" className={`mt-1.5 ${inputClass}`} placeholder="https://lhinigeria.org/blog" />
        </label>
      </div>
      <p className="text-xs text-admin-muted">Every email includes the LHI header, signature and a personal unsubscribe link.</p>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-admin-danger-soft px-3.5 py-2.5 text-sm text-admin-danger">
          {state.error}
        </p>
      )}
      {state?.ok && state.message && (
        <p role="status" className="rounded-lg bg-admin-success-soft px-3.5 py-2.5 text-sm text-admin-success">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className={buttonClass.secondary} onClick={() => modeRef.current && (modeRef.current.value = "test")}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />} Send me a test
        </button>
        <button
          type="submit"
          disabled={pending || subscriberCount === 0}
          className={buttonClass.primary}
          onClick={() => modeRef.current && (modeRef.current.value = "all")}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {connected ? `Send to ${people}` : `Queue for ${people}`}
        </button>
      </div>
    </form>
  );
}
