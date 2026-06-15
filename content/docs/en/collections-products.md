---
title: "Collections — Products"
description: "List the products that belong to a collection."
---

## Overview

Returns active products in a collection, joined through `collection_products`, with offset-based pagination. Use this to render a real collection page instead of listing the full catalog.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/collections/:handle/products`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `handle` | string | ✅ | The collection handle. |


### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | ❌ | Max results (default 50, max 100). |
| `offset` | number | ❌ | Items to skip (default 0). |


## Response

```json
{
  "products": [ { "id": "prod_uuid", "title": "T-shirt Logo", "price": 29.99 } ],
  "total": 24,
  "limit": 50,
  "offset": 0
}
```

## SDK example

```typescript
const res = await fetch(
  `${baseUrl}/api/v1/collections/summer/products?limit=50`,
  { headers: { Authorization: `Bearer ${apiKey}` } }
);
```
