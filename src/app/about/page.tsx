import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Life Helpers Initiative's mission and approach.",
};

const values = [
  {
    title: "Rapid response",
    body: "Placeholder: Field teams are pre-positioned and resourced to begin deploying within 72 hours of a crisis declaration.",
  },
  {
    title: "Open reporting",
    body: "Placeholder: Every program publishes its reach and spending in an annual impact report, available to anyone.",
  },
  {
    title: "Local partnership",
    body: "Placeholder: Programs are built and handed off with local health authorities, schools, and water agencies rather than run in isolation.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About Life Helpers Initiative
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Placeholder: Life Helpers Initiative delivers rapid crisis response,
          durable community programs, and openly audited impact reporting for
          communities facing humanitarian emergencies.
        </p>

        <div className="mt-12 flex flex-col gap-4 text-muted-foreground">
          <p>
            Placeholder copy: This organization mobilizes field teams,
            medical care, clean water infrastructure, and emergency supplies
            wherever a crisis is declared, then stays engaged through
            longer-term programs once the emergency phase ends.
          </p>
          <p>
            Placeholder copy: Every program and emergency response tracked on
            this site links to the audited impact report that covers it, so
            donors and partners can follow a gift from commitment through to
            outcome.
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
      </div>
    </main>
  );
}
