import { Info } from "lucide-react";

import { LEAVE_COLOR_STYLE } from "@/components/hr/leave-style";
import { Tip } from "@/components/hr/tooltip";
import type { BalanceRow } from "@/lib/hr/leave-balance";

const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** Leave Type | Total | Used | Available, with a breakdown on hover. */
export function BalanceTable({ rows }: { rows: BalanceRow[] }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
          <th scope="col" className="px-3 py-2">Leave Type</th>
          <th scope="col" className="px-3 py-2 text-right">Total</th>
          <th scope="col" className="px-3 py-2 text-right text-admin-danger">Used</th>
          <th scope="col" className="px-3 py-2 text-right text-admin-success">Available</th>
          <th scope="col" className="w-8 px-1 py-2"><span className="sr-only">Details</span></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-admin-border">
        {rows.map((r) => {
          const breakdown =
            r.total === null
              ? `No limit · ${n(r.used)} used${r.pending ? ` · ${n(r.pending)} pending` : ""}`
              : `Allowance ${n(r.entitlement!)}${r.carried ? ` + carried ${n(r.carried)}` : ""}${r.adjusted ? ` ${r.adjusted > 0 ? "+" : "−"} adjusted ${n(Math.abs(r.adjusted))}` : ""} · ${n(r.used)} used${r.pending ? ` · ${n(r.pending)} pending` : ""}`;
          return (
            <tr key={r.type.id}>
              <td className="px-3 py-2">
                <span className="inline-flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${LEAVE_COLOR_STYLE[r.type.color].dot}`} aria-hidden="true" />
                  {r.type.name}
                </span>
              </td>
              <td className="px-3 py-2 text-right font-mono tabular-nums">{r.total === null ? "—" : n(r.total)}</td>
              <td className="px-3 py-2 text-right font-mono tabular-nums text-admin-danger">{n(r.used)}</td>
              <td className={`px-3 py-2 text-right font-mono font-semibold tabular-nums ${r.available !== null && r.available <= 0 ? "text-admin-danger" : "text-admin-success"}`}>
                {r.available === null ? "No limit" : n(r.available)}
              </td>
              <td className="px-1 py-2">
                <Tip label={breakdown}>
                  <button type="button" aria-label={`${r.type.name}: ${breakdown}`} className="rounded p-0.5 text-admin-muted hover:text-admin-text">
                    <Info className="h-4 w-4" aria-hidden="true" />
                  </button>
                </Tip>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
