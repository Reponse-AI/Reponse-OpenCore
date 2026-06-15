---
title: "Agentic Commerce (ACP)"
description: "How Reponse enables agentic commerce."
---

## Overview

**Agentic Commerce** means letting AI agents discover products, build carts, and complete purchases on a shopper's behalf. Reponse implements the Agentic Commerce Protocol (ACP) — a set of machine-readable feeds, APIs, and approval flows that allow agents to transact safely with human-in-the-loop controls.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with products |
| API key | Key with `catalog:read`, `cart:write`, `orders:write` scopes |
| MCP or A2A client | An agent capable of calling tools or exchanging A2A messages |

## Architecture

Agentic commerce in Reponse is built on three pillars:

```
┌─────────────────────────────────────────┐
│           External AI Agent             │
└──────┬──────────────┬──────────────┬────┘
       │              │              │
  ┌────▼────┐   ┌─────▼─────┐  ┌────▼────┐
  │ACP Feed │   │MCP Server │  │A2A Proto│
  └────┬────┘   └─────┬─────┘  └────┬────┘
       │              │              │
  ┌────▼──────────────▼──────────────▼────┐
  │         Reponse Commerce Engine       │
  │  Catalog · Cart · Checkout · Orders   │
  └──────────────────┬────────────────────┘
                     │
              ┌──────▼──────┐
              │  Approvals  │
              │   (HITL)    │
              └─────────────┘
```

| Component | Purpose |
|---|---|
| **ACP Feed** | Machine-readable product feed optimized for agent consumption |
| **MCP Server** | Tool interface for MCP-compatible agents (Claude, Cursor) |
| **A2A Protocol** | JSON-RPC protocol for agent-to-agent task delegation |
| **Approvals API** | Human-in-the-loop approval before checkout completes |

## ACP product feed

The ACP feed exposes your catalog in an agent-optimized format:

```
GET https://api.reponse.ai/v1/acp/products
Authorization: Bearer rp_live_xxxxxxxxxxxx
```

```json
{
  "products": [
    {
      "id": "prod_xxx",
      "name": "Organic Cotton T-Shirt",
      "description": "Soft organic cotton, available in 5 colors",
      "price": { "amount": 29.99, "currency": "EUR" },
      "variants": [
        { "id": "var_1", "attributes": { "size": "M", "color": "Navy" }, "available": true }
      ],
      "actions": ["add_to_cart", "view_details"]
    }
  ],
  "meta": { "nextCursor": "abc123", "hasMore": true }
}
```

## Agent capabilities

An agent interacting with Reponse can perform these actions:

| Capability | Description | Approval required |
|---|---|---|
| **Browse catalog** | Search and filter products | No |
| **Get product details** | Fetch full product info, variants, images | No |
| **Create cart** | Start a new shopping cart | No |
| **Add/remove items** | Modify cart contents | No |
| **Apply discount** | Apply promo codes or loyalty points | No |
| **Initiate checkout** | Start the checkout flow | **Yes** |
| **Confirm purchase** | Complete the order | **Yes** |
| **Cancel order** | Cancel a pending order | **Yes** |

## Checkout flow

The agentic checkout flow enforces human approval before any payment is processed:

1. **Agent builds cart** — adds items, applies discounts
2. **Agent requests checkout** — calls `POST /v1/checkout/initiate`
3. **Approval request created** — a pending approval is generated
4. **Human reviews** — shopper sees a summary and approves or rejects
5. **Order confirmed** — on approval, payment is captured and order is created

```typescript
// Step 1: Agent initiates checkout
const { data: checkout } = await reponse.checkout.initiate({
  body: { cartId: 'cart_xxx' },
});
// checkout.approvalUrl → "https://shop.example.com/approve/apv_xxx"

// Step 2: Shopper approves via the approval URL

// Step 3: Agent polls or receives webhook for completion
const { data: order } = await reponse.orders.get({
  path: { id: checkout.orderId },
});
```

## Approval system

The approval system ensures shoppers retain control:

| Field | Type | Description |
|---|---|---|
| `approvalId` | `string` | Unique approval identifier |
| `status` | `enum` | `pending`, `approved`, `rejected`, `expired` |
| `expiresAt` | `ISO 8601` | Approval link expiry (default: 30 minutes) |
| `cartSummary` | `object` | Items, totals, and discount breakdown |
| `approvalUrl` | `string` | URL the shopper visits to approve |

### Approval webhooks

Configure a webhook to receive approval status changes:

```json
{
  "event": "approval.completed",
  "data": {
    "approvalId": "apv_xxx",
    "status": "approved",
    "orderId": "ord_xxx",
    "timestamp": "2026-05-27T10:00:00Z"
  }
}
```

## Configuration reference

| Setting | Location | Description |
|---|---|---|
| ACP feed enabled | Dashboard → Settings → Agentic | Toggle ACP product feed |
| Approval expiry | Dashboard → Settings → Agentic | Time before approval link expires |
| Webhook URL | Dashboard → Settings → Webhooks | Endpoint for approval events |
| Allowed agent origins | Dashboard → Settings → Agentic | Restrict which agents can initiate checkout |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| ACP feed returns empty | No published products | Publish products in the dashboard |
| Checkout initiation fails | Cart is empty or expired | Verify cart has items and is not stale |
| Approval link expired | Shopper didn't approve in time | Re-initiate checkout to generate a new link |
| Webhook not received | URL not configured or unreachable | Verify webhook URL in dashboard settings |
| Agent gets `FORBIDDEN` | API key missing `orders:write` scope | Regenerate key with required scopes |
