import Link from "next/link";
import { Plus } from "lucide-react";

import { CollectionTable, type TableColumn, type TableRow } from "@/components/cms/collection-table";
import { buttonClass, PageHeader } from "@/components/cms/ui";
import { displayValue, loadCollection } from "@/lib/cms/admin-helpers";

export default async function CollectionListPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const { def, items } = await loadCollection(collection);

  const fieldByName = new Map(def.fields.map((f) => [f.name, f]));
  const statusField = def.statusField ? fieldByName.get(def.statusField) : undefined;
  const imageField = def.fields.find((f) => f.type === "image");

  const columns: TableColumn[] = def.columns
    .filter((c) => c !== def.titleField)
    .map((key) => ({
      key,
      label: fieldByName.get(key)?.label ?? key,
      kind:
        key === def.statusField || fieldByName.get(key)?.type === "boolean"
          ? "status"
          : fieldByName.get(key)?.type === "date"
            ? "date"
            : "text",
    }));

  const rows: TableRow[] = items.map((item) => {
    const id = String(item.id);
    return {
      id,
      title: String(item[def.titleField] ?? ""),
      editHref: `/admin/content/${def.name}/${encodeURIComponent(id)}`,
      viewHref: def.publicPath?.(item) ?? null,
      thumb: imageField ? String(item[imageField.name] || "") || undefined : undefined,
      canDelete: !def.fixed,
      status: statusField ? String(item[statusField.name] ?? "") : undefined,
      cells: Object.fromEntries(columns.map((c) => [c.key, displayValue(fieldByName.get(c.key), item[c.key])])),
    };
  });

  return (
    <>
      <PageHeader
        title={def.label}
        description={def.description}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: def.label }]}
        actions={
          !def.fixed && (
            <Link href={`/admin/content/${def.name}/new`} className={buttonClass.primary}>
              <Plus className="h-4 w-4" /> Add {def.singular}
            </Link>
          )
        }
      />
      <CollectionTable
        collection={def.name}
        columns={columns}
        rows={rows}
        singular={def.singular}
        statusOptions={statusField?.options?.map((o) => o.value)}
      />
    </>
  );
}
