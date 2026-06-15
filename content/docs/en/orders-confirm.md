---
title: "Orders — Confirm"
description: "Confirm an order after a successful payment intent."
---

## Overview

Finalizes a cart into a paid order once the Stripe PaymentIntent has succeeded. Pass both the `payment_intent_id` and the originating `cart_id`.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/orders/confirm`

### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `payment_intent_id` | string | ✅ | Stripe PaymentIntent ID. |
| `cart_id` | string (uuid) | ✅ | Cart that was paid. |


## Response

```json
{ "order": { "id": "order_uuid", "status": "paid", "total": 53.98 } }
```

## SDK example

```typescript
const { data } = await reponse.orders.confirm({
  body: { payment_intent_id: "pi_...", cart_id: cartId }
});
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `payment_intent_id` or `cart_id` missing, or Stripe not configured. |
