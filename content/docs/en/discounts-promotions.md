---
title: "Discounts & Promotions"
description: "Discounts and promotions: codes, automatic discounts, and the promotions engine."
---

## Overview

Reponse supports discount codes, automatic discounts, and a promotions engine. Codes can be shopper-entered or auto-applied. When a code is applied to a cart, Reponse checks the promotions table first, then falls back to legacy discount codes — giving you flexibility to migrate at your own pace.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with **owner** or **admin** role |
| Products | At least one product in the catalog |
| API key (optional) | Key with `discounts:read`, `discounts:write` scopes for API access |

## Discount types

| Type | Code | Description |
|---|---|---|
| **Percentage** | `percentage` | Reduces price by a percentage (e.g. 15% off) |
| **Fixed amount** | `fixed_amount` | Reduces price by a fixed amount (e.g. €10 off) |
| **Free shipping** | `free_shipping` | Removes shipping cost |
| **Buy X Get Y** | `bxgy` | Buy a quantity of product X, get product Y free/discounted |

## Discount classes

| Class | Behavior |
|---|---|
| `code` | Shopper must enter a code at checkout |
| `automatic` | Applied automatically when conditions are met |

## Step 1 — Create a discount code

### Via the dashboard

1. Go to **Dashboard → Discounts → Create**.
2. Fill in code, type, value, and optional conditions.
3. Click **Save**.

### Via the API

```typescript
import { createDiscountCode } from '@/lib/discount.actions';

const discount = await createDiscountCode('ws_xxx', {
  code: 'SUMMER25',
  type: 'percentage',
  value: 25,
  currency: 'EUR',
  starts_at: '2026-06-01T00:00:00Z',
  end_at: '2026-08-31T23:59:59Z',
  conditions: 'Minimum order €50',
});
```

## Step 2 — Configure conditions and targeting

| Field | Type | Description |
|---|---|---|
| `applies_to_type` | `all` \| `products` \| `collections` | What the discount applies to |
| `applies_to_ids` | `string[]` | Product or collection IDs (when not `all`) |
| `min_order_amount` | `number` | Minimum cart total to qualify |
| `min_quantity` | `number` | Minimum item quantity to qualify |
| `customer_eligibility` | `all` \| `segment` | Who can use the discount |
| `customer_segment_ids` | `string[]` | Specific customer segments (when `segment`) |
| `tier_required` | `string` | Loyalty tier required (e.g. `Gold`) |

## Step 3 — Schedule discounts

Control when discounts are active:

```typescript
await createDiscountCode('ws_xxx', {
  code: 'FLASH50',
  type: 'percentage',
  value: 50,
  starts_at: '2026-07-04T08:00:00Z',   // starts July 4 at 8 AM
  end_at: '2026-07-04T20:00:00Z',       // ends same day at 8 PM
});
```

| Field | Description |
|---|---|
| `starts_at` | ISO 8601 date when the discount becomes active |
| `end_at` | ISO 8601 date when the discount expires |

Discounts outside their active window are rejected with `"Discount code is not active yet"` or `"Discount code has expired"`.

## Step 4 — Set usage limits

| Field | Type | Description |
|---|---|---|
| `usage_limit_total` | `number` | Max total uses across all customers |
| `usage_limit_per_customer` | `number` | Max uses per individual customer |

When the total usage limit is reached, the code returns `"Discount code usage limit reached"`.

## Combining discounts

Reponse supports stacking multiple discount codes on a single cart. The combinator engine groups discounts by kind and applies them in order:

1. **Product discounts** — applied to line items first
2. **Order discounts** — applied to the subtotal
3. **Shipping discounts** — applied to shipping cost

```typescript
import { useDiscountCodes } from '@/lib/discount.actions';

const result = await useDiscountCodes(
  ['disc_1', 'disc_2'],  // discount code IDs
  'lead_xxx',
  150.00                  // original cart total
);
// result → { success: true, discountAmount: 25.00, finalAmount: 125.00 }
```

Control stacking with the `combines_with` field:

```json
{ "combines_with": ["product", "shipping"] }
```

## Bulk code generation

Generate up to 500 unique codes from a template:

```typescript
import { bulkCreateDiscountCodes } from '@/lib/discount.actions';

const result = await bulkCreateDiscountCodes('ws_xxx', {
  prefix: 'VIP',
  count: 100,
  type: 'percentage',
  value: 20,
  end_at: '2026-12-31T23:59:59Z',
  usage_limit_per_customer: 1,
});
// result → { created: 100, codes: ["VIP-A3K7X", "VIP-B9M2R", ...] }
```

Codes are generated with confusable characters removed (no `I`, `O`, `0`, `1`).

## Applying to a cart

### Automatic discounts

Automatic discounts are reflected when you fetch a cart — no action needed.

### Code discounts

```typescript
// Via SDK
await reponse.cart.applyPromo({
  path: { id: cartId },
  body: { code: 'SUMMER25' },
});

// Via REST API
// POST /v1/cart/:id/promo
// { "code": "SUMMER25" }
```

## API reference

| Endpoint | Method | Description |
|---|---|---|
| `/v1/discounts` | `GET` | List discount codes for the workspace |
| `/v1/discounts` | `POST` | Create a new discount code |
| `/v1/discounts/:id` | `GET` | Get a discount code by ID |
| `/v1/discounts/:id` | `PATCH` | Update a discount code |
| `/v1/discounts/:id` | `DELETE` | Delete a discount code |
| `/v1/discounts/bulk` | `POST` | Bulk-generate discount codes |
| `/v1/cart/:id/promo` | `POST` | Apply a promo code to a cart |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "Discount code not found" | Code doesn't exist or is inactive | Check spelling and `is_active` flag |
| "Discount code has expired" | Current date is past `end_at` | Update or remove the expiry |
| "Usage limit reached" | `usage_limit_total` exceeded | Increase the limit or create a new code |
| Code not combining | Missing `combines_with` config | Set the `combines_with` field on each code |
| Automatic discount not applied | Conditions not met | Verify `min_order_amount` and `applies_to_type` |
| Bulk generation returns fewer codes | Collision limit reached | Use a longer prefix or reduce count |
