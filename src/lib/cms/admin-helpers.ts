import "server-only";

import { notFound } from "next/navigation";

import { requirePageUser } from "@/lib/cms/auth";
import { can, COLLECTIONS, isCollectionName, type CollectionDef, type FieldDef, type FieldOption } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { withRelationOptions } from "@/lib/cms/relations";

export async function loadCollection(name: string) {
  if (!isCollectionName(name)) notFound();
  const def = COLLECTIONS[name];
  const user = await requirePageUser(def.permission);
  let items = (await readStore(name)) as unknown as Record<string, unknown>[];
  // Authors only see and manage their own posts.
  if (name === "posts" && !can(user, "posts.all")) items = items.filter((i) => i.authorId === user.id);
  return { def: await withRelationOptions(def), user, items };
}

/** The loaded choices of a definition's relation fields, for the item editor. */
export function relationOptionsOf(def: CollectionDef): Record<string, FieldOption[]> {
  return Object.fromEntries(def.fields.filter((f) => f.relation).map((f) => [f.name, f.options ?? []]));
}

const optionLabel = (field: FieldDef, value: string) => field.options?.find((o) => o.value === value)?.label ?? value;

/** Render a stored value as short text for list tables and search results. */
export function displayValue(field: FieldDef | undefined, value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  if (!field) return String(value);
  if (Array.isArray(value)) return value.map((v) => optionLabel(field, String(v))).join(", ");
  if (field.type === "boolean") return value ? "Yes" : "No";
  if (field.type === "number") return Number(value).toLocaleString("en-US");
  if (field.type === "file" || field.type === "image") return String(value).split("/").pop() ?? "";
  if (field.type === "select") return optionLabel(field, String(value));
  return String(value);
}
