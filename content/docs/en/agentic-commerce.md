---
title: "Agentic Commerce (ACP)"
description: "How Reponse enables agentic commerce."
---

## Overview

**Agentic Commerce** means letting AI agents discover products, build carts, and complete purchases on a shopper's behalf. Reponse implements the Agentic Commerce Protocol (ACP) — a set of machine-readable feeds, APIs, and payment flows that allow agents to transact safely.

## Prerequisites

| Requirement | Description |
|---|---|
| Reponse workspace | Active workspace with products |
| API key | Workspace API key (Bearer token) |
| Stripe | Stripe account connected to your workspace with SPT (Shared Payment Tokens) enabled |
| Agent client | An AI agent capable of calling HTTP APIs (ChatGPT, Copilot, Gemini, etc.) |

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
  └───────────────────────────────────────┘
```

| Component | Purpose |
|---|---|
| **ACP Feed** | Machine-readable product feed optimized for agent consumption |
| **MCP Server** | Tool interface for MCP-compatible agents (Claude, Cursor) |
| **A2A Protocol** | JSON-RPC protocol for agent-to-agent task delegation |

## Discovery

AI agents discover your storefront via a standard manifest:

```
GET https://your-store.com/.well-known/acp.json
```

The manifest lists your endpoints, capabilities, and payment configuration. It is public (no auth required) and cached for 24 hours.

## Product feed

The ACP feed exposes your full catalog in an agent-optimized, gzip-compressed JSON format:

```
GET /api/v1/feed
Authorization: Bearer YOUR_API_KEY
```

```json
{
  "version": "1.0",
  "merchant": "Your Brand",
  "product_count": 42,
  "generated_at": "2026-05-26T06:00:00.000Z",
  "products": [
    {
      "id": "prod_xxx",
      "title": "Organic Cotton T-Shirt",
      "description": "Soft organic cotton, available in 5 colors",
      "price": 29.99,
      "currency": "EUR",
      "availability": "in_stock",
      "url": "https://your-store.com/products/organic-tee",
      "variants": [
        {
          "id": "var_1",
          "title": "Small / Black",
          "sku": "TS-SM-BLK",
          "price": 29.99,
          "inventory_quantity": 15,
          "option_values": { "Size": "Small", "Color": "Black" },
          "availability": "in_stock"
        }
      ]
    }
  ]
}
```

The response is Gzip-compressed (`Content-Encoding: gzip`). Most HTTP clients decompress automatically. Cache TTL is 1 hour.

## Agent capabilities

An agent interacting with Reponse can perform these actions:

| Capability | Endpoint | Description |
|---|---|---|
| **Browse catalog** | `GET /api/v1/feed` | Full product feed (gzip JSON) |
| **Search products** | `GET /api/v1/products` | Paginated search with filters |
| **Create cart** | `POST /api/v1/carts` | Start a new shopping cart |
| **Add/remove items** | `POST /api/v1/carts/{cart_id}/lines` | Modify cart contents |
| **Apply discount** | `POST /api/v1/carts/{cart_id}/promotions` | Apply promo codes |
| **Checkout with SPT** | `POST /api/v1/checkout/acp` | Complete purchase with Shared Payment Token |

## Checkout flow

The ACP checkout flow uses Stripe Shared Payment Tokens (SPT) for secure, agent-mediated payments:

1. **Agent browses feed** — discovers products via `/api/v1/feed`
2. **Agent creates cart** — calls `POST /api/v1/carts` and adds items
3. **User authorizes payment** — the agent's platform (e.g. ChatGPT) collects payment consent and issues a Shared Payment Token (SPT) via Stripe
4. **Agent completes checkout** — sends SPT to `POST /api/v1/checkout/acp`
5. **Order created** — Reponse creates a PaymentIntent, captures payment, creates the order, and sends confirmation emails
6. **Agent confirms** — the response includes `order_id` and `order_number` for the agent to relay to the shopper

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cart_id": "cart_xyz789",
    "payment_token": "spt_1234567890abcdef",
    "shipping_address": {
      "name": "John Doe",
      "line1": "123 Rue de Rivoli",
      "city": "Paris",
      "postal_code": "75001",
      "country": "FR"
    },
    "customer_email": "john@example.com",
    "idempotency_key": "unique-request-id-abc"
  }' \
  https://your-domain.com/api/v1/checkout/acp
```

### Successful response

```json
{
  "checkout_session_id": "pi_3abc123def456",
  "status": "completed",
  "payment_intent_id": "pi_3abc123def456",
  "order_id": "uuid-of-created-order",
  "order_number": "ACP-f456",
  "order_summary": {
    "currency": "EUR",
    "subtotal": 59.98,
    "discount": 0,
    "shipping": 4.90,
    "total": 64.88,
    "line_items": [
      {
        "product_title": "Premium T-Shirt",
        "variant_id": "var_001",
        "quantity": 2,
        "unit_price": 29.99
      }
    ],
    "applied_discount_codes": []
  }
}
```

### Checkout status values

| Status | Meaning |
|---|---|
| `completed` | Payment succeeded. Order created and confirmation email sent. |
| `requires_action` | 3D Secure or additional auth needed. Use `client_secret` to complete. |
| `processing` | Payment is being processed asynchronously. |
| `failed` | Payment failed. Check error details. |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| ACP feed returns empty | No published products | Publish products in the dashboard |
| `401 Unauthorized` | Invalid API key | Check your API key is valid and hasn't been rotated |
| `400 Stripe not configured` | Missing Stripe keys | Ensure Stripe is connected in workspace settings |
| `400 No market configuration` | No market defined | Create at least one market with `is_domestic: true` |
| `402 Payment declined` | SPT rejected | Card issue on user's side — agent must request a new SPT |
| `400 Invalid payment token` | SPT expired or malformed | Agent must request a new SPT |
| Agent gets `404` on cart | Cart not found or wrong workspace | Verify cart_id belongs to the authenticated workspace |
