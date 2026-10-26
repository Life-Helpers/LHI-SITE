import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { hrefWith } from "@/components/hr/query";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Year arrows and twelve month buttons; the chosen month is highlighted, months with data get a dot. */
export function MonthStrip({ base, params, year, month, marked = [] }: { base: string; params: Record<string, string | undefined>; year: number; month: string | undefined; marked?: string[] }) {
  return (
    <nav aria-label="Pay month" className="hr-card mb-5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-admin-border px-3 py-2">
        <Link href={hrefWith(base, params, { year: year - 1, month: undefined, page: undefined })} aria-label="Previous year" className="rounded-lg p-1.5 hover:bg-admin-bg">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <span className="text-sm font-semibold">{month ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-15T12:00:00Z`)) : year}</span>
        <Link href={hrefWith(base, params, { year: year + 1, month: undefined, page: undefined })} aria-label="Next year" className="rounded-lg p-1.5 hover:bg-admin-bg">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-12">
        {MONTHS.map((label, i) => {
          const ym = `${year}-${String(i + 1).padStart(2, "0")}`;
          const on = ym === month;
          return (
            <Link
              key={ym}
              href={hrefWith(base, params, { year, month: on ? undefined : ym, page: undefined })}
              aria-current={on ? "page" : undefined}
              className={`relative border-admin-border py-2.5 text-center text-xs font-medium [&:not(:first-child)]:border-l ${on ? "bg-admin-primary text-white" : "hover:bg-admin-bg"}`}
            >
              {label}
              {marked.includes(ym) && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${on ? "bg-white" : "bg-admin-primary"}`} aria-hidden="true" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Status tabs with counts (links that keep the other filters). */
export function CountTabs({ base, params, tabs, current, counts, param = "tab" }: { base: string; params: Record<string, string | undefined>; tabs: { id: string; label: string }[]; current: string; counts: Record<string, number>; param?: string }) {
  return (
    <nav aria-label="Status" className="flex gap-1 overflow-x-auto border-t border-admin-border px-2">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={hrefWith(base, params, { [param]: t.id === "all" ? undefined : t.id, page: undefined })}
          aria-current={current === t.id ? "page" : undefined}
          className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${current === t.id ? "border-admin-primary text-admin-primary" : "border-transparent text-admin-muted hover:text-admin-text"}`}
        >
          {t.label}
          <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${current === t.id ? "bg-admin-primary text-white" : "bg-admin-bg text-admin-muted"}`}>{counts[t.id] ?? 0}</span>
        </Link>
      ))}
    </nav>
  );
}
