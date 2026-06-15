---
title: "Gift Cards — Redeem"
description: "Redeem an amount against a gift card."
---

## Overview

Deducts an amount from a gift card balance, optionally tied to an order. Fails if the card is not active or the amount is invalid.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/gift-cards/redeem`

### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | ✅ | Gift card code. |
| `amount` | number | ✅ | Amount to redeem (must be positive). |
| `order_id` | string (uuid) | ❌ | Order to attach the redemption to. |


## Response

```json
{ "redeemed": 20.00, "remaining_balance": 30.00, "currency": "EUR" }
```

## SDK example

```typescript
await reponse.giftCards.redeem({ body: { code: "GIFT-XXXX", amount: 20.00 } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `code` and `amount` required, or amount not positive. |
| `404` | Gift card not found. |
| `422` | Gift card is not active. |
