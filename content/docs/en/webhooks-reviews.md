---
title: "Reviews (Stamped / Trustpilot)"
description: "Product review webhooks."
---

## Overview

Review webhooks notify Reponse when product or brand reviews are created or updated. The data feeds into product structured data (JSON-LD), the AI knowledge base, and the merchant dashboard. Reponse supports two review providers with dedicated webhook endpoints.

| Provider | Scope | Endpoint |
|---|---|---|
| **Stamped** | Product reviews | `POST /api/webhooks/stamped` |
| **Trustpilot** | Brand reviews | `POST /api/webhooks/trustpilot` |

## Configuration

### Stamped

1. In the Stamped dashboard, navigate to **Settings → Webhooks**.
2. Add the endpoint URL:
   ```
   https://api.reponse.ai/api/webhooks/stamped
   ```
3. Add a custom header `X-Workspace-Id` with your Reponse workspace ID.
4. Copy the **Webhook Secret** and save it in your workspace integration settings under **Settings → Integrations → Stamped** (stored as `credentials.webhookSecret` in the `workspace_integrations` table).

### Trustpilot

1. In the Trustpilot Business portal, navigate to **Integrations → Webhooks**.
2. Add the endpoint URL:
   ```
   https://api.reponse.ai/api/webhooks/trustpilot
   ```
3. Add a custom header `X-Workspace-Id` with your Reponse workspace ID.
4. Copy the **Webhook Secret** and save it in your workspace integration settings under **Settings → Integrations → Trustpilot**.

## Signature verification

### Stamped

HMAC-SHA256 with hex encoding:

```typescript
import crypto from "crypto";

const computed = crypto
  .createHmac("sha256", webhookSecret)
  .update(rawBody)
  .digest("hex");

const signature = req.headers.get("x-stamped-signature");
const valid = crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(computed)
);
```

### Trustpilot

HMAC-SHA256 with Base64 encoding:

```typescript
import crypto from "crypto";

const computed = crypto
  .createHmac("sha256", webhookSecret)
  .update(rawBody)
  .digest("base64");

const signature = req.headers.get("x-trustpilot-signature");
const valid = crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(computed)
);
```

> Both implementations use `crypto.timingSafeEqual()` to prevent timing attacks.

## Stamped payload example

```json
{
  "review": {
    "id": 12345678,
    "productId": 7654321098765,
    "productTitle": "Classic Logo T-Shirt",
    "author": "Jane Doe",
    "reviewRating": 5,
    "reviewTitle": "Amazing quality!",
    "reviewMessage": "Super soft cotton and the logo is beautifully embroidered. Fits true to size.",
    "reviewImages": [
      "https://cdn.stamped.io/uploads/review-photo-1.jpg"
    ],
    "reviewVerifiedType": 1,
    "reviewState": 1,
    "orderId": "ORD-2026-0042",
    "dateCreated": "2026-05-20T14:30:00Z"
  }
}
```

**Mapped fields:**

| Payload field | Database field | Notes |
|---|---|---|
| `review.id` | `external_id` | Cast to string |
| `review.productId` | `product_id`, `shopify_product_gid` | GID built as `gid://shopify/Product/{id}` |
| `review.author` | `author_first_name`, `author_last_initial` | Split on whitespace |
| `review.reviewRating` | `rating` | Clamped to 1–5 |
| `review.reviewTitle` | `title` | — |
| `review.reviewMessage` | `content` | — |
| `review.reviewImages` | `media_urls` | Array of URLs |
| `review.reviewVerifiedType` | `verified_purchase` | `1` → `true` |
| `review.reviewState` | `status` | `1` → `published`, `2` → `hidden`, else `pending` |
| `review.orderId` | `order_id` | — |
| — | `source` | `"stamped"` |
| — | `scope` | `"product"` |
| — | `language` | Defaults to `"fr"` |

## Trustpilot payload example

```json
{
  "review": {
    "id": "tp_review_abc123",
    "stars": 4,
    "title": "Great customer service",
    "text": "Had an issue with sizing but the support team resolved it within hours. Very impressed.",
    "consumer": {
      "displayName": "Jean Martin"
    },
    "isVerified": true,
    "language": "fr",
    "createdAt": "2026-05-18T09:15:00Z"
  }
}
```

**Mapped fields:**

| Payload field | Database field | Notes |
|---|---|---|
| `review.id` | `external_id` | Cast to string |
| — | `product_id` | Set to `"__brand__"` |
| `review.consumer.displayName` | `author_first_name`, `author_last_initial` | Split on whitespace |
| `review.stars` | `rating` | Clamped to 1–5 |
| `review.title` | `title` | — |
| `review.text` | `content` | — |
| `review.isVerified` | `verified_purchase` | — |
| `review.language` | `language` | First 2 chars |
| `review.createdAt` | `published_at` | — |
| — | `source` | `"trustpilot"` |
| — | `scope` | `"brand"` |
| — | `status` | Always `"published"` |

## Idempotency

Both handlers upsert on the composite key `(workspace_id, source, external_id)`. Re-deliveries of the same review update the existing record without creating duplicates.

## Retry policy

| Provider | Retry window | Max attempts |
|---|---|---|
| Stamped | Provider-specific | Varies |
| Trustpilot | Provider-specific | Varies |

Both providers retry on non-`2xx` responses. Make sure your handler returns `200` promptly.

## Post-purchase review collection

Reponse also supports **proactive** review collection via the `POST /api/webhooks/shopify/orders-fulfilled` endpoint. When a Shopify order is fulfilled, a `review_request` record is created with a unique token. This powers post-purchase review request emails.

## Best practices

1. **Configure both providers** if you use Stamped for product reviews and Trustpilot for brand reviews — they complement each other.
2. **Monitor `scope`** — `product` reviews feed into product-level structured data, `brand` reviews feed into site-level trust signals.
3. **Handle `hidden` and `pending` statuses** — only `published` reviews are surfaced to the AI and displayed publicly.
4. **Use the `media_urls` array** — review images can be displayed in the storefront and fed to the AI vision analysis pipeline.
