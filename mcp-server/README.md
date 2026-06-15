# @reponseai/mcp

> Headless Commerce MCP Server — Connect Claude, Cursor, or Windsurf to your Reponse store in 30 seconds.

[![npm version](https://img.shields.io/npm/v/@reponseai/mcp.svg)](https://www.npmjs.com/package/@reponseai/mcp)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## What is this?

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI agents full access to a Reponse Commerce backend — catalog browsing, cart management, checkout, order support, tickets, discounts, and more.

**35 tools** covering the complete e-commerce lifecycle:

| Category | Tools |
|---|---|
| **Catalog** | `list_products`, `get_product`, `list_collections` |
| **Cart** | `create_cart`, `get_cart`, `add_to_cart`, `update_cart_item`, `remove_cart_item` |
| **Checkout** | `create_checkout` |
| **Orders** | `list_orders`, `fulfill_order`, `refund_order`, `update_shipping_address`, `resend_order_confirmation`, `resend_invoice`, `cancel_order` |
| **Inventory** | `get_inventory`, `update_inventory` |
| **Loyalty & Referrals** | `get_loyalty_balance`, `redeem_loyalty`, `get_referral_info` |
| **Gift Cards** | `list_gift_cards`, `create_gift_card`, `redeem_gift_card` |
| **Subscriptions** | `update_subscription` |
| **Tickets** | `list_tickets`, `get_ticket`, `create_ticket`, `reply_to_ticket` |
| **Discounts** | `list_discount_codes`, `validate_discount_code`, `create_discount_code` |
| **Approvals** | `execute_approval`, `reject_approval` |
| **Utilities** | `geocode_address` |

## Quick Start

### 1. Get an API Key

Sign up at [app.reponse.ai](https://app.reponse.ai) and go to **Settings → API Keys** to generate a key (`sk_live_...`).

### 2. Configure your AI client

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "reponse": {
      "command": "npx",
      "args": ["-y", "@reponseai/mcp"],
      "env": {
        "REPONSE_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

#### Cursor

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "reponse": {
      "command": "npx",
      "args": ["-y", "@reponseai/mcp"],
      "env": {
        "REPONSE_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

#### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "reponse": {
      "command": "npx",
      "args": ["-y", "@reponseai/mcp"],
      "env": {
        "REPONSE_API_KEY": "sk_live_your_key_here"
      }
    }
  }
}
```

### 3. Start chatting

Ask your AI assistant:
- *"Show me all products in the store"*
- *"Create a cart with 2x the blue hoodie"*
- *"Generate a checkout link for cart xyz"*
- *"Cancel order #1234 — customer changed their mind"*
- *"List all open support tickets"*
- *"Fulfill order xyz with tracking number 123"*
- *"Check loyalty balance for contact abc"*

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REPONSE_API_KEY` | ✅ | Your Reponse API key (`sk_live_...` or `sk_test_...`) |
| `REPONSE_API_URL` | ❌ | API base URL (default: `https://api.reponse.ai`) |

## Tools Reference

### Catalog

- **`list_products`** — List products with optional search query and limit
- **`get_product`** — Get a single product by UUID with variants, images, and pricing
- **`list_collections`** — List product collections/categories

### Cart

- **`create_cart`** — Create a new cart, optionally with initial items
- **`get_cart`** — Retrieve cart contents and totals
- **`add_to_cart`** — Add items to an existing cart
- **`update_cart_item`** — Update quantity of a cart line item (set to 0 to remove)
- **`remove_cart_item`** — Remove a line item from a cart

### Checkout

- **`create_checkout`** — Generate a Stripe Checkout payment URL for a cart

### Orders

- **`list_orders`** — List orders with optional status filter and limit
- **`fulfill_order`** — Mark an order as fulfilled with optional tracking info
- **`refund_order`** — Refund an order fully or partially
- **`update_shipping_address`** — Update shipping address (requires identity verification, order must be unfulfilled)
- **`resend_order_confirmation`** — Resend confirmation email (rate limited: 3/hour)
- **`resend_invoice`** — Resend invoice PDF (rate limited: 3/hour)
- **`cancel_order`** — Cancel order with Stripe refund (rate limited: 1/hour, 3/30 days)

### Inventory

- **`get_inventory`** — Get inventory levels by variant ID, SKU, or product ID
- **`update_inventory`** — Set or adjust inventory quantity for a variant

### Loyalty & Referrals

- **`get_loyalty_balance`** — Get loyalty points balance for a contact
- **`redeem_loyalty`** — Redeem loyalty points, optionally against an order
- **`get_referral_info`** — Get referral program info (link, stats) for a contact

### Gift Cards

- **`list_gift_cards`** — List gift cards in the workspace
- **`create_gift_card`** — Create a new gift card with an initial value
- **`redeem_gift_card`** — Redeem a gift card by applying an amount against it

### Subscriptions

- **`update_subscription`** — Delay next shipment or trigger immediate shipment

### Tickets

- **`list_tickets`** — List support tickets with filters (status, category, email)
- **`get_ticket`** — Get ticket details with full conversation history
- **`create_ticket`** — Open a new support ticket for a customer
- **`reply_to_ticket`** — Send a reply to an existing ticket

### Discounts

- **`list_discount_codes`** — List discount codes with active/type filters
- **`validate_discount_code`** — Validate a code and calculate potential savings
- **`create_discount_code`** — Create a new discount code (percentage, fixed, free shipping, BXGY)

### Approvals

- **`execute_approval`** — Execute (approve) a pending approval request
- **`reject_approval`** — Reject a pending approval request with an optional reason

### Utilities

- **`geocode_address`** — Geocode a free-form address into coordinates and structured components

## What is Reponse?

[Reponse](https://reponse.ai) is an AI-native headless commerce platform. It provides a complete e-commerce backend (catalog, cart, checkout, orders, CRM, support) with a conversational AI sales engine built in.

This MCP server connects any AI agent to a Reponse store via the public REST API (`/v1/*`).

## License

MIT
