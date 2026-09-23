"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Trash2, Upload, X } from "lucide-react";

import { deleteMediaAction, updateMediaAltAction } from "@/app/admin/actions";
import { MediaThumb, uploadFiles } from "@/components/cms/media-picker";
import { buttonClass, formatDate, inputClass } from "@/components/cms/ui";
import type { MediaItem } from "@/lib/cms/schema";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "application/pdf", label: "Documents" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

export function MediaLibrary({ items, canDelete }: { items: MediaItem[]; canDelete: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [alt, setAlt] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const visible = items.filter((m) => filter === "all" || m.mimeType.startsWith(filter));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      await uploadFiles(files);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const open = (m: MediaItem) => {
    setSelected(m);
    setAlt(m.alt);
    setCopied(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            upload(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? "border-admin-primary bg-admin-primary-soft" : "border-admin-border bg-admin-card"
          }`}
        >
          <Upload className="h-6 w-6 text-admin-primary" />
          <p className="text-sm font-semibold">Drop files here to upload</p>
          <p className="text-xs text-admin-muted">JPG, PNG, WebP, GIF, AVIF, PDF or MP4 · up to 15 MB each</p>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          <button type="button" className={`${buttonClass.secondary} mt-2`} onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />} Select files
          </button>
          {error && <p className="text-sm text-admin-danger" role="alert">{error}</p>}
        </div>

        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Filter media">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                filter === f.id ? "bg-admin-primary-soft text-admin-primary" : "text-admin-muted hover:bg-admin-card"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl border border-admin-border bg-admin-card py-16 text-center text-sm text-admin-muted">
            No media yet.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6">
            {visible.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => open(m)}
                  aria-pressed={selected?.id === m.id}
                  className={`block w-full overflow-hidden rounded-lg border-2 bg-admin-card text-left ${
                    selected?.id === m.id ? "border-admin-primary" : "border-transparent hover:border-admin-border"
                  }`}
                >
                  <MediaThumb item={m} className="aspect-square w-full" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        {selected ? (
          <div className="rounded-xl border border-admin-border bg-admin-card">
            <div className="flex items-center justify-between border-b border-admin-border px-5 py-3.5">
              <h2 className="text-sm font-bold">Attachment details</h2>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close details" className="text-admin-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <MediaThumb item={selected} className="aspect-video w-full rounded-lg" />
              <dl className="space-y-1 text-xs">
                <div className="flex justify-between gap-2"><dt className="text-admin-muted">File</dt><dd className="truncate font-medium">{selected.filename}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-admin-muted">Size</dt><dd>{(selected.size / 1024).toFixed(0)} KB</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-admin-muted">Uploaded</dt><dd>{formatDate(selected.uploadedAt, true)}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-admin-muted">By</dt><dd>{selected.uploadedBy}</dd></div>
              </dl>
              <label className="block text-sm font-semibold">
                Alt text
                <textarea rows={2} value={alt} onChange={(e) => setAlt(e.target.value)} className={`${inputClass} mt-1.5`} />
              </label>
              <div className="flex gap-2">
                <input readOnly value={selected.url} aria-label="File URL" className={`${inputClass} font-mono text-xs`} />
                <button
                  type="button"
                  className={buttonClass.secondary}
                  aria-label="Copy URL"
                  onClick={() => {
                    navigator.clipboard?.writeText(selected.url);
                    setCopied(true);
                  }}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-between gap-2 border-t border-admin-border pt-4">
                {canDelete ? (
                  <button
                    type="button"
                    className={buttonClass.danger}
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Delete this file permanently? Pages using it will show a broken image.")) return;
                      startTransition(async () => {
                        const res = await deleteMediaAction(selected.id);
                        if (!res.ok) setError(res.error ?? "Delete failed.");
                        setSelected(null);
                        router.refresh();
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  className={buttonClass.primary}
                  disabled={pending || alt === selected.alt}
                  onClick={() =>
                    startTransition(async () => {
                      await updateMediaAltAction(selected.id, alt);
                      setSelected({ ...selected, alt });
                      router.refresh();
                    })
                  }
                >
                  Save alt text
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-admin-border p-8 text-center text-sm text-admin-muted">
            Select a file to see its details, copy its URL or edit alt text.
          </p>
        )}
      </aside>
    </div>
  );
}
