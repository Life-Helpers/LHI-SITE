import "server-only";

import { COLLECTIONS, type CollectionDef, type FieldOption } from "@/lib/cms/schema";
import { postProjects, projectPartnerIds } from "@/lib/cms/links";
import { readStore } from "@/lib/cms/store";
import type { CmsIntervention, CmsPost } from "@/lib/cms/types";

/** A collection definition with the choices of its relation fields filled in from the linked collections. */
export async function withRelationOptions(def: CollectionDef): Promise<CollectionDef> {
  if (!def.fields.some((f) => f.relation)) return def;
  const fields = await Promise.all(
    def.fields.map(async (f) => {
      if (!f.relation) return f;
      const target = COLLECTIONS[f.relation];
      const items = (await readStore(f.relation)) as unknown as Record<string, unknown>[];
      const options: FieldOption[] = items
        .map((i) => ({ value: String(i.id), label: String(i[target.titleField] ?? i.id) }))
        .sort((a, b) => a.label.localeCompare(b.label));
      return { ...f, options };
    }),
  );
  return { ...def, fields };
}

/** Relation values to show in the editor for a stored record (including the fallback links). */
export async function relationValues(collection: string, item: Record<string, unknown>) {
  if (collection === "posts" && item.projects === undefined) {
    return { ...item, projects: postProjects(item as unknown as CmsPost) };
  }
  if (collection === "interventions" && item.partnerIds === undefined) {
    return { ...item, partnerIds: projectPartnerIds(item as unknown as CmsIntervention, await readStore("partners")) };
  }
  return item;
}
