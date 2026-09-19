"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/eyebrow";
import { GradientText } from "@/components/gradient-text";
import { CountUp } from "@/components/effects/count-up";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { WhoWeAreBand } from "@/components/home/who-we-are-band";
import { WhatWeDoTiles } from "@/components/home/what-we-do-tiles";
import { LatestFromLHI } from "@/components/home/latest-from-lhi";
import { RadioBanner } from "@/components/home/radio-banner";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";
import { useLocale } from "@/i18n/locale-context";

export default function Home() {
  const { t } = useLocale();

  const stats = [
    { label: t.home.stats.statesActive, value: "11" },
    { label: t.home.stats.individualsReached, value: "1.5M+" },
    { label: t.home.stats.householdsReached, value: "400,000+" },
    { label: t.home.stats.yearsOfService, value: "20+" },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <section className="px-4 pt-14 pb-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 animate-fade-blur-in">
          <Eyebrow className="text-accent">{t.home.heroEyebrow}</Eyebrow>
          <h1 className="max-w-3xl text-[40px] leading-[1.1] font-extrabold tracking-tight text-balance text-foreground sm:text-[52px] lg:text-[64px]">
            {t.home.heroPrefix}
            <GradientText>{t.home.heroHighlight}</GradientText>
            {t.home.heroSuffix}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t.home.heroBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/donate">
                {t.home.donateNow}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/programs">{t.home.seePrograms}</Link>
            </Button>
          </div>
        </div>

        <ScrollReveal className="mx-auto mt-10 max-w-6xl">
          <dl className="glass-surface glow-border grid grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </section>

      <WhoWeAreBand />
      <WhatWeDoTiles />
      <LatestFromLHI />
      <RadioBanner />
      <TestimonialsSection />
      <PartnersStrip />
      <PhilosophyQuote />
      <NewsletterSubscribe />
    </main>
  );
}
