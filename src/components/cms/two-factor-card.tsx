"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";

import { confirmTwoFactorAction, disableTwoFactorAction, startTwoFactorSetupAction } from "@/app/admin/actions";
import { Badge, buttonClass, Card, inputClass } from "@/components/cms/ui";

/** Profile card to turn two-step verification (authenticator app codes) on or off. */
export function TwoFactorCard({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <Card title="Two-step verification" action={<Badge tone={enabled ? "success" : "neutral"}>{enabled ? "On" : "Off"}</Badge>}>
      {enabled ? (
        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-admin-success" /> Signing in needs your password and a code from your authenticator app.
          </p>
          <p className="text-admin-muted">To turn it off, enter your password and a current code.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            <input inputMode="numeric" autoComplete="one-time-code" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} />
          </div>
          <button
            type="button"
            disabled={pending}
            className={buttonClass.danger}
            onClick={() =>
              start(async () => {
                const res = await disableTwoFactorAction(password, code);
                setMsg({ ok: res.ok, text: res.ok ? "Two-step verification is off." : (res.error ?? "Could not turn it off.") });
                setCode("");
                setPassword("");
                router.refresh();
              })
            }
          >
            <ShieldOff className="h-4 w-4" /> Turn off
          </button>
        </div>
      ) : setup ? (
        <div className="space-y-4 text-sm">
          <ol className="list-decimal space-y-1 pl-5 text-admin-muted">
            <li>Install an authenticator app (Google Authenticator, Microsoft Authenticator or similar).</li>
            <li>Scan this QR code, or enter the key by hand.</li>
            <li>Type the 6-digit code the app shows.</li>
          </ol>
          <div className="flex flex-wrap items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL generated on the server */}
            <img src={setup.qr} alt="QR code for your authenticator app" width={180} height={180} className="rounded-lg border border-admin-border bg-white p-2" />
            <div>
              <p className="text-xs text-admin-muted">Key</p>
              <p className="font-mono text-sm tracking-wider">{setup.secret.match(/.{1,4}/g)?.join(" ")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`${inputClass} max-w-40 font-mono tracking-widest`}
            />
            <button
              type="button"
              disabled={pending || code.replace(/\s/g, "").length < 6}
              className={buttonClass.primary}
              onClick={() =>
                start(async () => {
                  const res = await confirmTwoFactorAction(code);
                  setMsg({ ok: res.ok, text: res.ok ? "Two-step verification is on." : (res.error ?? "Could not confirm.") });
                  if (res.ok) setSetup(null);
                  setCode("");
                  router.refresh();
                })
              }
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Confirm and turn on
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <p className="text-admin-muted">Protect your account with a code from your phone as well as your password.</p>
          <button
            type="button"
            disabled={pending}
            className={buttonClass.primary}
            onClick={() =>
              start(async () => {
                const res = await startTwoFactorSetupAction();
                if (res.ok && res.secret && res.qr) setSetup({ secret: res.secret, qr: res.qr });
                else setMsg({ ok: false, text: res.error ?? "Could not start setup." });
              })
            }
          >
            <ShieldCheck className="h-4 w-4" /> Set up two-step verification
          </button>
        </div>
      )}
      {msg && <p className={`mt-3 text-xs ${msg.ok ? "text-admin-success" : "text-admin-danger"}`}>{msg.text}</p>}
    </Card>
  );
}
