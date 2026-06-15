---
title: "Checkout — Stripe"
description: "Create a Stripe Checkout Session for a cart. Supports multi-market, subscriptions, automatic tax, and discount codes."
---

## Overview

Create a Stripe Checkout Session for a cart. Supports multi-market, subscriptions, automatic tax, and discount codes.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/checkout/stripe`

### Request Body

```json
{
  "cart_id": "cart_uuid",
  "market_id": "market_uuid",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cancel"
}
```

## Response

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_...",
  "sessionId": "cs_..."
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/checkout/stripe \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "cart_id": "cart_uuid",
  "market_id": "market_uuid",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cancel"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/checkout/stripe", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cart_id": "cart_uuid",
  "market_id": "market_uuid",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cancel"
}),
});

const data = await response.json();
console.log(data);
```

## Error Codes

| Status | Description |
| --- | --- |
| 400 | Bad Request — Invalid parameters |
| 401 | Unauthorized — Invalid or missing API key |
| 404 | Not Found — Resource does not exist |
| 500 | Internal Server Error |

## Notes

> Detects subscriptions automatically and sets Stripe mode to 'subscription'. Uses dual-read discount strategy (promotions engine + legacy).

## Related

- [Cart — Create](doc:cart-create)
- [Checkout — Payment Intent](doc:checkout-intent)
- [Checkout — ACP](doc:checkout-acp)
- [Orders — Create](doc:orders-create)
