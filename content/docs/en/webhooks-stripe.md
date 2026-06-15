---
title: "Stripe Webhooks"
description: "Stripe payment webhooks."
---

## Overview

Stripe webhooks keep order and payment state in sync between Stripe and Reponse. When a customer completes checkout, renews a subscription, or receives a refund, Stripe sends an event to your workspace's webhook endpoint. Reponse verifies the Stripe signature and processes the event to create orders, update financial statuses, and trigger post-purchase workflows.

**Endpoint:** `POST /api/stripe/webhook/{workspaceId}`

## Configuration

1. In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks), create a new webhook endpoint:
   ```
   https://api.reponse.ai/api/stripe/webhook/{workspaceId}
   ```
2. Subscribe to the following events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Copy the **Signing secret** (`whsec_...`) into your workspace settings. Reponse stores it as `stripe_webhook_secret`.

## Signature verification

Reponse uses the official Stripe SDK to verify webhook signatures:

```typescript
import Stripe from "stripe";

const stripe = new Stripe(workspace.stripe_secret_key);
const signature = req.headers.get("Stripe-Signature");
const body = await req.text();

let event: Stripe.Event;
try {
  event = stripe.webhooks.constructEvent(
    body,
    signature,
    workspace.stripe_webhook_secret
  );
} catch (err) {
  return new Response(`Webhook Error: ${err.message}`, { status: 400 });
}
```

> **Important:** Always read the raw body as text before passing it to `constructEvent()`. Parsing as JSON first will break the signature check.

## Handled events

### `checkout.session.completed`

The primary order creation event. When a Checkout Session completes successfully, Reponse:

1. **Resolves contact identity** — matches the customer email/phone to an existing contact or creates a new one via the identity resolver.
2. **Checks idempotency** — looks for an existing order by `external_id` (payment intent ID). If found, skips creation.
3. **Creates the order** — inserts order with `financial_status: "paid"`, `fulfillment_status: "unfulfilled"`, amounts in the session currency.
4. **Creates line items** — copies cart lines with variant, title, quantity, price, and SKU.
5. **Tracks the purchase** — sends a server-side GA4 purchase event via the Measurement Protocol.
6. **Converts the cart** — updates cart status to `converted`.
7. **Copies promotions** — migrates `cart_adjustments` and `line_item_adjustments` to `order_adjustments`, increments promotion usage counters.
8. **Resolves fulfillment** — determines the fulfillment driver (`manual`, `supplier_api`, or `shopify_proxy`) and notifies the merchant if manual.
9. **Generates invoice** — inserts an invoice record with a sequential number.
10. **Sends confirmation email** — triggers an AI-generated transactional email.
11. **Mirrors subscription** — if `session.mode === 'subscription'`, upserts a local subscription record.

**Payload example (key fields):**

```json
{
  "id": "cs_live_a1b2c3d4e5f6",
  "payment_intent": "pi_3abc123def456",
  "amount_total": 4999,
  "amount_subtotal": 4160,
  "currency": "eur",
  "mode": "payment",
  "customer_details": {
    "email": "jane@example.com",
    "phone": "+33612345678",
    "address": {
      "city": "Paris",
      "country": "FR",
      "line1": "123 Rue de la Paix",
      "postal_code": "75001"
    }
  },
  "shipping_details": {
    "address": {
      "city": "Paris",
      "country": "FR",
      "line1": "123 Rue de la Paix",
      "postal_code": "75001"
    }
  },
  "metadata": {
    "cart_id": "cart_uuid_here",
    "session_id": "sess_uuid_here",
    "market_id": "market_uuid_here",
    "applied_discount_codes": "SUMMER10"
  },
  "total_details": {
    "amount_tax": 839
  }
}
```

### `invoice.paid`

Handles subscription renewal payments. The first cycle (`billing_reason: "subscription_create"`) is skipped because it's already handled by `checkout.session.completed`. Subsequent cycles (`billing_reason: "subscription_cycle"`) clone the previous order with updated amounts.

**Key fields:**

```json
{
  "id": "in_1abc123",
  "subscription": "sub_abc123",
  "billing_reason": "subscription_cycle",
  "amount_paid": 2999,
  "subtotal": 2499,
  "tax": 500,
  "currency": "eur",
  "number": "INV-0042"
}
```

### `charge.refunded`

Updates the order's financial status based on refund state:

- Full refund → `financial_status: "refunded"`
- Partial refund → `financial_status: "partially_refunded"`

If the refund was triggered by the AI `cancel_order` tool (detected via `cancel_source: "ai_tool"` in metadata), the webhook is skipped to avoid duplicate processing.

**Key fields:**

```json
{
  "id": "ch_abc123",
  "payment_intent": "pi_3abc123def456",
  "refunded": true,
  "amount_refunded": 4999,
  "currency": "eur",
  "refunds": {
    "data": [
      {
        "metadata": { "cancel_source": "ai_tool" }
      }
    ]
  }
}
```

### Subscription lifecycle

| Event | Action |
|---|---|
| `customer.subscription.created` | Upsert subscription with status, billing period, cancellation flags |
| `customer.subscription.updated` | Update status and period dates |
| `customer.subscription.deleted` | Update status to reflect deletion |

**Upserted fields:**

```json
{
  "stripe_subscription_id": "sub_abc123",
  "status": "active",
  "current_period_start": "2026-05-01T00:00:00Z",
  "current_period_end": "2026-06-01T00:00:00Z",
  "cancel_at_period_end": false,
  "canceled_at": null
}
```

## Retry policy

| Property | Value |
|---|---|
| Retry window | 72 hours |
| Max attempts | ~15 |
| Backoff | Exponential |
| Event log | Available in Stripe Dashboard → Webhooks → Event log |

Stripe retries on any non-`2xx` response. Events are available in the Stripe Dashboard for manual replay if needed.

## Best practices

1. **Use `constructEvent()` from the Stripe SDK** — never verify signatures manually for Stripe.
2. **Always check idempotency** — the handler checks `external_id` before creating orders to prevent duplicates.
3. **Read the body as text** — `await req.text()` must be called before `constructEvent()`.
4. **Store both keys** — `stripe_secret_key` (for API calls) and `stripe_webhook_secret` (for verification) are both required.
5. **Test with the Stripe CLI** — use `stripe listen --forward-to localhost:3000/api/stripe/webhook/{id}` during development.
6. **Handle refund attribution** — check `cancel_source` metadata to avoid double-processing AI-initiated cancellations.
