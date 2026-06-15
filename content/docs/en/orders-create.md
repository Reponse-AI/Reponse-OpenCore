---
title: "Orders — Create"
description: "Create an order from an existing cart."
---

## Overview

Create an order from an existing cart.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/orders`

### Request Body

```json
{
  "cart_id": "cart_uuid",
  "customer_email": "customer@example.com"
}
```

## Response

```json
{
  "id": "order_uuid",
  "financial_status": "pending",
  "total_price": 59.98,
  "currency": "EUR",
  "created_at": "2025-01-01T00:00:00Z"
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/orders \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "cart_id": "cart_uuid",
  "customer_email": "customer@example.com"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/orders", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "cart_id": "cart_uuid",
  "customer_email": "customer@example.com"
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

## Related

- [Orders — Confirm](doc:orders-confirm)
- [Orders — Fulfill](doc:orders-fulfill)
- [Orders — Refund](doc:orders-refund)
- [Orders — Cancel](doc:orders-cancel)
