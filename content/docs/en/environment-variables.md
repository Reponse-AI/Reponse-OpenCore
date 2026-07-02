---
title: "Environment Variables"
description: "Environment variables used by the Reponse SDK and storefronts."
---

## Overview

Reponse uses environment variables to configure API keys, database connections, third-party integrations, and runtime behavior. This reference lists every variable, grouped by category. Never commit secrets to source control — use `.env.local` or your hosting provider's secrets manager.

## Core (Required)

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Exposed to the client for auth and realtime. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key. Safe for client-side use. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key. **Server-only.** Full database access. |
| `OPENAI_API_KEY` | OpenAI API key for chat completions and embeddings. |
| `NEXT_PUBLIC_BASE_URL` | Public base URL of the app (e.g. `https://reponse.ai`). |

## SDK

| Variable | Description |
| --- | --- |
| `REPONSE_API_KEY` | Workspace API key used by the SDK. Server-side only. |
| `NEXT_PUBLIC_REPONSE_BASE_URL` | Optional API base URL override for the client SDK. |

## Storefront

These variables are specific to storefronts built with the [Storefront Starter](doc:storefront-starter) or the Reponse SDK.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_REPONSE_API_URL` | API base URL (e.g. `https://reponse.ai/api`). |
| `NEXT_PUBLIC_REPONSE_API_KEY` | Client-side API key (same value as `REPONSE_API_KEY`). Used for client-side cart and variant operations. |
| `NEXT_PUBLIC_WORKSPACE_ID` | Workspace UUID. Found in the dashboard URL or **Settings → General**. |
| `NEXT_PUBLIC_STORE_NAME` | Store name displayed in the header and footer. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO (e.g. `https://my-store.com`). |
| `NEXT_PUBLIC_MARKET_ID` | Market UUID for currency, taxes, and shipping. Found in **Dashboard → Settings → Markets**. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_live_` or `pk_test_`). Found in [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys). |
| `CHECKOUT_MODE` | Checkout flow: `embedded` (Stripe Elements on your site) or `redirect` (Stripe-hosted page). Defaults to `embedded`. |

## Shopify

| Variable | Description |
| --- | --- |
| `SHOPIFY_WEBHOOK_SECRET` | HMAC secret for verifying Shopify webhook signatures. |

## Email (Resend)

| Variable | Description |
| --- | --- |
| `RESEND_API_KEY` | Resend API key for transactional emails. |
| `RESEND_FROM_EMAIL` | Default sender address (e.g. `hello@reponse.ai`). |
| `EMAIL_FROM_DOMAIN` | Verified sender domain for order and support emails. |
| `DEFAULT_SENDER_DOMAIN` | Fallback sender domain when workspace has none configured. |

## Notion CMS

| Variable | Description |
| --- | --- |
| `NOTION_TOKEN` | Notion integration token for CMS content fetching. |
| `NOTION_DATABASE_ID` | Main Notion database ID. |
| `NOTION_TOPICS_DATABASE_ID` | Topics database ID for doc/content pages. |

## Payments (Paddle)

| Variable | Description |
| --- | --- |
| `PADDLE_API_KEY` | Paddle API key for subscription billing. |
| `NEXT_PUBLIC_PADDLE_ENV` | Paddle environment: `sandbox` or `production`. |

## Analytics

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics 4 measurement ID (client-side). |
| `GA4_MEASUREMENT_ID` | GA4 measurement ID (server-side fallback). |
| `GA4_API_SECRET` | GA4 Measurement Protocol API secret. |

## DNS & Hosting (Netlify)

| Variable | Description |
| --- | --- |
| `NETLIFY_ACCESS_TOKEN` | Netlify API access token for custom domain management. |
| `NETLIFY_SITE_ID` | Netlify site ID for DNS configuration. |
| `NEXT_PUBLIC_NETLIFY_SITE_NAME` | Netlify site name for CNAME targets. |

## Security & Encryption

| Variable | Description |
| --- | --- |
| `CRYPTR_SECRET_KEY` | Encryption key for securing stored credentials (Shopify tokens, etc.). |
| `CRON_SECRET` | Secret token for authenticating internal cron job requests. |

## SEO

| Variable | Description |
| --- | --- |
| `INDEXNOW_KEY` | IndexNow API key for search engine URL submission. |

## AI Models

| Variable | Description |
| --- | --- |
| `REVIEW_EMBEDDING_MODEL` | Embedding model for review vectors (default: `text-embedding-3-small`). |
| `INBOX_AUTO_RESPONSE_MODEL` | Model for auto-responding to support tickets (default: `gpt-4o-mini`). |

## Example `.env.local`

```bash
# ── Core ──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_BASE_URL=https://reponse.ai

# ── SDK ───────────────────────────────────────────
REPONSE_API_KEY=rp_live_...

# ── Shopify ───────────────────────────────────────
SHOPIFY_WEBHOOK_SECRET=shpss_...

# ── Email ─────────────────────────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM_DOMAIN=reponse.ai

# ── Payments ──────────────────────────────────────
PADDLE_API_KEY=...
NEXT_PUBLIC_PADDLE_ENV=sandbox
```

## Security Notes

- Variables prefixed with `NEXT_PUBLIC_` are embedded in the client-side bundle. Only use this prefix for non-secret values.
- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and `CRYPTR_SECRET_KEY` must never be exposed to the browser.
- Rotate keys immediately if they are accidentally committed or leaked.
