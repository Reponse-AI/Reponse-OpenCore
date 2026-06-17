---
title: "Products — Get"
description: "Get a single product by UUID with full variant and image data."
---

## Overview

Get a single product by UUID with full variant and image data.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/products/:id`

## Response

```json
{
  "id": "uuid",
  "title": "Premium T-Shirt",
  "slug": "premium-t-shirt",
  "description": "...",
  "price": 29.99,
  "compare_at_price": 39.99,
  "currency": "EUR",
  "in_stock": true,
  "images": [...],
  "variants": [...],
  "option_definitions": [...],
  "metafields": [
    { "id": "uuid", "namespace": "custom", "key": "material", "value": "Cotton", "type": "single_line_text" }
  ]
}
```

> **Note:** `metafields` are included by default in the product detail response. See [Product metafields](doc:products-metafields) for details.

## Code Examples

### cURL

```bash
curl -X GET https://api.reponse.ai/v1/products/:id \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/products/:id", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
  },
});

const data = await response.json();
console.log(data);
```

## Error Codes

| Status | Description |
| --- | --- |
| 400 | Bad Request — Invalid parameters |
| 401 | Unauthorized — Invalid or missing API key |
| 500 | Internal Server Error |

## Related

- [List all products](doc:products-list)
- [Product metafields](doc:products-metafields)
- [Collections — Products](doc:collections-products)
