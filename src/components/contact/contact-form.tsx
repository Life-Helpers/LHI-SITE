"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Turnstile, turnstileHeaders } from "@/components/forms/turnstile";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "General Inquiries",
    officeLocation: "Sokoto Headquarters",
    message: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const website = String(new FormData(form).get("website") ?? "");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...turnstileHeaders(form) },
        body: JSON.stringify({ ...formData, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't send your message. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="mt-4 font-serif-display text-2xl font-light text-foreground">
          Message Received!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, <strong>{formData.fullName}</strong>. Your inquiry has been routed to our{" "}
          <strong>{formData.department}</strong> team. We typically respond within 24 to 48 business hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              department: "General Inquiries",
              officeLocation: "Sokoto Headquarters",
              message: "",
            });
          }}
          className="mt-6 inline-flex rounded-full border border-border bg-card px-5 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Amina Bello / Tayo Ade"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@domain.org"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+234 800 000 0000"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Department / Inquiry Type
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="General Inquiries">General Inquiries (official@lhinigeria.org)</option>
            <option value="Partnerships & Grants">Partnerships & Grants</option>
            <option value="Programs & Interventions">Programs & Field Interventions</option>
            <option value="Feedback & Safeguarding">Feedback / PSEA Safeguarding</option>
            <option value="Recruitment & Careers">Recruitment & Careers</option>
            <option value="Disability Fund">Disability Fund Inquiries</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="officeLocation" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preferred Office Location
        </label>
        <select
          id="officeLocation"
          value={formData.officeLocation}
          onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="Sokoto Headquarters">Sokoto Headquarters (Eastern Byepass)</option>
          <option value="Abuja Liaison Office">Abuja Liaison Office (Gwarimpa)</option>
          <option value="Maiduguri Field Office">Maiduguri Field Office (Damboa Road, Borno)</option>
          <option value="Other Field State">Other State Field Office</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Message *
        </label>
        <textarea
          id="message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can Life Helpers Initiative assist you or how would you like to partner?"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <Turnstile />

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-3.5 w-3.5" />
            Send Official Message
          </>
        )}
      </button>
    </form>
  );
}
