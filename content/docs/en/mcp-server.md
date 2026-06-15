---
title: "MCP Server"
description: "Connect AI tools to Reponse via the MCP server."
---

## Overview

Reponse ships a **Model Context Protocol (MCP)** server that exposes commerce operations as typed tools to any MCP-compatible client — including Claude, Cursor, Windsurf, and custom agent orchestrators. This lets an AI agent browse the catalog, manage carts, check orders, and act on loyalty data without building a custom integration.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with an API key |
| MCP-compatible client | Claude Desktop, Cursor, or any MCP SDK client |
| API key scope | `catalog:read`, `cart:write`, `orders:read` (minimum) |

## Step 1 — Configure the MCP client

Add the Reponse MCP server to your client configuration. For **Claude Desktop**, edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "reponse": {
      "command": "npx",
      "args": ["-y", "@reponseai/mcp-server"],
      "env": {
        "REPONSE_API_KEY": "rp_live_xxxxxxxxxxxx"
      }
    }
  }
}
```

For **Cursor**, add the same entry under `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "reponse": {
      "command": "npx",
      "args": ["-y", "@reponseai/mcp-server"],
      "env": {
        "REPONSE_API_KEY": "rp_live_xxxxxxxxxxxx"
      }
    }
  }
}
```

## Step 2 — Verify the connection

Once configured, your MCP client discovers the available tools automatically. You should see tools prefixed with `reponse_` in your client's tool list.

## Available tools

The MCP server exposes the following tools, mapping directly to the `/v1` REST API:

| Tool | Description | API equivalent |
|---|---|---|
| `reponse_list_products` | Search and list products with filters | `GET /v1/catalog/products` |
| `reponse_get_product` | Get full product details by ID | `GET /v1/catalog/products/:id` |
| `reponse_list_collections` | List all collections | `GET /v1/catalog/collections` |
| `reponse_create_cart` | Create a new cart | `POST /v1/cart` |
| `reponse_add_to_cart` | Add an item to a cart | `POST /v1/cart/:id/items` |
| `reponse_get_cart` | Retrieve cart contents | `GET /v1/cart/:id` |
| `reponse_apply_promo` | Apply a promo code to a cart | `POST /v1/cart/:id/promo` |
| `reponse_list_orders` | List orders by email or contact | `GET /v1/orders` |
| `reponse_get_order` | Get order details | `GET /v1/orders/:id` |
| `reponse_get_loyalty_balance` | Check loyalty points balance | `GET /v1/loyalty/:contactId/balance` |
| `reponse_create_ticket` | Open a support ticket | `POST /v1/tickets` |

## Tool input/output schema

Each tool uses typed JSON Schema. Example for `reponse_list_products`:

```json
{
  "name": "reponse_list_products",
  "description": "Search and list products from the catalog",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query":  { "type": "string", "description": "Search query" },
      "limit":  { "type": "number", "default": 10 },
      "cursor": { "type": "string" }
    }
  }
}
```

## Step 3 — Use in an agent workflow

With the MCP server connected, an agent can chain tools naturally:

```
User: "Find me a red jacket under €100 and add it to my cart"

Agent:
  1. reponse_list_products({ query: "red jacket", limit: 5 })
  2. reponse_create_cart({ currency: "EUR" })
  3. reponse_add_to_cart({ cartId: "...", variantId: "...", quantity: 1 })
```

## Configuration reference

| Variable | Required | Description |
|---|---|---|
| `REPONSE_API_KEY` | Yes | Workspace API key |
| `REPONSE_BASE_URL` | No | Override API base URL (default: `https://api.reponse.ai`) |
| `MCP_LOG_LEVEL` | No | Logging verbosity: `debug`, `info`, `warn`, `error` |

## A2A integration

The MCP server can be used alongside the [A2A protocol](/docs/a2a-protocol) to let external agents interact with Reponse. An orchestrator agent can discover the Reponse agent card via A2A, then invoke tools through MCP for catalog and cart operations.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Tools not appearing in client | Config file path wrong | Verify config location for your MCP client |
| `UNAUTHORIZED` errors | Invalid API key | Check `REPONSE_API_KEY` env variable |
| `npx` command fails | Node.js not installed or outdated | Install Node.js 18+ |
| Slow tool responses | Network latency or large catalog | Reduce `limit` parameter in list calls |
| Tool returns empty results | No products in workspace | Add products via Shopify sync or dashboard |
