---
title: "Tickets — Create"
description: "Create a support ticket."
---

## Overview

Opens a new support ticket for a customer. The contact is created automatically if it does not already exist.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/tickets`

### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `customer_email` | string | ✅ | Customer email. |
| `subject` | string | ✅ | Ticket subject. |
| `message` | string | ✅ | First message body. |
| `category` | string | ❌ | Ticket category. |
| `order_id` | string (uuid) | ❌ | Related order. |


## Response

```json
{ "data": { "id": "ticket_uuid", "status": "open" } }
```

## SDK example

```typescript
await reponse.tickets.create({
  body: { customer_email: "buyer@example.com", subject: "Question", message: "Hello" }
});
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `customer_email`, `subject`, and `message` are required. |
