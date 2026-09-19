const partners = [
  "UNICEF",
  "USAID",
  "World Food Programme (WFP)",
  "UK FCDO",
  "European Union (EU)",
  "UNDP",
  "Save the Children",
  "Plan International",
  "International Rescue Committee (IRC)",
  "COOPI",
  "GISCOR",
];

export function PartnersStrip() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="border-t border-border"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-col gap-2">
          <h2
            id="partners-heading"
            className="text-2xl font-bold tracking-tight"
          >
            Implementing Partners
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Programs are delivered alongside multilateral and international
            partners, including:
          </p>
        </div>

        {/*
          Real partner names, sourced from LHI's own organizational
          content — rendered as text wordmarks rather than logo images,
          since we don't have licensed logo assets for these organizations.
        */}
        <ul className="flex flex-wrap gap-3">
          {partners.map((partner) => (
            <li
              key={partner}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {partner}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
