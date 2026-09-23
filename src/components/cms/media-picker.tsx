"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Loader2, Music, Upload, X } from "lucide-react";

import { buttonClass } from "@/components/cms/ui";
import { AUDIO_ACCEPT } from "@/lib/cms/media-types";
import type { MediaItem } from "@/lib/cms/schema";

export async function uploadFiles(files: FileList | File[]): Promise<MediaItem[]> {
  const body = new FormData();
  Array.from(files).forEach((f) => body.append("file", f));
  const res = await fetch("/api/admin/media", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");
  return data.items as MediaItem[];
}

export function MediaThumb({ item, className = "" }: { item: Pick<MediaItem, "url" | "mimeType" | "filename">; className?: string }) {
  if (item.mimeType.startsWith("image/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.url} alt="" className={`object-cover ${className}`} />;
  }
  const Icon = item.mimeType.startsWith("audio/") ? Music : FileText;
  return (
    <div className={`flex flex-col items-center justify-center gap-1 bg-admin-bg p-2 text-center ${className}`}>
      <Icon className="h-6 w-6 text-admin-muted" />
      <span className="line-clamp-2 break-all text-[10px] text-admin-muted">{item.filename}</span>
    </div>
  );
}

export function MediaPicker({
  kind,
  onSelect,
  onClose,
}: {
  kind: "image" | "file" | "audio";
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not load media.");
      setItems([]);
      return;
    }
    setItems(data.items);
  }, []);

  useEffect(() => {
    load();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load, onClose]);

  const visible = (items ?? []).filter((m) => (kind === "image" ? m.mimeType.startsWith("image/") : kind === "audio" ? m.mimeType.startsWith("audio/") : true));

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadFiles(files);
      if (uploaded.length === 1) {
        onSelect(uploaded[0]);
        return;
      }
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Media library">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-3.5">
          <h2 className="text-sm font-bold">{kind === "image" ? "Choose an image" : "Choose a file"}</h2>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={
                kind === "image"
                  ? "image/jpeg,image/png,image/webp,image/gif,image/avif"
                  : kind === "audio"
                    ? AUDIO_ACCEPT
                    : `.pdf,.jpg,.jpeg,.png,.webp,.gif,.avif,.mp4,${AUDIO_ACCEPT}`
              }
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <button type="button" className={buttonClass.primary} onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
            </button>
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-admin-muted hover:bg-admin-bg" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {error && <p className="bg-admin-danger-soft px-5 py-2 text-sm text-admin-danger">{error}</p>}
        <div className="flex-1 overflow-y-auto p-5">
          {items === null ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-admin-muted" />
            </div>
          ) : visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-admin-muted">No files yet. Upload one to get started.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {visible.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(m)}
                    className="group block w-full overflow-hidden rounded-lg border border-admin-border text-left hover:border-admin-primary focus-visible:border-admin-primary"
                  >
                    <MediaThumb item={m} className="aspect-square w-full" />
                    <span className="block truncate px-2 py-1.5 text-[11px] text-admin-muted group-hover:text-admin-text">
                      {m.filename}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
