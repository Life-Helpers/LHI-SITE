import { notFound } from "next/navigation";

import { ItemEditor } from "@/components/cms/item-editor";
import { formatDate, PageHeader } from "@/components/cms/ui";
import { loadCollection, relationOptionsOf } from "@/lib/cms/admin-helpers";
import { relationValues } from "@/lib/cms/relations";

/** The page the item would appear on once live (so drafts can be previewed there), or null. */
function previewPath(def: { publicPath?: (item: Record<string, unknown>) => string | null }, item: Record<string, unknown>) {
  for (const status of ["published", "open", "active"]) {
    const path = def.publicPath?.({ ...item, status });
    if (path) return path.split("#")[0] || "/";
  }
  return null;
}

export default async function EditItemPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  const { def, items } = await loadCollection(collection);
  const stored = items.find((i) => String(i.id) === decodeURIComponent(id));
  if (!stored) notFound();
  const item = await relationValues(def.name, stored);

  const meta = [
    ...(item.updatedAt ? [{ label: "Last updated", value: formatDate(String(item.updatedAt), true) }] : []),
    ...(def.name === "posts" ? [{ label: "Author", value: String(item.author ?? "") }] : []),
  ];

  return (
    <>
      <PageHeader
        title={`Edit ${def.singular}`}
        description={String(item[def.titleField] ?? "")}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: def.label, href: `/admin/content/${def.name}` },
          { label: "Edit" },
        ]}
      />
      <ItemEditor collection={def.name} initial={def.fields.some((f) => f.name === "allowDownload") && item.allowDownload === undefined ? { ...item, allowDownload: true } : item} originalId={String(item.id)} viewHref={def.publicPath?.(item) ?? null}
        previewHref={previewPath(def, item)} meta={meta} relationOptions={relationOptionsOf(def)} />
    </>
  );
}
