---
title: "Authentication"
description: "How to authenticate with the Reponse API."
---

## Overview

The Reponse API uses Bearer authentication. Every request must include your workspace API key in the `Authorization` header. Keys are scoped to a single workspace and grant access to all resources within that workspace.

## Prerequisites

- A Reponse account with at least one workspace
- An API key generated from the dashboard

## Step 1 — Generate an API Key

Navigate to **Settings → API Keys** in your workspace dashboard. Click **Create key**, give it a label (e.g. `production-backend`), and copy the value immediately — it will not be shown again.

## Step 2 — Include the Key in Requests

Pass the key as a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_api_key>
```

### cURL Example

```bash
curl -X GET https://api.reponse.ai/v1/catalog/products \
  -H "Authorization: Bearer rp_live_abc123..."
```

### TypeScript Example

```typescript
const response = await fetch("https://api.reponse.ai/v1/catalog/products", {
  headers: {
    Authorization: `Bearer ${process.env.REPONSE_API_KEY}`,
  },
});
```

## Key Types

| Prefix | Environment | Description |
| --- | --- | --- |
| `rp_test_` | Sandbox | Operates on test data. Safe for development. |
| `rp_live_` | Production | Full access to live workspace data. |

Test keys return realistic responses but never mutate production data. Use them during development and in CI pipelines.

## Rate-Limit Headers

Every response includes rate-limit metadata so your application can self-throttle:

| Header | Description |
| --- | --- |
| `X-RateLimit-Limit` | Maximum requests allowed in the current window. |
| `X-RateLimit-Remaining` | Requests remaining before throttling. |
| `X-RateLimit-Reset` | Unix timestamp when the window resets. |
| `Retry-After` | Seconds to wait (present only on `429` responses). |

## Key Rotation

You can have up to five active keys per workspace. To rotate a key:

1. Create a new key in the dashboard.
2. Deploy the new key to your servers.
3. Revoke the old key once all traffic uses the new one.

Revoked keys return `401 Unauthorized` immediately.

## Security Best Practices

- **Never expose live keys in client-side code.** Use them only from a server or proxy requests through your backend.
- Store keys in environment variables (`REPONSE_API_KEY`), not in source control.
- Use test keys (`rp_test_`) for local development and CI.
- Rotate keys periodically and after any team-member departure.

## Storefront Public Auth

Storefront applications (e.g. the Next.js starter) can access **read-only catalog endpoints** and **shopping operations** (carts, checkout, shipping) without an API key by passing a `x-workspace-id` header instead.

This keeps the onboarding frictionless: merchants only need their Workspace ID to launch a storefront. Sensitive admin endpoints (orders management, inventory writes, CRM) still require a full API key.

### How it Works

Pass your Workspace ID in the `x-workspace-id` header:

```bash
curl -X GET https://api.reponse.ai/v1/products \
  -H "x-workspace-id: your-workspace-uuid"
```

Or as a query parameter:

```
GET https://api.reponse.ai/v1/products?workspace_id=your-workspace-uuid
```

### Public Endpoints

The following endpoints accept `x-workspace-id` authentication:

| Endpoint | Methods | Description |
| --- | --- | --- |
| `/v1/products` | GET | List products |
| `/v1/products/:id` | GET | Product detail |
| `/v1/collections` | GET | List collections |
| `/v1/collections/:handle` | GET | Collection detail |
| `/v1/collections/:handle/products` | GET | Products in a collection |
| `/v1/carts` | POST | Create cart |
| `/v1/carts/:id` | GET, PATCH | Read/update cart |
| `/v1/carts/:id/items` | POST | Add items |
| `/v1/carts/:id/items/:lineId` | PUT, DELETE | Update/remove items |
| `/v1/carts/:id/promotions` | POST, DELETE | Apply/remove promotions |
| `/v1/checkout/*` | POST | Stripe, intent, ACP checkout |
| `/v1/shipping/rates` | GET | Calculate shipping |
| `/v1/discounts/validate` | POST | Validate a discount code |
| `/v1/policies` | GET | Legal policies |
| `/v1/theme` | GET | Storefront theme config |

All other endpoints require a Bearer API key.

### Rate Limits

Public-auth requests are rate-limited per IP address:

| Tier | Limit | Applies to |
| --- | --- | --- |
| Read | 120 requests/minute | GET endpoints |
| Write | 30 requests/minute | POST, PUT, PATCH, DELETE |
| Checkout | 5 requests/5 minutes | `/checkout/*` endpoints |

Requests authenticated with a Bearer API key are not rate-limited.

### SDK Usage

The `@reponseai/sdk` supports both authentication modes:

```typescript
import { Reponse, client } from "@reponseai/sdk";

// Option A: API key auth (admin/backend)
const reponse = new Reponse({ apiKey: process.env.REPONSE_API_KEY! });

// Option B: Public auth (storefront)
client.setConfig({
  baseUrl: "https://reponse.ai/api",
  headers: { "x-workspace-id": process.env.NEXT_PUBLIC_WORKSPACE_ID! },
});
```

## Troubleshooting

| Issue | Solution |
| --- | --- |
| `401 Unauthorized` | Verify the key is correct and has not been revoked. |
| `403 Forbidden` | The key does not have access to the requested workspace. |
| `429 Too Many Requests` | You exceeded the rate limit. Wait for `Retry-After` seconds. |
| Key not shown after creation | Keys are displayed only once. Generate a new one if lost. |
