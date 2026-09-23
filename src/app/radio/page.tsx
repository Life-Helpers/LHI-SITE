import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, MessageSquareText, Phone, Radio as RadioIcon, Users } from "lucide-react";

import { RadioStation } from "@/components/radio/radio-station";
import { siteConfig } from "@/config/site";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { getEpisodes } from "@/lib/cms/content";
import { toRadioEpisode } from "@/lib/radio";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Radio Program: WeSpeak (Muyi Magana)",
  description:
    "Life Helpers Initiative's Radio Program. WeSpeak (Muyi Magana) airs every Tuesday, 11 AM – 12 PM on Radio Nigeria Royal FM 101.5, Sokoto.",
};

const features = [
  {
    icon: CalendarClock,
    title: "Every Tuesday, live",
    text: "11:00 AM – 12:00 PM on Radio Nigeria, Royal FM 101.5, Sokoto State.",
  },
  {
    icon: RadioIcon,
    title: "Every thematic area",
    text: "Health, education, livelihood, agriculture and gender equity, in one weekly programme.",
  },
  {
    icon: MessageSquareText,
    title: "Your voice on air",
    text: "Listeners ask questions, share concerns and complaints, and are referred to services.",
  },
  {
    icon: Users,
    title: "Open to partners",
    text: "Civil society organisations are invited to use the platform to raise awareness and collaborate.",
  },
];

export default async function RadioPage() {
  const episodes = (await getEpisodes()).map(toRadioEpisode);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <RadioStation episodes={episodes} />

      <section className="border-t border-border bg-muted/20 py-16 md:py-20" aria-labelledby="about-wespeak">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— About the programme</p>
            <h2 id="about-wespeak" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
              WeSpeak <span className="italic text-primary">(Muyi Magana)</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              WeSpeak is a weekly radio programme implemented by Life Helpers Initiative in Sokoto State. It provides timely information, encourages
              dialogue and creates space for questions, feedback and complaints. The programme has touched the lives of many people across Sokoto
              State by increasing awareness, promoting positive behaviour change and strengthening accountability.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f.title} className="rounded-2xl border border-border bg-card p-5">
                  <f.icon className="h-5 w-5 text-primary" />
                  <p className="mt-2 font-semibold text-foreground">{f.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
            <Image src={LHI_PHOTOS.solarRadioFarmer.src} alt={LHI_PHOTOS.solarRadioFarmer.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="call-in">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="call-in" className="font-serif-display text-3xl font-light text-foreground">Have a question or a topic for the show?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Send feedback, suggestions, appreciation or complaints by WhatsApp or SMS, or email us. We read every message.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${siteConfig.contact.feedbackLine.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="h-4 w-4" /> WhatsApp 0201 330 9033
            </a>
            <a href="mailto:feedback@lhinigeria.org" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
              feedback@lhinigeria.org
            </a>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted">
              Blog &amp; newsletter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
