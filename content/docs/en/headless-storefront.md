---
title: "Headless Storefront"
description: "Deploy a complete headless storefront powered by Reponse with Next.js 16."
---

## Overview

Reponse provides a **production-ready Next.js 16 storefront starter** (`starters/nextjs-storefront/`) that connects to your workspace via the Headless API. It includes 12 pages, B2C authentication, and dynamic theming — all configurable from the Reponse dashboard.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with products |
| Node.js 18+ | Required for Next.js 16 |
| Environment variables | `REPONSE_API_URL`, `REPONSE_WORKSPACE_ID` |

## Quick start

```bash
cp -r starters/nextjs-storefront my-store
cd my-store
cp .env.example .env.local
# Set REPONSE_API_URL and REPONSE_WORKSPACE_ID
pnpm install && pnpm dev
```

## Pages

| Route | Description | Module-gated |
|---|---|---|
| `/` | Homepage with featured products | — |
| `/products` | Catalog with search (`?q=`) and cursor pagination | — |
| `/products/[slug]` | PDP with variants, reviews, and product facts | — |
| `/collections` | Collections listing | — |
| `/cart` | Shopping cart | — |
| `/reviews` | Store-wide customer reviews | `reviews` |
| `/rewards` | Loyalty program marketing page | `loyalty` |
| `/track` | Public order lookup (email + order number) | — |
| `/support` | Support ticket form | `support` |
| `/account/login` | B2C OTP email login | — |
| `/feed` | AI product feed info | — |
| `/acp` | Agentic Commerce Protocol info | — |

## API endpoints

### New endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/v1/products/{id}/reviews` | Storefront | Product reviews with aggregates |
| `GET` | `/v1/reviews` | Storefront | Store-wide reviews |
| `POST` | `/v1/reviews` | Storefront | Submit a review (enters moderation) |
| `GET` | `/v1/me` | Bearer (session) | Authenticated contact profile |
| `GET` | `/v1/orders` | Storefront + `contact_id` | Customer order history |
| `GET` | `/v1/orders/lookup` | Storefront | Public order lookup by email + order number |

### Enhanced endpoints

| Method | Path | Change |
|---|---|---|
| `GET` | `/v1/theme` | Added `modules` block from `workspace_modules` |
| `GET` | `/v1/loyalty` | Public program config without API key (when no `contact_id`) |
| `GET` | `/v1/products/{id}` | `?include=facts` for product Q&A data |

## Theming

The storefront reads CSS custom properties from `GET /v1/theme`:

```css
--rp-color-primary
--rp-color-background
--rp-color-surface
--rp-color-border
--rp-color-text
--rp-color-text-secondary
--rp-radius
--rp-font-family
--rp-brand-name
--rp-brand-logo
```

Configure these in **Dashboard → Settings → Widget**.

## Module gating

Pages like `/reviews`, `/rewards`, and `/support` are conditionally shown based on workspace module activation. The `/v1/theme` response includes a `modules` block:

```json
{
  "modules": {
    "reviews": { "active": true, "config": {} },
    "loyalty": { "active": true, "config": {} },
    "support": { "active": false, "config": {} }
  }
}
```

Use `isModuleActive(config, "reviews")` in the starter to gate pages.

## B2C authentication

The storefront uses OTP (one-time password) email authentication:

1. **Request OTP**: `POST /api/auth/b2c/otp` with `{ workspaceId, email }`
2. **Verify code**: `POST /api/auth/b2c/verify` with `{ workspaceId, email, code }`
3. **Session**: The response includes a `sessionToken` stored in an httpOnly cookie
4. **Authenticated calls**: `GET /v1/me` with `Authorization: Bearer <sessionToken>`

Session tokens expire after 30 days.

## Security

- **IDOR protection**: Order lookup escapes SQL wildcards (`%`, `_`) in email input
- **Dual-auth on loyalty**: Public program config uses storefront auth; balance data requires API key
- **Session scoping**: `/v1/me` resolves the contact from the session token hash — no `contact_id` parameter exposed client-side
- **Rate limiting**: All public endpoints use `checkStorefrontRateLimit`
