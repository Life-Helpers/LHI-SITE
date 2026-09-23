"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { buttonClass } from "@/components/cms/ui";

export function DeleteMagazineButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={buttonClass.danger}
      onClick={() => {
        if (!confirm(`Delete “${title}” and its pages?`)) return;
        start(async () => {
          await fetch(`/api/admin/magazines?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
          router.refresh();
        });
      }}
    >
      <Trash2 className="h-4 w-4" /> Delete
    </button>
  );
}
