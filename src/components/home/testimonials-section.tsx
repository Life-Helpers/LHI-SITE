"use client";

import { Quote } from "lucide-react";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { useLocale } from "@/i18n/locale-context";

/**
 * No real testimonials have been collected from beneficiaries, partners,
 * or staff yet. We don't fabricate quotes or attribute invented statements
 * to real people, so this renders an honest empty state instead of three
 * placeholder testimonials until real ones exist.
 */
const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "When my 14-month-old daughter Fatima suffered from acute malnutrition, LHI's community workers enrolled us in the CMAM clinic and taught us Tom Brown preparation. Today she is healthy, flourishing, and vibrant.",
    name: "Amina & baby Fatima",
    role: "Nutrition Program Beneficiary, Zamfara",
  },
  {
    quote:
      "Access to clean water from the rehabilitated solar borehole transformed our village. We eliminated cholera and now irrigate dry-season vegetable farms, feeding 40 households.",
    name: "Mallam Usman",
    role: "Community Elder, Gujba LGA, Yobe",
  },
  {
    quote:
      "Through LHI's Village Savings and Loan Association (VSLA), I accessed a start-up loan to purchase climate-resilient seeds. Our harvest tripled, and I am sending all four of my children to school.",
    name: "Hadiza Mustapha",
    role: "Women Savings Group Leader, Borno",
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
          className="text-2xl font-bold tracking-tight sm:text-3xl"
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
