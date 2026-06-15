---
title: "Orders — Refund"
description: "Refund all or part of an order."
---

## Overview

Issues a refund through Stripe. Omit `amount` for a full refund, or pass an amount for a partial refund.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/orders/:orderId/refund`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `orderId` | string (uuid) | ✅ | The order ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | ❌ | Amount to refund (full refund if omitted). |
| `reason` | string | ❌ | Refund reason (default `requested_by_customer`). |
| `note` | string | ❌ | Internal note. |


## Response

```json
{ "refund": { "id": "re_...", "amount": 53.98, "status": "succeeded" } }
```

## SDK example

```typescript
await reponse.orders.refund({ path: { orderId }, body: { amount: 10.00, note: "Damaged item" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `404` | Order not found. |
