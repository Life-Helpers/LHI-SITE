"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark, BookMarked, BookOpen, Download, Library, Newspaper, Search, ScrollText, X } from "lucide-react";

import { pageImage, PROGRESS_KEY, SAVED_KEY, SHELF_LABELS, shelfOf, type Magazine, type ShelfCategory } from "@/data/magazines";

type Filter = "all" | ShelfCategory | "saved";
type Progress = Record<string, { page: number; total: number; at: number }>;

const FILTERS: { id: Filter; label: string; icon: typeof Library }[] = [
  { id: "all", label: "All editions", icon: Library },
  { id: "magazines", label: SHELF_LABELS.magazines, icon: BookOpen },
  { id: "digest", label: "Helpers Digest", icon: ScrollText },
  { id: "newsletters", label: SHELF_LABELS.newsletters, icon: Newspaper },
  { id: "saved", label: "Saved", icon: Bookmark },
];

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

/** Bookshelf-style library of project magazines, bulletins and newsletters. Opening one leads to the flipbook. */
export function MagazineLibrary({ magazines }: { magazines: Magazine[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setSaved(readJson<string[]>(SAVED_KEY, []));
    setProgress(readJson<Progress>(PROGRESS_KEY, {}));
  }, []);

  const toggleSave = (slug: string) =>
    setSaved((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {
        /* saving is a convenience only */
      }
      return next;
    });

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: magazines.length, magazines: 0, digest: 0, newsletters: 0, saved: 0 };
    for (const m of magazines) c[shelfOf(m)]++;
    c.saved = magazines.filter((m) => saved.includes(m.slug)).length;
    return c;
  }, [magazines, saved]);

  const q = query.trim().toLowerCase();
  const results = magazines.filter(
    (m) =>
      (filter === "all" || (filter === "saved" ? saved.includes(m.slug) : shelfOf(m) === filter)) &&
      (!q || [m.title, m.kind, m.period, m.description, m.partners].some((v) => v.toLowerCase().includes(q))),
  );
  const browsing = filter === "all" && !q;
  const continueReading = magazines
    .filter((m) => progress[m.slug] && progress[m.slug].page < progress[m.slug].total)
    .sort((a, b) => progress[b.slug].at - progress[a.slug].at)[0];
  const featured = magazines.slice(0, 3);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-[2rem] border border-[#eadfce] bg-[#fbf7f1] shadow-[0_40px_80px_-40px_rgba(90,60,20,0.35)] dark:border-white/10 dark:bg-[#17130f] lg:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="hidden flex-col border-r border-dashed border-[#e3d5c1] p-6 dark:border-white/10 lg:flex">
        <p className="flex items-center gap-2 font-serif-display text-xl font-medium text-foreground">
          <BookMarked className="h-5 w-5 text-primary" aria-hidden="true" /> LHI Library
        </p>
        <nav aria-label="Library shelves" className="mt-8 space-y-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                filter === f.id ? "bg-[#f0e4d3] text-foreground shadow-sm dark:bg-white/10" : "text-muted-foreground hover:bg-[#f4ebdf] hover:text-foreground dark:hover:bg-white/5"
              }`}
            >
              <f.icon className={`h-4 w-4 ${filter === f.id ? "text-primary" : ""}`} aria-hidden="true" />
              <span className="flex-1">{f.label}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{counts[f.id]}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          {continueReading ? (
            <ContinueCard magazine={continueReading} p={progress[continueReading.slug]} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e3d5c1] p-4 text-xs text-muted-foreground dark:border-white/10">
              Open any edition and we&apos;ll keep your place here.
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 p-5 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          <div role="group" aria-label="Filter editions" className="flex flex-wrap gap-2 lg:hidden">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-white text-foreground ring-1 ring-[#eadfce] hover:ring-primary dark:bg-white/5 dark:ring-white/10"
                }`}
              >
                <f.icon className="h-3.5 w-3.5" aria-hidden="true" /> {f.id === "all" ? "All" : f.label}
              </button>
            ))}
          </div>
          <label className="relative block w-full lg:max-w-sm">
            <span className="sr-only">Search magazines</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, projects or partners…"
              className="w-full rounded-full border border-[#eadfce] bg-white py-2.5 pl-11 pr-10 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        {continueReading && (
          <div className="mt-6 lg:hidden">
            <ContinueCard magazine={continueReading} p={progress[continueReading.slug]} />
          </div>
        )}

        {browsing ? (
          <>
            {/* Featured shelf */}
            <section aria-labelledby="featured-heading" className="mt-8 grid grid-cols-1 items-end gap-8 rounded-[1.75rem] bg-gradient-to-br from-[#f6ecdf] to-[#fbf7f1] p-6 dark:from-white/[0.06] dark:to-transparent sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <div className="self-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Newest on the shelf</p>
                <h2 id="featured-heading" className="mt-3 font-serif-display text-4xl font-light leading-[1.05] text-foreground sm:text-5xl">
                  Fresh from <em className="italic text-primary">the field.</em>
                </h2>
                <p className="mt-3 line-clamp-4 max-w-sm text-sm text-muted-foreground">{featured[0]?.description}</p>
                {featured[0] && (
                  <Link
                    href={`/project-magazines/${featured[0].slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" /> Read the latest
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="flex items-end justify-center gap-3 px-2 sm:gap-4">
                  {featured.map((m, i) => (
                    <Cover
                      key={m.slug}
                      magazine={m}
                      size={i === 0 ? "xl" : "lg"}
                      saved={saved.includes(m.slug)}
                      onToggleSave={toggleSave}
                      className={i === 0 ? "" : i === 2 ? "hidden sm:block" : ""}
                    />
                  ))}
                </div>
                <Plank />
              </div>
            </section>

            {(Object.keys(SHELF_LABELS) as ShelfCategory[]).map((cat) => {
              const items = magazines.filter((m) => shelfOf(m) === cat);
              if (!items.length) return null;
              return (
                <Shelf
                  key={cat}
                  title={SHELF_LABELS[cat]}
                  count={items.length}
                  onViewAll={() => setFilter(cat)}
                  items={items}
                  saved={saved}
                  progress={progress}
                  onToggleSave={toggleSave}
                />
              );
            })}
          </>
        ) : (
          <section aria-live="polite" className="mt-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif-display text-2xl font-light text-foreground">
                {q ? `Results for “${query.trim()}”` : filter === "saved" ? "Your saved editions" : SHELF_LABELS[filter as ShelfCategory]}
              </h2>
              <span className="text-xs text-muted-foreground">
                {results.length} {results.length === 1 ? "edition" : "editions"}
              </span>
            </div>
            {results.length === 0 ? (
              <p className="mt-10 rounded-2xl border border-dashed border-[#e3d5c1] p-10 text-center text-sm text-muted-foreground dark:border-white/10">
                {filter === "saved" ? "Tap the bookmark on any cover to save it here." : "Nothing matches that search yet."}
              </p>
            ) : (
              <ul className="mt-6 grid grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {results.map((m) => (
                  <li key={m.slug} className="flex flex-col">
                    <div className="relative px-3">
                      <div className="flex justify-center">
                        <Cover magazine={m} size="md" saved={saved.includes(m.slug)} onToggleSave={toggleSave} />
                      </div>
                      <Plank />
                    </div>
                    <Caption magazine={m} progress={progress[m.slug]} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Plank() {
  return (
    <div aria-hidden="true" className="relative -mt-px">
      <div className="h-3 rounded-t-sm bg-gradient-to-b from-[#f3e9dc] to-[#e2d2bd] dark:from-[#3d3228] dark:to-[#30271f]" />
      <div className="h-2 rounded-b-md bg-[#d6c3aa] shadow-[0_14px_20px_-10px_rgba(90,60,20,0.55)] dark:bg-[#251e18]" />
    </div>
  );
}

const SIZES = {
  md: "h-44 sm:h-52",
  lg: "h-44 sm:h-56",
  xl: "h-56 sm:h-72",
};

function Cover({
  magazine,
  size,
  saved,
  onToggleSave,
  className = "",
}: {
  magazine: Magazine;
  size: keyof typeof SIZES;
  saved: boolean;
  onToggleSave: (slug: string) => void;
  className?: string;
}) {
  return (
    <div className={`group relative shrink-0 [perspective:1200px] ${className}`}>
      <Link href={`/project-magazines/${magazine.slug}`} aria-label={`Open ${magazine.title}`} className="block">
        <div
          className={`relative aspect-[550/778] ${SIZES[size]} overflow-hidden rounded-r-lg rounded-l-[3px] shadow-[6px_10px_18px_-6px_rgba(40,25,10,0.55)] transition-transform duration-500 [transform-origin:left_bottom] group-hover:-translate-y-2 group-hover:[transform:rotateY(-12deg)_translateY(-8px)]`}
        >
          <Image
            src={pageImage(magazine, 1)}
            alt={`${magazine.title} cover`}
            fill
            sizes={size === "xl" ? "240px" : "180px"}
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
          <span className="pointer-events-none absolute inset-y-0 left-3 w-px bg-white/25" />
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onToggleSave(magazine.slug)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${magazine.title} from saved` : `Save ${magazine.title}`}
        className={`absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-1 transition-all ${
          saved ? "bg-primary text-primary-foreground ring-primary" : "bg-white/95 text-foreground ring-black/5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
        }`}
      >
        <Bookmark className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
      </button>
    </div>
  );
}

function Caption({ magazine, progress }: { magazine: Magazine; progress?: { page: number; total: number } }) {
  return (
    <div className="mt-4 px-3">
      <Link href={`/project-magazines/${magazine.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary">
        {magazine.title}
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">
        {magazine.period} · {magazine.pages} {magazine.pages === 1 ? "page" : "pages"}
      </p>
      {progress && progress.page < progress.total && (
        <div className="mt-2 h-1 rounded-full bg-[#eadfce] dark:bg-white/10" aria-label={`Read to page ${progress.page} of ${progress.total}`}>
          <div className="h-1 rounded-full bg-primary" style={{ width: `${(progress.page / progress.total) * 100}%` }} />
        </div>
      )}
      <a href={magazine.pdf} download data-title={magazine.title} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary">
        <Download className="h-3 w-3" aria-hidden="true" /> PDF
      </a>
    </div>
  );
}

function Shelf({
  title,
  count,
  onViewAll,
  items,
  saved,
  progress,
  onToggleSave,
}: {
  title: string;
  count: number;
  onViewAll: () => void;
  items: Magazine[];
  saved: string[];
  progress: Progress;
  onToggleSave: (slug: string) => void;
}) {
  return (
    <section className="mt-12" aria-label={title}>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif-display text-2xl font-light text-foreground">
          {title} <span className="text-sm text-muted-foreground">({count})</span>
        </h2>
        <button type="button" onClick={onViewAll} className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary">
          Full shelf <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-5 overflow-x-auto pb-2 [scrollbar-width:thin]">
        <ul className="flex min-w-max gap-2">
          {items.map((m) => (
            <li key={m.slug} className="w-44 sm:w-48">
              <div className="relative px-3 pt-3">
                <div className="flex justify-center">
                  <Cover magazine={m} size="md" saved={saved.includes(m.slug)} onToggleSave={onToggleSave} />
                </div>
                <Plank />
              </div>
              <Caption magazine={m} progress={progress[m.slug]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ContinueCard({ magazine, p }: { magazine: Magazine; p: Progress[string] }) {
  return (
    <Link
      href={`/project-magazines/${magazine.slug}?page=${p.page}`}
      className="block rounded-2xl border border-[#eadfce] bg-white/70 p-4 transition-colors hover:border-primary dark:border-white/10 dark:bg-white/5"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Continue reading</p>
      <div className="mt-3 flex gap-3">
        <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-r-md rounded-l-sm shadow-md">
          <Image src={pageImage(magazine, 1)} alt="" fill sizes="56px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">{magazine.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Page {p.page} of {p.total}
          </p>
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-[#eadfce] dark:bg-white/10" aria-hidden="true">
        <div
          className="h-1.5 rounded-full bg-primary"
          style={{ width: `${(p.page / p.total) * 100}%` }}
        />
      </div>
    </Link>
  );
}
