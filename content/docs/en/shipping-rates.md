---
title: "Shipping — Rates"
description: "Get available shipping rates for a market and cart."
---

## Overview

Resolves shipping rates for a given market, optionally refined by cart contents and destination country. Use the returned rates at checkout.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/shipping/rates`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `market_id` | string (uuid) | ✅ | Market to resolve rates for. |
| `cart_id` | string (uuid) | ❌ | Cart for weight/threshold rules. |
| `country` | string | ❌ | Destination country code. |


## Response

```json
{ "rates": [ { "id": "rate_std", "name": "Standard", "price": 4.90, "currency": "EUR" } ] }
```

## SDK example

```typescript
const { data } = await reponse.shipping.getRates({ query: { market_id: marketId, cart_id: cartId } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `market_id` is required. |
| `404` | Market not found. |
