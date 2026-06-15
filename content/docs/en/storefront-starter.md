---
title: "Storefront Starter"
description: "The Next.js storefront starter."
---

## Overview

The **Reponse Storefront Starter** is a production-ready Next.js commerce frontend wired to the Reponse SDK. It ships with product listing, product detail, collections, cart, embedded checkout, sitemap, robots.txt, and product JSON-LD — everything you need to launch a headless storefront in minutes.

## Prerequisites

| Requirement | Minimum version |
|---|---|
| Node.js | 18+ |
| pnpm (or npm / yarn) | 9+ |
| Reponse workspace | Active, with at least one product |
| Reponse API key | Generated in **Dashboard → Settings → API Keys** |
| Vercel account (optional) | Free tier or above |

## Step 1 — Clone the starter

```bash
npx degit reponseai/storefront-starter my-store
cd my-store
pnpm install
```

## Step 2 — Configure environment variables

Create a `.env.local` file at the project root:

```bash
# Required
REPONSE_API_KEY=rp_live_xxxxxxxxxxxx
NEXT_PUBLIC_STORE_NAME="My Store"

# Optional
NEXT_PUBLIC_BASE_URL=https://my-store.com
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_CURRENCY=EUR
```

| Variable | Required | Description |
|---|---|---|
| `REPONSE_API_KEY` | Yes | Server-side API key from your dashboard |
| `NEXT_PUBLIC_STORE_NAME` | Yes | Store name shown in `<title>` and header |
| `NEXT_PUBLIC_BASE_URL` | No | Canonical base URL (defaults to Vercel URL) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No | Default locale (`en` or `fr`). Defaults to `en` |
| `NEXT_PUBLIC_CURRENCY` | No | Display currency ISO code. Defaults to `EUR` |

## Step 3 — Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Products from your Reponse workspace appear automatically.

## Step 4 — Deploy to Vercel

```bash
pnpm build          # verify production build locally
vercel --prod       # deploy (or push to GitHub with Vercel integration)
```

Set the same environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Step 5 — Customize the theme

The starter uses Tailwind CSS and CSS variables for theming. Edit `tailwind.config.ts` to adjust colors, fonts, and spacing:

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent:  'var(--color-accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
      },
    },
  },
};
```

Override the CSS variables in `app/globals.css`:

```css
:root {
  --color-primary: #1a1a2e;
  --color-accent:  #e94560;
  --font-sans: 'Inter', sans-serif;
}
```

## Project structure

```
my-store/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Home / product listing
│   │   ├── products/[handle]/    # Product detail page
│   │   ├── collections/[slug]/   # Collection page
│   │   ├── cart/                 # Cart page
│   │   └── checkout/             # Embedded checkout
│   └── layout.tsx
├── components/                   # Shared UI components
├── lib/
│   └── reponse.ts                # SDK client singleton
├── public/
├── tailwind.config.ts
└── .env.local
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Empty product list | Invalid or missing `REPONSE_API_KEY` | Verify the key in Dashboard → Settings → API Keys |
| 401 on API calls | Key does not have `catalog:read` scope | Regenerate the key with required scopes |
| Build fails with type errors | Outdated SDK version | Run `pnpm update @reponseai/sdk` |
| Styles not applied after theme change | Tailwind purge cache | Delete `.next/` and restart `pnpm dev` |
| Images not loading | Missing domain in `next.config.ts` | Add your CDN domain to `images.remotePatterns` |
