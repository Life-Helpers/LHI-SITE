import Link from "next/link";

import { Badge, Card, PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { can, COLLECTION_NAMES, COLLECTIONS } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await requirePageUser();
  const q = ((await searchParams).q ?? "").trim().toLowerCase();

  const results: { collection: string; label: string; id: string; title: string }[] = [];
  if (q) {
    for (const name of COLLECTION_NAMES) {
      const def = COLLECTIONS[name];
      if (!can(user, def.permission)) continue;
      let items = (await readStore(name)) as unknown as Record<string, unknown>[];
      if (name === "posts" && !can(user, "posts.all")) items = items.filter((i) => i.authorId === user.id);
      for (const item of items) {
        const haystack = def.fields
          .filter((f) => ["text", "textarea", "markdown", "list", "slug"].includes(f.type))
          .map((f) => (Array.isArray(item[f.name]) ? (item[f.name] as string[]).join(" ") : String(item[f.name] ?? "")))
          .join(" ")
          .toLowerCase();
        if (haystack.includes(q)) {
          results.push({ collection: name, label: def.singular, id: String(item.id), title: String(item[def.titleField] ?? "") });
        }
      }
    }
  }

  return (
    <>
      <PageHeader
        title={q ? `Search results for “${q}”` : "Search"}
        description={q ? `${results.length} matches` : "Use the search bar at the top of the page."}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Search" }]}
      />
      {q && (
        <Card bodyClassName="divide-y divide-admin-border p-0">
          {results.slice(0, 100).map((r) => (
            <Link
              key={`${r.collection}-${r.id}`}
              href={`/admin/content/${r.collection}/${encodeURIComponent(r.id)}`}
              className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-admin-bg/60"
            >
              <span className="truncate text-sm font-medium">{r.title}</span>
              <Badge tone="primary">{r.label}</Badge>
            </Link>
          ))}
          {results.length === 0 && <p className="px-5 py-12 text-center text-sm text-admin-muted">Nothing matched.</p>}
        </Card>
      )}
    </>
  );
}
