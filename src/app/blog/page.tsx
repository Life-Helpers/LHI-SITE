import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BookOpenText, Download, Mail, Radio } from "lucide-react";

import { BlogFeed } from "@/components/blog/blog-feed";
import { EventDateTile } from "@/components/events/event-date-tile";
import { NewsletterForm } from "@/components/news/newsletter-form";
import { SocialLinks } from "@/components/social-links";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { MAGAZINES } from "@/data/magazines";
import { OBSERVANCE_AREAS } from "@/data/observances";
import { PUBLICATIONS } from "@/data/publication-stories";
import { getCalendarEvents, getPublishedPosts } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "LHI Blog & Newsletter",
  description:
    "News, field stories, success stories, the LHI newsletter, Helpers Digest bulletins and project magazines from Life Helpers Initiative, with free PDF downloads.",
};

export default async function BlogPage() {
  const [posts, events] = await Promise.all([getPublishedPosts(), getCalendarEvents(120)]);
  const upcoming = events.slice(0, 4);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— News, Stories & Newsletter"
        title={
          <>
            LHI <em className="font-light italic text-primary">Blog &amp; Newsletter.</em>
          </>
        }
        subtitle="Field news, stories of change, our newsletters and project magazines, all in one place."
        description="Follow LHI's projects across Nigeria, read the Helpers Digest and our newsletters, and download our publications."
        image={{ ...LHI_PHOTOS.gidanArzikiCommissioning, tag: "Gidan Arziki commissioning, April 2026" }}
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <h2 className="mb-8 font-serif-display text-3xl font-light text-foreground">Latest stories</h2>
            <BlogFeed posts={posts} paginate />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div id="subscribe" className="scroll-mt-32 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif-display text-xl font-medium text-foreground">Subscribe to our newsletter</h3>
                <p className="mt-2 text-xs text-muted-foreground">Receive LHI news, project magazines and stories of change in your inbox.</p>
                <NewsletterForm />
                <Link href="/blog?category=Newsletter" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
                  Read past newsletters →
                </Link>
              </div>

              {upcoming.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Upcoming days &amp; events</h3>
                  <ul className="mt-4 space-y-4">
                    {upcoming.map((e) => (
                      <li key={`${e.id}-${e.start}`} className="flex items-center gap-3">
                        <EventDateTile event={e} />
                        <div className="min-w-0">
                          <Link href={`/events#${e.id}`} className="text-sm font-semibold leading-snug text-foreground hover:text-primary">
                            {e.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{OBSERVANCE_AREAS[e.area].label}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link href="/events" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                    Full calendar &amp; add to calendar →
                  </Link>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card p-6">
                <Radio className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-foreground">Voices of the People (VOP)</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  WeSpeak (Muyi Magana) on Radio Nigeria, Royal FM 101.5, Sokoto. Every Tuesday, 11:00 AM – 12:00 PM.
                </p>
                <Link href="/radio" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                  Listen to VOP →
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Follow LHI</h3>
                <SocialLinks className="mt-4" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="publications" aria-labelledby="publications-heading" className="scroll-mt-24 border-t border-border bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Publications</p>
          <h2 id="publications-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Newsletters, bulletins &amp; project magazines
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLICATIONS.map((pub) => {
              const magazine = MAGAZINES.find((m) => m.pdf === pub.pdf);
              return (
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
                      {magazine && (
                        <Link
                          href={`/project-magazines/${magazine.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-background hover:opacity-90"
                        >
                          <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" /> Flip
                        </Link>
                      )}
                      <Link
                        href={pub.post}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                      >
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Read
                      </Link>
                      <a
                        href={pub.pdf}
                        download
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:bg-muted"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <BookOpen className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">Contribute or inquire about research</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Are you an academic researcher, monitoring specialist or development partner interested in collaborating on field research?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Contact the team
              </Link>
              <Link
                href="/interventions/projectandintervention"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                All projects &amp; interventions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
