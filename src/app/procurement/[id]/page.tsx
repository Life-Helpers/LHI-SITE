import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, CalendarClock, CheckCircle2, FileDown, Hash, MapPin, Package, Tag } from "lucide-react";

import { formatDeadline } from "@/components/careers/listing-card";
import { BidForm } from "@/components/procurement/bid-form";
import { getTender } from "@/lib/cms/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const found = await getTender((await params).id);
  return found ? { title: `${found.tender.title} | Procurement`, description: found.tender.summary, alternates: { canonical: `/procurement/${found.tender.id}` } } : {};
}

export default async function TenderPage({ params }: { params: Promise<{ id: string }> }) {
  const found = await getTender((await params).id);
  if (!found) notFound();
  const { tender, open } = found;

  const facts = [
    { icon: Hash, label: "Reference", value: tender.reference },
    { icon: Tag, label: "Request type", value: tender.category },
    { icon: Package, label: "Category", value: tender.procurementType },
    { icon: MapPin, label: "Location", value: tender.location },
    { icon: CalendarClock, label: "Deadline", value: formatDeadline(tender.deadline) },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/procurement" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All vendor requests
        </Link>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">{tender.category}</p>
            <h1 className="mt-2 font-serif-display text-4xl font-light text-foreground">{tender.title}</h1>
            {!open && (
              <p className="mt-3 inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {tender.status === "awarded" ? "Awarded" : "Closed"}
              </p>
            )}
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{tender.summary}</p>
            <div className="prose-post mt-8">
              <ReactMarkdown>{tender.description}</ReactMarkdown>
            </div>
            {tender.requirements.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif-display text-2xl font-light text-foreground">Eligibility &amp; documents required</h2>
                <ul className="mt-4 space-y-2.5">
                  {tender.requirements.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section id="respond" className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif-display text-2xl font-light text-foreground">Submit your response</h2>
              {open ? (
                <div className="mt-6">
                  <BidForm tenderId={tender.id} reference={tender.reference} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">This request is no longer accepting responses.</p>
              )}
            </section>
          </article>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <dl className="space-y-4 rounded-3xl border border-border bg-card p-6 text-sm">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</dt>
                    <dd className="font-semibold text-foreground">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {tender.document && (
              <a href={tender.document} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                <FileDown className="h-4 w-4" /> Download solicitation pack
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
