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

## Troubleshooting

| Issue | Solution |
| --- | --- |
| `401 Unauthorized` | Verify the key is correct and has not been revoked. |
| `403 Forbidden` | The key does not have access to the requested workspace. |
| `429 Too Many Requests` | You exceeded the rate limit. Wait for `Retry-After` seconds. |
| Key not shown after creation | Keys are displayed only once. Generate a new one if lost. |
