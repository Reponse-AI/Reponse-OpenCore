---
title: "Loyalty — Balance"
description: "Get a contact's loyalty points balance and tier."
---

## Overview

Returns the points balance, lifetime points earned, and current tier for a contact. Returns a zeroed balance if the contact has no loyalty record yet.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/loyalty`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `contact_id` | string (uuid) | ✅ | The contact to look up. |


## Response

```json
{
  "points_balance": 1200,
  "points_earned_total": 3400,
  "tier": { "id": "tier_uuid", "name": "Gold", "slug": "gold" }
}
```

## SDK example

```typescript
const { data } = await reponse.loyalty.getBalance({ query: { contact_id: contactId } });
```

## Related

- [Redeem points](doc:loyalty-redeem)
- [Loyalty referral](doc:loyalty-referral)
- [Gift Cards — List](doc:gift-cards-list)
