import type { Metadata } from "next";

import { MagazineLibrary } from "@/components/magazines/magazine-library";
import { getAllMagazines } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/project-magazines" },
  title: "Project Magazines",
  description: "Read Life Helpers Initiative's project magazines, Helpers Digest bulletins and newsletters online as flipbooks, or download them as PDF.",
};

export default async function ProjectMagazinesPage() {
  const magazines = await getAllMagazines();

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-28 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Impact · Project Magazines</p>
          <h1 className="mt-3 font-serif-display text-4xl font-light text-foreground sm:text-5xl">
            Stories from the field, <em className="font-light italic text-primary">page by page.</em>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Browse the shelf, pick an edition and flip through it online. Each one documents a project in the words of the farmers, learners, mothers and
            leaders it serves.
          </p>
        </header>
        <MagazineLibrary magazines={magazines} />
      </div>
    </main>
  );
}
