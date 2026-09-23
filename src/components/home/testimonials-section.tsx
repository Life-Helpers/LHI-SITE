"use client";

import Link from "next/link";
import { Quote } from "lucide-react";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

/**
 * Quotes published in LHI's project magazines (Gidan Arziki Vol. 2 and the ABEP
 * magazine). Each links to the full story.
 */
const testimonials: { quote: string; name: string; role: string; href: string }[] = [
  {
    quote: "Coming here every morning gives me hope and makes me feel healthy. Before, the process was very tedious. Now with the machine, we finish in minutes.",
    name: "Arajana Suleiman, 70",
    role: "Gidan Arziki centre, Batagarawa, Katsina State",
    href: "/blog/arajana-finding-purpose-at-70",
  },
  {
    quote: "Life Helpers Initiative has helped us a lot in supporting farmers, especially in the local government areas. Government alone cannot reach every community.",
    name: "Engr. Salim Suleiman",
    role: "Managing Director, Katsina State Irrigation Development Authority",
    href: "/blog/voices-from-batagarawa-gidan-arziki",
  },
  {
    quote: "Even children who did not receive school bags still come to class every day because they genuinely want to learn.",
    name: "Alhaji Rufai Maccido Salah",
    role: "Village Head of Dogon Daji, Tambuwal LGA, Sokoto State",
    href: "/blog/abep-impact-beyond-the-classroom",
  },
];

export function TestimonialsSection() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
    >
      <ScrollReveal className="mb-8 flex flex-col gap-2">
        <h2
          id="testimonials-heading"
          className="font-serif-display text-3xl font-light sm:text-4xl"
        >
          {t.home.testimonials.heading}
        </h2>
        <p className="max-w-xl text-muted-foreground">
          {t.home.testimonials.subtitle}
        </p>
      </ScrollReveal>

      {testimonials.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="glass-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <Quote className="h-5 w-5 text-primary" aria-hidden="true" />
              <blockquote className="mt-3 text-sm text-muted-foreground">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-3 text-sm font-medium">
                {testimonial.name}
                <span className="block text-xs font-normal text-muted-foreground">
                  {testimonial.role}
                </span>
                <Link href={testimonial.href} className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
                  Read the story →
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div
            role="status"
            className="glass-surface p-6 text-muted-foreground"
          >
            <p className="text-sm font-medium text-foreground">
              {t.home.testimonials.comingSoonTitle}
            </p>
            <p className="mt-2 text-sm">{t.home.testimonials.comingSoonBody}</p>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
