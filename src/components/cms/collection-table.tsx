"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Pencil, Search, Trash2 } from "lucide-react";

import { deleteItemAction } from "@/app/admin/actions";
import { Badge, buttonClass, inputClass, statusTone } from "@/components/cms/ui";

export interface TableColumn {
  key: string;
  label: string;
  kind?: "status" | "date" | "text";
}

export interface TableRow {
  id: string;
  title: string;
  editHref: string;
  viewHref?: string | null;
  thumb?: string;
  canDelete: boolean;
  status?: string;
  cells: Record<string, string>;
}

const PAGE_SIZE = 20;

export function CollectionTable({
  collection,
  columns,
  rows,
  statusOptions,
  singular,
}: {
  collection: string;
  columns: TableColumn[];
  rows: TableRow[];
  statusOptions?: string[];
  singular: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((r) => {
      if (r.status) c[r.status] = (c[r.status] ?? 0) + 1;
    });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (!q || r.title.toLowerCase().includes(q) || Object.values(r.cells).some((v) => v.toLowerCase().includes(q))),
    );
    if (sort) {
      list = [...list].sort((a, b) => {
        const av = sort.key === "__title" ? a.title : a.cells[sort.key] ?? "";
        const bv = sort.key === "__title" ? b.title : b.cells[sort.key] ?? "";
        return av.localeCompare(bv, undefined, { numeric: true }) * sort.dir;
      });
    }
    return list;
  }, [rows, query, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const deletable = visible.filter((r) => r.canDelete).map((r) => r.id);

  const remove = (ids: string[]) => {
    if (!ids.length) return;
    const label = ids.length === 1 ? `this ${singular.toLowerCase()}` : `${ids.length} items`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    setError("");
    startTransition(async () => {
      for (const id of ids) {
        const res = await deleteItemAction(collection, id);
        if (!res.ok) {
          setError(res.error ?? "Delete failed.");
          break;
        }
      }
      setSelected([]);
      router.refresh();
    });
  };

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  const SortIcon = ({ k }: { k: string }) =>
    sort?.key === k ? sort.dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" /> : null;

  return (
    <div className="rounded-xl border border-admin-border bg-admin-card">
      <div className="flex flex-col gap-3 border-b border-admin-border p-4 lg:flex-row lg:items-center lg:justify-between">
        {statusOptions && statusOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1 text-sm" role="tablist" aria-label="Filter by status">
            {["all", ...statusOptions].map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={status === s}
                onClick={() => {
                  setStatus(s);
                  setPage(0);
                }}
                className={`rounded-lg px-3 py-1.5 font-medium capitalize ${
                  status === s ? "bg-admin-primary-soft text-admin-primary" : "text-admin-muted hover:bg-admin-bg"
                }`}
              >
                {s} <span className="ml-0.5 text-xs opacity-70">({counts[s] ?? 0})</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-admin-muted">{rows.length} items</p>
        )}
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button type="button" onClick={() => remove(selected)} className={buttonClass.danger} disabled={pending}>
              <Trash2 className="h-4 w-4" /> Delete {selected.length}
            </button>
          )}
          <div className="relative w-full lg:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={`Search ${singular.toLowerCase()}s…`}
              aria-label="Search"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>
      </div>

      {error && <p className="border-b border-admin-border bg-admin-danger-soft px-4 py-2 text-sm text-admin-danger">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-[11px] font-bold uppercase tracking-wider text-admin-muted">
              <th className="w-10 px-4 py-3">
                {deletable.length > 0 && (
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    className="accent-admin-primary"
                    checked={deletable.length > 0 && deletable.every((id) => selected.includes(id))}
                    onChange={(e) => setSelected(e.target.checked ? deletable : [])}
                  />
                )}
              </th>
              <th className="px-4 py-3">
                <button type="button" onClick={() => toggleSort("__title")} className="inline-flex items-center gap-1 uppercase">
                  Title <SortIcon k="__title" />
                </button>
              </th>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 uppercase">
                    {c.label} <SortIcon k={c.key} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="group border-b border-admin-border last:border-0 hover:bg-admin-bg/60">
                <td className="px-4 py-3 align-top">
                  {row.canDelete && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.title}`}
                      className="accent-admin-primary"
                      checked={selected.includes(row.id)}
                      onChange={(e) =>
                        setSelected((s) => (e.target.checked ? [...s, row.id] : s.filter((id) => id !== row.id)))
                      }
                    />
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex items-start gap-3">
                    {row.thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.thumb} alt="" referrerPolicy="no-referrer" className="h-10 w-14 shrink-0 rounded-md bg-admin-bg object-cover" />
                    )}
                    <div className="min-w-0">
                      <Link href={row.editHref} className="font-semibold text-admin-text hover:text-admin-primary">
                        {row.title || "(untitled)"}
                      </Link>
                      <div className="mt-1 flex gap-3 text-xs text-admin-muted opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                        <Link href={row.editHref} className="inline-flex items-center gap-1 hover:text-admin-primary">
                          <Pencil className="h-3 w-3" /> Edit
                        </Link>
                        {row.viewHref && (
                          <a href={row.viewHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-admin-primary">
                            <ExternalLink className="h-3 w-3" /> View
                          </a>
                        )}
                        {row.canDelete && (
                          <button type="button" onClick={() => remove([row.id])} className="inline-flex items-center gap-1 text-admin-danger">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-top text-admin-muted">
                    {c.kind === "date" ? (
                      <span className="whitespace-nowrap">{row.cells[c.key] || "—"}</span>
                    ) : c.kind === "status" ? (
                      <Badge tone={statusTone(row.cells[c.key])}>{row.cells[c.key]}</Badge>
                    ) : (
                      <span className="line-clamp-2">{row.cells[c.key] || "—"}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-sm text-admin-muted">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-admin-border px-4 py-3 text-xs text-admin-muted">
        <span>
          {filtered.length === 0 ? 0 : current * PAGE_SIZE + 1}–{Math.min(filtered.length, (current + 1) * PAGE_SIZE)} of{" "}
          {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          <button type="button" className={buttonClass.secondary} disabled={current === 0} onClick={() => setPage(current - 1)}>
            Previous
          </button>
          <button type="button" className={buttonClass.secondary} disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
