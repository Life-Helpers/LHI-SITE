import { CheckCircle2, Loader2 } from "lucide-react";

import { fieldClass, labelClass } from "@/components/forms/use-multipart-submit";

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={`${labelClass} ${className ?? ""}`}>
      {label}
      {required && <span className="text-primary"> *</span>}
      <input name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} className={fieldClass} />
    </label>
  );
}

export function FileField({ label, name, required, help }: { label: string; name: string; required?: boolean; help: string }) {
  return (
    <label className={labelClass}>
      {label}
      {required && <span className="text-primary"> *</span>}
      <input
        name={name}
        type="file"
        required={required}
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="mt-1.5 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
      />
      <span className="mt-1 block text-xs text-muted-foreground">{help}</span>
    </label>
  );
}

/** Hidden field bots tend to fill in; submissions that include it are silently dropped. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function FormSuccess({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
      <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground">{title}</h3>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return message ? (
    <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  ) : null;
}
