---
title: "Cart — Get"
description: "Retrieve a cart with its line items, totals, and automatically applied discounts."
---

## Overview

Returns a single cart by ID, including its line items with product details and any automatic discounts active for the workspace. The cart must belong to the authenticated workspace.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/carts/:id`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The cart ID. |


## Response

```json
{
  "id": "cart_uuid",
  "currency": "EUR",
  "subtotal": 59.98,
  "total": 53.98,
  "discounts": [
    { "code": "WELCOME10", "type": "percentage", "value": 10, "savings": 6.00 }
  ],
  "cart_lines": [
    {
      "id": "line_uuid",
      "quantity": 2,
      "price_at_add": 29.99,
      "products": { "id": "prod_uuid", "title": "T-shirt Logo", "handle": "t-shirt-logo" }
    }
  ]
}
```

## SDK example

```typescript
const { data: cart } = await reponse.cart.get({ path: { id: cartId } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `404` | Cart not found or not in this workspace. |
| `401` | Missing or invalid API key. |
