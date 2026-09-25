import { notFound } from "next/navigation";

import { ItemEditor } from "@/components/cms/item-editor";
import { formatDate, PageHeader } from "@/components/cms/ui";
import { loadCollection, relationOptionsOf } from "@/lib/cms/admin-helpers";
import { relationValues } from "@/lib/cms/relations";

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
      <ItemEditor collection={def.name} initial={item} originalId={String(item.id)} viewHref={def.publicPath?.(item) ?? null} meta={meta} relationOptions={relationOptionsOf(def)} />
    </>
  );
}
