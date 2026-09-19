import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Quote, Radio } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Radio Stories | Life Helpers Initiative",
  description:
    "Listener testimonials and community transformation stories sparked by Life Helpers Initiative's Women Situation Room radio broadcasts.",
};

const radioStories = [
  {
    listener: "Hajiya Maryam",
    location: "Kware LGA, Sokoto State",
    episodeTopic: "Immunization Myths & Early Child Protection",
    story:
      "For years, several families in our ward refused polio and measles vaccines because of false rumors. During the Friday broadcast of the Women Situation Room, a female pediatric doctor answered call-in questions in Hausa so patiently. Hearing women just like me ask questions made me realize the truth. I took my three grandchildren to the dispensary the very next morning.",
    impact: "Led her ward's women association to achieve 100% routine immunization coverage.",
  },
  {
    listener: "Bilkisu, 17",
    location: "Damaturu, Yobe State",
    episodeTopic: "Saying No to Forced Early Marriage",
    story:
      "My father planned to marry me off at fifteen to an older merchant. My mother listened to the Women Situation Room dialogue featuring religious scholars who explained that Islam commands girls to seek knowledge first. My mother gathered the courage to sit with my father, played the recorded cassette of the show, and convinced him to allow me to complete secondary school.",
    impact: "Bilkisu is currently in her final year of science secondary school, aspiring to study pharmacy.",
  },
  {
    listener: "Alhaji Abubakar (Village Head)",
    location: "Anka LGA, Zamfara State",
    episodeTopic: "Dispute Resolution Between Farmers and Herders",
    story:
      "When cattle damaged community crops, violence nearly broke out. The radio broadcast that evening talked about setting up joint community peace panels composed of both farming elders and pastoralist chiefs. We implemented the exact model described on the radio. The farmer was compensated fairly, and our communities remain in harmony.",
    impact: "Zero violent communal clashes in their ward over the past two rainy seasons.",
  },
];

export default function RadioStoryPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Voices from the Airwaves"
        title={
          <>
            Radio <em className="font-light italic text-primary">Stories.</em>
          </>
        }
        subtitle="Voices of hope, empowerment, and joyous smiles across northern Nigerian airwaves."
        description="Hear how weekly episodes of The Women Situation Room ripple into classrooms, households, and village squares across Northern Nigeria, sparking real behavioral shifts, peace agreements, and community smiles."
        image={africanFulfillmentImages.radioHero}
      />

      {/* Stories Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {radioStories.map((item) => (
              <div
                key={item.listener}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      Episode: {item.episodeTopic}
                    </span>
                    <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                      Listener: {item.listener}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <MapPin size={12} className="text-primary" /> {item.location}
                    </p>
                  </div>
                  <Quote className="h-8 w-8 text-primary/20 shrink-0" />
                </div>

                <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-muted-foreground">
                  &ldquo;{item.story}&rdquo;
                </blockquote>

                <div className="mt-6 rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs font-medium text-primary">
                  Community Impact: {item.impact}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <Radio className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Listen to The Women Situation Room
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Broadcasts air weekly on state and community radio stations across Northern Nigeria.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/radio"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Learn About Radio Advocacy →
              </Link>
              <Link
                href="/success-stories"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                All Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
