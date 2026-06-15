---
title: "Products — List"
description: "List all active products in a workspace with cursor-based pagination and filtering."
---

## Overview

List all active products in a workspace with cursor-based pagination and filtering.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/products`

### Query Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | ❌ | Max results per page (default: 50) |
| `cursor` | string | ❌ | Pagination cursor (created_at of last item) |
| `query` | string | ❌ | Search by title (case-insensitive) |
| `slug` | string | ❌ | Exact product handle match |

## Response

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Premium T-Shirt",
      "slug": "premium-t-shirt",
      "price": 29.99,
      "currency": "EUR",
      "in_stock": true,
      "images": ["https://..."],
      "variants": [...]
    }
  ],
  "next_cursor": "2025-01-01T00:00:00Z",
  "has_more": true
}
```

## Code Examples

### cURL

```bash
curl -X GET https://api.reponse.ai/v1/products \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/products", {
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

- [Get a single product](doc:products-get)
- [Product metafields](doc:products-metafields)
- [Collections — List](doc:collections-list)
