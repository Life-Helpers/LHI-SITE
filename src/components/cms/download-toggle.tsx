"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/** "Visitors can download the PDF" switch for one uploaded magazine. */
export function MagazineDownloadToggle({ slug, title, allowed }: { slug: string; title: string; allowed: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(allowed);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-admin-muted" title="Show the Download PDF button on the site">
      <input
        type="checkbox"
        checked={on}
        disabled={pending}
        aria-label={`Visitors can download ${title}`}
        onChange={(e) => {
          const next = e.target.checked;
          setOn(next);
          setError("");
          start(async () => {
            const res = await fetch("/api/admin/magazines", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, allowDownload: next }) });
            if (!res.ok) {
              setOn(!next);
              setError("Not saved");
            } else router.refresh();
          });
        }}
        className="h-4 w-4 accent-[var(--a-primary)]"
      />
      Download allowed
      {error && <span className="text-admin-danger">{error}</span>}
    </label>
  );
}
