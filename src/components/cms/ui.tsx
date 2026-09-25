import Link from "next/link";

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs text-admin-muted">
            {breadcrumbs.map((b, i) => (
              <span key={b.label} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-admin-primary">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-admin-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`rounded-xl border border-admin-border bg-admin-card shadow-[0_1px_2px_rgba(20,24,36,0.04)] ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-admin-border px-5 py-3.5">
          <h2 className="text-sm font-bold">{title}</h2>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

const TONES = {
  neutral: "bg-admin-bg text-admin-muted",
  primary: "bg-admin-primary-soft text-admin-primary",
  success: "bg-admin-success-soft text-admin-success",
  warning: "bg-admin-warning-soft text-admin-warning",
  danger: "bg-admin-danger-soft text-admin-danger",
} as const;

export type Tone = keyof typeof TONES;

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(value: unknown): Tone {
  if (String(value).toLowerCase().startsWith("scheduled")) return "primary";
  switch (String(value).toLowerCase()) {
    case "published":
    case "active":
    case "true":
      return "success";
    case "draft":
    case "new":
      return "warning";
    case "multi-year":
    case "review":
      return "primary";
    case "archived":
    case "false":
      return "neutral";
    default:
      return "neutral";
  }
}

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-card px-4 py-2 text-sm font-semibold text-admin-text hover:bg-admin-bg disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-admin-danger hover:bg-admin-danger-soft disabled:opacity-60",
};

export const inputClass =
  "block w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-muted focus:border-admin-primary focus:ring-3 focus:ring-admin-primary/15 aria-invalid:border-admin-danger";

export function formatDate(value: string | undefined, withTime = false) {
  if (!value) return "—";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
