---
title: "Geocode"
description: "Resolve a free-text address into structured location data."
---

## Overview

Geocodes an address string into structured fields (street, city, postal code, country, coordinates). Useful for autocomplete and address validation at checkout.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/utils/geocode`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | string | ✅ | Free-text address to resolve. |


## Response

```json
{ "results": [ { "address1": "10 Downing St", "city": "London", "country": "GB", "lat": 51.5, "lng": -0.12 } ] }
```

## SDK example

```typescript
const { data } = await reponse.utils.geocode({ query: { query: "10 Downing St London" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Missing `query` parameter. |
