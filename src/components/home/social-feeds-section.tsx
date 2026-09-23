import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { SOCIAL_ACCOUNTS, SocialIcon } from "@/components/social-links";
import { siteConfig } from "@/config/site";
import { isUnoptimized } from "@/lib/image";
import type { CmsPost } from "@/lib/cms/types";
import { formatPostDate } from "@/lib/posts";

/**
 * Social media on the home page: the live Facebook Page timeline (official page
 * plugin, no API key needed), follow cards for every verified account, and the
 * latest updates published through the CMS.
 */
export function SocialFeedsSection({ posts }: { posts: CmsPost[] }) {
  const fbPlugin = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    siteConfig.social.facebook,
  )}&tabs=timeline&width=500&height=640&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <section aria-labelledby="social-heading" className="border-t border-border bg-muted/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Follow our work</p>
          <h2 id="social-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Life Helpers Initiative on social media
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Field updates, stories and events as they happen, from our official accounts.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Live Facebook timeline */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card lg:col-span-5">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <SocialIcon path={SOCIAL_ACCOUNTS[0].path} className="h-4 w-4 text-[#0866FF]" /> Live on Facebook
              </span>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Open page <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <iframe
              src={fbPlugin}
              title="Life Helpers Initiative Facebook timeline"
              loading="lazy"
              className="h-[640px] w-full border-0"
              allow="encrypted-media; picture-in-picture; web-share"
            />
          </div>

          <div className="space-y-8 lg:col-span-7">
            {/* Follow cards */}
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SOCIAL_ACCOUNTS.map((a) => (
                <li key={a.name}>
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: a.color }}>
                      <SocialIcon path={a.path} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{a.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{a.handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Latest updates from the CMS */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Latest updates</h3>
                <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  All updates <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="group flex gap-4 rounded-2xl border border-border bg-card p-3 transition-colors hover:border-primary/50">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {post.featuredImage && (
                          <Image src={post.featuredImage} alt="" fill sizes="112px" unoptimized={isUnoptimized(post.featuredImage)} className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 py-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                          {post.category} · {formatPostDate(post.date)}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">{post.title}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
