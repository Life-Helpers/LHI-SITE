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

**Sensitive stories.** Posts about health status (e.g. HIV), GBV or abuse, child protection or mental health
are flagged (by the "Sensitive story" box, or automatically from the title, excerpt and tags). Only users with
*Approve sensitive stories* (Administrators by default) can publish them, and only after ticking all four
safeguarding checks; everyone else saves them as *Pending review*.
| Media Library | Uploaded photos, logos, PDFs, video (served from `/media/...`) | Everywhere via the image/file pickers |
| Interventions | The project directory, dossiers, gallery photos, YouTube video | `/interventions/*`, factsheet PDFs, programme pages, map |
| Map States | Offices, LGAs covered and reach for the 11 states | Operational map (home + interventions) |
| Partners & Logos | Partner details and **uploaded official logos** | Home-page partner marquee |
| Compliance Docs | CAC, tax clearance, audits, PSEA/safeguarding/anti-fraud PDFs | `/partner-portal` |
| Submissions | Contact, volunteer and consortium/RFP forms (inbox) | Admin only |
| Users | Accounts with roles: Administrator, Editor, Author | Admin only |
| Home Page Text | Home page headings and text in English, French, Hausa, Yoruba and Igbo (empty = built-in text) | Home page |
| History Timeline | Road-map milestones: year, story, photos with alt text/labels, state map pins | `/our-history` |
| Team | Board of Trustees, management team, state office coordinators | `/board-of-trustees`, `/management-team` |
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

Until a section is first saved, the site shows the original content from `src/data/*`.
Where saved content and uploads live depends on the environment:

| Setting | Content, users, submissions | Uploaded files (media, magazines, CVs, bids) |
|---|---|---|
| `DATABASE_URL` (or `POSTGRES_URL`) | Postgres table `cms_store` (created automatically) | — |
| `BLOB_READ_WRITE_TOKEN` | — | Vercel Blob (private store), served through `/media/…` |
| neither | JSON files in `CMS_DATA_DIR` (default `./cms-data`) | `CMS_DATA_DIR/uploads` and `/private` |

**On Vercel both a database and Blob are required** — the server disk there is temporary,
and the admin shows a red *Storage is not permanent yet* notice until they are connected.

**Deploying on Vercel (one-time):**

1. Vercel dashboard → the project → **Storage** → **Create Database** → *Neon (Postgres)*;
   connect it to the project (this sets `DATABASE_URL`/`POSTGRES_URL`).
2. **Storage** → **Create** → *Blob*, choose **Private** access, connect it to the project
   (this sets `BLOB_READ_WRITE_TOKEN`).
3. **Settings → Environment Variables**: add `CMS_SETUP_TOKEN` (a long random string, used
   once to create the first administrator) and `CMS_SESSION_SECRET` (another long random
   string, signs admin sign-ins). Generate each with `openssl rand -base64 32`.
4. Redeploy, open `https://<your-site>/admin/setup`, enter the setup token and create the
   first **Administrator** account. Setup closes itself once an account exists.

To move content from an existing server (or an unpacked backup) into the database and Blob:
`DATABASE_URL=… BLOB_READ_WRITE_TOKEN=… node scripts/cms-import.mjs ./cms-data`
(add `--overwrite` to replace collections that already exist in the database).

Large files (radio MP3s, magazine PDFs over 4 MB) upload straight from the browser to Blob,
so they are not limited by Vercel's 4.5 MB request size.

**Backups.** Anyone with the *Site settings* permission can download a `.tar.gz` from
**Admin → Settings → Backup** (`/api/admin/backup`): with the database it contains every
saved collection as JSON; with disk storage it contains the whole `CMS_DATA_DIR`. Store it
somewhere private (it contains personal data). Postgres providers also keep their own
point-in-time backups; uploaded files stay in Blob.

With disk storage (no `DATABASE_URL`), run a single server instance with a persistent,
backed-up `CMS_DATA_DIR`.

### Site settings worth filling in

- **Donations → bank transfer details**: the donate page shows exactly what is
  entered here (separate accounts with a blank line). Nothing is shown until it is set.
- **Comments & alerts**: comments are held for moderation unless *Auto-approve
  comments* is ticked; the alert email receives team notifications once email
  sending is configured.
- Card payments need the Stripe variables; without them the donate form says
  online payments aren't available yet rather than pretending to succeed.

### Spam protection

Every public form (contact, volunteer, feedback, partnership, job applications, vendor
registration and bids, comments) is rate-limited per IP and has a hidden honeypot field.
To add a visible human check, create a Cloudflare Turnstile widget and set
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, then rebuild.

### Security notes

- Passwords are hashed with scrypt; sessions are signed, HTTP-only cookies (12 h).
- Failed logins are throttled (5 attempts per email per 15 minutes).
- Uploads are limited to images, PDF and MP4 up to 15 MB; SVG is rejected.
- Every mutation re-checks the user's role on the server.

## Email

All outgoing email goes through `src/lib/email/send.ts` and is recorded in the
**Email Outbox** (`/admin/outbox`) first, so nothing is lost before email is set up.

- **Connect**: set `EMAIL_PROVIDER` (`resend`, `sendgrid`, `postmark` or `brevo`),
  `EMAIL_API_KEY` and `EMAIL_FROM` (optionally `EMAIL_REPLY_TO`), restart, then press
  **Send queued now** in the outbox to deliver everything that was waiting.
- **What is sent**: confirmations to people who submit forms (contact, volunteer,
  partnership, job applications, vendor registration and bids, newsletter welcome),
  team alerts to *Settings → Comments & alerts → alert email*, comment-moderation
  alerts, certificate emails, and password-reset links for learners
  (`/get-involved/training/forgot`) and team members (`/admin/forgot`).
- **Newsletter** (`/admin/newsletter`): write and send to all active subscribers;
  every email has a signed one-click unsubscribe link (`/unsubscribe`). Subscribers
  can be exported as CSV.
- Until email is connected, a team member can open a password-reset email in the
  outbox and pass the link on personally.

## Admin workflows

- **Review stages** (Admin → Submissions → open an item): job applications, vendor bids and
  registrations, partnership requests and feedback have their own stages (e.g. Screening →
  Shortlisted → Interview for jobs; Compliance → Technical → Financial evaluation → Awarded for bids;
  Acknowledged → In progress → Resolved for feedback). Jobs and bids also take a 0–100 score.
  Internal notes are visible to the team only. Filter the list by stage; CSV exports include
  stage, score and notes.
- **Scheduled posts**: a published post with a future publish date shows as *Scheduled* and
  goes live automatically on that date.
- **Two-step verification**: each team member can turn it on under Profile (Google Authenticator,
  Microsoft Authenticator or similar). Administrators can reset it for someone who loses their phone.
- **Project magazines**: Admin → Magazines → Upload turns a PDF into a flipbook in the browser
  (pages are rendered with pdf.js and uploaded as images) and offers the PDF for download.

## Team roles & permissions

Team members sign in at `/admin` ("Team login" in the site footer). Each user has one role; a role is a set of
permissions (posts, media, comments, radio, projects, partners, documents, submissions, jobs, vendor requests,
training, users & roles, settings, activity log). Built-in roles: **Administrator** (always everything, locked),
**Editor** and **Author**; create more in **Admin → Roles & Permissions**, then assign them in **Admin → Users**.
Pages, menu items and server actions all check the specific permission. Roles are stored in `CMS_DATA_DIR/roles.json`;
when new permissions are added to the code, grant them to existing custom roles in the admin.

## Engagement, training, careers and procurement

All of these store their data in `CMS_DATA_DIR` and are managed from the admin:

- **Posts:** every post (`/blog/[slug]`: news, success stories, newsletter, magazines) has a like button,
  share buttons (Facebook, X, LinkedIn, WhatsApp, Telegram, Reddit, Pinterest, email, copy link, device share)
  and comments. Comments are held in **Admin → Comments** until approved.
- **Humanitarian Training** (`/get-involved/training`): three courses built from LHI's safeguarding,
  child safeguarding and GBV materials. The pass mark is 80%; learners who score below it retake the
  assessment. Lessons and assessments require a free learner account (email + password,
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
