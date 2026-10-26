"use client";

import { useEffect, useState } from "react";
import { CircleCheck, X } from "lucide-react";

const EVENT = "hr:notice";

/** Show a confirmation at the bottom of the page, e.g. after a one-click approve whose row then disappears. */
export function announce(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

/** Where announced confirmations appear (mounted once by the portal frame). Each fades after 6 seconds. */
export function NoticeHost() {
  const [notices, setNotices] = useState<{ id: number; message: string }[]>([]);
  useEffect(() => {
    let next = 0;
    const onNotice = (e: Event) => {
      const id = ++next;
      setNotices((list) => [...list.slice(-2), { id, message: String((e as CustomEvent).detail) }]);
      setTimeout(() => setNotices((list) => list.filter((n) => n.id !== id)), 6000);
    };
    window.addEventListener(EVENT, onNotice);
    return () => window.removeEventListener(EVENT, onNotice);
  }, []);
  if (!notices.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(26rem,calc(100%-2rem))] flex-col gap-2 print:hidden">
      {notices.map((n) => (
        <div key={n.id} role="status" className="pointer-events-auto flex items-start gap-2 rounded-xl border border-admin-border bg-admin-card px-3 py-2.5 text-sm text-admin-text shadow-xl">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-admin-success" aria-hidden="true" />
          <span className="min-w-0 flex-1">{n.message}</span>
          <button type="button" onClick={() => setNotices((list) => list.filter((x) => x.id !== n.id))} aria-label="Dismiss" className="rounded p-0.5 text-admin-muted hover:bg-admin-bg">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
