---
title: "Checkout — Payment Intent"
description: "Create a Stripe PaymentIntent for a cart (headless / embedded checkout)."
---

## Overview

Resolves the market context, applies discounts and shipping, then creates a Stripe PaymentIntent. Returns the `client_secret` you use to confirm payment on the client. Requires the workspace to have a Stripe secret key configured.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/checkout/intent`

### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `cart_id` | string (uuid) | ✅ | Cart to check out. |
| `market_id` | string (uuid) | ❌ | Market context (defaults to domestic). |
| `customer_email` | string | ❌ | Customer email. |
| `shipping_address` | object | ❌ | Shipping address for rate resolution. |
| `discount_codes` | string[] | ❌ | Codes to apply at checkout. |


## Response

```json
{
  "client_secret": "pi_..._secret_...",
  "amount": 5398,
  "currency": "eur",
  "breakdown": { "subtotal": 5998, "discount": 600, "shipping": 0 }
}
```

## SDK example

```typescript
const { data } = await reponse.checkout.createIntent({
  body: { cart_id: cartId, customer_email: "buyer@example.com" }
});
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `cart_id` required, Stripe not configured, or no market. |
| `404` | Cart not found. |
