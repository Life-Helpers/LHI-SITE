"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Save } from "lucide-react";

import { saveHomeTextAction } from "@/app/admin/actions";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";
import type { Locale } from "@/i18n/types";
import { HOME_TEXT_SECTIONS, type HomeTextByLocale, type HomeTextValues } from "@/lib/home-text";

type Draft = Record<string, string>;

const toDraft = (values: HomeTextValues | undefined): Draft =>
  Object.fromEntries(Object.entries(values ?? {}).map(([k, v]) => [k, Array.isArray(v) ? v.join("\n") : v]));

const asText = (v: string | string[]) => (Array.isArray(v) ? v.join("\n") : v);

/**
 * Home page text per language. Each box shows the built-in text as a placeholder;
 * leave a box empty to keep it, type to replace it.
 */
export function HomeTextForm({
  languages,
  defaults,
  initial,
}: {
  languages: { id: Locale; label: string }[];
  defaults: Record<Locale, Record<string, string | string[]>>;
  initial: HomeTextByLocale;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(languages.map((l) => [l.id, toDraft(initial[l.id])])),
  );
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const draft = drafts[locale] ?? {};
  const set = (key: string, value: string) => setDrafts((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));
  const changedCount = Object.values(draft).filter((v) => v.trim()).length;
  const label = languages.find((l) => l.id === locale)?.label ?? locale;

  const save = () =>
    startTransition(async () => {
      const values = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, v]));
      const res = await saveHomeTextAction(locale, values);
      setNotice(res.ok ? { ok: true, text: `${label} home page text saved. The website has been updated.` } : { ok: false, text: res.error ?? "Save failed." });
      if (res.ok) router.refresh();
    });

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Language" className="flex flex-wrap gap-2">
        {languages.map((l) => {
          const count = Object.values(drafts[l.id] ?? {}).filter((v) => v.trim()).length;
          return (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={locale === l.id}
              onClick={() => {
                setLocale(l.id);
                setNotice(null);
              }}
              className={locale === l.id ? buttonClass.primary : buttonClass.secondary}
            >
              {l.label}
              {count > 0 && <span className="rounded-full bg-black/10 px-1.5 text-[11px]">{count} edited</span>}
            </button>
          );
        })}
      </div>

      {notice && (
        <p role={notice.ok ? "status" : "alert"} className={`rounded-lg px-4 py-3 text-sm ${notice.ok ? "bg-admin-success-soft text-admin-success" : "bg-admin-danger-soft text-admin-danger"}`}>
          {notice.text}
        </p>
      )}

      <form
        className="grid grid-cols-1 gap-6 xl:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        {HOME_TEXT_SECTIONS.map((section) => (
          <Card key={section.title} title={section.title} bodyClassName="space-y-4 p-6">
            {section.fields.map((field) => {
              const id = `ht-${locale}-${field.key}`;
              const placeholder = asText(defaults[locale]?.[field.key] ?? "");
              const value = draft[field.key] ?? "";
              return (
                <div key={field.key}>
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor={id} className="text-sm font-semibold">
                      {field.label}
                    </label>
                    {value && (
                      <button type="button" onClick={() => set(field.key, "")} className="inline-flex items-center gap-1 text-xs text-admin-muted hover:text-admin-primary">
                        <RotateCcw className="h-3 w-3" aria-hidden="true" /> Use default
                      </button>
                    )}
                  </div>
                  {field.multiline ? (
                    <textarea id={id} rows={field.list ? 5 : 3} value={value} placeholder={placeholder} onChange={(e) => set(field.key, e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  ) : (
                    <input id={id} value={value} placeholder={placeholder} onChange={(e) => set(field.key, e.target.value)} className={`mt-1.5 ${inputClass}`} />
                  )}
                  {field.list && <p className="mt-1 text-xs text-admin-muted">One per line, written as “Name — description”.</p>}
                </div>
              );
            })}
          </Card>
        ))}

        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-card p-4 shadow-lg xl:col-span-2">
          <p className="text-sm text-admin-muted">
            {changedCount > 0 ? `${changedCount} field${changedCount === 1 ? "" : "s"} replaced in ${label}.` : `${label} uses the built-in text everywhere.`} Empty boxes keep the built-in text.
          </p>
          <button type="submit" disabled={pending} className={buttonClass.primary}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            Save {label}
          </button>
        </div>
      </form>
    </div>
  );
}
