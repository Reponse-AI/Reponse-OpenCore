---
title: "Orders — Get"
description: "List orders for a workspace, with optional status filtering."
---

## Overview

Returns orders for the authenticated workspace. Filter by status and paginate to build an order history view. Individual order actions (fulfill, refund, cancel) have dedicated endpoints.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/orders`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | ❌ | Filter by order status. |
| `limit` | number | ❌ | Max results (default 50). |


## Response

```json
{ "data": [ { "id": "order_uuid", "status": "paid", "total": 53.98, "currency": "EUR" } ] }
```

## SDK example

```typescript
const { data } = await reponse.orders.list({ query: { status: "paid", limit: 50 } });
```

## Related

- [Orders — Create](doc:orders-create)
- [Orders — Fulfill](doc:orders-fulfill)
- [Webhooks — Shopify](doc:webhooks-shopify)
