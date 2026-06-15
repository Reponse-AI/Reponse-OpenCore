---
title: "Shopify Sync"
description: "Sync your Shopify catalog into Reponse."
---

## Overview

Reponse syncs products, variants, collections, and inventory from your Shopify store. The initial sync imports your full catalog, and webhooks keep everything up to date in real time. Product handles are preserved from Shopify and collections are upserted on `workspace_id, handle`.

## Prerequisites

- A Shopify store with the Reponse app installed, or a custom Shopify app with the required scopes
- A Reponse workspace

## Step 1 — Connect Your Store

1. Go to **Dashboard → Settings → Integrations → Shopify**.
2. Enter your Shopify store domain (e.g. `your-store.myshopify.com`).
3. Click **Connect** — you will be redirected to Shopify to authorize the app.
4. After authorization, Reponse stores your access token securely (encrypted at rest).

## Step 2 — Run the Initial Sync

Once connected, click **Sync Now** in the dashboard. The initial sync fetches all products, variants, images, and collections via the Shopify Admin GraphQL API.

```bash
# You can also trigger a sync via the API
curl -X POST "https://api.reponse.ai/v1/shopify/sync" \
  -H "Authorization: Bearer rp_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{ "workspaceId": "ws_01H..." }'
```

## Step 3 — Configure Webhooks

Reponse automatically registers webhooks with Shopify when you connect your store. The following events are listened to:

| Webhook Topic | Action in Reponse |
| --- | --- |
| `products/create` | Creates product and variants. |
| `products/update` | Updates product data, images, and variants. |
| `products/delete` | Soft-deletes the product. |
| `collections/create` | Creates the collection. |
| `collections/update` | Updates collection metadata. |
| `inventory_levels/update` | Updates stock quantities. |

Webhooks are verified using HMAC-SHA256 with your `SHOPIFY_WEBHOOK_SECRET`. Set this environment variable on your server:

```bash
SHOPIFY_WEBHOOK_SECRET=your_shopify_webhook_secret
```

## What Syncs

| Data | Fields |
| --- | --- |
| **Products** | Title, description, handle, status, images, tags, vendor, product type |
| **Variants** | SKU, barcode, price, compare-at price, inventory quantity, option values |
| **Collections** | Title, handle, sort order, image |
| **Inventory** | Stock levels per variant per location |

## Data Flow

```
Shopify Store
  ↓ (webhook or manual sync)
Reponse API  →  /api/shopify/webhooks/[workspaceId]
  ↓
Supabase (products, product_variants, collections tables)
  ↓
AI Engine (RAG, product facts, knowledge sources)
```

## Configuration

| Environment Variable | Required | Description |
| --- | --- | --- |
| `SHOPIFY_WEBHOOK_SECRET` | Yes | HMAC secret for webhook verification. |

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Products not appearing after sync | Check that the products are **active** in Shopify (draft products are skipped). |
| Webhook events not arriving | Verify the webhook URL is reachable and HMAC secret matches. |
| Duplicate products | Products are upserted on `workspace_id, shopify_product_id` — duplicates indicate a workspace mismatch. |
| Variants missing | Ensure variants have a SKU or barcode set in Shopify. |
| Stale inventory data | Confirm `inventory_levels/update` webhook is registered and not failing. |
