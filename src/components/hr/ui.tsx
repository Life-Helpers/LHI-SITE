/** Presentational pieces shared by the HR portal pages (server-safe, no hooks). */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const inputClass =
  "mt-1 block w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text outline-none placeholder:text-admin-muted focus:border-admin-primary focus:ring-3 focus:ring-admin-primary/20";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90";

export const outlineButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-card px-4 py-2 text-sm font-semibold text-admin-text hover:bg-admin-bg";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block text-sm font-medium text-admin-text">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-admin-muted">{hint}</span>}
    </label>
  );
}

export function Card({
  title,
  subtitle,
  children,
  actions,
  flush = false,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  /** No inner padding (for tables that run edge to edge). */
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={`hr-card overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border px-5 py-4">
          <div>
            {title && <h2 className="text-base font-semibold text-admin-text">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-admin-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-admin-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-admin-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Notice({ tone = "warning", children }: { tone?: "warning" | "danger" | "success"; children: React.ReactNode }) {
  const tones = {
    warning: "border-admin-warning/30 bg-admin-warning-soft text-admin-warning",
    danger: "border-admin-danger/30 bg-admin-danger-soft text-admin-danger",
    success: "border-admin-success/30 bg-admin-success-soft text-admin-success",
  } as const;
  return (
    <p role={tone === "danger" ? "alert" : "status"} className={`mb-5 rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </p>
  );
}

/** Tints for dashboard stat cards. Literal class names so Tailwind generates them. */
const TINTS = {
  teal: { card: "border-teal-200 bg-teal-50/70 dark:border-teal-500/30 dark:bg-teal-500/10", chip: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300", text: "text-teal-700 dark:text-teal-300" },
  blue: { card: "border-blue-200 bg-blue-50/70 dark:border-blue-500/30 dark:bg-blue-500/10", chip: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300", text: "text-blue-700 dark:text-blue-300" },
  green: { card: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10", chip: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300", text: "text-emerald-700 dark:text-emerald-300" },
  violet: { card: "border-violet-200 bg-violet-50/70 dark:border-violet-500/30 dark:bg-violet-500/10", chip: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300", text: "text-violet-700 dark:text-violet-300" },
  amber: { card: "border-amber-200 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-500/10", chip: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300", text: "text-amber-700 dark:text-amber-300" },
  orange: { card: "border-orange-200 bg-orange-50/70 dark:border-orange-500/30 dark:bg-orange-500/10", chip: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300", text: "text-orange-700 dark:text-orange-300" },
  rose: { card: "border-rose-200 bg-rose-50/70 dark:border-rose-500/30 dark:bg-rose-500/10", chip: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300", text: "text-rose-700 dark:text-rose-300" },
} as const;
export type Tint = keyof typeof TINTS;

/** Dashboard stat card: tinted, with an icon chip, the figure and a short note. */
export function TintStat({
  tint,
  icon: Icon,
  label,
  value,
  note,
  href,
  progress,
}: {
  tint: Tint;
  icon: LucideIcon;
  label: string;
  value: string | number;
  note?: string;
  href?: string;
  /** 0–100: draws a bar under the figure. */
  progress?: number;
}) {
  const t = TINTS[tint];
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.chip}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {href && <ArrowUpRight className={`h-4 w-4 opacity-60 ${t.text}`} aria-hidden="true" />}
      </div>
      <p className={`mt-4 text-sm font-medium ${t.text}`}>{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-admin-text">{value}</p>
      {progress !== undefined && (
        <span className={`mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-white/70 dark:bg-white/10 ${t.text}`} aria-hidden="true">
          <span className="block h-full rounded-full bg-current opacity-70" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </span>
      )}
      {note && <p className={`mt-1.5 text-xs ${t.text}`}>{note}</p>}
    </>
  );
  const cls = `block rounded-xl border p-5 transition-shadow ${t.card} ${href ? "hover:shadow-md" : ""}`;
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** Plain stat, used on self-service pages. */
export function Stat({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="hr-card p-5">
      <p className="text-sm text-admin-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-admin-text">{value}</p>
      {note && <p className="mt-1 text-xs text-admin-muted">{note}</p>}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
  active: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
  rejected: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
  inactive: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
  left: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
  cancelled: "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-300",
  probation: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300",
  invited: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300",
};

export function Badge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_TONE[status] ?? "border-admin-border bg-admin-bg text-admin-muted"}`}>
      {label ?? status}
    </span>
  );
}

export function Table({ head, children, empty }: { head: React.ReactNode[]; children: React.ReactNode; empty?: string | false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
            {head.map((h, i) => (
              <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border">{children}</tbody>
      </table>
      {empty && <p className="px-4 py-10 text-center text-sm text-admin-muted">{empty}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- Avatars */

const TONES = ["bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-teal-500", "bg-indigo-500", "bg-orange-500"];

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";

export function toneFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

/** Initials avatar (staff photos aren't stored in the portal). */
export function Avatar({ name, size = "md", square = false }: { name: string; size?: "sm" | "md" | "lg"; square?: boolean }) {
  const dims = { sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" }[size];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center font-bold text-white ${square ? "rounded-xl" : "rounded-full"} ${dims} ${toneFor(name)}`} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}

/** Avatar with name and a second line (email or job title). */
export function Person({ name, sub, href }: { name: string; sub?: string; href?: string }) {
  return (
    <span className="flex items-center gap-3">
      <Avatar name={name} />
      <span className="min-w-0">
        {href ? (
          <Link href={href} className="block truncate font-medium text-admin-text hover:text-admin-primary">
            {name}
          </Link>
        ) : (
          <span className="block truncate font-medium text-admin-text">{name}</span>
        )}
        {sub && <span className="block truncate text-xs text-admin-muted">{sub}</span>}
      </span>
    </span>
  );
}

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }) : "—";

export const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }) : "—";

/** Today in Nigeria (WAT) as YYYY-MM-DD. */
export const todayLagos = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
