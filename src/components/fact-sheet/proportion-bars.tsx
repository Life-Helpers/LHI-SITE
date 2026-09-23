/**
 * Part-to-whole bars for a fact sheet: one hue, every value labelled, so no legend is needed.
 * Each row is plain text plus a bar, which doubles as the accessible table view.
 */
export function ProportionBars({
  title,
  rows,
  unit = "%",
  note,
}: {
  title: string;
  rows: { label: string; pct: number; value?: number }[];
  unit?: "%" | "count";
  note?: string;
}) {
  const max = unit === "count" ? Math.max(...rows.map((r) => r.value ?? 0)) : 100;
  const total = unit === "count" ? rows.reduce((n, r) => n + (r.value ?? 0), 0) : 0;
  return (
    <figure className="rounded-3xl border border-border bg-card p-6">
      <figcaption className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</figcaption>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const size = unit === "count" ? ((r.value ?? 0) / max) * 100 : r.pct;
          const share = unit === "count" ? Math.round(((r.value ?? 0) / total) * 100) : r.pct;
          const text = unit === "count" ? `${(r.value ?? 0).toLocaleString("en-GB")} (${share}%)` : `${r.value !== undefined ? `${r.value.toLocaleString("en-GB")} · ` : ""}${r.pct}%`;
          return (
            <li key={r.label} title={`${r.label}: ${text}`} className="group">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-foreground/80">{r.label}</span>
                <span className="font-semibold tabular-nums text-foreground">{text}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-muted" aria-hidden="true">
                <div
                  className="h-2 rounded-full bg-primary transition-opacity group-hover:opacity-80"
                  style={{ width: `${Math.max(size, 1.5)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
    </figure>
  );
}

export function StatTile({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <p className="font-serif-display text-4xl font-light tabular-nums text-foreground sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
      {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}
