/** Small presentational pieces shared by the HR portal pages. */

export const inputClass =
  "mt-1 block w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-muted focus:border-admin-primary focus:ring-3 focus:ring-admin-primary/20";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block text-sm font-medium text-admin-text">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-admin-muted">{hint}</span>}
    </label>
  );
}

export function Card({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-card p-5 shadow-sm sm:p-6">
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-base font-semibold text-admin-text">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-admin-text">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-admin-muted">{subtitle}</p>}
    </div>
  );
}

export function Notice({ tone = "warning", children }: { tone?: "warning" | "danger" | "success"; children: React.ReactNode }) {
  const tones = {
    warning: "bg-admin-warning-soft text-admin-warning",
    danger: "bg-admin-danger-soft text-admin-danger",
    success: "bg-admin-success-soft text-admin-success",
  } as const;
  return (
    <p role={tone === "danger" ? "alert" : "status"} className={`mb-5 rounded-lg px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-admin-border bg-admin-card p-4">
      <p className="text-2xl font-bold text-admin-text">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-admin-muted">{label}</p>
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  pending: "bg-admin-warning-soft text-admin-warning",
  approved: "bg-admin-success-soft text-admin-success",
  active: "bg-admin-success-soft text-admin-success",
  rejected: "bg-admin-danger-soft text-admin-danger",
  inactive: "bg-admin-danger-soft text-admin-danger",
  left: "bg-admin-danger-soft text-admin-danger",
  cancelled: "bg-admin-bg text-admin-muted",
  invited: "bg-admin-primary-soft text-admin-primary",
};

export function Badge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_TONE[status] ?? "bg-admin-bg text-admin-muted"}`}>
      {label ?? status}
    </span>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: string | false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-admin-border text-xs uppercase tracking-wider text-admin-muted">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border">{children}</tbody>
      </table>
      {empty && <p className="px-3 py-6 text-center text-sm text-admin-muted">{empty}</p>}
    </div>
  );
}

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }) : "—";

export const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }) : "—";
