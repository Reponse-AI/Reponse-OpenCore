---
title: Product Feed (XML)
description: XML product feeds for Google Shopping, Meta, Pinterest, Snapchat, and TikTok
---

# Product Feed (XML)

Reponse generates platform-specific XML product feeds for shopping integrations. Each feed is an RSS 2.0 document using the `g:` (Google Base) namespace, compatible with all major shopping platforms.

## Endpoints

| Platform | URL | Activation policy |
|---|---|---|
| Google Merchant Center | `/api/seo/merchant-center/{workspaceId}/feed.xml` | `merchantCenter` |
| Meta / Facebook | `/api/seo/facebook/{workspaceId}/feed.xml` | `facebookCatalog` |
| Pinterest | `/api/seo/pinterest/{workspaceId}/feed.xml` | `pinterestCatalog` |
| Snapchat | `/api/seo/snapchat/{workspaceId}/feed.xml` | `snapchatCatalog` |
| TikTok | `/api/seo/tiktok/{workspaceId}/feed.xml` | `tiktokCatalog` |

## Activation

Enable each feed from **Settings → Channels** in the dashboard. Toggle the corresponding platform switch to generate the feed URL.

## Fields

All feeds include the following product fields per variant:

| Field | Description |
|---|---|
| `g:id` | Unique variant identifier (`productId_variantId`) |
| `g:title` | Product title + variant title |
| `g:description` | HTML-stripped product description (platform-specific max length) |
| `g:link` | Storefront product URL |
| `g:image_link` | Featured product image |
| `g:additional_image_link` | Up to 10–20 additional images (platform-dependent) |
| `g:availability` | Stock status (platform-specific format) |
| `g:price` | Display price with currency code |
| `g:sale_price` | Sale price (if `compare_at_price > price`) |
| `g:brand` | Product vendor (fallback: workspace name) |
| `g:condition` | Always `new` |
| `g:gtin` | Product barcode |
| `g:mpn` | Product SKU (when no barcode) |
| `g:identifier_exists` | `true`/`false` (Google only) |
| `g:google_product_category` | Google taxonomy path |
| `g:product_type` | Merchant category |
| `g:item_group_id` | Product ID (groups variants) |
| `g:color` | Extracted from variant options |
| `g:size` | Extracted from variant options |
| `g:shipping_weight` | Weight with unit |
| `g:custom_label_0–4` | Campaign segmentation labels |

## Custom Labels

Auto-derived labels for advertising campaign segmentation:

| Label | Content | Use case |
|---|---|---|
| `custom_label_0` | Product type / category | Category-based campaigns |
| `custom_label_1` | `On Sale` (if discounted) | Sale campaigns |
| `custom_label_2` | Price bucket (`0-25`, `25-50`, `50-100`, `100-200`, `200+`) | Bid by price range |
| `custom_label_3` | Stock level (`In Stock` / `Low Stock` / `Out of Stock`) | Priority bidding |
| `custom_label_4` | Brand / vendor | Brand campaigns |

Custom labels are emitted for Google, Meta, Pinterest, and Snapchat feeds.

## Platform Differences

| Platform | Availability format | Description max | Additional images |
|---|---|---|---|
| Google | `in_stock` / `out_of_stock` | 5,000 chars | 10 |
| Meta | `in stock` / `out of stock` | 9,999 chars | 20 |
| Pinterest | `in stock` / `out of stock` | 500 chars | 10 |
| Snapchat | `In stock` / `Out of stock` | 5,000 chars | 10 |
| TikTok | `in_stock` / `out_of_stock` | 5,000 chars | 10 |

## Caching

All feeds are cached for **1 hour** (`Cache-Control: public, max-age=3600`).

## Discovery

Feed URLs are discoverable via the [UCP manifest](/.well-known/ucp) at `/.well-known/ucp`.
