"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { saveItemAction } from "@/app/admin/actions";
import { buttonClass, inputClass } from "@/components/cms/ui";
import { slugify } from "@/lib/cms/schema";

export function QuickDraft() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string; id?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const res = await saveItemAction("posts", null, {
        title,
        slug: `${slugify(title)}-${Date.now().toString(36)}`,
        excerpt: content.slice(0, 180),
        content,
        status: "draft",
        date: new Date().toISOString().slice(0, 10),
        category: "News",
        tags: [],
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        setResult({ ok: true, text: "Draft saved.", id: res.id });
      } else {
        setResult({ ok: false, text: Object.values(res.errors ?? {})[0] ?? res.error ?? "Could not save." });
      }
    });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Draft title"
        required
        className={inputClass}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's the story?"
        aria-label="Draft content"
        rows={4}
        required
        className={inputClass}
      />
      <div className="flex items-center justify-between gap-3">
        {result ? (
          <p className={`text-xs ${result.ok ? "text-admin-success" : "text-admin-danger"}`} role="status">
            {result.text}{" "}
            {result.id && (
              <Link href={`/admin/content/posts/${result.id}`} className="font-semibold underline">
                Edit draft
              </Link>
            )}
          </p>
        ) : (
          <span />
        )}
        <button type="submit" className={buttonClass.primary} disabled={pending || !title.trim() || !content.trim()}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save draft
        </button>
      </div>
    </form>
  );
}
