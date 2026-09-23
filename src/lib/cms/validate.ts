import { slugify, type CollectionDef, type FieldDef } from "@/lib/cms/schema";

export type FieldErrors = Record<string, string>;

const isSafeAssetUrl = (v: string) => v === "" || v.startsWith("/") || /^https:\/\//.test(v);

function coerceField(field: FieldDef, raw: unknown): { value: unknown; error?: string } {
  const empty = (msg = `${field.label} is required.`) => ({ value: raw, error: msg });

  switch (field.type) {
    case "number": {
      if (raw === "" || raw === null || raw === undefined) {
        return field.required ? empty() : { value: 0 };
      }
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) return { value: raw, error: `${field.label} must be a positive number.` };
      return { value: n };
    }
    case "boolean":
      return { value: raw === true || raw === "true" || raw === "on" };
    case "multiselect":
    case "list":
    case "images": {
      const arr = (Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split("\n") : [])
        .map((v) => String(v).trim())
        .filter(Boolean);
      if (field.type === "multiselect") {
        const allowed = new Set(field.options?.map((o) => o.value));
        if (arr.some((v) => !allowed.has(v))) return { value: arr, error: `${field.label} has an invalid choice.` };
      }
      if (field.type === "images" && arr.some((v) => !isSafeAssetUrl(v))) {
        return { value: arr, error: `${field.label} must be uploaded images or https:// links.` };
      }
      if (field.required && arr.length === 0) return empty();
      return { value: Array.from(new Set(arr)) };
    }
    default: {
      let v = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
      if (field.type === "slug") v = slugify(v);
      if (!v) return field.required ? empty() : { value: "" };
      if (field.type === "select" && !field.options?.some((o) => o.value === v)) {
        return { value: v, error: `${field.label} has an invalid choice.` };
      }
      if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { value: v, error: `${field.label} must be a date.` };
      if (field.type === "url" && !/^https?:\/\//.test(v)) return { value: v, error: `${field.label} must start with https://` };
      if ((field.type === "image" || field.type === "file" || field.type === "audio") && !isSafeAssetUrl(v)) {
        return { value: v, error: `${field.label} must be an uploaded file or an https:// link.` };
      }
      if (field.type === "text" && v.length > 300) return { value: v, error: `${field.label} is too long.` };
      return { value: v };
    }
  }
}

/** Validate and coerce raw editor values against a collection definition. Unknown keys are dropped. */
export function validateRecord(def: CollectionDef, input: Record<string, unknown>) {
  const record: Record<string, unknown> = {};
  const errors: FieldErrors = {};
  for (const field of def.fields) {
    const { value, error } = coerceField(field, input[field.name]);
    record[field.name] = value;
    if (error) errors[field.name] = error;
  }
  return { record, errors };
}
