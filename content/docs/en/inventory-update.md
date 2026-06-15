---
title: "Inventory — Update"
description: "Update inventory quantity. Supports 'set' (absolute) and 'adjust' (relative) modes."
---

## Overview

Update inventory quantity. Supports 'set' (absolute) and 'adjust' (relative) modes.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/inventory`

### Request Body

```json
{
  "variant_id": "uuid",
  "quantity": 10,
  "mode": "adjust",
  "reason": "Restock from supplier"
}
```

## Response

```json
{
  "success": true,
  "variant_id": "uuid",
  "old_quantity": 42,
  "new_quantity": 52,
  "change": 10
}
```

## Code Examples

### cURL

```bash
curl -X POST https://api.reponse.ai/v1/inventory \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "variant_id": "uuid",
  "quantity": 10,
  "mode": "adjust",
  "reason": "Restock from supplier"
}'
```

### TypeScript

```typescript
const response = await fetch("https://api.reponse.ai/v1/inventory", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "variant_id": "uuid",
  "quantity": 10,
  "mode": "adjust",
  "reason": "Restock from supplier"
}),
});

const data = await response.json();
console.log(data);
```

## Error Codes

| Status | Description |
| --- | --- |
| 400 | Bad Request — Invalid parameters |
| 401 | Unauthorized — Invalid or missing API key |
| 404 | Not Found — Resource does not exist |
| 500 | Internal Server Error |

## Notes

> Protects against negative inventory. All changes are logged to inventory_ledger.
