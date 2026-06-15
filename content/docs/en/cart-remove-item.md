---
title: "Cart — Remove Item"
description: "Remove a line item from a cart."
---

## Overview

Removes a line item entirely from the cart and recalculates totals. Equivalent to updating the line quantity to `0`.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**DELETE** `/v1/carts/:id/items/:lineId`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The cart ID. |
| `lineId` | string (uuid) | ✅ | The cart line ID. |


## Response

```json
{ "id": "cart_uuid", "subtotal": 0, "total": 0, "cart_lines": [] }
```

## SDK example

```typescript
await reponse.cart.removeItem({ path: { id: cartId, lineId } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `404` | Cart or line not found. |
