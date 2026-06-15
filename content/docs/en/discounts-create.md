---
title: "Discounts — Create"
description: "Create a discount code."
---

## Overview

Creates a percentage or fixed-amount discount code for the workspace. Codes can be `automatic` (applied without input) or `code`-based.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/discounts`

### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | ✅ | The code customers enter. |
| `type` | string | ✅ | `percentage` or `fixed_amount`. |
| `value` | number | ✅ | Discount value. |
| `is_active` | boolean | ❌ | Whether the code is active (default true). |


## Response

```json
{ "data": { "id": "disc_uuid", "code": "WELCOME10", "type": "percentage", "value": 10 } }
```

## SDK example

```typescript
await reponse.discounts.create({ body: { code: "WELCOME10", type: "percentage", value: 10 } });
```
