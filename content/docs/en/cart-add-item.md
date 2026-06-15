---
title: "Cart — Add Item"
description: "Add one or more items to an existing cart."
---

## Overview

Adds line items to a cart. For products with multiple variants, `variant_id` is required. Cart totals are recalculated automatically after the items are added.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/carts/:id/items`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The cart ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | ✅ | Array of items to add. |
| `items[].product_id` | string (uuid) | ✅ | Product to add. |
| `items[].variant_id` | string (uuid) | ❌ | Required if the product has multiple variants. |
| `items[].quantity` | number | ✅ | Quantity to add. |


## Response

```json
{ "id": "cart_uuid", "subtotal": 89.97, "total": 89.97, "cart_lines": [ /* ... */ ] }
```

## SDK example

```typescript
await reponse.cart.addItem({
  path: { id: cartId },
  body: { items: [{ product_id: "prod_uuid", variant_id: "var_uuid", quantity: 2 }] }
});
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `variant_id` required for a multi-variant product. |
| `404` | Cart not found. |
