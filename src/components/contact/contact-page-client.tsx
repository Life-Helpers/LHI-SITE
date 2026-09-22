"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  ShieldAlert,
  Compass,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { NigeriaMap } from "@/components/contact/nigeria-map";

export function ContactPageClient() {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("sokoto-hq");

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
            Headquartered in Sokoto with an operational footprint across 11 states in Nigeria. Connect with our dedicated administrative, program, and emergency protection teams.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Interactive Nigeria Map & Office Addresses (7 cols) */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Interactive Nigeria Presence Map</span>
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Our 11 Operational Offices Across Nigeria
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Pinpointed below across 11 states. Click any pin on the map or select an office to inspect its verified address, contact lines, and Google Maps directions:
                </p>
              </div>

              {/* Interactive Nigeria Structured Map Component with Animated Beacons & Comprehensive Detail */}
              <NigeriaMap
                selectedOfficeId={selectedOfficeId}
                onSelectOffice={(id) => setSelectedOfficeId(id)}
              />

              {/* Confidential Safeguarding (PSEA) Box */}
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                      Confidential Whistleblowing & PSEA Reporting
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Life Helpers Initiative maintains zero tolerance for sexual exploitation, abuse, and harassment. All reports submitted via our dedicated integrity hotline remain strictly confidential.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                      <a
                        href={`mailto:${siteConfig.contact.pseaEmail}?subject=CONFIDENTIAL%20PSEA%20REPORT`}
                        className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {siteConfig.contact.pseaEmail}
                      </a>
                      <a
                        href={`tel:${siteConfig.contact.pseaHotline}`}
                        className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {siteConfig.contact.pseaHotline}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                  <div className="mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Direct Inquiries
                    </span>
                    <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Send a Message
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Partnership proposals, media queries, institutional collaborations, or general questions:
                    </p>
                  </div>

                  <ContactForm />
                </div>

                {/* Direct Connect Quick Card */}
                <div className="rounded-2xl border border-border bg-muted/40 p-5 text-xs text-muted-foreground space-y-3">
                  <p className="font-semibold text-foreground">
                    General Administrative Enquiries:
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${siteConfig.contact.officialEmail}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {siteConfig.contact.officialEmail}
                    </a>
                  </p>
                  <p>
                    Official Hotline:{" "}
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </p>
                  <p>
                    Operating Hours: Monday – Friday, 8:00 AM – 5:00 PM (WAT)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
