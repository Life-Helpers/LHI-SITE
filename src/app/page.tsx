"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

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
import { SocialFeedsSection } from "@/components/home/social-feeds-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { PhilosophyQuote } from "@/components/home/philosophy-quote";
import { NewsletterSubscribe } from "@/components/home/newsletter-subscribe";
import { useLocale } from "@/i18n/locale-context";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

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
      <section className="px-4 pt-12 pb-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Headline & CTAs */}
            <div className="flex flex-col items-start gap-5 animate-fade-blur-in lg:col-span-7">
              <Eyebrow className="text-accent">{t.home.heroEyebrow}</Eyebrow>
              <h1 className="text-[36px] leading-[1.1] font-extrabold tracking-tight text-balance text-foreground sm:text-[48px] lg:text-[58px]">
                {t.home.heroPrefix}
                <GradientText>{t.home.heroHighlight}</GradientText>
                {t.home.heroSuffix}
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                {t.home.heroBody}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
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

              {/* LHI Ethos Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs text-foreground">
                <Heart className="h-3.5 w-3.5 text-primary fill-primary/30" />
                <span className="font-semibold text-primary">Motto:</span>
                <span>&ldquo;Putting a smile on a face&rdquo; since 2004</span>
              </div>
            </div>

            {/* African Fulfillment Hero Demo Image */}
            <div className="lg:col-span-5">
              <div className="group relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card p-2 shadow-2xl transition-all hover:border-primary/50">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={africanFulfillmentImages.homeHero.src}
                    alt={africanFulfillmentImages.homeHero.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/95 px-3 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur-md shadow-md">
                    <Sparkles className="h-3 w-3" />
                    Putting A Smile On A Face
                  </div>

                  {/* Caption pill */}
                  <div className="absolute right-3 bottom-3 left-3 rounded-xl bg-background/90 p-2.5 backdrop-blur-md">
                    <p className="text-[11px] font-medium text-foreground leading-snug">
                      &ldquo;{africanFulfillmentImages.homeHero.caption}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollReveal className="mx-auto mt-10 max-w-6xl">
          <dl className="glass-surface grid grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
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
      <SocialFeedsSection />
      <PartnersStrip />
      <PhilosophyQuote />
      <NewsletterSubscribe />
    </main>
  );
}
