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

## Conventions

- Brand palette: red (`--primary`) as the primary CTA/link color, orange
  (`--accent`) for secondary emphasis, and a dedicated `--alert` surface for
  crisis/emergency banners. All tokens live in `src/app/globals.css` and are
  WCAG 2.2 AA contrast-checked (4.5:1+ for text pairings).
- Path alias `@/*` maps to `src/*`.
- `npm run lint` runs ESLint (`eslint-config-next`).
