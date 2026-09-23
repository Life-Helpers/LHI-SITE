import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Shared layout for legal pages: title, last-updated date, contents list and numbered sections. */
export function LegalDocument({ title, updated, intro, sections }: { title: string; updated: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">On this page</p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article>
          <h2 className="font-serif-display text-3xl font-light text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
          <div className="mt-6 text-sm leading-relaxed text-muted-foreground">{intro}</div>
          <div className="legal-body mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-serif-display text-2xl font-light text-foreground">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-3 space-y-3">{s.body}</div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
