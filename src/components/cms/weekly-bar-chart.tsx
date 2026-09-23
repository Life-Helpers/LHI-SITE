"use client";

import { useState } from "react";

export interface WeeklyPoint {
  label: string;
  value: number;
}

/** Single-series column chart with hover tooltip and a screen-reader table. */
export function WeeklyBarChart({ data, unit }: { data: WeeklyPoint[]; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = 180;
  const pad = { top: 16, right: 8, bottom: 24, left: 28 };
  const max = Math.max(4, ...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 2) * 2;
  const ticks = [0, niceMax / 2, niceMax];
  const band = (W - pad.left - pad.right) / data.length;
  const barW = Math.min(24, band - 2);
  const y = (v: number) => pad.top + (H - pad.top - pad.bottom) * (1 - v / niceMax);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${unit} per week, last ${data.length} weeks`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="var(--a-border)" strokeWidth={1} />
            <text x={pad.left - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--a-muted)">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.left + i * band + (band - barW) / 2;
          const top = y(d.value);
          const h = y(0) - top;
          const r = Math.min(4, h);
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.left + i * band} y={pad.top} width={band} height={H - pad.top - pad.bottom} fill="transparent" />
              {h > 0 && (
                <path
                  d={`M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${y(0)} Z`}
                  fill="var(--a-primary)"
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              )}
              {(i === 0 || i === data.length - 1 || i % 3 === 0) && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--a-muted)">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-md border border-admin-border bg-admin-card px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${((pad.left + hover * band + band / 2) / W) * 100}%`, top: 0 }}
        >
          <p className="text-admin-muted">Week of {data[hover].label}</p>
          <p className="font-semibold">
            {data[hover].value} {unit}
          </p>
        </div>
      )}
      <table className="sr-only">
        <caption>{unit} per week</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
