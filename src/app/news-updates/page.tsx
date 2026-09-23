import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BookOpenText, Download, Mail, Radio } from "lucide-react";

import { BlogFeed } from "@/components/blog/blog-feed";
import { NewsletterForm } from "@/components/news/newsletter-form";
import { SocialLinks } from "@/components/social-links";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { MAGAZINES } from "@/data/magazines";
import { PUBLICATIONS } from "@/data/publication-stories";
import { getPublishedPosts } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "News, Newsletter & Magazines",
  description:
    "Latest news, press releases, the LHI newsletter and project magazines from Life Helpers Initiative, with free PDF downloads.",
};

export default async function NewsUpdatesPage() {
  const posts = (await getPublishedPosts()).filter((p) =>
    ["News", "Press Release", "Events", "Newsletter"].includes(p.category),
  );

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— News & Newsletter"
        title={
          <>
            News &amp; <em className="font-light italic text-primary">Updates.</em>
          </>
        }
        subtitle="Field news, press releases, our newsletter and project magazines."
        description="Follow the milestones of LHI's projects across Nigeria, from the Gidan Arziki hub in Katsina to learning centres in Sokoto, and download our publications."
        image={{ ...LHI_PHOTOS.gidanArzikiCommissioning, tag: "Gidan Arziki commissioning, April 2026" }}
      />

      <section id="publications" aria-labelledby="publications-heading" className="border-b border-border bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Publications</p>
          <h2 id="publications-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Newsletter &amp; project magazines
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLICATIONS.map((pub) => (
              <article key={pub.pdf} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative aspect-[4/3]">
                  <Image src={pub.image.src} alt={pub.image.alt} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {pub.kind}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{pub.period}</p>
                  <h3 className="mt-1 font-semibold leading-snug text-foreground">{pub.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{pub.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {MAGAZINES.some((m) => m.pdf === pub.pdf) && (
                      <Link
                        href={`/project-magazines/${MAGAZINES.find((m) => m.pdf === pub.pdf)!.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-background hover:opacity-90"
                      >
                        <BookOpenText className="h-3.5 w-3.5" /> Flip
                      </Link>
                    )}
                    <Link href={pub.post} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                      <BookOpen className="h-3.5 w-3.5" /> Read
                    </Link>
                    <a href={pub.pdf} download className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="mb-8 font-serif-display text-3xl font-light text-foreground">Latest news</h2>
              <BlogFeed posts={posts} />
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div id="subscribe" className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Mail size={20} />
                  </div>
                  <h3 className="mt-4 font-serif-display text-xl font-medium text-foreground">Subscribe to our newsletter</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Receive LHI news, project magazines and stories of change in your inbox.
                  </p>
                  <NewsletterForm />
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <Radio className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold text-foreground">WeSpeak (Muyi Magana) on radio</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Radio Nigeria, Royal FM 101.5, Sokoto. Every Tuesday, 11:00 AM – 12:00 PM.
                  </p>
                  <Link href="/radio" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                    About the programme →
                  </Link>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Follow LHI</h3>
                  <SocialLinks className="mt-4" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
