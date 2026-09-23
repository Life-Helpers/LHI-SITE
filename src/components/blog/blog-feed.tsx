"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Tag, User } from "lucide-react";

import { isUnoptimized } from "@/lib/image";
import type { CmsPost } from "@/lib/cms/types";
import { formatPostDate, readingTime } from "@/lib/posts";

const PAGE_SIZE = 12;

export function BlogFeed({ posts, paginate = false }: { posts: CmsPost[]; paginate?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const matching = posts.filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory));
  const filtered = paginate ? matching.slice(0, limit) : matching;

  // Deep links such as /blog?category=Newsletter open with that category selected.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    if (wanted && posts.some((p) => p.category === wanted)) setSelectedCategory(wanted);
  }, [posts]);

  const choose = (cat: string) => {
    setSelectedCategory(cat);
    setLimit(PAGE_SIZE);
    const url = new URL(window.location.href);
    if (cat === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", cat);
    window.history.replaceState(null, "", url);
  };

  if (posts.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No articles have been published yet.</p>;
  }

  return (
    <div className="space-y-8">
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => choose(cat)}
              aria-pressed={selectedCategory === cat}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filtered.map((post) => (
          <article
            key={post.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
          >
            <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
              {post.featuredImage && (
                <Image
                  src={post.featuredImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={isUnoptimized(post.featuredImage)}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {formatPostDate(post.date)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {readingTime(post.content)}
                </span>
              </div>

              <h2 className="font-serif-display mt-3 text-xl font-light text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

              {post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {paginate && matching.length > filtered.length && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:border-primary hover:text-primary"
          >
            Load more ({matching.length - filtered.length} more)
          </button>
        </div>
      )}
    </div>
  );
}
