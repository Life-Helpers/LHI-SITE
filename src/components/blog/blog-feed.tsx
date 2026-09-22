"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Tag, User } from "lucide-react";
import { type BlogPost, initialBlogPosts } from "@/lib/cms-crm-store";

export function BlogFeed() {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lhi_cms_posts");
        if (saved) {
          const parsed = JSON.parse(saved) as BlogPost[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load blog posts from localStorage", e);
      }
    }
  }, []);

  // Filter only published posts for the public view
  const publishedPosts = posts.filter((p) => p.status.toLowerCase() === "published");
  const categories = ["All", ...Array.from(new Set(publishedPosts.map((p) => p.category)))];

  const filtered = publishedPosts.filter((p) =>
    selectedCategory === "All" ? true : p.category === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
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

      {/* Grid of articles */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filtered.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
          >
            <div className="relative aspect-16/9 w-full bg-muted overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-primary/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {post.date}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                {post.title}
              </h2>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>

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

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>

                <Link
                  href={`/contact?subject=${encodeURIComponent(`Inquiry on ${post.title}`)}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <span>Discuss Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
