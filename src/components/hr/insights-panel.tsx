import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck, Info, OctagonAlert, Sparkles } from "lucide-react";

import { byUrgency, type Insight, type InsightTone } from "@/lib/hr/insights";

// Status colours with an icon and a word, never colour alone.
const TONE: Record<InsightTone, { icon: typeof Info; label: string; chip: string }> = {
  critical: { icon: OctagonAlert, label: "Urgent", chip: "bg-admin-danger-soft text-admin-danger" },
  warning: { icon: CircleAlert, label: "Soon", chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  info: { icon: Info, label: "Note", chip: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  good: { icon: CircleCheck, label: "Good", chip: "bg-admin-success-soft text-admin-success" },
};

/** "Needs attention": what to act on, most urgent first, each with a link to where it's done. */
export function InsightsPanel({ items, title = "Needs attention", empty = "Nothing needs your attention right now." }: { items: Insight[]; title?: string; empty?: string }) {
  const sorted = byUrgency(items);
  const urgent = sorted.filter((i) => i.tone === "critical").length;
  return (
    <section aria-labelledby="insights-title" className="hr-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-admin-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-admin-primary-soft text-admin-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="insights-title" className="text-base font-semibold">{title}</h2>
            <p className="text-xs text-admin-muted">
              {sorted.length ? `${sorted.length} item${sorted.length === 1 ? "" : "s"}${urgent ? `, ${urgent} urgent` : ""} · worked out from today's records` : "Worked out from today's records"}
            </p>
          </div>
        </div>
      </div>
      {sorted.length === 0 ? (
        <p className="flex items-center gap-2 px-5 py-6 text-sm text-admin-muted">
          <CircleCheck className="h-5 w-5 text-admin-success" aria-hidden="true" /> {empty}
        </p>
      ) : (
        <ul className="divide-y divide-admin-border">
          {sorted.map((i) => {
            const t = TONE[i.tone];
            const Icon = t.icon;
            return (
              <li key={i.id} className="flex items-start gap-3 px-5 py-3">
                <span className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${t.chip}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.label}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-medium">{i.title}</span>
                  {i.detail && <span className="block text-xs text-admin-muted">{i.detail}</span>}
                </span>
                {i.href && (
                  <Link href={i.href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-admin-primary hover:underline">
                    {i.action ?? "Open"} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
