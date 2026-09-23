import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Download } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { pageImage } from "@/data/magazines";
import { getAllMagazines } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Project Magazines",
  description: "Read Life Helpers Initiative's project magazines and newsletter online as flipbooks, or download them as PDF.",
};

export default async function ProjectMagazinesPage() {
  const [latest, ...rest] = await getAllMagazines();

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Impact · Project Magazines"
        title={
          <>
            Stories from the field, <em className="font-light italic text-primary">page by page.</em>
          </>
        }
        subtitle="Flip through our project magazines and newsletter online."
        description="Each edition documents a project in the words of the farmers, learners, mothers and leaders it serves, with the data behind the results."
        image={{ ...LHI_PHOTOS.gidanArzikiTailoring, tag: "Gidan Arziki, Vol. 2" }}
      />

      <section className="py-16 md:py-20" aria-labelledby="latest-edition">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Latest edition</p>
          <div className="mt-6 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <Link href={`/project-magazines/${latest.slug}`} className="group relative mx-auto block w-full max-w-sm [perspective:1600px]">
              <div className="relative aspect-[550/778] overflow-hidden rounded-r-xl rounded-l-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)] transition-transform duration-500 [transform-origin:left_center] group-hover:[transform:rotateY(-14deg)]">
                <Image src={pageImage(latest, 1)} alt={`${latest.title} cover`} fill priority sizes="384px" className="object-cover" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 to-transparent" />
              </div>
            </Link>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {latest.kind} · {latest.period}
              </p>
              <h2 id="latest-edition" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
                {latest.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{latest.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {latest.partners} · {latest.pages} pages
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/project-magazines/${latest.slug}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                  <BookOpen className="h-4 w-4" /> Read the flipbook
                </Link>
                <a href={latest.pdf} download data-title={latest.title} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
                  <Download className="h-4 w-4" /> PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-16" aria-labelledby="all-editions">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="all-editions" className="font-serif-display text-3xl font-light text-foreground">All editions</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
            {rest.map((m) => (
              <li key={m.slug}>
                <Link href={`/project-magazines/${m.slug}`} className="group block [perspective:1400px]">
                  <div className="relative aspect-[550/778] overflow-hidden rounded-r-lg rounded-l-sm shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] transition-transform duration-500 [transform-origin:left_center] group-hover:[transform:rotateY(-14deg)]">
                    <Image src={pageImage(m, 1)} alt={`${m.title} cover`} fill sizes="(min-width: 768px) 320px, 45vw" className="object-cover" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 to-transparent" />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-accent">{m.kind}</p>
                  <h3 className="mt-1 font-semibold leading-snug text-foreground group-hover:text-primary">{m.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.period} · {m.pages} pages
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
