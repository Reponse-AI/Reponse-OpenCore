---
title: "Installation"
description: "Install the Reponse SDK and set up your environment."
---

## Overview

Install the Reponse SDK with your preferred package manager, configure your API key, and verify the setup with a quick health check. The entire process takes under five minutes.

## Prerequisites

- Node.js 18 or later
- A package manager: npm, pnpm, or yarn
- A Reponse API key (see [Authentication](/docs/authentication))

## Step 1 — Install the SDK

Choose your package manager:

```bash
# npm
npm install @reponseai/sdk

# pnpm
pnpm add @reponseai/sdk

# yarn
yarn add @reponseai/sdk
```

For React projects, also install the hooks package:

```bash
npm install @reponseai/react
```

### CDN (Browser)

If you are not using a bundler, load the SDK from the CDN:

```html
<script src="https://cdn.reponse.ai/sdk/latest/reponse.min.js"></script>
<script>
  const reponse = new Reponse({ apiKey: "rp_live_..." });
</script>
```

## Step 2 — Configure Environment Variables

Create a `.env.local` file at the root of your project:

```bash
# Required — your workspace API key (server-side only)
REPONSE_API_KEY=rp_live_...

# Optional — override the default API base URL
NEXT_PUBLIC_REPONSE_BASE_URL=https://api.reponse.ai
```

> **Important:** Never prefix server-only secrets with `NEXT_PUBLIC_`. The `REPONSE_API_KEY` variable must stay server-side.

## Step 3 — Initialize the Client

```typescript
import { Reponse } from "@reponseai/sdk";

const reponse = new Reponse({
  apiKey: process.env.REPONSE_API_KEY!,
});
```

## Step 4 — Verify the Installation

Run a quick products request to confirm everything works:

```typescript
const { data } = await reponse.catalog.listProducts({ query: { limit: 1 } });
console.log("Connected ✓ — first product:", data.data[0]?.title);
```

Expected output:

```
Connected ✓ — first product: Example Product
```

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | — | Your workspace API key (required). |
| `baseUrl` | `string` | `https://api.reponse.ai` | Override the API base URL. |
| `timeout` | `number` | `30000` | Request timeout in milliseconds. |
| `retries` | `number` | `2` | Number of automatic retries on 5xx errors. |

## Troubleshooting

| Issue | Solution |
| --- | --- |
| `MODULE_NOT_FOUND` | Run `npm install` again and check your `node_modules`. |
| `401 Unauthorized` on first call | Verify `REPONSE_API_KEY` is set and correct. |
| TypeScript type errors | Ensure you are on `@reponseai/sdk` ≥ 1.0.0 and TypeScript ≥ 5.0. |
| CDN script not loading | Check for ad-blockers or CSP headers blocking `cdn.reponse.ai`. |
