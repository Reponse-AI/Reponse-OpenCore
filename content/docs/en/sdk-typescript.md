---
title: "TypeScript SDK"
description: "The official TypeScript SDK."
---

## Overview

`@reponseai/sdk` is the official typed client for the Reponse Commerce API. It provides namespaced operations — `catalog`, `cart`, `orders`, `loyalty`, `tickets`, `subscriptions`, and `discounts` — with full TypeScript inference for request parameters and response shapes.

## Installation

```bash
pnpm add @reponseai/sdk
# or
npm install @reponseai/sdk
```

## Client creation

```typescript
import { Reponse } from '@reponseai/sdk';

const reponse = new Reponse({
  apiKey: process.env.REPONSE_API_KEY!,
  // Optional overrides
  baseUrl: 'https://api.reponse.ai',   // default
  timeout: 10_000,                       // ms, default 30 000
  retries: 2,                            // auto-retry on 5xx, default 0
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | — | **Required.** API key from Dashboard → Settings → API Keys |
| `baseUrl` | `string` | `https://api.reponse.ai` | API base URL |
| `timeout` | `number` | `30000` | Request timeout in milliseconds |
| `retries` | `number` | `0` | Number of automatic retries on 5xx responses |

## API namespaces

### Catalog

```typescript
// List products (paginated)
const { data, meta } = await reponse.catalog.listProducts({
  query: { limit: 10, cursor: 'abc123' },
});

// Get a single product
const { data: product } = await reponse.catalog.getProduct({
  path: { id: 'prod_xxx' },
});

// List collections
const { data: collections } = await reponse.catalog.listCollections();
```

### Cart

```typescript
// Create a cart
const { data: cart } = await reponse.cart.create({
  body: { currency: 'EUR' },
});

// Get a cart
const { data: cart } = await reponse.cart.get({
  path: { id: cartId },
});

// Add item
await reponse.cart.addItem({
  path: { id: cartId },
  body: { variantId: 'var_xxx', quantity: 2 },
});

// Apply promo code
await reponse.cart.applyPromo({
  path: { id: cartId },
  body: { code: 'SAVE10' },
});
```

### Orders

```typescript
// List orders for a customer
const { data: orders } = await reponse.orders.list({
  query: { email: 'buyer@example.com', limit: 5 },
});

// Get order by ID
const { data: order } = await reponse.orders.get({
  path: { id: 'ord_xxx' },
});
```

### Loyalty

```typescript
// Get balance
const { data: balance } = await reponse.loyalty.getBalance({
  path: { contactId: 'ctc_xxx' },
});

// Redeem points
await reponse.loyalty.redeem({
  path: { contactId: 'ctc_xxx' },
  body: { points: 500, reason: 'checkout' },
});
```

### Tickets

```typescript
// Create a support ticket
const { data: ticket } = await reponse.tickets.create({
  body: { subject: 'Missing item', email: 'buyer@example.com' },
});
```

### Subscriptions

```typescript
// List subscriptions
const { data: subs } = await reponse.subscriptions.list({
  query: { status: 'active' },
});

// Delay next shipment
await reponse.subscriptions.manage({
  path: { id: 'sub_xxx' },
  body: { action: 'delay', days: 7 },
});
```

## Pagination

List endpoints return a `meta` object with cursor-based pagination:

```typescript
const { data, meta } = await reponse.catalog.listProducts({
  query: { limit: 20 },
});

console.log(meta.nextCursor);  // pass as `cursor` to fetch the next page
console.log(meta.hasMore);     // boolean
```

## Error handling

All SDK methods throw a `ReponseApiError` on non-2xx responses:

```typescript
import { ReponseApiError } from '@reponseai/sdk';

try {
  await reponse.cart.get({ path: { id: 'invalid' } });
} catch (err) {
  if (err instanceof ReponseApiError) {
    console.error(err.status);   // 404
    console.error(err.code);     // "CART_NOT_FOUND"
    console.error(err.message);  // "Cart not found"
  }
}
```

| Property | Type | Description |
|---|---|---|
| `status` | `number` | HTTP status code |
| `code` | `string` | Machine-readable error code |
| `message` | `string` | Human-readable description |
| `requestId` | `string` | Unique request ID for support |

## Common error codes

| Code | Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | Key lacks required scope |
| `NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 422 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Too many requests — retry after header |
| `INTERNAL_ERROR` | 500 | Server error — retry or contact support |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `UNAUTHORIZED` on every call | Wrong or missing API key | Verify `REPONSE_API_KEY` env variable |
| Types not matching response | Outdated SDK version | Run `pnpm update @reponseai/sdk` |
| Timeout errors | Slow network or large payload | Increase `timeout` option |
| `RATE_LIMITED` errors | Exceeding 100 req/s default | Add backoff logic or request a limit increase |
