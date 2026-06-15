---
title: "Changelog"
description: "API and platform changelog."
---

## Overview

Track notable changes to the Reponse API, SDK, and platform. Breaking changes are announced in advance and the API is versioned under `/v1`. Additive changes ship continuously.

## Versioning

The current API version is **`v1`**. All endpoints are prefixed with `/api/v1/`. Additive, non-breaking changes (new fields, new endpoints) ship continuously. Breaking changes would ship under a new version (e.g. `/api/v2/`), with at least 90 days of dual support.

---

## v1.4.0 — 2026-05-20

### ✨ New

- **Logistics webhooks** — Sendcloud integration with HMAC signature verification. Receive `parcel_status_changed` events to keep fulfillment records current. ([Logistics Webhooks](doc:webhooks-logistics))
- **Trustpilot reviews** — Brand review webhook handler with automatic upsert into the `reviews` table. ([Reviews](doc:webhooks-reviews))
- **Post-purchase review requests** — `orders-fulfilled` Shopify webhook creates `review_request` records with unique tokens for review collection emails.
- **Subscription renewal orders** — `invoice.paid` Stripe webhook now clones previous orders for subscription renewal cycles.

### 🔧 Improved

- **Paddle usage reset** — Conversation usage counter automatically resets when a new billing cycle starts.
- **Refund attribution** — Stripe `charge.refunded` webhook skips processing when the refund was initiated by the AI `cancel_order` tool (detected via `cancel_source` metadata).
- **Shopify Markets sync** — `markets/create`, `markets/update`, and `markets/delete` webhooks now sync full market data including currency, locales, and country codes via Admin GraphQL.

### 🐛 Fixed

- **Shopify inventory webhook** — Added SKU-based fallback when `inventory_item_id` cannot be resolved to a variant directly.
- **Contact phone normalisation** — Improved E.164 phone normalisation for international formats in Shopify customer webhooks.

---

## v1.3.0 — 2026-04-15

### ✨ New

- **Product Feed — CSV** — `GET /api/v1/feed/csv` endpoint returns the active catalog as a Google Merchant Center–compatible CSV file. ([Feed CSV](doc:feed-csv))
- **Product Feed — JSON** — `GET /api/v1/feed` endpoint returns ACP-compliant structured product data with Gzip compression. ([Feed JSON](doc:feed-json))
- **Theme API** — `GET /api/v1/theme` returns workspace theme configuration (CSS custom properties) for consistent storefront styling. ([Theme](doc:theme-get))
- **Email inbound webhook** — Customer email replies are parsed and threaded into support tickets. ([Email Inbound](doc:webhooks-email-inbound))

### 🔧 Improved

- **Shopify product webhook** — Now syncs `option_definitions`, `has_only_default_variant`, and `barcode` fields.
- **Stripe checkout** — Added server-side GA4 purchase tracking via Measurement Protocol.
- **Invoice generation** — Sequential invoice numbers generated atomically via `next_invoice_number` RPC.

---

## v1.2.0 — 2026-03-10

### ✨ New

- **Stamped reviews webhook** — Product review ingestion with HMAC-SHA256 verification. ([Reviews](doc:webhooks-reviews))
- **Paddle billing webhooks** — Subscription lifecycle management for workspaces using Paddle as merchant of record. ([Paddle](doc:webhooks-paddle))
- **AI transactional emails** — Order confirmation emails triggered automatically from Stripe webhook flow.

### 🔧 Improved

- **Shopify customer webhook** — Now captures SMS consent, marketing consent timestamps, and links Shopify customer identities.
- **Stripe subscription mirroring** — `checkout.session.completed` now creates local subscription records for subscription-mode sessions.

---

## v1.1.0 — 2026-02-01

### ✨ New

- **Stripe webhooks** — Full checkout-to-order pipeline: `checkout.session.completed`, `charge.refunded`, subscription lifecycle. ([Stripe](doc:webhooks-stripe))
- **Shopify fulfillment webhooks** — `fulfillments/create` and `fulfillments/update` events create and update tracking records.
- **Cart promotions** — Discount codes and cart adjustments are migrated to order adjustments on checkout completion.

### 🔧 Improved

- **Order idempotency** — Stripe webhook checks `external_id` before creating orders to prevent duplicates on retry.
- **Fulfillment driver resolution** — Market-level fulfillment driver overrides workspace defaults.

---

## v1.0.0 — 2026-01-15

### 🚀 Launch

- **Reponse API v1** — Initial public release.
- **Shopify webhooks** — Product sync (`products/create`, `products/update`, `products/delete`), order sync, customer sync, inventory updates, app lifecycle. ([Shopify](doc:webhooks-shopify))
- **Authentication** — Workspace API keys with Bearer token authentication. ([Authentication](doc:authentication))
- **SDK** — `@reponse/sdk` npm package with TypeScript support. ([SDK Overview](doc:sdk-overview))
- **Core API** — Products, collections, cart, checkout, orders, discounts, and inventory endpoints.

---

## Deprecation policy

- Deprecated fields and endpoints are marked with a `deprecated` flag in the API response and documentation.
- Deprecated features are supported for at least **6 months** after the deprecation notice.
- Breaking changes are communicated via email to workspace owners and in this changelog.
