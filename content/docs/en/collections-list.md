---
title: "Collections — List"
description: "List all active collections in a workspace."
---

## Overview

Returns active collections with their product counts, using cursor-based pagination. Backed by the `collections` table (unique per workspace by handle).

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/collections`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | ❌ | Max results per page (default 50). |
| `cursor` | string | ❌ | Pagination cursor (created_at of last item). |


## Response

```json
{
  "data": [
    { "id": "col_uuid", "title": "Summer", "handle": "summer", "product_count": 24 }
  ],
  "next_cursor": null,
  "has_more": false
}
```

## SDK example

```typescript
const { data } = await reponse.catalog.listCollections({ query: { limit: 50 } });
```
