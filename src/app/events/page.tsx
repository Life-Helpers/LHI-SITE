import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Events & Updates | Life Helpers Initiative",
  description:
    "Community workshops, stakeholder roundtables, capacity-building sessions, and health campaigns conducted by Life Helpers Initiative.",
};

const events = [
  {
    id: "pause-reflect-q1",
    title: "Quarterly Quality Improvement Pause & Reflect Meeting",
    date: "Quarterly Convening",
    time: "9:00 AM – 4:00 PM WAT",
    location: "LHI Headquarters Conference Hall, Sokoto",
    category: "Monitoring & Governance",
    organizer: "LHI in partnership with EU, UNICEF & State Ministry of Health",
    summary:
      "A joint sectoral review bringing together primary healthcare directors, cluster coordinators, and community monitors to analyze clinical indicators, referral throughput, and medicine supply chain integrity across supported LGAs.",
  },
  {
    id: "women-leadership-iri",
    title: "Women in Leadership & Civic Governance Training Workshop",
    date: "Bi-Annual Program",
    time: "10:00 AM – 3:30 PM WAT",
    location: "Multipurpose Hall, Sokoto South, Sokoto State",
    category: "Civic Empowerment",
    organizer: "LHI in partnership with International Republican Institute (IRI)",
    summary:
      "Empowering women leaders, youth representatives, and Persons with Disabilities (PWDs) to actively participate in local government policymaking, budget hearings, and civic advocacy across seven local councils.",
  },
  {
    id: "kmc-health-workers",
    title: "Frontline Child Health & Kangaroo Mother Care (KMC) Capacity Building",
    date: "Specialized Training Cohort",
    time: "8:30 AM – 5:00 PM WAT",
    location: "Zonal Health Training Hub, Wamakko LGA",
    category: "Health & Nutrition",
    organizer: "LHI Maternal & Child Health Unit",
    summary:
      "Intensive hands-on simulation modules for female primary health officers and community midwives covering hypothermia prevention, neonatal resuscitation, and home follow-up for low-birthweight infants.",
  },
  {
    id: "childrens-day-goronyo",
    title: "Commemoration of World Children's Day in IDP Host Communities",
    date: "Annual Celebration",
    time: "10:00 AM – 2:00 PM WAT",
    location: "Goronyo & Rabah LGAs, Sokoto State",
    category: "Child Protection",
    organizer: "LHI Child Protection & Psychosocial Team",
    summary:
      "Bringing joyful recreation, psychosocial art therapy, nutritional screenings, and dignity supplies to internally displaced and host-community children, accompanied by monuments illumination across Sokoto, Kebbi, and Zamfara.",
  },
  {
    id: "vsla-learning-exchange",
    title: "Statewide VSLA Peer-Learning Exchange & Social Fund Showcase",
    date: "Annual Milestone",
    time: "9:30 AM – 3:00 PM WAT",
    location: "Liaison Coordination Hall, Damaturu, Yobe State",
    category: "Economic Livelihoods",
    organizer: "LHI Livelihoods & Micro-Enterprise Team",
    summary:
      "Bringing together executives from 40 village savings groups to share emergency medical fund mechanisms, group loan auditing techniques, and cooperative bulk purchase of agricultural inputs.",
  },
];

export default function EventsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Convenings &amp; Community Milestones"
        title={
          <>
            Events &amp; <em className="font-light italic text-primary">Gatherings.</em>
          </>
        }
        subtitle="Bringing people together with joy, shared purpose, and communal smiles."
        description="Explore capacity-building academies, healthcare provider simulations, community dialogue forums, and humanitarian coordination celebrations led by Life Helpers Initiative."
        image={africanFulfillmentImages.eventsHero}
      />

      {/* Events List */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Tag size={12} />
                      {event.category}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {event.organizer}
                  </span>
                </div>

                <h2 className="mt-4 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
                  {event.title}
                </h2>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar size={14} className="text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-accent" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {event.summary}
                </p>

                <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Open to participating community delegates &amp; partners</span>
                  <Link
                    href="/contact"
                    className="font-semibold text-primary hover:underline"
                  >
                    Inquire About Participation →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <Users className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Host or Co-Sponsor a Community Event
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              We regularly collaborate with development agencies, academic institutions, and local leaders on evidence-based workshops and capacity sessions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Contact Event Coordinators
              </Link>
              <Link
                href="/our-strategies"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                Our 6 Strategic Pillars
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
