---
title: "Discounts — Validate"
description: "Validate a discount code against cart context. Checks active status, date validity, usage limits, minimum order, and tier requirements."
---

## Overview

Validate a discount code against cart context. Checks active status, date validity, usage limits, minimum order, and tier requirements.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/discounts/validate`

### Request Body

```json
{
  "code": "SUMMER20",
  "cart_total": 59.98,
  "cart_quantity": 2,
  "customer_tier": "warm"
}
```

## Response

```json
{
  "valid": true,
  "discount": {
    "id": "discount_uuid",
    "code": "SUMMER20",
    "type": "percentage",
    "value": 20,
    "savings": 11.99,
    "discount_class": "order"
  }
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/discounts/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "code": "SUMMER20",
  "cart_total": 59.98,
  "cart_quantity": 2,
  "customer_tier": "warm"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/discounts/validate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "code": "SUMMER20",
  "cart_total": 59.98,
  "cart_quantity": 2,
  "customer_tier": "warm"
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

> Tier hierarchy: cold → warm → hot → vip. A discount requiring 'warm' tier accepts warm, hot, and vip customers.
