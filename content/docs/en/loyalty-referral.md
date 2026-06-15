---
title: "Loyalty — Referral"
description: "Get a contact's referral code and stats."
---

## Overview

Returns the referral code for a contact along with referral performance, used to power refer-a-friend flows.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/loyalty/referral`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `contact_id` | string (uuid) | ✅ | The contact to look up. |


## Response

```json
{ "referral_code": "FRIEND-AB12", "referrals_count": 3, "points_earned": 300 }
```

## SDK example

```typescript
const { data } = await reponse.loyalty.getReferral({ query: { contact_id: contactId } });
```
