import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Life Helpers Initiative (LHI) is a Nigerian non-profit founded in 2004, operating across 11 states.",
};

const values = [
  {
    title: "Grassroots first",
    body: "LHI began as Beulah Projects in 2004, caring for orphans and vulnerable children in Sokoto, and has grown into a national NGO without losing that local, community-led starting point.",
  },
  {
    title: "Multi-sectoral by design",
    body: "Health, education, livelihoods, agriculture, and protection are treated as connected — a household's needs rarely fit inside a single program category.",
  },
  {
    title: "Zero tolerance for exploitation",
    body: "A strict PSEA and safeguarding policy applies across every program, protecting beneficiaries from sexual exploitation, abuse, and harassment.",
  },
];

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

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About Life Helpers Initiative
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          &ldquo;Putting a smile on a face&rdquo; — touching lives,
          transforming households, impacting communities.
        </p>

        <div className="mt-12 flex flex-col gap-4 text-muted-foreground">
          <p>
            Life Helpers Initiative (LHI) was established on October 1, 2004,
            initially founded as Beulah Projects, dedicated to caring for
            orphans and vulnerable children in Sokoto. Over more than two
            decades of grassroots and humanitarian service, LHI has matured
            into a national non-governmental, not-for-profit organization
            combining development programming, emergency humanitarian relief,
            resilience building, and disaster risk reduction (DRR).
          </p>
          <p>
            Today LHI operates across 11 Nigerian states — Adamawa, Bauchi,
            Benue, Borno, Ebonyi, FCT Abuja (Liaison Office), Katsina, Kebbi,
            Plateau, Yobe, and Zamfara — with more than 350 full-time staff
            and over 700 trained community volunteers deployed across remote
            local government areas.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-md border border-border p-5">
              <h2 className="font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {value.body}
              </p>
            </div>
          ))}
        </div>

        <section aria-labelledby="partners-heading" className="mt-16">
          <h2 id="partners-heading" className="text-xl font-semibold">
            Institutional partners
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Programs are delivered alongside multilateral and international
            partners, including:
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-3">
            {partners.map((partner) => (
              <li key={partner}>{partner}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
