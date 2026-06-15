---
title: "Inventory — Get"
description: "Get inventory levels for variants by variant_id, sku, or product_id."
---

## Overview

Get inventory levels for variants by variant_id, sku, or product_id.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/inventory`

### Query Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `variant_id` | string | ❌ | Filter by variant UUID |
| `sku` | string | ❌ | Filter by SKU |
| `product_id` | string | ❌ | Filter by product UUID |

## Response

```json
{
  "data": [
    {
      "variant_id": "uuid",
      "title": "Premium T-Shirt / M / Black",
      "sku": "TS-BLK-M",
      "inventory_quantity": 42,
      "available": true,
      "product_id": "uuid"
    }
  ]
}
```

## Code Examples

### cURL

```bash
curl -X GET https://api.reponse.ai/v1/inventory \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/inventory", {
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

## Notes

> At least one of variant_id, sku, or product_id is required.

## Related

- [Update inventory](doc:inventory-update)
- [Products — List](doc:products-list)
- [Shipping rates](doc:shipping-rates)
