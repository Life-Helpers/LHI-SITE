import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

import { Flipbook } from "@/components/magazines/flipbook";
import { MAGAZINES, pageImage } from "@/data/magazines";
import { getAllMagazines, getAnyMagazine } from "@/lib/cms/content";

export const revalidate = 300;

export function generateStaticParams() {
  return MAGAZINES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = await getAnyMagazine((await params).slug);
  if (!m) return {};
  return {
    title: `${m.title} | Project Magazines`,
    description: m.description,
    alternates: { canonical: `/project-magazines/${m.slug}` },
    openGraph: { title: m.title, description: m.description, images: [{ url: pageImage(m, 1) }] },
  };
}

export default async function MagazineReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const magazine = await getAnyMagazine((await params).slug);
  if (!magazine) notFound();
  const others = (await getAllMagazines()).filter((m) => m.slug !== magazine.slug);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pt-20">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-5 sm:px-0">
          <div>
            <Link href="/project-magazines" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> All magazines
            </Link>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-accent">
              {magazine.kind} · {magazine.period}
            </p>
            <h1 className="mt-1 font-serif-display text-2xl font-light text-foreground sm:text-3xl">{magazine.title}</h1>
          </div>
          <Link href={magazine.story} className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-sm font-semibold text-primary hover:underline">
            <BookOpen className="h-4 w-4" /> Read as an article
          </Link>
        </div>

        <Flipbook magazine={magazine} />

        <p className="px-4 pt-3 text-center text-xs text-muted-foreground sm:px-0">
          Tip: drag a page corner, click the arrows, or use ← → on your keyboard. Turn the page-turn sound on or off with the speaker button.
        </p>

        <section className="px-4 py-14 sm:px-0" aria-labelledby="more-editions">
          <h2 id="more-editions" className="font-serif-display text-2xl font-light text-foreground">More editions</h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:grid-cols-3">
            {others.map((m) => (
              <li key={m.slug}>
                <Link href={`/project-magazines/${m.slug}`} className="group flex gap-4">
                  <span className="relative h-28 w-20 shrink-0 overflow-hidden rounded shadow-md">
                    <Image src={pageImage(m, 1)} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                  <span className="min-w-0 break-words">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent">{m.kind}</span>
                    <span className="mt-1 block text-sm font-semibold text-foreground group-hover:text-primary">{m.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
