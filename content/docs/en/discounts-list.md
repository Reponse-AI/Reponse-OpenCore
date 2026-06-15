---
title: "Discounts — List"
description: "List discount codes for a workspace."
---

## Overview

Returns discount codes with optional filtering by active state and type, using offset-based pagination.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/discounts`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `active` | boolean | ❌ | Filter by active state. |
| `type` | string | ❌ | Filter by discount type. |
| `limit` | number | ❌ | Max results (default 50). |
| `offset` | number | ❌ | Items to skip (default 0). |


## Response

```json
{ "data": [ { "code": "WELCOME10", "type": "percentage", "value": 10, "is_active": true } ], "total": 12 }
```

## SDK example

```typescript
const { data } = await reponse.discounts.list({ query: { active: true } });
```

## Related

- [Create a discount](doc:discounts-create)
- [Validate a discount code](doc:discounts-validate)
- [Cart — Apply Promotion](doc:cart-apply-promotion)
