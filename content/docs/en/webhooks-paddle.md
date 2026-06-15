---
title: "Paddle Webhooks"
description: "Paddle billing webhooks."
---

## Overview

Paddle webhooks handle subscription billing events for workspaces that use Paddle as the merchant of record. When a merchant subscribes to a Reponse plan, upgrades, or cancels, Paddle sends lifecycle events that keep the workspace's billing state in sync.

**Endpoint:** `POST /api/webhooks/paddle`

## Configuration

1. In the [Paddle Dashboard](https://vendors.paddle.com/), navigate to **Developer Tools → Notifications**.
2. Create a new notification destination with the endpoint URL:
   ```
   https://api.reponse.ai/api/webhooks/paddle
   ```
3. Subscribe to these events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.activated`
   - `subscription.canceled`
   - `subscription.past_due`
4. Copy the **Webhook Secret** and set it as the `PADDLE_WEBHOOK_SECRET` environment variable.

## Signature verification

Reponse uses the official Paddle Node SDK to verify and unmarshal webhook payloads:

```typescript
import { paddle } from "@/lib/paddle";

const signature = req.headers.get("paddle-signature") || "";
const body = await req.text();

const eventData = await paddle.webhooks.unmarshal(
  body,
  process.env.PADDLE_WEBHOOK_SECRET || "",
  signature
);

if (!eventData) {
  return new Response("Invalid signature", { status: 401 });
}
```

> The `paddle-signature` header contains a timestamp and hash that the SDK validates. Never skip this step.

## Handled events

### `subscription.created` / `subscription.updated` / `subscription.activated`

All three events share the same handler. They update the workspace billing state:

| Field updated | Source |
|---|---|
| `paddle_customer_id` | `subscription.customerId` |
| `paddle_subscription_id` | `subscription.id` |
| `subscription_status` | `subscription.status` |
| `subscription_plan_id` | `subscription.items[0].price.id` |
| `billing_cycle_start` | `subscription.currentBillingPeriod.startsAt` |
| `conversations_limit` | Set to `1000` (plan default) |
| `conversations_usage` | Reset to `0` when billing cycle start changes |

The workspace is identified via `customData.workspaceId` passed during checkout. If missing, the handler falls back to matching by `paddle_subscription_id`.

**Payload example:**

```json
{
  "eventType": "subscription.updated",
  "data": {
    "id": "sub_01abc123def456",
    "customerId": "ctm_01xyz789",
    "status": "active",
    "items": [
      {
        "price": {
          "id": "pri_01growth_monthly"
        }
      }
    ],
    "currentBillingPeriod": {
      "startsAt": "2026-05-01T00:00:00Z",
      "endsAt": "2026-06-01T00:00:00Z"
    },
    "customData": {
      "workspaceId": "ws_abc123"
    }
  }
}
```

### `subscription.canceled`

Sets the workspace `subscription_status` to `canceled`. The workspace is matched by `paddle_subscription_id`.

**Payload example:**

```json
{
  "eventType": "subscription.canceled",
  "data": {
    "id": "sub_01abc123def456",
    "status": "canceled",
    "canceledAt": "2026-05-15T14:30:00Z"
  }
}
```

### `subscription.past_due`

Sets the workspace `subscription_status` to `past_due`, signalling that a payment has failed.

**Payload example:**

```json
{
  "eventType": "subscription.past_due",
  "data": {
    "id": "sub_01abc123def456",
    "status": "past_due"
  }
}
```

## Usage counter reset

When a new billing cycle starts (`currentBillingPeriod.startsAt` differs from the stored `billing_cycle_start`), the handler automatically resets `conversations_usage` to `0`. This ensures merchants get a fresh conversation quota each billing cycle.

## Retry policy

| Property | Value |
|---|---|
| Retry window | 24 hours |
| Max attempts | 10 |
| Backoff | Exponential |
| Manual replay | Available in Paddle Dashboard → Notifications → Event log |

## Best practices

1. **Always pass `workspaceId` in `customData`** during Paddle Checkout — this is the primary lookup key.
2. **Handle the fallback path** — if `customData` is missing, the handler matches by `paddle_subscription_id`.
3. **Monitor `past_due` events** — alert merchants when payment fails to avoid service interruption.
4. **Test with Paddle Sandbox** — use sandbox mode and the sandbox webhook secret during development.
5. **Keep `PADDLE_WEBHOOK_SECRET` in environment variables** — never hardcode it.
