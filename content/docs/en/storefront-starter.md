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
| Stripe account | Connected to your workspace (for checkout) |

## Step 1 — Clone the starter

```bash
npx degit reponseai/storefront-starter my-store
cd my-store
pnpm install
```

## Step 2 — Configure environment variables

Create a `.env.local` file at the project root:

```bash
# ─── Reponse API (required) ─────────────────────────────────────────────────
REPONSE_API_KEY=rp_live_xxxxxxxxxxxx
NEXT_PUBLIC_REPONSE_API_URL=https://reponse.ai/api
NEXT_PUBLIC_REPONSE_API_KEY=rp_live_xxxxxxxxxxxx
NEXT_PUBLIC_WORKSPACE_ID=your-workspace-uuid

# ─── Store ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_STORE_NAME="My Store"
NEXT_PUBLIC_SITE_URL=https://my-store.com

# ─── Checkout ───────────────────────────────────────────────────────────────
CHECKOUT_MODE=embedded
NEXT_PUBLIC_MARKET_ID=your-market-uuid
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
```

### Variable reference

| Variable | Required | Description |
|---|---|---|
| `REPONSE_API_KEY` | Yes | Server-side API key. See [Authentication](doc:authentication). |
| `NEXT_PUBLIC_REPONSE_API_URL` | Yes | API base URL — use `https://reponse.ai/api` for production. |
| `NEXT_PUBLIC_REPONSE_API_KEY` | Yes | Client-side API key (same value as `REPONSE_API_KEY`). Used by the variant selector and client-side cart operations. |
| `NEXT_PUBLIC_WORKSPACE_ID` | Yes | Your workspace UUID. See [How to find your Workspace ID](#how-to-find-your-workspace-id). |
| `NEXT_PUBLIC_STORE_NAME` | Yes | Store name shown in `<title>` and footer. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical base URL for SEO (defaults to `localhost:3000`). |
| `CHECKOUT_MODE` | No | `embedded` (Stripe Elements on your site) or `redirect` (redirect to Stripe Checkout). Defaults to `embedded`. See [Checkout modes](#checkout-modes). |
| `NEXT_PUBLIC_MARKET_ID` | Yes | Market UUID for currency, taxes, and shipping. See [How to find your Market ID](#how-to-find-your-market-id). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key. See [How to find your Stripe key](#how-to-find-your-stripe-key). |

### How to find your Workspace ID

1. Open the Reponse dashboard.
2. The workspace ID is the UUID in the URL: `https://reponse.ai/dashboard/{workspace-id}/...`
3. You can also find it in **Settings → General**.

### How to find your Market ID

Markets define the currency, tax rules, and shipping zones for a region. Every workspace has at least one market (created automatically).

1. Go to **Dashboard → Settings → Markets**.
2. Click on the market you want to use (e.g. "France" or "Europe").
3. Copy the **Market ID** shown at the top of the market detail page.

If you only sell in one country, use your default market. For multi-currency storefronts, pass different `market_id` values based on the visitor's locale.

### How to find your Stripe key

The storefront needs your Stripe **publishable key** (starts with `pk_live_` or `pk_test_`). This is a client-side key — it is safe to expose in the browser.

1. Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2. Copy the **Publishable key**.
3. For testing, use the key from Stripe's test mode (`pk_test_...`).

> **Note:** Your workspace also needs a Stripe **secret key** configured on the backend. This is set up in **Dashboard → Settings → Payments** — you do not need to add it to your storefront `.env.local`.

### Checkout modes

| Mode | Description |
|---|---|
| `embedded` (default) | Stripe Payment Elements render directly on your storefront. The customer never leaves your site. Requires `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. |
| `redirect` | The customer is redirected to a Stripe-hosted checkout page. Simpler to set up — no Stripe key needed in the storefront. |

## Step 3 — Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Products from your Reponse workspace appear automatically.

## Step 4 — Deploy

### Vercel

```bash
pnpm build          # verify production build locally
vercel --prod       # deploy (or push to GitHub with Vercel integration)
```

Set the same environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Netlify

The starter includes a `netlify.toml` configuration file. To deploy:

1. Create a new site on Netlify and connect your Git repository.
2. Netlify auto-detects the Next.js framework and uses the `@netlify/plugin-nextjs` adapter.
3. Set environment variables in **Site Settings → Environment Variables**.
4. Deploy.

## Step 5 — Add the AI Chat Widget (optional)

Add the Reponse chat widget to your storefront for conversational commerce. The starter includes this automatically when `NEXT_PUBLIC_WORKSPACE_ID` is set.

If you need to add it manually to a custom layout:

```tsx
import Script from "next/script";

<Script
  src="https://reponse.ai/assets/sdk/reponse-widget.min.js"
  data-workspace-id={process.env.NEXT_PUBLIC_WORKSPACE_ID}
  strategy="lazyOnload"
/>
```

## Step 6 — Customize the theme

The starter uses Tailwind CSS v4 and CSS variables for theming. Override the CSS variables in `app/globals.css`:

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
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home / product listing
│   │   ├── products/[slug]/      # Product detail page
│   │   ├── collections/[handle]/ # Collection page
│   │   ├── cart/                 # Cart page
│   │   ├── checkout/             # Embedded checkout
│   │   ├── order/success/        # Order confirmation
│   │   ├── policies/[type]/      # Legal policies
│   │   ├── sitemap.ts            # Dynamic sitemap
│   │   ├── robots.ts             # Robots.txt
│   │   └── layout.tsx            # Root layout + AI widget
│   ├── components/               # UI components
│   └── lib/
│       ├── reponse.ts            # SDK client singleton
│       ├── cart.ts               # Cart server actions
│       └── currency.ts           # Price formatting
├── netlify.toml                  # Netlify config
├── package.json
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
| Checkout fails | Missing `NEXT_PUBLIC_MARKET_ID` or Stripe not connected | Verify market ID and Stripe config in dashboard |

## Related

- [Authentication](doc:authentication)
- [Checkout — Stripe](doc:checkout-stripe)
- [Checkout — Payment Intent](doc:checkout-intent)
- [SDK Overview](doc:sdk-overview)
- [Environment Variables](doc:environment-variables)
