"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, MapPin, Phone, Mail, ExternalLink, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export function ContactPageClient() {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(siteConfig.offices[0].id);

  const selectedOffice =
    siteConfig.offices.find((o) => o.id === selectedOfficeId) || siteConfig.offices[0];

  return (
    <div className="flex flex-col">
      {/* Hero Section with African Fulfillment Demo Image */}
      <section className="relative isolate overflow-hidden border-b border-border bg-muted py-24 sm:py-32">
        <Image
          src={africanFulfillmentImages.contactHero.src}
          alt={africanFulfillmentImages.contactHero.alt}
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-center brightness-[0.38] dark:brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur-md">
            LHI Nationwide Network
          </span>
          <h1 className="mt-4 font-serif-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            Contact <span className="italic text-primary font-serif">Life Helpers Initiative</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-zinc-200 leading-relaxed">
            Headquartered in Sokoto with operational presence across 11 states in Nigeria. Connect with our warm, dedicated administrative, program, and emergency protection teams.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Office Addresses & Google Maps (7 cols) */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Our Office Locations & Google Maps
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Select an office below to inspect the location, contact lines, and interactive Google Map:
                </p>
              </div>

              {/* Office Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {siteConfig.offices.map((office) => {
                  const isSelected = office.id === selectedOfficeId;
                  return (
                    <button
                      key={office.id}
                      type="button"
                      onClick={() => setSelectedOfficeId(office.id)}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/40"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                      }`}
                    >
                      {office.name.replace(" State Office", "").replace(" Regional Office", "")}
                    </button>
                  );
                })}
              </div>

              {/* Featured Selected Office with Google Map */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-wider">
                        {selectedOffice.type}
                      </span>
                      <h3 className="mt-1.5 text-lg sm:text-xl font-bold text-foreground">
                        {selectedOffice.name}
                      </h3>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedOffice.mapQuery
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>
                        {selectedOffice.address}, {selectedOffice.city}, {selectedOffice.state}, Nigeria
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      <a href={`tel:${selectedOffice.phone}`} className="hover:underline text-foreground font-medium">
                        {selectedOffice.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-primary" />
                      <a href={`mailto:${siteConfig.contact.officialEmail}`} className="hover:underline text-foreground font-medium">
                        {siteConfig.contact.officialEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed iframe */}
                <div className="relative h-72 sm:h-80 w-full border-t border-border bg-muted">
                  <iframe
                    title={`Google Map for ${selectedOffice.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      selectedOffice.mapQuery
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* All Addresses Directory List */}
              <div className="space-y-3 pt-4">
                <h3 className="text-base font-bold text-foreground">
                  All 7 Official Addresses (lhinigeria.org/contactus)
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {siteConfig.offices.map((office) => (
                    <div
                      key={office.id}
                      onClick={() => setSelectedOfficeId(office.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        office.id === selectedOfficeId
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Building2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {office.name}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                            {office.address}, {office.city}, {office.state}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                            View on map &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidential Safeguarding (PSEA) Box */}
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                      Confidential Whistleblowing & PSEA Reporting
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Reports of sexual exploitation, abuse, financial misconduct, or child safeguarding concerns are handled in strict confidence by our independent Internal Audit & Compliance Unit:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      <a
                        href="mailto:psea@lhinigeria.org"
                        className="font-bold text-red-600 dark:text-red-400 underline"
                      >
                        psea@lhinigeria.org
                      </a>
                      <span className="text-muted-foreground">•</span>
                      <a
                        href="mailto:feedback@lhinigeria.org"
                        className="font-bold text-foreground underline"
                      >
                        feedback@lhinigeria.org
                      </a>
                      <span className="text-muted-foreground">•</span>
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="font-bold text-foreground"
                      >
                        Hotline: {siteConfig.contact.phoneDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form & Direct Inquiries (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-foreground">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Fill out this form and our operations coordinator will route your message to the appropriate directorate.
                  </p>

                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </div>

                {/* Direct Communications Card */}
                <div className="rounded-2xl border border-border bg-muted/40 p-5 text-xs space-y-2.5">
                  <h3 className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                    Direct Communication Desks
                  </h3>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Official Email:</span>
                    <a href={`mailto:${siteConfig.contact.officialEmail}`} className="font-semibold text-primary hover:underline">
                      {siteConfig.contact.officialEmail}
                    </a>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Recruitment & Careers:</span>
                    <a href={`mailto:${siteConfig.contact.recruitmentEmail}`} className="font-semibold text-primary hover:underline">
                      {siteConfig.contact.recruitmentEmail}
                    </a>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">General Info:</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-primary hover:underline">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">Central Phone / WhatsApp:</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="font-semibold text-foreground">
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
