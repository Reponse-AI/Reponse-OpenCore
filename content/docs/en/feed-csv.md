---
title: "Product Feed — CSV"
description: "Get the product feed as CSV."
---

## Overview

Returns the active product catalog as a CSV file, compatible with **Google Merchant Center**, **Perplexity Shopping**, **Meta Catalog**, and other feed-based channels. The CSV follows the [Google product data specification](https://support.google.com/merchants/answer/7052112).

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/api/v1/feed/csv`

### Query parameters

This endpoint does not accept query parameters. It returns all active products (up to 5,000) for the authenticated workspace.

### Headers

| Header | Value | Required |
|---|---|---|
| `Authorization` | `Bearer <api_key>` | ✅ |
| `Accept` | `text/csv` | Optional |

## Response

### Success — `200 OK`

**Content-Type:** `text/csv; charset=utf-8`

**Headers:**

| Header | Description |
|---|---|
| `Content-Disposition` | `attachment; filename="product-feed.csv"` |
| `Cache-Control` | `public, max-age=3600, s-maxage=3600` (1 hour) |
| `X-Product-Count` | Number of products in the feed |

### CSV columns

| Column | Description | Example |
|---|---|---|
| `id` | Unique product or variant ID (`{product_id}_{variant_id}`) | `prod_abc_var_123` |
| `title` | Product title, with variant suffix if applicable | `Classic Logo T-Shirt - S / Black` |
| `description` | Plain-text description (HTML stripped, max 5,000 chars) | `Premium cotton t-shirt...` |
| `link` | Product page URL | `https://my-store.reponse.ai/products/classic-logo-t-shirt` |
| `image_link` | Primary product image URL | `https://cdn.shopify.com/...` |
| `additional_image_link` | Additional images (comma-separated, up to 10) | `https://cdn...1.jpg,https://cdn...2.jpg` |
| `availability` | Stock status | `in_stock` or `out_of_stock` |
| `price` | Display price with currency | `39.99 EUR` |
| `sale_price` | Sale price with currency (empty if no sale) | `29.99 EUR` |
| `brand` | Workspace brand name | `My Brand` |
| `condition` | Product condition | Always `new` |
| `google_product_category` | Google product taxonomy category | `Apparel & Accessories > Clothing > Shirts` |
| `item_group_id` | Parent product ID (for variant grouping) | `prod_abc123` |
| `gtin` | SKU / barcode | `LOGO-TEE-S-BLK` |

### Example output

```csv
id,title,description,link,image_link,additional_image_link,availability,price,sale_price,brand,condition,google_product_category,item_group_id,gtin
prod_abc_var_1,"Classic Logo T-Shirt - S / Black","Premium cotton t-shirt with embroidered logo.",https://my-store.reponse.ai/products/classic-logo-t-shirt,https://cdn.shopify.com/tee-black.jpg,,in_stock,"39.99 EUR","29.99 EUR","My Brand",new,"Apparel & Accessories > Clothing > Shirts",prod_abc,LOGO-TEE-S-BLK
prod_abc_var_2,"Classic Logo T-Shirt - M / White","Premium cotton t-shirt with embroidered logo.",https://my-store.reponse.ai/products/classic-logo-t-shirt,https://cdn.shopify.com/tee-white.jpg,,in_stock,"39.99 EUR","29.99 EUR","My Brand",new,"Apparel & Accessories > Clothing > Shirts",prod_abc,LOGO-TEE-M-WHT
```

### Error responses

| Status | Body | Cause |
|---|---|---|
| `401` | `{ "error": "Unauthorized" }` | Missing or invalid API key |
| `500` | `{ "error": "Failed to fetch product feed" }` | Database error |

## Pricing logic

The feed uses a "compare at" pricing model:

- If a variant has a `compare_at_price` **greater than** its `price`, the feed treats the variant as on sale:
  - `price` column = `compare_at_price` (the "was" price)
  - `sale_price` column = `price` (the current/sale price)
- If no `compare_at_price` or it's not greater, `price` = variant price and `sale_price` is empty.

## Variant handling

- **Single variant products** (or products with only a "Default" variant) output as a single row.
- **Multi-variant products** output one row per variant, with the `item_group_id` set to the parent product ID for variant grouping in Google Merchant Center.
- Variant titles are appended to the product title: `"Product Name - Variant Title"`.

## SDK example

```typescript
const res = await fetch(
  `${baseUrl}/api/v1/feed/csv`,
  {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }
);

const csv = await res.text();
// Parse CSV or save to file for upload to Google Merchant Center
```

## Caching

The response is cached for **1 hour** (`max-age=3600`). For real-time inventory accuracy, consider using the [Product Feed — JSON](doc:feed-json) endpoint which also supports Gzip compression for faster transfer.

## Related

- [Product Feed — JSON](doc:feed-json) — ACP-compliant structured JSON feed
- [Products — List](doc:products-list) — paginated product list with full filtering
