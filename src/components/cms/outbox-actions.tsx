"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Trash2 } from "lucide-react";

import { deliverOutboxAction, discardOutboxEmailAction } from "@/app/admin/email-actions";
import { buttonClass } from "@/components/cms/ui";

export function DeliverOutboxButton({ pending: count, connected }: { pending: number; connected: boolean }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy || !connected || count === 0}
        className={buttonClass.primary}
        title={connected ? undefined : "Connect an email provider first"}
        onClick={() =>
          start(async () => {
            const res = await deliverOutboxAction();
            setResult({ ok: res.ok, text: res.error ?? res.message ?? "" });
            router.refresh();
          })
        }
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send {count} queued now
      </button>
      {result && <p className={`text-xs ${result.ok ? "text-admin-success" : "text-admin-danger"}`}>{result.text}</p>}
    </div>
  );
}

export function DiscardEmailButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  return (
    <button
      type="button"
      disabled={busy}
      className={buttonClass.danger}
      onClick={() => {
        if (!confirm("Discard this email? It will not be sent.")) return;
        start(async () => {
          await discardOutboxEmailAction(id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="h-4 w-4" /> Discard
    </button>
  );
}
