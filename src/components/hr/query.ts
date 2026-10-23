/** Build a link to `base` keeping the current query values, with some changed or removed. */
export function hrefWith(base: string, current: Record<string, string | undefined>, changes: Record<string, string | number | undefined | null> = {}) {
  const merged: Record<string, string> = {};
  for (const [k, v] of Object.entries({ ...current, ...changes })) {
    if (v !== undefined && v !== null && v !== "") merged[k] = String(v);
  }
  const qs = new URLSearchParams(merged).toString();
  return qs ? `${base}?${qs}` : base;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(day: string, n: number) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
}

/** The Monday of the week containing `day`. */
export function mondayOf(day: string) {
  const d = new Date(`${day}T12:00:00Z`);
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return iso(d);
}

export const isIsoDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T12:00:00Z`));
