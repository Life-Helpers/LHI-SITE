"use client";

import { Field, FileField, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/forms/form-bits";
import { fieldClass, labelClass, useMultipartSubmit } from "@/components/forms/use-multipart-submit";
import { Turnstile } from "@/components/forms/turnstile";

export function BidForm({ tenderId, reference }: { tenderId: string; reference: string }) {
  const { status, error, onSubmit } = useMultipartSubmit("/api/procurement/respond");

  if (status === "done") {
    return (
      <FormSuccess title="Submission received">
        Your response to <strong className="text-foreground">{reference}</strong> has been recorded. LHI&apos;s procurement committee evaluates all
        responses after the deadline.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <input type="hidden" name="tenderId" value={tenderId} />
      <Honeypot />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Company name (as registered)" name="company" required autoComplete="organization" />
        <Field label="CAC registration number" name="cac" />
        <Field label="Contact person" name="name" required autoComplete="name" />
        <Field label="Email address" name="email" type="email" required autoComplete="email" />
        <Field label="Phone number" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Total quoted amount (₦)" name="amount" placeholder="e.g. 4,850,000" />
      </div>
      <label className={labelClass}>
        Notes
        <textarea name="notes" rows={4} className={fieldClass} placeholder="Delivery lead time, validity of quotation, clarifications…" />
      </label>
      <FileField label="Quotation / bid document" name="bid" required help="PDF or Word, maximum 5 MB. Include the documents listed as required." />
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="declaration" value="yes" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span>
          We confirm our submission is genuine, free of collusion, and that we will uphold LHI&apos;s safeguarding standards (zero tolerance for sexual
          exploitation, abuse and harassment) if awarded.
        </span>
      </label>
      <FormError message={error} />
      <Turnstile />
      <SubmitButton loading={status === "loading"}>Submit response</SubmitButton>
    </form>
  );
}
