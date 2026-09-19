import { Quote } from "lucide-react";

/**
 * No real testimonials have been collected from beneficiaries, partners,
 * or staff yet. We don't fabricate quotes or attribute invented statements
 * to real people, so this renders an honest empty state instead of three
 * placeholder testimonials until real ones exist.
 */
const testimonials: { quote: string; name: string; role: string }[] = [];

export function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6"
    >
      <div className="mb-8 flex flex-col gap-2">
        <h2
          id="testimonials-heading"
          className="text-2xl font-bold tracking-tight"
        >
          What People Say About Us
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Voices from the communities, partners, and staff LHI works with.
        </p>
      </div>

      {testimonials.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-md border border-border p-5"
            >
              <Quote
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
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
        <div className="rounded-md border border-dashed border-border p-6 text-muted-foreground">
          <p className="text-sm font-medium text-foreground">
            This section is coming soon
          </p>
          <p className="mt-2 text-sm">
            We&apos;re collecting real stories directly from the people and
            communities we work with — we don&apos;t publish placeholder
            quotes, so check back soon.
          </p>
        </div>
      )}
    </section>
  );
}
