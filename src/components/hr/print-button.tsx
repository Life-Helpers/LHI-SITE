"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 print:hidden">
      <Printer className="h-4 w-4" aria-hidden="true" /> {label}
    </button>
  );
}
