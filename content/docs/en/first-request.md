---
title: "First Request"
description: "Make your first Reponse API call in under five minutes."
---

## Overview

This quickstart walks you through making your first API call. You will install the SDK, initialize the client, fetch products from your catalog, and verify the response. By the end, you will have a working connection to the Reponse API.

## Prerequisites

- Node.js 18+ installed
- A Reponse API key (see [Authentication](/docs/authentication))
- The `@reponseai/sdk` package installed (see [Installation](/docs/installation))

## Step 1 — Install the SDK

```bash
npm install @reponseai/sdk
```

## Step 2 — Set Your API Key

Export the key in your terminal or add it to `.env.local`:

```bash
export REPONSE_API_KEY=rp_live_abc123...
```

## Step 3 — Initialize the Client

```typescript
import { Reponse } from "@reponseai/sdk";

const reponse = new Reponse({
  apiKey: process.env.REPONSE_API_KEY!,
});
```

## Step 4 — List Products

```typescript
const { data } = await reponse.catalog.listProducts({
  query: { limit: 10 },
});

console.log(`Fetched ${data.data.length} products`);
console.log(data.data.map((p) => p.title));
```

## Step 5 — Verify the Response

A successful response looks like this:

```json
{
  "data": [
    {
      "id": "prod_01H...",
      "title": "Classic Sneaker",
      "handle": "classic-sneaker",
      "status": "active",
      "variants": [
        { "id": "var_01H...", "sku": "SNK-001", "price": "89.00" }
      ]
    }
  ],
  "meta": {
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}
```

## Alternative: cURL

You can also make the request directly with cURL:

```bash
curl -X GET "https://api.reponse.ai/v1/catalog/products?limit=10" \
  -H "Authorization: Bearer rp_live_abc123..."
```

## Step 6 — Send a Chat Message

Once your catalog is verified, try sending a chat message:

```typescript
const chat = await reponse.chat.sendMessage({
  body: {
    workspaceId: "ws_01H...",
    message: "What is your best-selling product?",
  },
});

console.log(chat.data.reply);
```

## Next Steps

- [Chat Widget](/docs/chat-widget) — Embed the AI assistant on your storefront
- [React Hooks](/docs/react-hooks) — Fetch data declaratively in React
- [AI Engines](/docs/ai-engines) — Understand how engine selection works

## Troubleshooting

| Issue | Solution |
| --- | --- |
| `401 Unauthorized` | Check that your API key is correct and not revoked. |
| Empty `data` array | Your workspace has no synced products yet. Run a Shopify sync first. |
| `ECONNREFUSED` | Verify the base URL and your network/firewall settings. |
| Timeout errors | Increase the `timeout` option in the client constructor. |
