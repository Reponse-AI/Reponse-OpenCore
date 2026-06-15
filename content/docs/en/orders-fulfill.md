---
title: "Orders — Fulfill"
description: "Mark an order as fulfilled and attach tracking."
---

## Overview

Records fulfillment for an order with tracking details and optionally sends the shipping notification email to the customer.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/orders/:orderId/fulfill`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `orderId` | string (uuid) | ✅ | The order ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `tracking_number` | string | ✅ | Carrier tracking number. |
| `tracking_company` | string | ❌ | Carrier name. |
| `tracking_url` | string | ❌ | Tracking URL. |
| `send_email` | boolean | ❌ | Send shipping email (default true). |


## Response

```json
{ "order": { "id": "order_uuid", "status": "fulfilled" } }
```

## SDK example

```typescript
await reponse.orders.fulfill({
  path: { orderId },
  body: { tracking_number: "1Z999...", tracking_company: "UPS" }
});
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `tracking_number` is required. |
| `404` | Order not found. |
