---
title: "SDK Overview"
description: "The Reponse SDKs and tools."
---

## Overview

Reponse provides official SDKs and tools to integrate the API into your stack. The TypeScript SDK is auto-generated from the OpenAPI specification, so its types always match the live API. React hooks add declarative data fetching, and the MCP server connects AI agents.

## Available SDKs

| Package | Use Case | Install |
| --- | --- | --- |
| `@reponseai/sdk` | Server-side and full-stack TypeScript | `npm install @reponseai/sdk` |
| `@reponseai/react` | React UI data fetching (SWR-powered) | `npm install @reponseai/react` |
| `@reponseai/mcp` | Connect AI agents via Model Context Protocol | `npm install @reponseai/mcp` |

## Quick Start — TypeScript SDK

```typescript
import { Reponse } from "@reponseai/sdk";

const reponse = new Reponse({
  apiKey: process.env.REPONSE_API_KEY!,
});

// List products
const { data } = await reponse.catalog.listProducts({ query: { limit: 10 } });
console.log(data.data);

// Get a single product
const product = await reponse.catalog.getProduct({ path: { id: "prod_01H..." } });
console.log(product.data);
```

## Quick Start — React Hooks

```tsx
import { ReponseProvider, useProducts } from "@reponseai/react";

function App() {
  return (
    <ReponseProvider apiKey="rp_live_...">
      <ProductList />
    </ReponseProvider>
  );
}

function ProductList() {
  const { data, error, isLoading } = useProducts({ limit: 20 });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

## Quick Start — MCP Server

The MCP server lets AI agents (Claude, GPT, custom agents) access your Reponse workspace as a tool:

```bash
REPONSE_API_KEY=rp_live_abc123... npx @reponseai/mcp
```

The server exposes 35 tools like `list_products`, `create_cart`, `fulfill_order`, and `create_checkout` over the Model Context Protocol.

## Supported Platforms

| Platform | SDK | Notes |
| --- | --- | --- |
| Node.js 18+ | `@reponseai/sdk` | Full support, recommended for server-side. |
| Next.js (App Router) | `@reponseai/sdk` + `@reponseai/react` | Server Components and Client Components. |
| Vite / CRA | `@reponseai/react` | Client-side only, requires proxy for API key. |
| Deno / Bun | `@reponseai/sdk` | Community-tested, not officially supported. |
| Browser (CDN) | `reponse.min.js` | Lightweight client for script-tag embeds. |

## Configuration Reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | — | Workspace API key (required). |
| `baseUrl` | `string` | `https://api.reponse.ai` | API base URL override. |
| `timeout` | `number` | `30000` | Request timeout in ms. |
| `retries` | `number` | `2` | Auto-retries on 5xx errors. |

## Next Steps

- [Installation](/docs/installation) — Detailed setup instructions
- [First Request](/docs/first-request) — Make your first API call
- [React Hooks](/docs/react-hooks) — Full hooks reference
- [Rate Limits](/docs/rate-limits) — Understand API throttling
