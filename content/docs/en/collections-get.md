---
title: "Collections — Get"
description: "Retrieve a single collection by handle."
---

## Overview

Returns one active collection identified by its handle, including SEO fields and the number of products it contains.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/collections/:handle`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `handle` | string | ✅ | The collection handle. |


## Response

```json
{
  "data": {
    "id": "col_uuid",
    "title": "Summer",
    "handle": "summer",
    "description": "Warm-weather essentials",
    "seo_title": "Summer Collection",
    "product_count": 24
  }
}
```

## SDK example

```typescript
const { data } = await reponse.catalog.getCollection({ path: { handle: "summer" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `404` | Collection not found or inactive. |
