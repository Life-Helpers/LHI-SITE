import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Lock, Mail, MessageCircle, Radio, Reply, Search, ShieldAlert, Users } from "lucide-react";

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { siteConfig } from "@/config/site";
import { LHI_PHOTOS } from "@/data/lhi-photos";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share a compliment, suggestion, complaint or question with Life Helpers Initiative. Feedback is free, confidential and can be anonymous.",
};

const whatsappNumber = siteConfig.contact.feedbackLine.replace(/[^\d]/g, "");

const steps = [
  { icon: ClipboardCheck, title: "We log it", text: "Every message gets a reference number and is recorded in our feedback register." },
  { icon: Search, title: "We review it", text: "The right team looks into it confidentially. Serious issues are escalated to management." },
  { icon: Reply, title: "We respond", text: "If you left contact details, we reply through the channel you chose and explain what we did." },
  { icon: Users, title: "We learn", text: "Feedback shapes how we design and improve our projects, with the communities we serve." },
];

const promises = [
  "Giving feedback is free and never affects the help you receive.",
  "We keep your identity confidential and share details only with staff who need to act.",
  "No one will face retaliation for raising a concern in good faith.",
  "Women, men, girls, boys and people with disabilities are all heard equally.",
  "You can write in English or Hausa, or stay anonymous.",
];

export default function FeedbackPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Accountability"
        title={
          <>
            Your voice, <em className="font-light italic text-primary">our accountability.</em>
          </>
        }
        subtitle="Tell us what we are doing well, what we can do better and what went wrong."
        description="Communities, partners, learners, suppliers and visitors can all reach us. Every compliment, suggestion, complaint and question is logged and answered."
        image={{ ...LHI_PHOTOS.communityDialogue, tag: "Community dialogue" }}
      />

      <section className="border-b border-border bg-primary/5 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <ShieldAlert className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-foreground">
            <strong>Reporting sexual exploitation, abuse or harassment, or a child at risk?</strong> Please don&apos;t use this form. Contact our
            confidential safeguarding channel:{" "}
            <a href={`mailto:${siteConfig.contact.pseaEmail}`} className="font-semibold text-primary hover:underline">
              {siteConfig.contact.pseaEmail}
            </a>{" "}
            or{" "}
            <a href={`tel:${siteConfig.contact.pseaHotline}`} className="font-semibold text-primary hover:underline">
              {siteConfig.contact.feedbackLine}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Send feedback online</p>
            <h2 className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">Share your feedback</h2>
            <p className="mt-2 mb-8 text-sm text-muted-foreground">It takes about two minutes. Fields marked * are required.</p>
            <FeedbackForm />
          </div>

          <aside className="space-y-4 lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— Other ways to reach us</p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <MessageCircle className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-foreground">WhatsApp or SMS</span>
                <span className="block text-sm text-muted-foreground">{siteConfig.contact.feedbackLine}</span>
              </span>
            </a>
            <a
              href={`mailto:${siteConfig.contact.feedbackEmail}?subject=Feedback`}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <Mail className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-foreground">Email</span>
                <span className="block text-sm text-muted-foreground">{siteConfig.contact.feedbackEmail}</span>
              </span>
            </a>
            <Link href="/radio" className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary">
              <Radio className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-foreground">On air: Voices of the People (VOP)</span>
                <span className="block text-sm text-muted-foreground">
                  Ask questions and raise concerns live on WeSpeak (Muyi Magana), Royal FM 101.5 Sokoto, Tuesdays 11 AM – 12 PM.
                </span>
              </span>
            </Link>
            <Link href="/contact" className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary">
              <Users className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-foreground">In person</span>
                <span className="block text-sm text-muted-foreground">Speak to LHI staff at project sites or visit one of our 11 state offices.</span>
              </span>
            </Link>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Lock className="h-4 w-4 text-primary" aria-hidden="true" /> Our promise to you
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                {promises.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="border-t border-border bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">— What happens next</p>
          <h2 id="process-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            From your message to action
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-muted-foreground">
            Read more about how we are accountable to communities in{" "}
            <Link href="/our-commitment" className="font-semibold text-primary hover:underline">
              our commitment
            </Link>{" "}
            and our{" "}
            <Link href="/impact" className="font-semibold text-primary hover:underline">
              annual reports
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
