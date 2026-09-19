"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EmergencyAlert } from "@/types/content";

const DISMISS_KEY_PREFIX = "lhi:alert-dismissed:";

export function EmergencyAlertBanner({
  alerts,
}: {
  alerts: EmergencyAlert[];
}) {
  const alert = alerts[0];
  // Defaults to visible so the alert still renders for first-time visitors
  // and no-JS clients; only hides once we confirm this session dismissed it.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!alert) return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY_PREFIX + alert.id) === "1") {
        setDismissed(true);
      }
    } catch {
      // sessionStorage unavailable — leave the alert visible.
    }
  }, [alert]);

  if (!alert || dismissed) return null;

  const isCritical = alert.severity === "critical";

  function handleDismiss() {
    if (!alert) return;
    try {
      window.sessionStorage.setItem(DISMISS_KEY_PREFIX + alert.id, "1");
    } catch {
      // sessionStorage unavailable (private mode, blocked storage); dismiss
      // still works for this render, it just won't persist.
    }
    setDismissed(true);
  }

  return (
    <div
      role={isCritical ? "alert" : "status"}
      className={cn(
        "flex items-center gap-3 border-b px-4 py-3 text-sm",
        isCritical
          ? "bg-alert text-alert-foreground border-alert-border"
          : "bg-accent text-accent-foreground border-transparent",
      )}
    >
      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 font-medium">{alert.message}</p>
      <Link
        href={alert.href}
        className="shrink-0 rounded underline decoration-2 underline-offset-2 hover:no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        {alert.ctaLabel}
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded p-1 hover:bg-black/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Dismiss alert</span>
      </button>
    </div>
  );
}
