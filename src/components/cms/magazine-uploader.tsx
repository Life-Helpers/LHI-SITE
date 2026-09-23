"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";

import { buttonClass, inputClass } from "@/components/cms/ui";

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

async function post(body: FormData) {
  const res = await fetch("/api/admin/magazines", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data;
}

/** Turns a PDF into flipbook pages in the browser (pdf.js), then uploads the pages, the PDF and the details. */
export function MagazineUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [error, setError] = useState("");

  const run = async (form: HTMLFormElement) => {
    setError("");
    const pdfFile = fileRef.current?.files?.[0];
    const fd = new FormData(form);
    const finalSlug = slugify(slug || title);
    if (!pdfFile) return setError("Choose the magazine PDF.");
    if (!title.trim() || !finalSlug) return setError("Enter a title.");
    try {
      setProgress({ done: 0, total: 1, label: "Opening the PDF…" });
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await pdfFile.arrayBuffer()) }).promise;
      const total = doc.numPages;
      if (total > 120) throw new Error("Magazines can have up to 120 pages.");
      for (let n = 1; n <= total; n++) {
        setProgress({ done: n - 1, total, label: `Rendering page ${n} of ${total}…` });
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: 1100 / base.width });
        const canvas = document.createElement("canvas");
        canvas.width = 1100;
        canvas.height = 1556;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Fit the page into the A4-shaped flipbook frame.
        const scale = Math.min(1, 1556 / viewport.height);
        ctx.setTransform(scale, 0, 0, scale, (1100 - viewport.width * scale) / 2, (1556 - viewport.height * scale) / 2);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.8));
        if (!blob) throw new Error("Your browser could not create page images. Try Chrome, Edge or Firefox.");
        const body = new FormData();
        body.set("action", "page");
        body.set("slug", finalSlug);
        body.set("page", String(n));
        body.set("file", new File([blob], `${n}.webp`, { type: "image/webp" }));
        await post(body);
      }
      setProgress({ done: total, total, label: "Uploading the PDF for download…" });
      const pdfBody = new FormData();
      pdfBody.set("action", "pdf");
      pdfBody.set("slug", finalSlug);
      pdfBody.set("file", pdfFile);
      await post(pdfBody);
      setProgress({ done: total, total, label: "Saving…" });
      fd.set("action", "save");
      fd.set("slug", finalSlug);
      fd.set("title", title);
      fd.set("pages", String(total));
      await post(fd);
      router.push("/admin/magazines");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setProgress(null);
    }
  };

  const busy = progress !== null;
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void run(e.currentTarget);
      }}
    >
      <label className="block text-sm font-medium">
        Magazine PDF <span className="text-admin-danger">*</span>
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" required disabled={busy} className="mt-1.5 block w-full text-sm" />
        <span className="mt-1 block text-xs text-admin-muted">Up to 60 MB and 120 pages. Pages are turned into images in your browser, so keep this tab open.</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Title <span className="text-admin-danger">*</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            required
            disabled={busy}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <label className="block text-sm font-medium">
          URL slug
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            disabled={busy}
            className={`mt-1.5 ${inputClass}`}
          />
          <span className="mt-1 block text-xs text-admin-muted">/project-magazines/{slugify(slug || title) || "…"}</span>
        </label>
        <label className="block text-sm font-medium">
          Kind
          <input name="kind" placeholder="e.g. Project Magazine Vol. 3, Helpers Digest" disabled={busy} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium">
          Period
          <input name="period" placeholder="e.g. January – March 2027" disabled={busy} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium">
          Partners
          <input name="partners" placeholder="e.g. FCDO · World Food Programme" disabled={busy} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium">
          Related story link
          <input name="story" placeholder="/blog/… (optional)" disabled={busy} className={`mt-1.5 ${inputClass}`} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Description
        <textarea name="description" rows={3} maxLength={600} disabled={busy} className={`mt-1.5 ${inputClass}`} />
      </label>
      <label className="block text-sm font-medium">
        Status
        <select name="status" defaultValue="published" disabled={busy} className={`mt-1.5 ${inputClass} max-w-xs`}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </label>

      {progress && (
        <div role="status" className="rounded-lg bg-admin-bg p-4 text-sm">
          <p className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> {progress.label}
          </p>
          <div className="mt-2 h-2 rounded-full bg-admin-border">
            <div className="h-2 rounded-full bg-admin-primary transition-all" style={{ width: `${(progress.done / Math.max(progress.total, 1)) * 100}%` }} />
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-lg bg-admin-danger-soft px-3.5 py-2.5 text-sm text-admin-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={buttonClass.primary}>
        <FileUp className="h-4 w-4" /> Upload and publish
      </button>
    </form>
  );
}
