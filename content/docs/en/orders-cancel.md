---
title: "Orders — Cancel"
description: "Cancel an order. Includes tool-guards: identity verification, state validation, rate limiting (1/hour, 3/30 days lifetime), and abuse prevention."
---

## Overview

Cancel an order. Includes tool-guards: identity verification, state validation, rate limiting (1/hour, 3/30 days lifetime), and abuse prevention.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/orders/:orderId/cancel`

### Request Body

```json
{
  "reason": "customer_changed_mind",
  "custom_reason": "Optional explanation"
}
```

## Response

```json
{
  "success": true,
  "confirmation_message": "Order has been cancelled.",
  "event_id": "event_uuid"
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/orders/:orderId/cancel \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "reason": "customer_changed_mind",
  "custom_reason": "Optional explanation"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/orders/:orderId/cancel", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "reason": "customer_changed_mind",
  "custom_reason": "Optional explanation"
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

> Valid reasons: customer_changed_mind, wrong_item_ordered, delivery_too_slow_anticipated, found_better_price, payment_issue, other.
