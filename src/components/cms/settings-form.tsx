"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Save, X } from "lucide-react";

import { saveSettingsAction } from "@/app/admin/actions";
import { MediaPicker } from "@/components/cms/media-picker";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";
import type { CmsSettings } from "@/lib/cms/schema";

function Row({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
      {help && <span className="mt-1 block text-xs font-normal text-admin-muted">{help}</span>}
    </label>
  );
}

export function SettingsForm({ initial }: { initial: CmsSettings }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [picker, setPicker] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof CmsSettings>(group: K, key: keyof CmsSettings[K], value: unknown) =>
    setS((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

  const hf = s.homeFeature;

  return (
    <form
      className="grid grid-cols-1 gap-6 xl:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await saveSettingsAction(s);
          setNotice(res.ok ? { ok: true, text: "Settings saved. The website has been updated." } : { ok: false, text: res.error ?? "Save failed." });
          if (res.ok) router.refresh();
        });
      }}
    >
      {notice && (
        <p
          role={notice.ok ? "status" : "alert"}
          className={`rounded-lg px-4 py-3 text-sm xl:col-span-2 ${notice.ok ? "bg-admin-success-soft text-admin-success" : "bg-admin-danger-soft text-admin-danger"}`}
        >
          {notice.text}
        </p>
      )}

      <Card title="Home page feature story" bodyClassName="space-y-4 p-6" className="xl:row-span-2">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={hf.enabled} onChange={(e) => set("homeFeature", "enabled", e.target.checked)} className="accent-admin-primary" />
          Show the feature story on the home page
        </label>
        <Row label="Eyebrow">
          <input value={hf.eyebrow} onChange={(e) => set("homeFeature", "eyebrow", e.target.value)} className={inputClass} />
        </Row>
        <Row label="Headline">
          <input value={hf.title} onChange={(e) => set("homeFeature", "title", e.target.value)} className={inputClass} />
        </Row>
        <Row label="Story summary">
          <textarea rows={5} value={hf.excerpt} onChange={(e) => set("homeFeature", "excerpt", e.target.value)} className={inputClass} />
        </Row>
        <div>
          <p className="mb-1.5 text-sm font-semibold">Photo</p>
          {hf.image && (
            <div className="relative mb-2 overflow-hidden rounded-lg border border-admin-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hf.image} alt="" referrerPolicy="no-referrer" className="aspect-video w-full object-cover" />
              <button type="button" onClick={() => set("homeFeature", "image", "")} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white" aria-label="Remove photo">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <button type="button" className={buttonClass.secondary} onClick={() => setPicker(true)}>
            <ImagePlus className="h-4 w-4" /> {hf.image ? "Replace photo" : "Choose photo"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Row label="Button label">
            <input value={hf.linkLabel} onChange={(e) => set("homeFeature", "linkLabel", e.target.value)} className={inputClass} />
          </Row>
          <Row label="Button link" help="e.g. /blog/my-story">
            <input value={hf.linkHref} onChange={(e) => set("homeFeature", "linkHref", e.target.value)} className={inputClass} />
          </Row>
        </div>
      </Card>

      <Card title="NIDAKE impact calculator" bodyClassName="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
        <Row label="Kit cost (USD)">
          <input type="number" min={1} value={s.nidake.costUsd} onChange={(e) => set("nidake", "costUsd", e.target.value)} className={inputClass} />
        </Row>
        <Row label="Years of dignity / kit">
          <input type="number" min={1} value={s.nidake.yearsOfDignity} onChange={(e) => set("nidake", "yearsOfDignity", e.target.value)} className={inputClass} />
        </Row>
        <Row label="School days saved / kit">
          <input type="number" min={1} value={s.nidake.schoolDaysSaved} onChange={(e) => set("nidake", "schoolDaysSaved", e.target.value)} className={inputClass} />
        </Row>
      </Card>

      <Card title="Contact details on factsheets" bodyClassName="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <Row label="Email">
          <input type="email" value={s.contact.email} onChange={(e) => set("contact", "email", e.target.value)} className={inputClass} />
        </Row>
        <Row label="Phone">
          <input value={s.contact.phone} onChange={(e) => set("contact", "phone", e.target.value)} className={inputClass} />
        </Row>
      </Card>

      <div className="flex justify-end xl:col-span-2">
        <button type="submit" className={buttonClass.primary} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
        </button>
      </div>

      {picker && (
        <MediaPicker
          kind="image"
          onSelect={(m) => {
            set("homeFeature", "image", m.url);
            setPicker(false);
          }}
          onClose={() => setPicker(false)}
        />
      )}
    </form>
  );
}
