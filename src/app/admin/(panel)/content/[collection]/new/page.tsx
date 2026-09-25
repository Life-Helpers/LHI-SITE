import { notFound } from "next/navigation";

import { ItemEditor } from "@/components/cms/item-editor";
import { PageHeader } from "@/components/cms/ui";
import { loadCollection, relationOptionsOf } from "@/lib/cms/admin-helpers";

export default async function NewItemPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const { def, user } = await loadCollection(collection);
  if (def.fixed) notFound();

  const initial: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (f.type === "multiselect" || f.type === "list" || f.type === "images") initial[f.name] = [];
    else if (f.type === "boolean") initial[f.name] = f.name === "visible";
    else if (f.type === "select" && f.required) initial[f.name] = f.options?.[0]?.value ?? "";
    else if (f.type === "date") initial[f.name] = new Date().toISOString().slice(0, 10);
    else initial[f.name] = "";
  }
  if (def.name === "posts") {
    initial.status = "draft";
    initial.author = user.name;
  }

  return (
    <>
      <PageHeader
        title={`Add ${def.singular}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: def.label, href: `/admin/content/${def.name}` },
          { label: "Add new" },
        ]}
      />
      <ItemEditor collection={def.name} initial={initial} originalId={null} relationOptions={relationOptionsOf(def)} />
    </>
  );
}
