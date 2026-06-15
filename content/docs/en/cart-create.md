---
title: "Cart — Create"
description: "Create a new shopping cart with initial items."
---

## Overview

Create a new shopping cart with initial items.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/carts`

### Request Body

```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "currency": "EUR"
}
```

## Response

```json
{
  "id": "cart_uuid",
  "items": [
    {
      "id": "line_uuid",
      "product_id": "uuid",
      "variant_id": "variant_uuid",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "subtotal": 59.98,
  "currency": "EUR",
  "created_at": "2025-01-01T00:00:00Z"
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/carts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "currency": "EUR"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/carts", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "currency": "EUR"
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

- [Get cart](doc:cart-get)
- [Add item to cart](doc:cart-add-item)
- [Checkout — Stripe](doc:checkout-stripe)
