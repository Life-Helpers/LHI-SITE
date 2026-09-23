/** Build a CSV (RFC 4180) with a BOM so Excel opens UTF-8 correctly. Cells that look like formulas are neutralised. */
export function toCsv(headers: string[], rows: (string | number | undefined | null)[][]) {
  const cell = (v: string | number | undefined | null) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
