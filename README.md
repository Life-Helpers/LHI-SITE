# Life Helpers Initiative (LHI) — Web Platform

Digital platform for Life Helpers Initiative: crisis response dispatch, program
transparency, and donation intake.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, TypeScript, `src/` directory)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config, no `tailwind.config.js`)
- [shadcn/ui](https://ui.shadcn.com) component conventions (`components.json`, `src/lib/utils.ts`)
  — components are added by hand in this environment because `ui.shadcn.com` is
  network-blocked here; copy component source manually when adding new ones.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Payments (Stripe)

The donation funnel (`/donate`) uses Stripe's embedded Payment Element for
both one-time payments and monthly recurring donations. No real keys are
configured in this repo — copy `.env.example` to `.env.local` and fill in:

1. **`STRIPE_SECRET_KEY`** / **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** — from
   the [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (test mode
   keys are fine for development).
2. **`STRIPE_DONATION_PRODUCT_ID`** — recurring donations are billed as a
   dynamically-priced subscription against a Stripe Product you create once:
   ```bash
   stripe products create --name "Donation"
   ```
3. **`STRIPE_WEBHOOK_SECRET`** — for local development, run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   which prints a `whsec_...` secret. In production, create a webhook
   endpoint pointed at `/api/webhooks/stripe` in the Stripe Dashboard instead
   and use the signing secret it gives you. Subscribe it to at least
   `payment_intent.succeeded`, `payment_intent.payment_failed`, and
   `invoice.paid`.

Without `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set, the donation funnel's
payment step shows an honest "not configured" notice instead of a broken
widget — it doesn't fail silently or fake success.

**What the webhook handler doesn't do yet:** there's no database or CRM in
this project, so `src/app/api/webhooks/stripe/route.ts` only verifies the
signature and logs the event — it doesn't persist a donation record or send
a custom receipt (Stripe's own receipt email, via `receipt_email`/the
Customer's email, still goes out). Wire up real persistence there once a
data layer exists.

**Security notes:** the secret key is only ever read server-side
(`src/lib/stripe.ts`, guarded with the `server-only` package so it can't
accidentally end up in a client bundle); card details are entered directly
into Stripe's iframe via the Payment Element and never touch this app's
server or logs; the webhook route rejects anything without a valid Stripe
signature.

## Conventions

- Brand palette: red (`--primary`) as the primary CTA/link color, orange
  (`--accent`) for secondary emphasis, and a dedicated `--alert` surface for
  crisis/emergency banners. All tokens live in `src/app/globals.css` and are
  WCAG 2.2 AA contrast-checked (4.5:1+ for text pairings).
- Path alias `@/*` maps to `src/*`.
- `npm run lint` runs ESLint (`eslint-config-next`).
