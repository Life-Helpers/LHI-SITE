import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { searchSite } from "@/lib/search";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

const SUGGESTIONS = ["malaria", "GSLA savings", "girls' education", "safeguarding course", "Sokoto", "nutrition", "vacancy"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const results = query ? await searchSite(query) : [];

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Search</p>
        <h1 className="mt-2 font-serif-display text-4xl font-light text-foreground">Search the site</h1>
        <form action="/search" role="search" className="mt-6 flex gap-2">
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Stories, projects, courses, vacancies…"
            autoFocus
            className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            <Search className="h-4 w-4" aria-hidden="true" /> Search
          </button>
        </form>

        {!query ? (
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">Try:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-muted-foreground" role="status">
              {results.length === 0
                ? `No results for “${query}”. Try fewer or different words.`
                : `${results.length}${results.length === 60 ? "+" : ""} ${results.length === 1 ? "result" : "results"} for “${query}”`}
            </p>
            <ol className="mt-4 divide-y divide-border">
              {results.map((r) => (
                <li key={`${r.type}-${r.href}`} className="py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{r.type}</p>
                  <Link href={r.href} className="mt-1 block text-lg font-semibold text-foreground hover:text-primary">
                    {r.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </main>
  );
}
