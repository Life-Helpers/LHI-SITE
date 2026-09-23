"use client";

import { Field, FileField, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/forms/form-bits";
import { fieldClass, labelClass, useMultipartSubmit } from "@/components/forms/use-multipart-submit";
import { Turnstile } from "@/components/forms/turnstile";

const CATEGORIES = [
  "Food & agricultural inputs",
  "Non-food items & dignity kits",
  "Medical & nutrition supplies",
  "Education & learning materials",
  "Construction & works",
  "Solar & energy",
  "ICT equipment & services",
  "Vehicles, transport & logistics",
  "Printing & branding",
  "Hotels, venues & catering",
  "Consultancy & research",
  "Security services",
];

export function VendorRegistrationForm() {
  const { status, error, onSubmit } = useMultipartSubmit("/api/procurement/register");

  if (status === "done") {
    return (
      <FormSuccess title="Registration received">
        Thank you. LHI&apos;s procurement team reviews vendor registrations and will contact you when a matching request is published.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <Honeypot />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Company name (as registered)" name="company" required autoComplete="organization" />
        <Field label="CAC registration number" name="cac" />
        <Field label="Tax identification number (TIN)" name="tin" />
        <Field label="Contact person" name="name" required autoComplete="name" />
        <Field label="Email address" name="email" type="email" required autoComplete="email" />
        <Field label="Phone number" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Business address" name="address" className="sm:col-span-2" autoComplete="street-address" />
        <Field label="States you can supply to" name="states" className="sm:col-span-2" placeholder="e.g. Sokoto, Kebbi, Zamfara" />
      </div>
      <fieldset>
        <legend className={labelClass}>
          Supply categories<span className="text-primary"> *</span>
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:border-primary/50">
              <input type="checkbox" name="categories" value={c} className="h-4 w-4 accent-[var(--primary)]" />
              {c}
            </label>
          ))}
        </div>
      </fieldset>
      <label className={labelClass}>
        Brief company description
        <textarea name="description" rows={4} className={fieldClass} placeholder="Products and services, years in business, notable clients…" />
      </label>
      <FileField label="Company profile" name="profile" help="Optional. PDF or Word, maximum 5 MB." />
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="declaration" value="yes" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span>
          We confirm the information is accurate and agree to uphold LHI&apos;s safeguarding standards and anti-fraud and anti-corruption requirements
          in any business with LHI.
        </span>
      </label>
      <FormError message={error} />
      <Turnstile />
      <SubmitButton loading={status === "loading"}>Register as a vendor</SubmitButton>
    </form>
  );
}
