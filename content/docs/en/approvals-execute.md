---
title: "Approvals — Execute"
description: "Execute a pending approval (human-in-the-loop action)."
---

## Overview

Approves and runs a pending agent action (for example, issuing a refund or cancelling an order). The approval must be in a pending state.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/approvals/:approvalId/execute`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `approvalId` | string (uuid) | ✅ | The approval ID. |


## Response

```json
{ "executed": true, "approval": { "id": "appr_uuid", "status": "executed" } }
```

## SDK example

```typescript
await reponse.approvals.execute({ path: { approvalId } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Approval is not pending. |
| `404` | Approval not found. |
