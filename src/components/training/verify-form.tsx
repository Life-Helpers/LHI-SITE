"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function VerifyCertificateForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initial);

  return (
    <form
      className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const value = code.trim().toUpperCase();
        if (value) router.push(`/get-involved/training/verify/${encodeURIComponent(value)}`);
      }}
    >
      <label htmlFor="certificate-code" className="sr-only">Certificate code</label>
      <input
        id="certificate-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="LHI-SG-XXXXXXXX"
        autoComplete="off"
        className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm uppercase tracking-wider text-foreground outline-none focus:border-primary"
      />
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
        <Search className="h-4 w-4" /> Verify
      </button>
    </form>
  );
}
