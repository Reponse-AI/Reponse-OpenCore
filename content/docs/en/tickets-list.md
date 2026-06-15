---
title: "Tickets — List"
description: "List support tickets for a customer."
---

## Overview

Returns support tickets for a given customer email, optionally filtered by status. The customer is resolved to a contact internally.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/v1/tickets`

### Query parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `customer_email` | string | ✅ | Customer email. |
| `status` | string | ❌ | Filter by ticket status. |


## Response

```json
{ "data": [ { "id": "ticket_uuid", "subject": "Where is my order?", "status": "open" } ] }
```

## SDK example

```typescript
const { data } = await reponse.tickets.list({ query: { customer_email: "buyer@example.com" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `customer_email` is required. |

## Related

- [Create a ticket](doc:tickets-create)
- [Reply to a ticket](doc:tickets-reply)
