---
title: "Shopify Webhooks"
description: "Shopify sync webhooks."
---

## Overview

Shopify webhooks are the primary mechanism for keeping your Reponse catalog, orders, customers, and inventory in sync with Shopify. When a product is created, an order is placed, or inventory changes, Shopify sends an HTTP `POST` to your workspace's webhook endpoint. Reponse processes the event and upserts the corresponding records.

**Endpoint:** `POST /api/shopify/webhooks/{workspaceId}`

## Configuration

1. During the Shopify OAuth install flow, Reponse automatically registers webhooks for all supported topics.
2. The `shopify_webhook_secret` is stored on the workspace record.
3. Every incoming request is verified against this secret before processing.

You can also manually register webhooks in the Shopify Partner Dashboard under **Notifications → Webhooks**, using the endpoint URL:

```
https://api.reponse.ai/api/shopify/webhooks/{workspaceId}
```

## Signature verification

Shopify signs every webhook with an HMAC-SHA256 hash of the raw body using your webhook secret. Reponse verifies this before processing:

```typescript
import crypto from "crypto";

const rawBody = await req.text();

const generatedHash = crypto
  .createHmac("sha256", workspace.shopify_webhook_secret)
  .update(rawBody, "utf8")
  .digest("base64");

const hmacHeader = req.headers.get("x-shopify-hmac-sha256");

if (generatedHash !== hmacHeader) {
  return new Response("Unauthorized", { status: 401 });
}
```

### Required headers

| Header | Description |
|---|---|
| `X-Shopify-Hmac-Sha256` | HMAC-SHA256 signature (Base64) |
| `X-Shopify-Topic` | Event topic (e.g. `products/update`) |
| `X-Shopify-Shop-Domain` | The shop's `.myshopify.com` domain |
| `X-Shopify-Webhook-Id` | Unique ID for deduplication |

## Handled events

### Products — `products/create`, `products/update`

Upserts the product, variants, images, and tags. The handler mirrors the sync route mapping:

- Strips HTML from `body_html` for the `description` field
- Builds `option_definitions` from Shopify options
- Determines `is_active_for_ai` based on variant availability and product status
- Upserts variants keyed on `shopify_variant_id`
- Deletes and re-inserts images from source `shopify`
- Parses and replaces tags

**Payload example (abbreviated):**

```json
{
  "id": 7654321098765,
  "title": "Classic Logo T-Shirt",
  "handle": "classic-logo-t-shirt",
  "body_html": "<p>Premium cotton t-shirt with embroidered logo.</p>",
  "vendor": "My Brand",
  "product_type": "T-Shirts",
  "status": "active",
  "tags": "summer, cotton, bestseller",
  "options": [
    { "name": "Size", "position": 1, "values": ["S", "M", "L", "XL"] },
    { "name": "Color", "position": 2, "values": ["Black", "White"] }
  ],
  "variants": [
    {
      "id": 43210987654321,
      "title": "S / Black",
      "price": "29.99",
      "compare_at_price": "39.99",
      "sku": "LOGO-TEE-S-BLK",
      "available": true,
      "inventory_quantity": 42,
      "inventory_policy": "deny",
      "option1": "S",
      "option2": "Black",
      "option3": null,
      "position": 1,
      "weight": 0.2,
      "weight_unit": "kg",
      "requires_shipping": true,
      "taxable": true
    }
  ],
  "images": [
    {
      "src": "https://cdn.shopify.com/s/files/1/example/tee-black.jpg",
      "position": 1,
      "alt": "Classic Logo T-Shirt in Black"
    }
  ]
}
```

### Products — `products/delete`

Soft-deletes the product by setting `status: "archived"` and `is_active_for_ai: false`. The product record is preserved for order history.

### Orders — `orders/create`, `orders/updated`

Updates `financial_status` and `fulfillment_status` on the matching order record (looked up via `metadata.shopify_order_id`).

**Payload fields used:**

```json
{
  "id": 5678901234567,
  "financial_status": "paid",
  "fulfillment_status": "fulfilled"
}
```

### Fulfillments — `fulfillments/create`, `fulfillments/update`

Creates or updates fulfillment records with tracking information. Maps Shopify fulfillment statuses to Reponse statuses:

| Shopify status | Reponse status |
|---|---|
| `success` | `in_transit` |
| `pending` | `pending` |
| `cancelled` | `failed` |
| `error` | `failed` |
| `failure` | `failed` |

**Payload fields used:**

```json
{
  "id": 4567890123456,
  "order_id": 5678901234567,
  "status": "success",
  "tracking_number": "1Z999AA10123456784",
  "tracking_company": "UPS",
  "tracking_url": "https://www.ups.com/track?tracknum=1Z999AA10123456784"
}
```

### Refunds — `refunds/create`

Sets the order `financial_status` to `refunded`.

### Customers — `customers/create`, `customers/update`

Upserts contact records with:

- Name, email (normalised to lowercase)
- Phone (normalised to E.164)
- Default address (street, city, province, country, zip)
- Email marketing consent (`subscribed` → `true`)
- SMS marketing consent
- Shopify customer identity linked via `contact_identities`

**Payload example (abbreviated):**

```json
{
  "id": 1234567890123,
  "email": "jane@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+33612345678",
  "email_marketing_consent": {
    "state": "subscribed",
    "consent_updated_at": "2026-01-15T10:30:00Z"
  },
  "sms_marketing_consent": {
    "state": "not_subscribed"
  },
  "default_address": {
    "address1": "123 Rue de la Paix",
    "city": "Paris",
    "province": "Île-de-France",
    "country": "France",
    "country_code": "FR",
    "zip": "75001"
  }
}
```

### Inventory — `inventory_levels/update`

Updates variant `inventory_quantity` and `available` flag. Requires the workspace to have `shopify_admin_token` configured so Reponse can resolve the `inventory_item_id` to a variant (via REST API or SKU fallback).

### Markets — `markets/create`, `markets/update`, `markets/delete`

Syncs Shopify Markets data including currency, locales, and country codes. Uses the Admin GraphQL API to fetch full market details. `markets/delete` performs a soft-delete (`is_active: false`).

### App lifecycle — `app/uninstalled`

Clears Shopify tokens (`shopify_admin_token`, `shopify_storefront_token`, `shopify_webhook_secret`) from the workspace record.

## Retry policy

| Property | Value |
|---|---|
| Retry window | 48 hours |
| Max attempts | 19 |
| Backoff | Exponential |
| On persistent failure | Webhook subscription is automatically removed by Shopify |

> **Note:** Reponse's handler returns `200 OK` even on internal processing errors to prevent unnecessary retries when the failure is a code bug. Errors are logged server-side for investigation.

## Best practices

1. **Let the sync route handle the initial import** — webhooks are for incremental updates after the first full sync.
2. **Monitor `[Shopify Webhook]` logs** — all handler actions are logged with this prefix.
3. **Keep `shopify_webhook_secret` secure** — rotate it if compromised by re-installing the app.
4. **Handle `products/delete` gracefully** — Reponse archives rather than hard-deletes, preserving order history.
5. **Inventory updates require admin token** — if the workspace lacks `shopify_admin_token`, inventory webhooks are skipped with a warning.
