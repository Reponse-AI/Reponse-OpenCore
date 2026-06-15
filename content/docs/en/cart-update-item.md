---
title: "Cart — Update Item"
description: "Update the quantity of a cart line item."
---

## Overview

Sets a new quantity for a line item. Setting the quantity to `0` removes the line. Totals are recalculated automatically.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**PUT** `/v1/carts/:id/items/:lineId`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The cart ID. |
| `lineId` | string (uuid) | ✅ | The cart line ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `quantity` | number | ✅ | New quantity (0 removes the line). |


## Response

```json
{ "id": "cart_uuid", "subtotal": 29.99, "total": 29.99, "cart_lines": [ /* ... */ ] }
```

## SDK example

```typescript
await reponse.cart.updateItem({
  path: { id: cartId, lineId },
  body: { quantity: 3 }
});
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid quantity (must be a number >= 0). |
| `404` | Cart not found. |
