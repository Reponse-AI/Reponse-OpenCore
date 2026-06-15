---
title: "Checkout — ACP"
description: "Agentic Commerce Protocol checkout. Accepts a Shared Payment Token (SPT) from AI agents to complete a purchase."
---

## Overview

Agentic Commerce Protocol checkout. Accepts a Shared Payment Token (SPT) from AI agents to complete a purchase.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/checkout/acp`

### Request Body

```json
{
  "cart_id": "cart_uuid",
  "payment_token": "spt_...",
  "shipping_address": { "line1": "...", "city": "...", "country": "FR" },
  "customer_email": "customer@example.com",
  "idempotency_key": "unique_key"
}
```

## Response

```json
{
  "checkout_session_id": "cs_uuid",
  "status": "completed",
  "payment_intent_id": "pi_...",
  "order_summary": {
    "currency": "EUR",
    "subtotal": 59.98,
    "discount": 5.00,
    "shipping": 4.99,
    "total": 59.97,
    "line_items": [...]
  }
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/checkout/acp \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "cart_id": "cart_uuid",
  "payment_token": "spt_...",
  "shipping_address": { "line1": "...", "city": "...", "country": "FR" },
  "customer_email": "customer@example.com",
  "idempotency_key": "unique_key"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/checkout/acp", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cart_id": "cart_uuid",
  "payment_token": "spt_...",
  "shipping_address": { "line1": "...", "city": "...", "country": "FR" },
  "customer_email": "customer@example.com",
  "idempotency_key": "unique_key"
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

> Uses confirm:true and allow_redirects:'never' on PaymentIntent. Handles card decline (402) and invalid token (400).
