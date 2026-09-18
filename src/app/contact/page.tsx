import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Life Helpers Initiative.",
};

const channels = [
  {
    label: "General inquiries",
    email: "info@example.org",
  },
  {
    label: "Media inquiries",
    email: "press@example.org",
  },
  {
    label: "Partnership inquiries",
    email: "partners@example.org",
  },
];

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground">
          Placeholder: these addresses are demo placeholders — replace with
          the organization&apos;s real inboxes before launch.
        </p>

        <ul className="mt-8 flex flex-col gap-4">
          {channels.map((channel) => (
            <li
              key={channel.label}
              className="flex items-center justify-between gap-4 rounded-md border border-border p-4"
            >
              <span className="font-medium">{channel.label}</span>
              <a
                href={`mailto:${channel.email}`}
                className="inline-flex items-center gap-1.5 rounded text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {channel.email}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
