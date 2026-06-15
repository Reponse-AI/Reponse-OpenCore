---
title: "Subscriptions — Manage"
description: "Modify a subscription (delay or ship now)."
---

## Overview

Updates an active subscription. Use `delay` with a future `target_date` to push the next shipment, or `ship_now` to trigger the next order immediately. Only active subscriptions can be modified.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**PATCH** `/v1/subscriptions/:id`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (uuid) | ✅ | The subscription ID. |


### Body parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | string | ✅ | `delay` or `ship_now`. |
| `target_date` | string (ISO) | ❌ | Required for `delay`; must be after current period end. |


## Response

```json
{ "success": true }
```

## SDK example

```typescript
await reponse.subscriptions.update({ path: { id }, body: { action: "delay", target_date: "2026-07-01" } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid action, missing/invalid `target_date`, or non-active subscription. |
| `404` | Subscription not found. |
