---
title: "Product Feed — JSON"
description: "Get the product feed in ACP-compatible JSON (gzipped)."
---

## Overview

Returns the full active product catalog as a gzipped JSON feed in an Agentic Commerce Protocol compatible shape. Use it to sync the catalog to agents and marketplaces.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/feed`

## Response

```json
{ "products": [ { "id": "prod_uuid", "title": "T-shirt Logo", "price": 29.99, "availability": "in_stock" } ] }
```

## SDK example

```typescript
const res = await fetch(`${baseUrl}/api/v1/feed`, { headers: { Authorization: `Bearer ${apiKey}` } });
```
