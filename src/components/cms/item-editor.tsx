"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, ExternalLink, ImagePlus, Loader2, Paperclip, Save, Trash2, X } from "lucide-react";

import { deleteItemAction, saveItemAction } from "@/app/admin/actions";
import { MediaPicker, MediaThumb } from "@/components/cms/media-picker";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";
import { COLLECTIONS, slugify, type CollectionName, type FieldDef, type FieldOption, type MediaItem } from "@/lib/cms/schema";

type Values = Record<string, unknown>;

export function ItemEditor({
  collection,
  initial,
  originalId,
  viewHref,
  meta,
  relationOptions,
}: {
  collection: CollectionName;
  /** Choices for relation fields (e.g. the projects a post can link to), loaded on the server. */
  relationOptions?: Record<string, FieldOption[]>;
  initial: Values;
  originalId: string | null;
  viewHref?: string | null;
  meta?: { label: string; value: string }[];
}) {
  const def = useMemo(() => {
    const base = COLLECTIONS[collection];
    if (!relationOptions) return base;
    return { ...base, fields: base.fields.map((f) => (f.relation ? { ...f, options: relationOptions[f.name] ?? [] } : f)) };
  }, [collection, relationOptions]);
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(originalId));
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setValue = (name: string, value: unknown) => {
    setDirty(true);
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (!slugTouched) {
        def.fields
          .filter((f) => f.type === "slug" && f.from === name)
          .forEach((f) => (next[f.name] = slugify(String(value ?? ""))));
      }
      return next;
    });
  };

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await saveItemAction(def.name, originalId, values);
      if (!res.ok) {
        setErrors(res.errors ?? {});
        setMessage({ tone: "error", text: res.error ?? "Save failed." });
        return;
      }
      setErrors({});
      setDirty(false);
      setMessage({ tone: "ok", text: `${def.singular} saved. The website has been updated.` });
      if (res.id && res.id !== originalId) {
        router.replace(`/admin/content/${def.name}/${encodeURIComponent(res.id)}`);
      }
      router.refresh();
    });
  };

  const remove = () => {
    if (!originalId || !window.confirm(`Delete this ${def.singular.toLowerCase()}? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteItemAction(def.name, originalId);
      if (!res.ok) {
        setMessage({ tone: "error", text: res.error ?? "Delete failed." });
        return;
      }
      setDirty(false);
      router.push(`/admin/content/${def.name}`);
      router.refresh();
    });
  };

  const main = def.fields.filter((f) => !f.sidebar);
  const side = def.fields.filter((f) => f.sidebar);

  const renderField = (field: FieldDef) => (
    <Field
      key={field.name}
      field={field}
      value={values[field.name]}
      error={errors[field.name]}
      onChange={(v) => {
        if (field.type === "slug") setSlugTouched(true);
        setValue(field.name, v);
      }}
    />
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
      noValidate
    >
      <div className="space-y-6">
        {message && (
          <div
            role={message.tone === "error" ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${
              message.tone === "ok" ? "bg-admin-success-soft text-admin-success" : "bg-admin-danger-soft text-admin-danger"
            }`}
          >
            {message.tone === "ok" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <span className="flex-1">{message.text}</span>
            {message.tone === "ok" && viewHref && (
              <a href={viewHref} target="_blank" rel="noreferrer" className="font-semibold underline">
                View
              </a>
            )}
          </div>
        )}
        <Card bodyClassName="space-y-5 p-5 sm:p-6">{main.map(renderField)}</Card>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <Card title="Publish" bodyClassName="p-5 space-y-4">
          {meta && meta.length > 0 && (
            <dl className="space-y-1.5 text-xs">
              {meta.map((m) => (
                <div key={m.label} className="flex justify-between gap-2">
                  <dt className="text-admin-muted">{m.label}</dt>
                  <dd className="truncate font-medium">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {side.map(renderField)}
          <div className="flex items-center justify-between gap-2 border-t border-admin-border pt-4">
            {originalId && !def.fixed ? (
              <button type="button" onClick={remove} className={buttonClass.danger} disabled={pending}>
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className={buttonClass.primary} disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {originalId ? "Update" : "Publish"}
            </button>
          </div>
          {viewHref && (
            <a href={viewHref} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-admin-primary">
              <ExternalLink className="h-3.5 w-3.5" /> View on website
            </a>
          )}
          {dirty && <p className="text-xs text-admin-warning">You have unsaved changes.</p>}
        </Card>
        <p className="text-center text-xs text-admin-muted">
          <Link href={`/admin/content/${def.name}`} className="hover:text-admin-primary">
            ← Back to all {def.label.toLowerCase()}
          </Link>
        </p>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.name}`;
  const describedBy = [field.help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": Boolean(error) || undefined, "aria-describedby": describedBy };
  const str = value === undefined || value === null ? "" : String(value);
  const arr = Array.isArray(value) ? (value as string[]) : [];

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <textarea {...common} rows={4} value={str} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
      break;
    case "markdown":
      control = <MarkdownField common={common} value={str} onChange={onChange} />;
      break;
    case "number":
      control = <input {...common} type="number" min={0} value={str} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
      break;
    case "date":
      control = <input {...common} type="date" value={str} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
      break;
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
          <span>{field.label}</span>
          <input
            id={id}
            type="checkbox"
            role="switch"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 shrink-0 rounded-full bg-admin-border transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-admin-primary peer-checked:after:translate-x-4 peer-focus-visible:ring-3 peer-focus-visible:ring-admin-primary/30" />
        </label>
      );
    case "select":
      control = (
        <select {...common} value={str} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          {!field.required && <option value="">—</option>}
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "multiselect":
      control = (
        <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={`${id}-label`}>
          {field.options?.map((o) => {
            const checked = arr.includes(o.value);
            return (
              <label
                key={o.value}
                className={`cursor-pointer rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                  checked ? "border-admin-primary bg-admin-primary-soft text-admin-primary" : "border-admin-border text-admin-muted hover:bg-admin-bg"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked ? [...arr, o.value] : arr.filter((v) => v !== o.value))}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      );
      break;
    case "list":
      control = (
        <textarea
          {...common}
          rows={Math.min(8, Math.max(3, arr.length + 1))}
          value={arr.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          className={inputClass}
        />
      );
      break;
    case "image":
    case "file":
    case "audio":
      control = <AssetField kind={field.type} value={str} onChange={onChange} common={common} />;
      break;
    case "images":
      control = <GalleryField value={arr} onChange={onChange} />;
      break;
    default:
      control = (
        <input
          {...common}
          type={field.type === "url" ? "url" : "text"}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${field.type === "slug" ? "font-mono text-xs" : ""} ${field.name === "title" ? "text-base font-semibold" : ""}`}
        />
      );
  }

  return (
    <div>
      <label id={`${id}-label`} htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {field.label}
        {field.required && <span className="text-admin-danger"> *</span>}
      </label>
      {control}
      {field.help && (
        <p id={`${id}-help`} className="mt-1 text-xs text-admin-muted">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-admin-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function MarkdownField({
  common,
  value,
  onChange,
}: {
  common: Record<string, unknown>;
  value: string;
  onChange: (v: string) => void;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  return (
    <div className="overflow-hidden rounded-lg border border-admin-border">
      <div className="flex gap-1 border-b border-admin-border bg-admin-bg px-2 py-1.5 text-xs font-semibold">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-2.5 py-1 capitalize ${tab === t ? "bg-admin-card text-admin-text shadow-sm" : "text-admin-muted"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "write" ? (
        <textarea
          {...common}
          rows={18}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full resize-y bg-admin-card px-3 py-2.5 font-mono text-[13px] leading-relaxed text-admin-text outline-none"
        />
      ) : (
        <div className="prose-admin min-h-64 px-4 py-3 text-sm leading-relaxed">
          <ReactMarkdown>{value || "_Nothing to preview._"}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function AssetField({
  kind,
  value,
  onChange,
  common,
}: {
  kind: "image" | "file" | "audio";
  value: string;
  onChange: (v: string) => void;
  common: Record<string, unknown>;
}) {
  const [open, setOpen] = useState(false);
  const pick = (m: MediaItem) => {
    onChange(m.url);
    setOpen(false);
  };
  return (
    <div className="space-y-2">
      {value && kind === "image" && (
        <div className="relative overflow-hidden rounded-lg border border-admin-border bg-admin-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" referrerPolicy="no-referrer" className="aspect-video w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      {value && kind === "audio" && (
        <div className="space-y-1 rounded-lg border border-admin-border bg-admin-bg p-2">
          <audio src={value} controls preload="none" className="w-full" />
          <button type="button" onClick={() => onChange("")} className="text-xs text-admin-muted hover:text-admin-danger">
            Remove audio
          </button>
        </div>
      )}
      {value && kind === "file" && (
        <div className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-xs">
          <Paperclip className="h-3.5 w-3.5 text-admin-muted" />
          <a href={value} target="_blank" rel="noreferrer" className="flex-1 truncate text-admin-primary">
            {value.split("/").pop()}
          </a>
          <button type="button" onClick={() => onChange("")} aria-label="Remove file" className="text-admin-muted hover:text-admin-danger">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <button type="button" onClick={() => setOpen(true)} className={`${buttonClass.secondary} w-full`}>
        <ImagePlus className="h-4 w-4" /> {value ? "Replace" : kind === "image" ? "Choose image" : kind === "audio" ? "Choose or upload audio" : "Choose file"}
      </button>
      <input
        {...common}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste a URL"
        className={`${inputClass} text-xs`}
      />
      {open && <MediaPicker kind={kind} onSelect={pick} onClose={() => setOpen(false)} />}
    </div>
  );
}

function GalleryField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((src, i) => (
          <li key={src} className="relative overflow-hidden rounded-lg border border-admin-border">
            <MediaThumb item={{ url: src, mimeType: "image/*", filename: src }} className="aspect-square w-full" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
              aria-label="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-admin-border text-xs text-admin-muted hover:border-admin-primary hover:text-admin-primary"
          >
            <ImagePlus className="h-5 w-5" /> Add photo
          </button>
        </li>
      </ul>
      {open && (
        <MediaPicker
          kind="image"
          onSelect={(m) => {
            if (!value.includes(m.url)) onChange([...value, m.url]);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
