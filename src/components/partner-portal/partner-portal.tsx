"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Landmark,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  COMPLIANCE_DOCUMENTS,
  type ComplianceCategory,
  type ComplianceDocument,
} from "@/data/compliance-documents";
import { OPERATIONAL_STATES } from "@/data/operational-states";
import {
  FUNDING_AGENCIES,
  REQUEST_TYPES,
  consortiumEoiSchema,
  type ConsortiumEoiValues,
} from "@/lib/validations/consortium-eoi";

const CATEGORY_ICONS: Record<ComplianceCategory, React.ElementType> = {
  "Registration & tax": Landmark,
  "Financial accountability": FileText,
  "Safeguarding & integrity": ShieldCheck,
};

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive";

export function PartnerPortal() {
  const [result, setResult] = useState<{ reference: string; message: string } | null>(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsortiumEoiValues>({
    resolver: zodResolver(consortiumEoiSchema),
    defaultValues: {
      requestType: "Consortium partnership",
      agency: "European Union",
      states: [],
      documents: [],
    },
  });

  const requestDocument = (doc: ComplianceDocument) => {
    setValue("requestType", "Due-diligence document request");
    const current = getValues("documents") ?? [];
    if (!current.includes(doc.title)) setValue("documents", [...current, doc.title]);
    document.getElementById("eoi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = async (values: ConsortiumEoiValues) => {
    setServerError("");
    try {
      const res = await fetch("/api/consortium-eoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed. Please try again.");
      setResult({ reference: data.reference, message: data.message });
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  const categories = Array.from(new Set(COMPLIANCE_DOCUMENTS.map((d) => d.category)));

  return (
    <>
      {/* Compliance library */}
      <section aria-labelledby="documents-heading" className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Due diligence</p>
          <h2 id="documents-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Compliance &amp; accountability library
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Everything a lead applicant or institutional donor needs for pre-award assessment. Documents that are not
            yet posted publicly are shared on request within 48 working hours.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <div key={category} className="rounded-3xl border border-border bg-card p-6">
                  <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" /> {category}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {COMPLIANCE_DOCUMENTS.filter((d) => d.category === category).map((doc) => (
                      <li key={doc.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                        <p className="text-sm font-medium text-foreground">{doc.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{doc.description}</p>
                        <div className="mt-2">
                          {doc.file ? (
                            <a
                              href={doc.file}
                              download
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </a>
                          ) : doc.href ? (
                            <Link
                              href={doc.href}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              View reports <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => requestDocument(doc)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              <FileCheck2 className="h-3.5 w-3.5" /> Request a certified copy
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EOI intake form */}
      <section id="eoi" aria-labelledby="eoi-heading" className="scroll-mt-24 border-t border-border bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Expedited intake</p>
            <h2 id="eoi-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground">
              Request consortium partnership or submit an RFP expression of interest
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bid deadlines are tight. Share the opportunity and we will confirm capacity, geographic fit and a focal
              person within 48 working hours.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground">
              {[
                "Field presence across 11 northern states",
                "Offices in Sokoto, Zamfara, Kebbi, Borno, Yobe, Adamawa, Bauchi and Abuja",
                "Track record with UN, EU, USAID and German cooperation partners",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8">
            {result ? (
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center" role="status">
                <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground">Submission received</h3>
                <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Reference: <span className="font-mono text-foreground">{result.reference}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="mt-6 rounded-full border border-border bg-card px-5 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Request type" error={errors.requestType?.message} htmlFor="requestType">
                    <select id="requestType" className={selectClass} {...register("requestType")}>
                      {REQUEST_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Funding agency / lead" error={errors.agency?.message} htmlFor="agency">
                    <select id="agency" className={selectClass} {...register("agency")}>
                      {FUNDING_AGENCIES.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Organization" error={errors.organization?.message} htmlFor="organization">
                    <Input id="organization" aria-invalid={!!errors.organization} {...register("organization")} />
                  </Field>
                  <Field label="Contact person" error={errors.contactName?.message} htmlFor="contactName">
                    <Input id="contactName" autoComplete="name" aria-invalid={!!errors.contactName} {...register("contactName")} />
                  </Field>
                  <Field label="Work email" error={errors.email?.message} htmlFor="email">
                    <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                  </Field>
                  <Field label="Phone (optional)" error={errors.phone?.message} htmlFor="phone">
                    <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
                  </Field>
                  <Field label="RFP / opportunity reference (optional)" error={errors.opportunityRef?.message} htmlFor="opportunityRef">
                    <Input id="opportunityRef" {...register("opportunityRef")} />
                  </Field>
                  <Field label="Submission deadline (optional)" error={errors.deadline?.message} htmlFor="deadline">
                    <Input id="deadline" type="date" {...register("deadline")} />
                  </Field>
                </div>

                <fieldset>
                  <legend className="text-sm font-medium text-foreground">Target states</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {OPERATIONAL_STATES.map((s) => (
                      <label
                        key={s.id}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                      >
                        <input type="checkbox" value={s.id} className="accent-primary" {...register("states")} />
                        {s.name}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-sm font-medium text-foreground">Documents requested (optional)</legend>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {COMPLIANCE_DOCUMENTS.filter((d) => !d.href).map((d) => (
                      <label key={d.id} className="inline-flex items-center gap-2 text-xs text-foreground">
                        <input type="checkbox" value={d.title} className="accent-primary" {...register("documents")} />
                        {d.title}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field label="Opportunity details" error={errors.message?.message} htmlFor="message">
                  <Textarea
                    id="message"
                    rows={5}
                    aria-invalid={!!errors.message}
                    placeholder="Scope, sectors, expected LHI role, budget range and timelines"
                    {...register("message")}
                  />
                </Field>

                {serverError && (
                  <p role="alert" className="text-sm text-destructive">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit to partnerships team
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
