import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";

import { PostEngagement } from "@/components/blog/post-engagement";
import { siteConfig } from "@/config/site";
import { getPostBySlug, getPublishedPosts } from "@/lib/cms/content";
import { isUnoptimized } from "@/lib/image";
import { formatPostDate, readingTime } from "@/lib/posts";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const related = (await getPublishedPosts(post.category)).filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All articles
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— {post.category}</p>
        <h1 className="mt-3 font-serif-display text-3xl font-light leading-tight text-foreground sm:text-5xl">{post.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5 text-primary" /> {post.author}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-primary" /> {formatPostDate(post.date)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {readingTime(post.content)}</span>
        </div>

        {post.featuredImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src={post.featuredImage}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              unoptimized={isUnoptimized(post.featuredImage)}
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose-post mt-10">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5 border-t border-border pt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        <PostEngagement
          slug={post.slug}
          title={post.title}
          url={`${siteConfig.url}/blog/${post.slug}`}
          image={post.featuredImage ? new URL(post.featuredImage, siteConfig.url).toString() : undefined}
        />

        {related.length > 0 && (
          <aside className="mt-14">
            <h2 className="font-serif-display text-2xl font-light text-foreground">More {post.category.toLowerCase()}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`} className="block rounded-2xl border border-border bg-card p-5 hover:border-primary/50">
                    <p className="font-semibold text-foreground">{p.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </main>
  );
}
