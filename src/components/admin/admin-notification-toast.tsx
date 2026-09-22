"use client";

import { useEffect, useState, useRef } from "react";
import { AlertCircle, CheckCircle2, DollarSign, Mail, X } from "lucide-react";
import type { AdminNotification } from "@/types/admin";

interface NotificationToastProps {
  notification: AdminNotification | null;
  onDismiss: () => void;
  onView: () => void;
}

export function AdminNotificationToast({ notification, onDismiss, onView }: NotificationToastProps) {
  const [progress, setProgress] = useState(100);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!notification) return;

    setProgress(100);
    const duration = 6000; // 6s total
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);
    }, 50);

    const dismissTimer = setTimeout(() => {
      onDismissRef.current();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, [notification]);

  if (!notification) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-xl animate-in slide-in-from-bottom-5 duration-300 ring-1 ring-primary/20"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            notification.category === "donation"
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : notification.category === "approval"
              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
          }`}
        >
          {notification.category === "donation" && <DollarSign className="h-5 w-5" />}
          {notification.category === "approval" && <AlertCircle className="h-5 w-5" />}
          {notification.category === "inquiry" && <Mail className="h-5 w-5" />}
          {notification.category === "system" && <CheckCircle2 className="h-5 w-5" />}
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Event</span>
            <span className="text-[10px] text-muted-foreground">· Just now</span>
          </div>
          <h4 className="text-xs font-bold text-foreground line-clamp-1">{notification.title}</h4>
          <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{notification.message}</p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={onView}
              className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Notifications
            </button>
            <button
              onClick={onDismiss}
              className="rounded-lg bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress timer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <div
          className={`h-full transition-all duration-75 ${
            notification.category === "donation"
              ? "bg-emerald-500"
              : notification.category === "approval"
              ? "bg-amber-500"
              : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
