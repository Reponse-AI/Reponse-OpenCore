---
title: "Gift Cards — List"
description: "List gift cards for a workspace."
---

## Overview

Returns gift cards, optionally filtered by status or a specific code.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/gift-cards`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | ❌ | Filter by status (e.g. `active`). |
| `code` | string | ❌ | Look up a specific code. |


## Response

```json
{ "data": [ { "code": "GIFT-XXXX", "balance": 50.00, "currency": "EUR", "status": "active" } ] }
```

## SDK example

```typescript
const { data } = await reponse.giftCards.list({ query: { status: "active" } });
```
