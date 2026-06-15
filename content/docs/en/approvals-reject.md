---
title: "Approvals — Reject"
description: "Reject a pending approval."
---

## Overview

Declines a pending agent action so it is never executed. The approval must be in a pending state.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**POST** `/v1/approvals/:approvalId/reject`

### Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `approvalId` | string (uuid) | ✅ | The approval ID. |


## Response

```json
{ "rejected": true, "approval": { "id": "appr_uuid", "status": "rejected" } }
```

## SDK example

```typescript
await reponse.approvals.reject({ path: { approvalId } });
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Approval is not pending. |
| `404` | Approval not found. |
