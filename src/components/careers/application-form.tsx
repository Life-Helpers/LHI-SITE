"use client";

import { Field, FileField, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/forms/form-bits";
import { fieldClass, labelClass, useMultipartSubmit } from "@/components/forms/use-multipart-submit";

export function ApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const { status, error, onSubmit } = useMultipartSubmit("/api/careers/apply");

  if (status === "done") {
    return (
      <FormSuccess title="Application received">
        Thank you for applying for <strong className="text-foreground">{jobTitle}</strong>. Only shortlisted candidates will be contacted.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5" encType="multipart/form-data">
      <input type="hidden" name="jobId" value={jobId} />
      <Honeypot />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required autoComplete="name" />
        <Field label="Email address" name="email" type="email" required autoComplete="email" />
        <Field label="Phone number" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Current location (state)" name="location" />
        <label className={labelClass}>
          Years of relevant experience
          <select name="experience" className={fieldClass} defaultValue="">
            <option value="" disabled>Select…</option>
            <option>Less than 1</option>
            <option>1–2</option>
            <option>3–5</option>
            <option>6–10</option>
            <option>More than 10</option>
          </select>
        </label>
        <Field label="Highest qualification" name="qualification" placeholder="e.g. B.Sc. Public Health" />
      </div>
      <label className={labelClass}>
        Cover letter
        <textarea name="coverLetter" rows={6} className={fieldClass} placeholder="Why are you a good fit for this role?" />
      </label>
      <FileField label="CV / résumé" name="cv" required help="PDF or Word document, maximum 5 MB." />
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="safeguarding" value="yes" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span>
          I understand that LHI applies safe recruitment practices, and I consent to reference and background checks. I confirm the information I have
          provided is true.
        </span>
      </label>
      <FormError message={error} />
      <SubmitButton loading={status === "loading"}>Submit application</SubmitButton>
    </form>
  );
}
