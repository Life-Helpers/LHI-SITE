"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, EyeOff, Loader2 } from "lucide-react";

import { fieldClass, labelClass } from "@/components/forms/use-multipart-submit";
import { FEEDBACK_PROGRAMMES, FEEDBACK_TYPES, RESPONSE_CHANNELS } from "@/data/feedback";
import { Turnstile, turnstileHeaders } from "@/components/forms/turnstile";

const STATES = ["Sokoto", "Kebbi", "Zamfara", "Katsina", "Borno", "Yobe", "Adamawa", "Bauchi", "Plateau", "Ebonyi", "FCT Abuja", "Other"];

const TYPE_HELP: Record<(typeof FEEDBACK_TYPES)[number], string> = {
  Compliment: "Something that went well",
  Suggestion: "An idea to do better",
  Complaint: "Something that went wrong",
  Question: "Something you want to know",
};

export function FeedbackForm() {
  const [type, setType] = useState<(typeof FEEDBACK_TYPES)[number] | "">("");
  const [anonymous, setAnonymous] = useState(false);
  const [channel, setChannel] = useState<(typeof RESPONSE_CHANNELS)[number]>("Email");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  if (status === "done") {
    return (
      <div role="status" className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground">Thank you. Your feedback is logged.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your reference is <span className="font-mono font-semibold text-foreground">{reference}</span>. Keep it if you want to follow up.
          {anonymous ? " Because you chose to stay anonymous, we can't reply to you directly." : " We'll respond through the channel you chose."}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setType("");
          }}
          className="mt-5 text-sm font-semibold text-primary hover:underline"
        >
          Send more feedback
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="relative space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const value = (k: string) => String(f.get(k) ?? "").trim();
        if (!type) return setError("Choose the kind of feedback.");
        setStatus("sending");
        setError("");
        try {
          const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...turnstileHeaders(e.currentTarget) },
            body: JSON.stringify({
              feedbackType: type,
              programme: value("programme") || undefined,
              state: value("state") || undefined,
              message: value("message"),
              anonymous,
              name: anonymous ? undefined : value("name") || undefined,
              email: anonymous ? undefined : value("email") || undefined,
              phone: anonymous ? undefined : value("phone") || undefined,
              responseChannel: anonymous ? undefined : channel,
              consent: f.get("consent") === "on",
              website: value("website"),
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
          setReference(data.reference);
          setStatus("done");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
          setStatus("idle");
        }
      }}
    >
      <fieldset>
        <legend className={labelClass}>
          What kind of feedback is it? <span className="text-primary">*</span>
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEEDBACK_TYPES.map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-2xl border p-3 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                type === t ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <input type="radio" name="feedbackType" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
              <span className="block text-sm font-semibold text-foreground">{t}</span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">{TYPE_HELP[t]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Which programme or service is it about?
          <select name="programme" defaultValue="" className={fieldClass}>
            <option value="">Choose (optional)</option>
            {FEEDBACK_PROGRAMMES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          State
          <select name="state" defaultValue="" className={fieldClass}>
            <option value="">Choose (optional)</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClass}>
        Your message <span className="text-primary">*</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={6}
          className={fieldClass}
          placeholder="Tell us what happened, where and when, and what you would like us to do. You can write in English or Hausa."
        />
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--primary)]" />
        <span>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <EyeOff className="h-4 w-4" aria-hidden="true" /> Send anonymously
          </span>
          <span className="mt-0.5 block text-muted-foreground">We won&apos;t ask for your name or contact details, but we won&apos;t be able to reply to you.</span>
        </span>
      </label>

      {!anonymous && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label className={labelClass}>
              Name
              <input name="name" autoComplete="name" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Email
              <input name="email" type="email" autoComplete="email" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Phone
              <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
            </label>
          </div>
          <fieldset>
            <legend className={labelClass}>How should we reply?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {RESPONSE_CHANNELS.map((c) => (
                <label
                  key={c}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                    channel === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  <input type="radio" name="responseChannel" value={c} checked={channel === c} onChange={() => setChannel(c)} className="sr-only" />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[var(--primary)]" />
        <span>
          I understand LHI will record this feedback and share it only with the staff who need to act on it, as described in the{" "}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Turnstile />

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Send feedback
      </button>
    </form>
  );
}
