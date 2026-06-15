---
title: "Rate Limits"
description: "API rate limits and how to handle them."
---

## Overview

The Reponse API applies per-workspace rate limits to ensure fair usage and platform stability. When you exceed a limit, the API responds with HTTP `429 Too Many Requests`. All responses include rate-limit headers so your application can self-throttle proactively.

## Rate-Limit Headers

Every API response includes the following headers:

| Header | Type | Description |
| --- | --- | --- |
| `X-RateLimit-Limit` | `number` | Maximum requests allowed in the current window. |
| `X-RateLimit-Remaining` | `number` | Requests remaining before the limit is reached. |
| `X-RateLimit-Reset` | `number` | Unix timestamp (seconds) when the window resets. |
| `Retry-After` | `number` | Seconds to wait before retrying (only on `429` responses). |

## Limits per Endpoint

| Endpoint | Window | Limit | Notes |
| --- | --- | --- | --- |
| `POST /v1/chat` | 1 minute | 60 | Per workspace. Streaming counts as one request. |
| `GET /v1/catalog/products` | 1 minute | 120 | Cached responses do not count. |
| `GET /v1/catalog/products/:id` | 1 minute | 120 | — |
| `POST /v1/shopify/sync` | 1 hour | 10 | Full catalog syncs are heavy operations. |
| `POST /v1/leads` | 1 minute | 30 | Lead capture / submission. |
| All other endpoints | 1 minute | 100 | Default limit. |

Limits are applied per workspace, not per API key. Multiple keys on the same workspace share the same quota.

## Handling 429 Responses

When you receive a `429`, the response body and headers tell you how long to wait:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Retry after 12 seconds.",
    "retryAfter": 12
  }
}
```

### Retry with Exponential Backoff

```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status !== 429) return response;

    const retryAfter = parseInt(response.headers.get("Retry-After") || "1", 10);
    const delay = retryAfter * 1000 * Math.pow(2, attempt);
    console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Max retries exceeded");
}
```

### cURL Example

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer rp_live_abc123..." \
  "https://api.reponse.ai/v1/catalog/products"

# Check headers
curl -s -D - \
  -H "Authorization: Bearer rp_live_abc123..." \
  "https://api.reponse.ai/v1/catalog/products" | grep X-RateLimit
```

## Best Practices

- **Read the headers proactively.** Pause requests when `X-RateLimit-Remaining` approaches zero.
- **Cache responses** on your side for data that changes infrequently (products, collections).
- **Batch operations** where possible instead of making many sequential calls.
- **Use webhooks** for real-time updates instead of polling the API.

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Constant `429` errors | Check if multiple services share the same workspace. Consolidate or request a limit increase. |
| `Retry-After` header missing | Older SDK versions may not parse it. Update to `@reponseai/sdk` ≥ 1.0.0. |
| Limits seem lower than documented | Test keys (`rp_test_`) have reduced limits. Use live keys for production loads. |
