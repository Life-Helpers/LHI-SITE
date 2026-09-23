import "server-only";

/** Read a trimmed text field from multipart form data, capped at `max` characters. */
export function text(form: FormData, key: string, max = 2000) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function file(form: FormData, key: string) {
  const v = form.get(key);
  return v instanceof File && v.size > 0 ? v : null;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
