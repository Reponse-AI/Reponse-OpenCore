---
title: "Tickets — Reply"
description: "Reply to a support ticket."
---

## Overview

Appends a message to an existing ticket thread. The ticket must belong to the authenticated workspace.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/tickets/:id/reply`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The ticket ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | ✅ | Reply body. |


## Response

```json
{ "data": { "id": "message_uuid", "ticket_id": "ticket_uuid" } }
```

## SDK example

```typescript
await reponse.tickets.reply({ path: { id: ticketId }, body: { message: "Thanks for reaching out" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | `message` is required. |
| `404` | Ticket not found. |
