"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, Mail, Megaphone, RotateCcw, Save, Send } from "lucide-react";

import { saveEmailSettingsAction, savePopupAction, sendTestEmailAction, type SettingsResult } from "@/app/admin/email-settings-actions";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";

const PROVIDERS = [
  { id: "mailgun", label: "Mailgun" },
  { id: "resend", label: "Resend" },
  { id: "sendgrid", label: "SendGrid" },
  { id: "postmark", label: "Postmark" },
  { id: "brevo", label: "Brevo" },
];

/** On/off switch styled like the rest of the admin. */
function Switch({ checked, onChange, label, name }: { checked: boolean; onChange: (v: boolean) => void; label: string; name: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold">
      <input type="checkbox" role="switch" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-admin-border transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-admin-primary peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-admin-primary" aria-hidden="true" />
      {label}
    </label>
  );
}

function Notice({ result }: { result: SettingsResult | null }) {
  if (!result) return null;
  return (
    <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-admin-success" : "text-admin-danger"}`}>
      {result.ok && <CheckCircle2 className="mr-1 inline h-4 w-4" />}
      {result.ok ? result.message : result.error}
    </p>
  );
}

export function EmailSettingsForm({
  initial,
  keyHint,
  status,
  live,
}: {
  initial: { enabled: boolean; provider: string; domain: string; region: string; from: string; replyTo: string };
  keyHint: string;
  status: string;
  live: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<SettingsResult | null>(null);
  const [pending, start] = useTransition();
  const set = (patch: Partial<typeof v>) => setV((cur) => ({ ...cur, ...patch }));
  const mailgun = v.provider === "mailgun";

  const save = (extra: { removeKey?: boolean } = {}) =>
    start(async () => {
      const res = await saveEmailSettingsAction({ ...v, apiKey, ...extra });
      setResult(res);
      if (res.ok) {
        setApiKey("");
        router.refresh();
      }
    });

  return (
    <Card title={<span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-admin-primary" /> Email delivery</span>} bodyClassName="space-y-5 p-5" className="hr-card">
      <div className={`rounded-lg px-4 py-3 text-sm ${live ? "bg-admin-success-soft text-admin-success" : "bg-admin-warning-soft text-admin-warning"}`} data-email-status>
        {status}
      </div>
      <Switch name="enabled" checked={v.enabled} onChange={(enabled) => set({ enabled })} label={v.enabled ? "Email is on" : "Email is off"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Provider
          <select value={v.provider} onChange={(e) => set({ provider: e.target.value })} className={`${inputClass} mt-1.5`}>
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        {mailgun && (
          <label className="block text-sm font-semibold">
            Account region
            <select value={v.region} onChange={(e) => set({ region: e.target.value })} className={`${inputClass} mt-1.5`}>
              <option value="us">US (api.mailgun.net)</option>
              <option value="eu">EU (api.eu.mailgun.net)</option>
            </select>
          </label>
        )}
      </div>
      {mailgun && (
        <label className="block text-sm font-semibold">
          Sending domain
          <input value={v.domain} onChange={(e) => set({ domain: e.target.value })} placeholder="mg.lhinigeria.org" className={`${inputClass} mt-1.5`} />
          <span className="mt-1 block text-xs font-normal text-admin-muted">The domain you verified in Mailgun → Sending → Domains.</span>
        </label>
      )}
      <label className="block text-sm font-semibold">
        <span className="inline-flex items-center gap-1.5"><KeyRound className="h-4 w-4" /> API key</span>
        <input
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={keyHint ? `Saved (ends in ${keyHint}). Type a new key to replace it.` : mailgun ? "Mailgun private API key" : "API key"}
          className={`${inputClass} mt-1.5`}
        />
        <span className="mt-1 block text-xs font-normal text-admin-muted">Stored encrypted and never shown again. {mailgun ? "In Mailgun: Account settings → API keys." : ""}</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Sender
          <input value={v.from} onChange={(e) => set({ from: e.target.value })} placeholder="Life Helpers Initiative <news@mg.lhinigeria.org>" className={`${inputClass} mt-1.5`} />
        </label>
        <label className="block text-sm font-semibold">
          Replies go to (optional)
          <input value={v.replyTo} onChange={(e) => set({ replyTo: e.target.value })} placeholder="official@lhinigeria.org" className={`${inputClass} mt-1.5`} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-admin-border pt-4">
        <button type="button" onClick={() => save()} disabled={pending} className={buttonClass.primary}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
        <button
          type="button"
          disabled={pending || !live}
          title={live ? "Send a test to your own address" : "Save with email on first"}
          onClick={() => start(async () => setResult(await sendTestEmailAction()))}
          className={buttonClass.secondary}
        >
          <Send className="h-4 w-4" /> Send me a test
        </button>
        {keyHint && (
          <button type="button" disabled={pending} onClick={() => confirm("Remove the saved API key? Email will stop until a new one is added.") && save({ removeKey: true })} className={buttonClass.danger}>
            Remove key
          </button>
        )}
        <Notice result={result} />
      </div>
    </Card>
  );
}

export function PopupSettingsForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(enabled);
  const [result, setResult] = useState<SettingsResult | null>(null);
  const [pending, start] = useTransition();
  const save = (input: { enabled: boolean; showAgain?: boolean }) =>
    start(async () => {
      const res = await savePopupAction(input);
      setResult(res);
      if (res.ok) router.refresh();
      else setOn(enabled);
    });
  return (
    <Card title={<span className="inline-flex items-center gap-2"><Megaphone className="h-4 w-4 text-admin-primary" /> Newsletter pop-up</span>} bodyClassName="space-y-4 p-5" className="hr-card">
      <p className="text-sm text-admin-muted">
        Invites visitors to subscribe. Each visitor sees it <strong>only once</strong>: after they close it or subscribe it never comes back on that browser. During the
        anniversary season (15 Sept – 31 Oct) it shows the anniversary greeting.
      </p>
      <Switch
        name="popup"
        checked={on}
        onChange={(next) => {
          setOn(next);
          save({ enabled: next });
        }}
        label={on ? "Pop-up is on" : "Pop-up is off"}
      />
      <div className="border-t border-admin-border pt-4">
        <button type="button" disabled={pending || !on} onClick={() => confirm("Show the pop-up once more to everyone, including people who already saw it?") && save({ enabled: true, showAgain: true })} className={buttonClass.secondary}>
          <RotateCcw className="h-4 w-4" /> Show it once more to everyone
        </button>
        <p className="mt-1.5 text-xs text-admin-muted">Only for a new campaign: people who already closed it will see it one more time.</p>
      </div>
      <Notice result={result} />
    </Card>
  );
}
