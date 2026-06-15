---
title: "Subscriptions"
description: "Selling and managing subscriptions."
---

## Overview

Reponse supports **recurring subscriptions** with scheduled shipments, flexible billing cycles, and lifecycle management. Customers and AI agents can delay shipments, ship early, pause, or cancel — all through the dashboard, API, or chat agent. Payment processing is handled by **Paddle** as the merchant of record.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace on a plan that includes subscriptions |
| Paddle account | Connected in Dashboard → Settings → Payments |
| Subscription product | At least one product configured as a subscription |

## Key concepts

| Concept | Description |
|---|---|
| **Subscription plan** | Defines the product, price, billing cycle, and shipment frequency |
| **Billing cycle** | How often the customer is charged (`weekly`, `monthly`, `quarterly`, `yearly`) |
| **Shipment schedule** | When the next shipment is dispatched (can differ from billing) |
| **Lifecycle state** | Current state of the subscription |

## Step 1 — Create a subscription plan

1. Open **Dashboard → Products → Subscriptions**.
2. Click **Create Plan**.
3. Configure the plan:

| Field | Type | Description |
|---|---|---|
| `product_id` | `string` | The product to sell as a subscription |
| `name` | `string` | Plan display name (e.g. "Monthly Coffee Box") |
| `billing_cycle` | `enum` | `weekly`, `monthly`, `quarterly`, `yearly` |
| `price` | `number` | Recurring price per cycle |
| `currency` | `string` | ISO currency code |
| `trial_days` | `number` | Free trial period (0 = no trial) |
| `shipment_frequency` | `enum` | How often to ship (can match or differ from billing) |

### Via the API

```typescript
const { data: plan } = await reponse.subscriptions.createPlan({
  body: {
    productId: 'prod_xxx',
    name: 'Monthly Coffee Box',
    billingCycle: 'monthly',
    price: 29.99,
    currency: 'EUR',
    trialDays: 14,
  },
});
```

## Step 2 — Customer subscribes

When a customer subscribes, Reponse creates a subscription record and initiates billing through Paddle:

```typescript
const { data: subscription } = await reponse.subscriptions.create({
  body: {
    planId: 'plan_xxx',
    email: 'customer@example.com',
    shippingAddress: { /* ... */ },
  },
});
// subscription.id → "sub_xxx"
// subscription.status → "active" (or "trialing" if trial_days > 0)
```

## Step 3 — Manage subscriptions

### Delay next shipment

Push the next shipment forward by a number of days:

```typescript
await reponse.subscriptions.manage({
  path: { id: 'sub_xxx' },
  body: { action: 'delay', days: 7 },
});
```

### Ship now

Trigger an immediate shipment:

```typescript
await reponse.subscriptions.manage({
  path: { id: 'sub_xxx' },
  body: { action: 'ship_now' },
});
```

### Pause

Temporarily pause a subscription (billing and shipments stop):

```typescript
await reponse.subscriptions.manage({
  path: { id: 'sub_xxx' },
  body: { action: 'pause' },
});
```

### Resume

Resume a paused subscription:

```typescript
await reponse.subscriptions.manage({
  path: { id: 'sub_xxx' },
  body: { action: 'resume' },
});
```

### Cancel

Cancel a subscription (takes effect at end of current billing cycle):

```typescript
await reponse.subscriptions.manage({
  path: { id: 'sub_xxx' },
  body: { action: 'cancel', reason: 'Too expensive' },
});
```

## Subscription lifecycle

```
created → trialing → active → paused → active (resumed)
                        ↓         ↓
                    canceled    canceled
                        ↓         ↓
                     expired   expired
```

| State | Description |
|---|---|
| `created` | Subscription record created, awaiting payment setup |
| `trialing` | In free trial period, no charges yet |
| `active` | Recurring billing and shipments are running |
| `paused` | Temporarily paused — no billing or shipments |
| `canceled` | Canceled — active until end of current cycle |
| `expired` | Past the cancellation date, fully terminated |

## Upgrade / Downgrade

Customers can switch plans mid-cycle:

```typescript
await reponse.subscriptions.changePlan({
  path: { id: 'sub_xxx' },
  body: {
    newPlanId: 'plan_yyy',
    proration: 'prorate',  // 'prorate' | 'immediate' | 'next_cycle'
  },
});
```

| Proration mode | Description |
|---|---|
| `prorate` | Credit remaining days, charge difference immediately |
| `immediate` | Charge full new plan price now |
| `next_cycle` | Apply new plan at next billing date |

## Paddle integration

Reponse uses Paddle as the merchant of record for subscription billing:

1. **Connect Paddle** in Dashboard → Settings → Payments.
2. Provide your Paddle **Vendor ID** and **API Key**.
3. Reponse automatically syncs subscription events (payment success, failed, refund) via Paddle webhooks.

| Paddle webhook event | Reponse action |
|---|---|
| `subscription_payment_succeeded` | Mark cycle as paid, trigger shipment |
| `subscription_payment_failed` | Notify customer, retry per dunning rules |
| `subscription_cancelled` | Update status to `canceled` |
| `subscription_updated` | Sync plan and price changes |

## API reference

| Endpoint | Method | Description |
|---|---|---|
| `/v1/subscriptions` | `GET` | List subscriptions (filter by status, email) |
| `/v1/subscriptions` | `POST` | Create a new subscription |
| `/v1/subscriptions/:id` | `GET` | Get subscription details |
| `/v1/subscriptions/:id/manage` | `POST` | Delay, ship now, pause, resume, or cancel |
| `/v1/subscriptions/:id/change-plan` | `POST` | Upgrade or downgrade the plan |
| `/v1/subscription-plans` | `GET` | List available plans |
| `/v1/subscription-plans` | `POST` | Create a new plan |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Only active subscriptions can be modified" | Subscription is paused or canceled | Resume or create a new subscription |
| Payment fails repeatedly | Customer card expired | Send dunning email via Paddle settings |
| Shipment not triggered | Paddle webhook not received | Verify webhook URL in Paddle dashboard |
| Trial not starting | `trial_days` set to 0 | Update the plan with a trial period |
| Downgrade not applying | Wrong `proration` mode | Use `next_cycle` for end-of-cycle changes |
| Paddle not connected | Missing API credentials | Add Vendor ID and API Key in settings |
