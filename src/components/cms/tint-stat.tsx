import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

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
