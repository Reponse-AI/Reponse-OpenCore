---
title: "Webhooks Overview"
description: "How Reponse webhooks work."
---

## Overview

Webhooks let your systems react in real time to events that happen in Reponse — orders, payments, catalog changes, reviews, support tickets, and more. Instead of polling the API, you register an endpoint and Reponse (or the connected provider) sends an HTTP `POST` request to it every time a relevant event occurs.

Each integration source has its own webhook endpoint URL and event set. This guide covers the common patterns shared across all providers.

## Supported providers

| Provider | Endpoint pattern | Events |
|---|---|---|
| **Shopify** | `/api/shopify/webhooks/{workspaceId}` | Orders, products, customers, inventory, fulfillments, markets, app lifecycle |
| **Stripe** | `/api/stripe/webhook/{workspaceId}` | `checkout.session.completed`, `invoice.paid`, `charge.refunded`, subscription lifecycle |
| **Paddle** | `/api/webhooks/paddle` | Subscription created/updated/cancelled/past-due |
| **Stamped** | `/api/webhooks/stamped` | Product review created/updated |
| **Trustpilot** | `/api/webhooks/trustpilot` | Brand review created/updated |
| **Logistics** | `/api/webhooks/logistics?provider={name}&workspaceId={id}` | Shipment status changes (Sendcloud, ShipStation, etc.) |
| **Email Inbound** | `/api/webhooks/email-inbound` | Incoming customer email → support ticket |

## Registering a webhook

### Via the dashboard

1. Open **Settings → Integrations** in the Reponse dashboard.
2. Select the provider you want to configure.
3. Paste the endpoint URL shown in the integration card into the provider's webhook settings (e.g. Shopify Partner Dashboard, Stripe Dashboard, etc.).
4. Copy the **webhook secret** displayed by the provider back into Reponse.

### Programmatically (Shopify example)

Shopify webhooks are automatically registered during the app install OAuth flow. Reponse stores the `shopify_webhook_secret` on the workspace and verifies every incoming request against it.

## Security

### Signature verification

Every provider that supports webhook signatures **must** be verified before trusting the payload. Reponse verifies signatures server-side for all built-in integrations:

| Provider | Header | Algorithm |
|---|---|---|
| Shopify | `X-Shopify-Hmac-Sha256` | HMAC-SHA256 → Base64 |
| Stripe | `Stripe-Signature` | Stripe SDK `constructEvent()` |
| Paddle | `Paddle-Signature` | Paddle SDK `webhooks.unmarshal()` |
| Stamped | `X-Stamped-Signature` | HMAC-SHA256 → Hex |
| Trustpilot | `X-Trustpilot-Signature` | HMAC-SHA256 → Base64 |
| Sendcloud | `Sendcloud-Signature` | HMAC-SHA256 → Hex |
| Email Inbound | `X-Webhook-Secret` | Shared secret comparison |

#### Example: verifying a Shopify HMAC

```typescript
import crypto from "crypto";

const generatedHash = crypto
  .createHmac("sha256", webhookSecret)
  .update(rawBody, "utf8")
  .digest("base64");

if (generatedHash !== hmacHeader) {
  return new Response("Unauthorized", { status: 401 });
}
```

### Workspace scoping

Always validate that the incoming event belongs to your workspace. Reponse routes include `workspaceId` in the URL path or header, and the handler fetches the matching secret from the database before processing.

## Idempotency

Providers may deliver the same event more than once. All Reponse handlers are designed to be idempotent:

- **Shopify** — uses `x-shopify-webhook-id` for deduplication (planned) and upserts keyed on `shopify_product_id` / `shopify_variant_id`.
- **Stripe** — checks for existing orders by `external_id` (payment intent ID) before inserting.
- **Paddle** — upserts workspace billing fields by `paddle_subscription_id`.
- **Reviews** — upserts on the composite key `(workspace_id, source, external_id)`.

> **Best practice:** Key your processing on the provider's unique event ID so duplicate deliveries are harmless.

## Retry policy

All providers follow a retry-with-backoff strategy when your endpoint returns a non-`2xx` status code:

| Provider | Retry window | Max attempts | Backoff |
|---|---|---|---|
| Shopify | 48 hours | 19 | Exponential |
| Stripe | 72 hours | ~15 | Exponential |
| Paddle | 24 hours | 10 | Exponential |
| Sendcloud | 24 hours | 5 | Linear |

> **Important:** Reponse's Shopify handler returns `200 OK` even on internal processing errors to prevent unnecessary retries when the failure is a code bug rather than a transient issue. Stripe, Paddle, and review handlers return appropriate error codes to trigger retries on genuine failures.

## Response requirements

- Return a `2xx` status code within **5 seconds** to acknowledge receipt.
- If processing takes longer, accept the webhook, queue the work, and return `200` immediately.
- Do **not** return redirects (`3xx`) — most providers treat them as failures.

## Best practices

1. **Verify signatures first** — reject unsigned or incorrectly-signed requests before parsing the body.
2. **Process asynchronously** — queue heavy work (email sends, inventory sync, AI enrichment) and return `200` immediately.
3. **Make handlers idempotent** — use upserts and check for existing records before inserting.
4. **Log raw payloads** — store the raw body for debugging during development. Remove in production to avoid PII retention.
5. **Monitor failures** — set up alerting on `4xx`/`5xx` responses from your webhook endpoints.
6. **Use HTTPS only** — never expose webhook endpoints over plain HTTP.
7. **Rotate secrets regularly** — update webhook secrets periodically and redeploy.

## Next steps

- [Events Reference](doc:webhooks-events) — full list of event types and payload structure
- [Shopify Webhooks](doc:webhooks-shopify) — product and order sync details
- [Stripe Webhooks](doc:webhooks-stripe) — payment and subscription lifecycle
- [Paddle Webhooks](doc:webhooks-paddle) — billing and subscription management
