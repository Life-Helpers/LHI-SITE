export function PhilosophyQuote() {
  return (
    <section
      aria-labelledby="philosophy-heading"
      className="border-t border-border bg-muted/40"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 id="philosophy-heading" className="sr-only">
          Our Philosophy
        </h2>
        <blockquote className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          &ldquo;Putting a smile on a face &mdash; touching lives,
          transforming households, impacting communities.&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground">
          LHI&apos;s founding motto, since 2004
        </p>
      </div>
    </section>
  );
}
