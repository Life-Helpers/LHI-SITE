"use client";

import { useState } from "react";
import { useSiteData } from "@/components/site-data-provider";
import { telHref } from "@/lib/site-data";
import Image from "next/image";
import { Check, Clock, Copy, Mail, MapPin, Navigation, Phone, ShieldAlert, Building2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { OfficePresenceMap, type Office } from "@/components/contact/office-presence-map";

const ZONES = [
  { name: "North-West", states: ["sokoto", "kebbi", "zamfara", "katsina"] },
  { name: "North-East", states: ["borno", "yobe", "adamawa", "bauchi"] },
  { name: "North-Central", states: ["fct", "plateau"] },
  { name: "South-East", states: ["ebonyi"] },
];

const directionsUrl = (o: Office) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery)}`;
const embedUrl = (o: Office, zoom = 15) => `https://maps.google.com/maps?q=${encodeURIComponent(o.mapQuery)}&z=${zoom}&output=embed`;
const fullAddress = (o: Office) => `${o.address}, ${o.city}, ${o.state}, ${o.country}`;

function CopyAddress({ office }: { office: Office }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(fullAddress(office));
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? "Copied" : "Copy address"}
      <span className="sr-only"> for {office.name}</span>
    </button>
  );
}

function OfficeCard({ office, highlighted, onFocus }: { office: Office; highlighted: boolean; onFocus: () => void }) {
  // Each Google Map embed is heavy, so a card only loads its map when asked.
  const [showMap, setShowMap] = useState(false);
  return (
    <article
      id={office.id}
      className={`flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow ${
        highlighted ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"
      }`}
    >
      <div className="relative aspect-[16/10] w-full bg-muted">
        {showMap ? (
          <iframe
            title={`Google Map of the ${office.name}, ${office.city}`}
            src={embedUrl(office)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 via-muted to-accent/10 text-center"
          >
            <MapPin className="h-8 w-8 text-primary transition-transform group-hover:-translate-y-1" aria-hidden="true" />
            <span className="px-4 text-sm font-medium text-foreground">{office.city}</span>
            <span className="rounded-full bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground">
              Show map<span className="sr-only"> of the {office.name}</span>
            </span>
          </button>
        )}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground shadow-sm">
          {office.state}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{office.type}</p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">
          <button type="button" onClick={onFocus} className="text-left hover:text-primary">
            {office.name}
          </button>
        </h3>
        <p className="mt-2 flex gap-2 text-sm leading-relaxed text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            {office.address}, {office.city}, {office.state}
            {office.postalCode ? ` ${office.postalCode}` : ""}
          </span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-primary">
            {office.phone}
          </a>
        </p>
        <p className="mt-1.5 flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <a href={`mailto:${office.email}`} className="text-foreground hover:text-primary">
            {office.email}
          </a>
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <a
            href={directionsUrl(office)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" /> Directions<span className="sr-only"> to the {office.name} (opens Google Maps)</span>
          </a>
          <CopyAddress office={office} />
        </div>
      </div>
    </article>
  );
}

export function ContactPageClient() {
  const { contact } = useSiteData();
  const [selectedId, setSelectedId] = useState<string>("sokoto-hq");
  const offices = siteConfig.offices;
  const selected = offices.find((o) => o.id === selectedId) ?? offices[0];
  const hq = offices.find((o) => o.isPrimary) ?? offices[0];

  const focusOffice = (id: string) => {
    setSelectedId(id);
    document.getElementById("presence-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-muted pb-16 pt-32 sm:pb-20 sm:pt-40">
        <Image
          src={africanFulfillmentImages.contactHero.src}
          alt={africanFulfillmentImages.contactHero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.38] dark:brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" /> {offices.length} offices · {offices.length} states
          </span>
          <h1 className="mt-4 font-serif-display text-4xl font-light text-white sm:text-5xl lg:text-6xl">
            Contact <span className="font-serif italic text-[#ff8a8e]">Life Helpers Initiative</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-100 sm:text-lg">
            Headquartered in Sokoto, with offices in {offices.length} states across Nigeria. Find the office nearest to you, or send us a message.
          </p>
          <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <a href={telHref(contact.phone)} className="rounded-2xl border border-white/20 bg-black/35 p-4 text-white backdrop-blur-md hover:border-white/50">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="mt-2 block text-[11px] uppercase tracking-wider text-zinc-200">Helpline</span>
              <span className="block text-sm font-semibold">{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="rounded-2xl border border-white/20 bg-black/35 p-4 text-white backdrop-blur-md hover:border-white/50">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="mt-2 block text-[11px] uppercase tracking-wider text-zinc-200">Email</span>
              <span className="block text-sm font-semibold">{contact.email}</span>
            </a>
            <div className="rounded-2xl border border-white/20 bg-black/35 p-4 text-white backdrop-blur-md">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span className="mt-2 block text-[11px] uppercase tracking-wider text-zinc-200">Office hours</span>
              <span className="block text-sm font-semibold">Mon – Fri, 8 AM – 5 PM (WAT)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Presence map */}
      <section id="presence-map" className="scroll-mt-20 py-16 sm:py-20" aria-labelledby="presence-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Our presence</p>
          <h2 id="presence-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Where you&apos;ll find us in Nigeria
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Select a pin to see that office&apos;s address and street map.</p>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 lg:col-span-7">
              <OfficePresenceMap selectedId={selectedId} onSelect={setSelectedId} />
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-accent text-[6px] font-bold text-white shadow">HQ</span>
                  Headquarters
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-white bg-primary shadow" /> State office
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-4 rounded-sm bg-primary/30" /> State with an LHI office
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {ZONES.map((zone) => (
                  <div key={zone.name}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">{zone.name}</p>
                    <ul className="mt-1.5 space-y-1">
                      {offices
                        .filter((o) => zone.states.includes(o.mapStateId))
                        .map((o) => (
                          <li key={o.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedId(o.id)}
                              aria-pressed={o.id === selectedId}
                              className={`text-left text-xs hover:text-primary ${o.id === selectedId ? "font-semibold text-primary" : "text-muted-foreground"}`}
                            >
                              {o.state.replace(" State", "")}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-28 lg:col-span-5" aria-live="polite">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="relative aspect-[4/3] w-full bg-muted">
                  <iframe
                    key={selected.id}
                    title={`Google Map of the ${selected.name}, ${selected.city}`}
                    src={embedUrl(selected)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{selected.type}</p>
                  <h3 className="mt-1 font-serif-display text-2xl font-light text-foreground">{selected.name}</h3>
                  <p className="mt-3 flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {fullAddress(selected)}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-primary">
                      {selected.phone}
                    </a>
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={directionsUrl(selected)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Navigation className="h-3.5 w-3.5" aria-hidden="true" /> Get directions<span className="sr-only"> (opens Google Maps)</span>
                    </a>
                    <CopyAddress office={selected} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All office addresses */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-20" aria-labelledby="offices-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Office addresses</p>
          <h2 id="offices-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Every state office, with its map
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[hq, ...offices.filter((o) => o.id !== hq.id)].map((office) => (
              <OfficeCard key={office.id} office={office} highlighted={office.id === selectedId} onFocus={() => focusOffice(office.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Message + safeguarding */}
      <section className="py-16 sm:py-20" aria-labelledby="message-heading">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Direct enquiries</span>
              <h2 id="message-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Send a message
              </h2>
              <p className="mb-6 mt-1 text-sm text-muted-foreground">Partnership proposals, media queries, collaborations or general questions.</p>
              <ContactForm />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-400" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-red-700 dark:text-red-400">Confidential whistleblowing & PSEA reporting</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    LHI has zero tolerance for sexual exploitation, abuse and harassment. Reports to our integrity line stay strictly confidential.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
                    <a
                      href={`mailto:${contact.pseaEmail}?subject=CONFIDENTIAL%20PSEA%20REPORT`}
                      className="inline-flex items-center gap-1 text-red-700 hover:underline dark:text-red-400"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" /> {contact.pseaEmail}
                    </a>
                    <a href={telHref(contact.helpline)} className="inline-flex items-center gap-1 text-red-700 hover:underline dark:text-red-400">
                      <Phone className="h-4 w-4" aria-hidden="true" /> {contact.helpline}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Headquarters</p>
              <p className="mt-2">{fullAddress(hq)}</p>
              <p className="mt-3">
                Recruitment:{" "}
                <a href={`mailto:${contact.recruitmentEmail}`} className="font-medium text-primary hover:underline">
                  {contact.recruitmentEmail}
                </a>
              </p>
              <p className="mt-1">Office hours: Monday – Friday, 8:00 AM – 5:00 PM (WAT)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
