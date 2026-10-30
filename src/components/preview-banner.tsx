import { draftMode } from "next/headers";

/** Shown across the site while an editor is previewing drafts. */
export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-[90] flex flex-wrap items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-semibold text-black shadow-lg">
      Preview: you are seeing drafts and unpublished changes. Visitors don&apos;t see these.
      <a href="/api/admin/preview?exit=1" className="rounded-full bg-black px-3 py-1 text-xs text-white hover:bg-black/80">
        Exit preview
      </a>
    </div>
  );
}
