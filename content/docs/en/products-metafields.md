---
title: "Products — Metafields"
description: "Product metafields and extended attributes."
---

## Overview

Metafields store **extended, structured attributes** on products beyond the core fields — specifications, care instructions, Google product category, ingredients, and more. They are synced from Shopify and surfaced for SEO (JSON-LD structured data) and AI grounding (giving engines more facts to answer shopper questions accurately).

## Authentication

All metafield endpoints require a valid API key with `read:products` (for GET) or `write:products` (for PATCH) scopes.

```
Authorization: Bearer rp_live_xxxxxxxxxxxx
```

## GET metafields

Retrieve all metafields for a product.

### Request

```
GET /v1/products/:productId/metafields
```

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `productId` | path | `string` | Yes | Product ID |
| `namespace` | query | `string` | No | Filter by namespace (e.g. `custom`) |
| `key` | query | `string` | No | Filter by key (e.g. `care_instructions`) |

### Response

```json
{
  "data": [
    {
      "id": "mf_abc123",
      "namespace": "custom",
      "key": "care_instructions",
      "value": "Machine wash cold, tumble dry low",
      "type": "single_line_text",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-03-20T14:00:00Z"
    },
    {
      "id": "mf_def456",
      "namespace": "custom",
      "key": "material_composition",
      "value": "{\"cotton\": 80, \"polyester\": 20}",
      "type": "json",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

### Code examples

**cURL:**

```bash
curl -X GET "https://api.reponse.ai/v1/products/prod_xxx/metafields?namespace=custom" \
  -H "Authorization: Bearer rp_live_xxxxxxxxxxxx"
```

**TypeScript (SDK):**

```typescript
const { data: metafields } = await reponse.catalog.getMetafields({
  path: { productId: 'prod_xxx' },
  query: { namespace: 'custom' },
});

for (const mf of metafields) {
  console.log(`${mf.namespace}.${mf.key} = ${mf.value}`);
}
```

## PATCH metafields

Create or update metafields on a product. If a metafield with the same `namespace` + `key` already exists, it is updated; otherwise a new one is created (upsert behavior).

### Request

```
PATCH /v1/products/:productId/metafields
```

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `productId` | path | `string` | Yes | Product ID |

**Body:**

```json
{
  "metafields": [
    {
      "namespace": "custom",
      "key": "care_instructions",
      "value": "Hand wash only, do not bleach",
      "type": "single_line_text"
    },
    {
      "namespace": "custom",
      "key": "weight_grams",
      "value": "250",
      "type": "number_integer"
    }
  ]
}
```

### Response

```json
{
  "data": [
    {
      "id": "mf_abc123",
      "namespace": "custom",
      "key": "care_instructions",
      "value": "Hand wash only, do not bleach",
      "type": "single_line_text",
      "updatedAt": "2026-05-27T10:00:00Z"
    },
    {
      "id": "mf_ghi789",
      "namespace": "custom",
      "key": "weight_grams",
      "value": "250",
      "type": "number_integer",
      "createdAt": "2026-05-27T10:00:00Z",
      "updatedAt": "2026-05-27T10:00:00Z"
    }
  ]
}
```

### Code examples

**cURL:**

```bash
curl -X PATCH "https://api.reponse.ai/v1/products/prod_xxx/metafields" \
  -H "Authorization: Bearer rp_live_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "metafields": [
      {
        "namespace": "custom",
        "key": "care_instructions",
        "value": "Hand wash only",
        "type": "single_line_text"
      }
    ]
  }'
```

**TypeScript (SDK):**

```typescript
await reponse.catalog.updateMetafields({
  path: { productId: 'prod_xxx' },
  body: {
    metafields: [
      {
        namespace: 'custom',
        key: 'care_instructions',
        value: 'Hand wash only',
        type: 'single_line_text',
      },
    ],
  },
});
```

## Namespace / key pattern

Metafields follow a `namespace.key` naming convention:

| Namespace | Purpose | Examples |
|---|---|---|
| `custom` | Merchant-defined fields | `custom.care_instructions`, `custom.material` |
| `shopify` | Synced from Shopify metafields | `shopify.google_product_category` |
| `specs` | Technical specifications | `specs.battery_capacity`, `specs.screen_size` |
| `compliance` | Regulatory compliance | `compliance.oeko_tex`, `compliance.origin_country` |
| `dimensions` | Physical dimensions | `dimensions.length`, `dimensions.width` |
| `seo` | SEO-specific metadata | `seo.title_override`, `seo.description_override` |
| `ai` | AI grounding data | `ai.product_facts`, `ai.usage_scenarios` |

**Naming rules:**

- Namespaces: lowercase, alphanumeric with underscores, max 64 characters
- Keys: lowercase, alphanumeric with underscores, max 128 characters
- Combined: `namespace.key` must be unique per product
- Maximum 50 metafields per product

## Value types

| Type | Description | Example value |
|---|---|---|
| `single_line_text` | Plain text, single line | `"Machine wash cold"` |
| `multi_line_text` | Plain text, multiple lines | `"Line 1\nLine 2"` |
| `number_integer` | Integer number | `"250"` |
| `number_decimal` | Decimal number | `"19.99"` |
| `boolean` | Boolean value | `"true"` |
| `json` | Arbitrary JSON | `"{\"cotton\": 80}"` |
| `date` | ISO 8601 date | `"2026-06-01"` |
| `url` | Valid URL | `"https://example.com"` |
| `color` | Hex color code | `"#FF5733"` |
| `dimension` | Value with unit | `"{\"value\": 30, \"unit\": \"cm\"}"` |
| `weight` | Value with unit | `"{\"value\": 250, \"unit\": \"g\"}"` |

> **Note:** All values are stored as strings. The `type` field determines how the value is validated, displayed, and used in structured data.

## How metafields are used

| Consumer | Usage |
|---|---|
| **JSON-LD structured data** | Metafields like `google_product_category`, `material`, `weight` are mapped to Schema.org properties |
| **AI engines** | Product metafields are injected into the system prompt as `[PRODUCT_ATTRIBUTES]` for accurate answers |
| **Storefront display** | Metafields can be rendered in product detail templates via the headless API |
| **Search & filters** | Numeric and enum metafields can power faceted search |
| **Shopify sync** | Metafields from Shopify are automatically synced with `namespace: "shopify"` |

## Metafields in product responses

Metafields are **included by default** in the product detail endpoint (`GET /v1/products/:id`).

For the product list endpoint (`GET /v1/products`), metafields are **excluded by default** to keep responses lightweight. Add `?include=metafields` to include them:

```
GET /v1/products?include=metafields
```

## Error codes

| Code | Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | Key lacks `write:products` scope |
| `PRODUCT_NOT_FOUND` | 404 | Product ID does not exist |
| `INVALID_NAMESPACE` | 422 | Namespace contains invalid characters |
| `INVALID_KEY` | 422 | Key contains invalid characters or exceeds max length |
| `INVALID_VALUE_TYPE` | 422 | Value does not match the declared type |
| `DUPLICATE_METAFIELD` | 409 | Multiple metafields with same namespace+key in a single request |
| `METAFIELD_LIMIT` | 422 | Product already has 50 metafields |
| `RATE_LIMITED` | 429 | Too many requests |
