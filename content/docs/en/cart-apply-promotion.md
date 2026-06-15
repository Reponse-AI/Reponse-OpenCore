---
title: "Cart — Apply Promotion"
description: "Apply a promotion or discount code to a cart."
---

## Overview

Validates a code and applies the matching adjustment to the cart. The endpoint reads the new `promotions` table first, then falls back to the legacy `discount_codes` table for Shopify-migrated codes. The cart must be `open`.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/carts/:id/promotions`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The cart ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | ✅ | Promotion code (case-insensitive). |


## Response

```json
{ "applied": true, "code": "SUMMER20", "savings": 12.00, "total": 47.98 }
```

## SDK example

```typescript
await reponse.cart.applyPromotion({ path: { id: cartId }, body: { code: "SUMMER20" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `code` is required, cart not open, or promotion not active/expired. |
| `404` | Cart not found. |
