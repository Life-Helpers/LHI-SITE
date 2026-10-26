"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Small chart kit for the HR portal dashboards. Colours come from the --viz-* tokens in
 * globals.css (a colour-blind-checked palette, with its own dark-mode steps). Every chart has a
 * hover tooltip and a "Show as table" view, so no figure depends on colour alone.
 */

/** `slot` pins a colour to the entity (e.g. a leave type) so filtering never repaints it. */
export type Series = { name: string; values: number[]; slot?: number };

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
export const vizColor = (slot: number) => (slot < 0 || slot > 7 ? "var(--viz-other)" : `var(--viz-${slot + 1})`);

/** A rounded-up maximum split into three whole-number steps (1, 2 or 5 × 10ⁿ each). */
function niceMax(max: number) {
  const raw = Math.max(1, Math.ceil(max / 3));
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const unit = [1, 2, 5, 10].map((m) => m * p).find((u) => u >= raw) ?? 10 * p;
  return unit * 3;
}

function TableView({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-3 text-xs">
      <summary className="cursor-pointer font-medium text-admin-muted hover:text-admin-text">Show as table</summary>
      <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-admin-border">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-admin-bg text-admin-muted">
            <tr>
              {head.map((h, i) => (
                <th key={h} scope="col" className={`px-3 py-1.5 font-semibold ${i ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {rows.map((r) => (
              <tr key={String(r[0])}>
                {r.map((c, i) => (
                  <td key={i} className={`px-3 py-1.5 ${i ? "text-right tabular-nums" : ""}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/**
 * Columns over time. One series is a plain column chart; several are stacked (with a legend,
 * a 2px gap between segments, and the hovered month's breakdown in the tooltip).
 */
export function ColumnChart({ labels, fullLabels, series, unit, height = 180 }: { labels: string[]; fullLabels?: string[]; series: Series[]; unit: string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  // Draw at the card's real width so text stays a readable size in narrow cards.
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(600);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(200, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const totals = labels.map((_, i) => series.reduce((n, s) => n + (s.values[i] ?? 0), 0));
  const max = niceMax(Math.max(0, ...totals));
  const padL = 28;
  const padB = 22;
  const plotH = height - padB - 8;
  const slot = (W - padL) / Math.max(1, labels.length);
  const barW = Math.min(28, slot * 0.6);
  const y = (v: number) => 8 + plotH - (v / max) * plotH;
  const stacked = series.length > 1;
  // Keep the tooltip inside the card near either edge.
  const tipX = hover === null ? 0 : (padL + slot * (hover + 0.5)) / W;
  const tipAt = hover === null ? null : { left: `${tipX * 100}%`, transform: `translateX(${tipX < 0.2 ? "0" : tipX > 0.8 ? "-100%" : "-50%"})` };
  // Thin out month labels when they would collide.
  const every = slot < 34 ? Math.ceil(34 / slot) : 1;

  return (
    <div>
      {stacked && (
        <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-admin-muted" aria-label="Legend">
          {series.map((s, i) => (
            <li key={s.name} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: vizColor(s.slot ?? i) }} aria-hidden="true" />
              {s.name}
            </li>
          ))}
        </ul>
      )}
      <div className="relative" ref={box}>
        <svg viewBox={`0 0 ${W} ${height}`} className="block h-auto w-full" role="img" aria-label={`${series.map((s) => s.name).join(", ")} by month`} onMouseLeave={() => setHover(null)}>
          {[0, 1 / 3, 2 / 3, 1].map((f) => (
            <g key={f}>
              <line x1={padL} x2={W} y1={y(max * f)} y2={y(max * f)} stroke="var(--viz-grid)" strokeWidth={1} />
              <text x={padL - 6} y={y(max * f) + 3} textAnchor="end" fontSize={10} fill="var(--a-muted)">
                {fmt(max * f)}
              </text>
            </g>
          ))}
          {labels.map((label, i) => {
            const cx = padL + slot * (i + 0.5);
            let base = 0;
            return (
              <g key={label + i}>
                {hover === i && <rect x={cx - slot / 2} y={8} width={slot} height={plotH} fill="var(--viz-grid)" opacity={0.5} />}
                {series.map((s, si) => {
                  const v = s.values[i] ?? 0;
                  if (v <= 0) return null;
                  const top = y(base + v);
                  const h = y(base) - top - (stacked && base > 0 ? 2 : 0);
                  base += v;
                  const isTop = series.slice(si + 1).every((later) => (later.values[i] ?? 0) <= 0);
                  return (
                    <path
                      key={s.name}
                      d={isTop && h > 4 ? `M${cx - barW / 2},${top + h} V${top + 4} Q${cx - barW / 2},${top} ${cx - barW / 2 + 4},${top} H${cx + barW / 2 - 4} Q${cx + barW / 2},${top} ${cx + barW / 2},${top + 4} V${top + h} Z` : `M${cx - barW / 2},${top + Math.max(h, 1)} V${top} H${cx + barW / 2} V${top + Math.max(h, 1)} Z`}
                      fill={vizColor(s.slot ?? si)}
                    />
                  );
                })}
                {(i % every === 0 || i === labels.length - 1) && (
                  <text x={cx} y={height - 6} textAnchor="middle" fontSize={10} fill="var(--a-muted)">
                    {label}
                  </text>
                )}
                <rect x={cx - slot / 2} y={0} width={slot} height={height} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={0} aria-label={`${fullLabels?.[i] ?? label}: ${fmt(totals[i])} ${unit}`} />
              </g>
            );
          })}
          <line x1={padL} x2={W} y1={y(0)} y2={y(0)} stroke="var(--a-border)" strokeWidth={1} />
        </svg>
        {hover !== null && tipAt && (
          <div className="pointer-events-none absolute top-0 z-10 min-w-36 rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-xs shadow-lg" style={tipAt}>
            <p className="font-semibold">{fullLabels?.[hover] ?? labels[hover]}</p>
            {stacked &&
              series
                .filter((s) => (s.values[hover] ?? 0) > 0)
                .map((s) => (
                  <p key={s.name} className="mt-0.5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm" style={{ background: vizColor(s.slot ?? series.indexOf(s)) }} aria-hidden="true" />
                      {s.name}
                    </span>
                    <span className="tabular-nums">{fmt(s.values[hover])}</span>
                  </p>
                ))}
            <p className={`tabular-nums ${stacked ? "mt-1 border-t border-admin-border pt-1 font-semibold" : "text-admin-muted"}`}>
              {stacked ? "Total " : ""}
              {fmt(totals[hover])} {unit}
            </p>
          </div>
        )}
      </div>
      <TableView
        head={["Month", ...(stacked ? series.map((s) => s.name) : []), stacked ? "Total" : unit.charAt(0).toUpperCase() + unit.slice(1)]}
        rows={labels.map((l, i) => [fullLabels?.[i] ?? l, ...(stacked ? series.map((s) => fmt(s.values[i] ?? 0)) : []), fmt(totals[i])])}
      />
    </div>
  );
}

/** Horizontal bars for a breakdown (one series), largest first, with counts and shares. */
export function BarList({ rows, unit = "staff", empty = "No data yet." }: { rows: { label: string; value: number; note?: string }[]; unit?: string; empty?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((n, r) => n + r.value, 0);
  if (!rows.length || total === 0) return <p className="py-6 text-center text-sm text-admin-muted">{empty}</p>;
  return (
    <ul className="space-y-2.5" onMouseLeave={() => setHover(null)}>
      {rows.map((r, i) => (
        <li key={r.label} onMouseEnter={() => setHover(i)} className="group">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate" title={r.label}>
              {r.label}
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-semibold">{fmt(r.value)}</span>
              <span className={`ml-1.5 text-xs text-admin-muted ${hover === i ? "" : "sr-only"}`}>
                {Math.round((r.value / total) * 100)}% of {fmt(total)} {unit}
                {r.note ? ` · ${r.note}` : ""}
              </span>
            </span>
          </div>
          <span className="mt-1 block h-2 overflow-hidden rounded-full bg-admin-bg" aria-hidden="true">
            <span className={`block h-full rounded-full transition-opacity ${hover !== null && hover !== i ? "opacity-50" : ""}`} style={{ width: `${(r.value / max) * 100}%`, background: vizColor(0) }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

const STATUS_COLOR: Record<string, string> = {
  approved: "var(--a-success)",
  pending: "var(--a-warning)",
  rejected: "var(--a-danger)",
  cancelled: "var(--viz-other)",
};

/** One bar split into parts (e.g. requests by status), always labelled with counts. */
export function SplitBar({ parts, unit }: { parts: { key: string; label: string; value: number; color?: string }[]; unit: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = parts.reduce((n, p) => n + p.value, 0);
  if (!total) return <p className="py-6 text-center text-sm text-admin-muted">No {unit} yet.</p>;
  const shown = parts.filter((p) => p.value > 0);
  return (
    <div onMouseLeave={() => setHover(null)}>
      <div className="flex h-4 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={shown.map((p) => `${p.label} ${p.value}`).join(", ")}>
        {shown.map((p) => (
          <span
            key={p.key}
            onMouseEnter={() => setHover(p.key)}
            className={`h-full transition-opacity first:rounded-l-full last:rounded-r-full ${hover && hover !== p.key ? "opacity-50" : ""}`}
            style={{ width: `${(p.value / total) * 100}%`, minWidth: 4, background: p.color ?? STATUS_COLOR[p.key] ?? vizColor(0) }}
            title={`${p.label}: ${p.value} (${Math.round((p.value / total) * 100)}%)`}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {parts.map((p) => (
          <li key={p.key} onMouseEnter={() => setHover(p.key)} className={`rounded-lg border border-admin-border px-3 py-2 ${hover === p.key ? "bg-admin-bg" : ""}`}>
            <span className="flex items-center gap-1.5 text-xs text-admin-muted">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color ?? STATUS_COLOR[p.key] ?? vizColor(0) }} aria-hidden="true" />
              {p.label}
            </span>
            <span className="mt-0.5 block font-semibold tabular-nums">
              {p.value} <span className="text-xs font-normal text-admin-muted">({Math.round((p.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A compact figure with an explanation, for analytics rows. */
export function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-admin-border bg-admin-card px-4 py-3">
      <p className="text-xs font-medium text-admin-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-admin-muted">{hint}</p>
    </div>
  );
}
