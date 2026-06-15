---
title: "Theme — Get"
description: "Get the workspace storefront theme settings."
---

## Overview

Returns the theme configuration for the authenticated workspace as a set of CSS custom properties. These values are used to style storefronts, embedded chat widgets, checkout pages, and any other Reponse-powered UI consistently with the merchant's brand.

## Authentication

This endpoint requires a Bearer token. Include your workspace API key in the `Authorization` header.

```
Authorization: Bearer <your_api_key>
```

## Request

**GET** `/api/v1/theme`

### Headers

| Header | Value | Required |
|---|---|---|
| `Authorization` | `Bearer <api_key>` | ✅ |

### Query parameters

None.

## Response

### Success — `200 OK`

**Content-Type:** `application/json`

**Cache headers:** `Cache-Control: public, max-age=300, stale-while-revalidate=600` (5 min fresh, 10 min stale-while-revalidate)

### Response schema

The response is a flat JSON object where each key is a CSS custom property name:

```json
{
  "--rp-color-primary": "#0A0A0A",
  "--rp-color-primary-hover": "#333333",
  "--rp-color-background": "#ffffff",
  "--rp-color-surface": "#f9fafb",
  "--rp-color-border": "#e5e7eb",
  "--rp-color-text": "#111827",
  "--rp-color-text-secondary": "#6b7280",
  "--rp-color-success": "#22c55e",
  "--rp-color-error": "#ef4444",
  "--rp-radius": "12px",
  "--rp-font-family": "Geist, system-ui, -apple-system, sans-serif",
  "--rp-brand-name": "My Store",
  "--rp-brand-logo": "https://cdn.reponse.ai/brands/my-store/logo.svg"
}
```

### Property reference

| Property | Type | Default | Source | Description |
|---|---|---|---|---|
| `--rp-color-primary` | CSS color | `#000000` | `brand_dna.primary_color` | Primary brand colour (buttons, links, accents) |
| `--rp-color-primary-hover` | CSS color | `#333333` | `brand_dna.primary_hover` | Hover state of primary colour |
| `--rp-color-background` | CSS color | `#ffffff` | `brand_dna.background_color` | Page background colour |
| `--rp-color-surface` | CSS color | `#f9fafb` | `brand_dna.surface_color` | Card/panel surface colour |
| `--rp-color-border` | CSS color | `#e5e7eb` | Constant | Border colour |
| `--rp-color-text` | CSS color | `#111827` | Constant | Primary text colour |
| `--rp-color-text-secondary` | CSS color | `#6b7280` | Constant | Secondary/muted text colour |
| `--rp-color-success` | CSS color | `#22c55e` | Constant | Success state colour |
| `--rp-color-error` | CSS color | `#ef4444` | Constant | Error state colour |
| `--rp-radius` | CSS length | `12px` | `brand_dna.border_radius` | Default border radius |
| `--rp-font-family` | CSS font-family | `system-ui, -apple-system, sans-serif` | `brand_dna.font_family` | Typography font stack |
| `--rp-brand-name` | string | `""` | `marketing_policy.brand_persona.name` | Brand display name |
| `--rp-brand-logo` | URL | `""` | `marketing_policy.brand_persona.avatar_url` | Brand logo URL |

### Error responses

| Status | Body | Cause |
|---|---|---|
| `401` | `{ "error": "Unauthorized" }` | Missing or invalid API key |
| `404` | `{ "error": "Workspace not found" }` | Workspace ID from token doesn't match a record |

## Data sources

Theme values are derived from two workspace fields:

| Workspace field | Properties sourced |
|---|---|
| `brand_dna` (JSONB) | `primary_color`, `primary_hover`, `background_color`, `surface_color`, `border_radius`, `font_family` |
| `marketing_policy` (JSONB) | `brand_persona.name`, `brand_persona.avatar_url` |

Constant values (`--rp-color-border`, `--rp-color-text`, etc.) are not configurable via the API — they follow a neutral palette designed to work with any primary colour.

## Usage example

### Applying theme to a storefront

```typescript
// Fetch theme
const { data } = await reponse.theme.get();

// Apply CSS custom properties to the document root
Object.entries(data).forEach(([property, value]) => {
  document.documentElement.style.setProperty(property, value);
});
```

### Using in CSS

```css
.rp-button {
  background-color: var(--rp-color-primary);
  color: var(--rp-color-background);
  border-radius: var(--rp-radius);
  font-family: var(--rp-font-family);
  transition: background-color 150ms ease;
}

.rp-button:hover {
  background-color: var(--rp-color-primary-hover);
}

.rp-card {
  background: var(--rp-color-surface);
  border: 1px solid var(--rp-color-border);
  border-radius: var(--rp-radius);
}
```

### Using with the SDK

```typescript
const { data } = await reponse.theme.get();

console.log(data["--rp-color-primary"]); // "#0A0A0A"
console.log(data["--rp-brand-name"]);    // "My Store"
console.log(data["--rp-brand-logo"]);    // "https://cdn.reponse.ai/..."
```

## Caching

The response is cached with:

- **`max-age=300`** — the response is considered fresh for 5 minutes.
- **`stale-while-revalidate=600`** — after 5 minutes, stale data can be served for up to 10 more minutes while revalidating in the background.

This means theme changes may take up to 5 minutes to propagate to all clients.

## Related

- [Custom Domains](doc:custom-domains) — configure a custom domain for your storefront
- [Chat Widget](doc:chat-widget) — embed the AI chat widget with automatic theme application
