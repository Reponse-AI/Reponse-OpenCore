---
title: "Loyalty — Redeem"
description: "Redeem loyalty points for a contact."
---

## Overview

Deducts points from a contact's balance according to the workspace loyalty program, optionally against a specific order.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/loyalty/redeem`

### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `contact_id` | string (uuid) | ✅ | The contact redeeming points. |
| `points` | number | ✅ | Points to redeem. |
| `order_id` | string (uuid) | ❌ | Order to apply the reward to. |


## Response

```json
{ "redeemed_points": 500, "discount_value": 5.00, "remaining_balance": 700 }
```

## SDK example

```typescript
await reponse.loyalty.redeem({ body: { contact_id: contactId, points: 500 } });
```
