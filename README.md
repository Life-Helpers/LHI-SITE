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

## Admin CMS (`/admin`)

A WordPress-style content manager (dark "Phoenix" sidebar layout) for editing the
live site without touching code.

| Section | What it manages | Where it appears |
|---|---|---|
| Posts | News, success stories, field blog, magazine, press releases (Markdown) | `/blog`, `/blog/[slug]`, `/success-stories`, `/news-updates` |
| Media Library | Uploaded photos, logos, PDFs, video (served from `/media/...`) | Everywhere via the image/file pickers |
| Interventions | The project directory, dossiers, gallery photos, YouTube video | `/interventions/*`, factsheet PDFs, programme pages, map |
| Map States | Offices, LGAs covered and reach for the 11 states | Operational map (home + interventions) |
| Partners & Logos | Partner details and **uploaded official logos** | Home-page partner marquee |
| Compliance Docs | CAC, tax clearance, audits, PSEA/safeguarding/anti-fraud PDFs | `/partner-portal` |
| Submissions | Contact, volunteer and consortium/RFP forms (inbox) | Admin only |
| Users | Accounts with roles: Administrator, Editor, Author | Admin only |
| Settings | Home feature story, NIDAKE kit figures, factsheet contact details | Home page, `/nidake`, PDFs |
| Activity Log | Sign-ins, edits, uploads, deletions | Admin only |

Saving in the admin refreshes the public pages immediately (on-demand revalidation);
pages also re-check every 5 minutes.

### First-time setup

1. Set `CMS_SETUP_TOKEN` (any long random string) in the server environment.
2. Visit `/admin` — with no users yet you are sent to `/admin/setup`.
3. Enter the token and create the first **Administrator** account.
4. Add other staff under **Users**. Setup is disabled once any user exists.

In local development (`npm run dev`) the setup token is not required.

### Storage — read before deploying

Content is stored as JSON files (plus uploads) in `CMS_DATA_DIR` (default
`./cms-data`, git-ignored). Until a section is first saved, the site shows the
original content from `src/data/*`.

- The server needs a **persistent, writable disk** (VPS, or a Docker volume mounted
  at `CMS_DATA_DIR`). On serverless/ephemeral hosting edits would be lost; swap
  `src/lib/cms/store.ts` for a database-backed implementation in that case.
- **Back up `CMS_DATA_DIR` regularly** — it holds all edited content, uploads and
  user accounts.
- Run a single server instance (the store serialises writes in-process).

### Security notes

- Passwords are hashed with scrypt; sessions are signed, HTTP-only cookies (12 h).
- Failed logins are throttled (5 attempts per email per 15 minutes).
- Uploads are limited to images, PDF and MP4 up to 15 MB; SVG is rejected.
- Every mutation re-checks the user's role on the server.

## Engagement, training, careers and procurement

All of these store their data in `CMS_DATA_DIR` and are managed from the admin:

- **Posts:** every post (`/blog/[slug]`: news, success stories, newsletter, magazines) has a like button,
  share buttons (Facebook, X, LinkedIn, WhatsApp, Telegram, Reddit, Pinterest, email, copy link, device share)
  and comments. Comments are held in **Admin → Comments** until approved.
- **Humanitarian Training** (`/get-involved/training`): three courses built from LHI's safeguarding,
  child safeguarding and GBV materials. Lessons and assessments require a free learner account (email + password,
  separate from team accounts); progress is stored on the account. Learners are listed in **Admin → Learners**,
  where editors can reset a learner's password. Final-assessment answer keys live server-side in
  `src/data/training/answer-keys.ts`. Certificates are listed in **Admin → Certificates** and can be verified publicly.
- **Careers** (`/careers`) and **Procurement** (`/procurement`): vacancies and vendor requests are managed in
  **Admin → Jobs & Vacancies / Vendor Requests**. CVs and bid documents are stored under `CMS_DATA_DIR/private`
  and are downloadable only by signed-in editors from **Admin → Submissions**.
- **Project magazines** (`/project-magazines`, in the Impact menu): flipbook reader with page-turn animation,
  synthesised flip sound, thumbnails, full screen and keyboard control. Page images are pre-rendered WebP files in
  `public/magazines/<slug>/`; add a magazine by rendering its pages there and adding it to `src/data/magazines.ts`.
- **Radio** (`/radio` and the home-page mini radio): episodes are managed in **Admin → Radio Episodes**. Upload the
  recording (MP3, M4A, AAC, WAV or OGG, up to 80 MB) straight from the episode editor; audio is served with byte-range
  support so listeners can seek. Mark an episode "Play first on the home page" to put it at the top.
- **Download gate:** the first document a visitor downloads (any `.pdf`/`.doc(x)`/`.xls(x)`/`.ppt(x)`/`.zip` link on
  the site, including job ads and vendor request packs) asks them to subscribe; subscribers are remembered in the
  browser. Use `data-gate="off"` on a link to skip it or `data-gate="on"` to force it.
- **Newsletter:** all signup forms (including the anniversary popup, configured in `src/config/anniversary.ts`)
  add subscribers to **Admin → Submissions → Newsletter**.

Seed content (posts, projects) is only used until a collection is first saved; on a site whose `posts.json`
already exists, new seed stories must be added through the admin.

## Brand system

- **Typefaces:** Cormorant Garamond (`font-serif-display`, light weight) for page and section headings;
  Sora for small UI headings (cards, labels; the default for `h1`–`h6`); Inter for body text.
- **Eyebrow labels** above headings: `text-[11px] font-semibold uppercase tracking-[0.3em] text-primary`
  (or the `Eyebrow` component).
- **Colour:** `primary` (LHI red) and `accent` (orange) with neutral foreground/muted tokens. Green is reserved
  for status (active, success) and WhatsApp; don't introduce other hues for categories.
- **Contact:** use `siteConfig.contact` (official@lhinigeria.org, feedback@, psea@) rather than hard-coded addresses.
- **Page titles:** set only the page name; the layout appends "| Life Helpers Initiative".
