---
title: "Events Reference"
description: "Reference of webhook event types."
---

## Overview

Reponse processes webhook events across commerce, billing, review, logistics, and support domains. Each event is delivered as an HTTP `POST` request with a JSON body. Subscribe to the ones relevant to your integration.

## Event types

### Shopify events

Endpoint: `POST /api/shopify/webhooks/{workspaceId}`

| Topic | Description | Reponse action |
|---|---|---|
| `orders/create` | New order placed | Upsert order record (financial + fulfillment status) |
| `orders/updated` | Order status changed | Update `financial_status` and `fulfillment_status` |
| `fulfillments/create` | Shipment created | Insert fulfillment with tracking number, company, URL |
| `fulfillments/update` | Shipment status changed | Update fulfillment record and order fulfillment status |
| `refunds/create` | Refund issued | Set order `financial_status` to `refunded` |
| `products/create` | New product in Shopify | Upsert product, variants, images, tags |
| `products/update` | Product edited | Upsert product, variants, images, tags |
| `products/delete` | Product removed | Soft-delete: set `status: archived`, `is_active_for_ai: false` |
| `customers/create` | New customer | Upsert contact with address, phone, consent |
| `customers/update` | Customer edited | Update contact record |
| `inventory_levels/update` | Stock level changed | Update variant `inventory_quantity` and `available` flag |
| `markets/create` | New market added | Upsert market with currency, locales, countries |
| `markets/update` | Market settings changed | Upsert market record |
| `markets/delete` | Market removed | Soft-delete: `is_active: false` |
| `app/uninstalled` | Merchant uninstalled app | Clear Shopify tokens from workspace |

### Stripe events

Endpoint: `POST /api/stripe/webhook/{workspaceId}`

| Event type | Description | Reponse action |
|---|---|---|
| `checkout.session.completed` | Payment succeeded | Create order, line items, invoice; trigger confirmation email |
| `invoice.paid` | Subscription renewal paid | Create renewal order (skips first cycle) |
| `charge.refunded` | Charge refunded | Update order to `refunded` or `partially_refunded` |
| `customer.subscription.created` | Subscription started | Upsert subscription mirror |
| `customer.subscription.updated` | Subscription changed | Update status, period, cancellation flag |
| `customer.subscription.deleted` | Subscription ended | Update subscription status |

### Paddle events

Endpoint: `POST /api/webhooks/paddle`

| Event type | Description | Reponse action |
|---|---|---|
| `subscription.created` | New subscription | Update workspace billing fields |
| `subscription.updated` | Plan or status changed | Update billing, optionally reset usage counter |
| `subscription.activated` | Subscription activated | Same as `updated` |
| `subscription.canceled` | Subscription cancelled | Set `subscription_status: canceled` |
| `subscription.past_due` | Payment past due | Set `subscription_status: past_due` |

### Review events

| Provider | Endpoint | Event | Reponse action |
|---|---|---|---|
| Stamped | `POST /api/webhooks/stamped` | Review created/updated | Upsert into `reviews` table (scope: `product`) |
| Trustpilot | `POST /api/webhooks/trustpilot` | Review created/updated | Upsert into `reviews` table (scope: `brand`) |

### Logistics events

Endpoint: `POST /api/webhooks/logistics?provider={name}&workspaceId={id}`

| Provider | Event | Description |
|---|---|---|
| Sendcloud | `parcel_status_changed` | Shipment status update (in transit, delivered, exception) |
| ShipStation | *(planned)* | Order shipped, delivered |
| Easyship | *(planned)* | Shipment tracking update |

### Email inbound

Endpoint: `POST /api/webhooks/email-inbound`

| Event | Description | Reponse action |
|---|---|---|
| Inbound email | Customer reply received | Create or append to support ticket |

### Shopify fulfillments (review requests)

The Reponse Shopify app subscribes `fulfillments/create` and `fulfillments/update` at `POST /api/shopify/webhooks/app`, one endpoint for every store, which finds the workspace from the `X-Shopify-Shop-Domain` header. A store still connected through a per-workspace webhook sends the same topics to `POST /api/shopify/webhooks/{workspaceId}` (envelope below). Both endpoints run the same handler. There is no separate review endpoint.

| Event | Description | Reponse action |
|---|---|---|
| Fulfillment succeeded | A Shopify fulfillment reaches `success` (the goods have shipped) | Mark the order fulfilled and open one `review_request` per order for post-purchase review collection |

## Common payload envelope

All webhook handlers parse the raw body as JSON. The payload structure is provider-specific, but Reponse normalises each event into internal database records.

```
POST /api/shopify/webhooks/{workspaceId}
Content-Type: application/json
X-Shopify-Topic: products/update
X-Shopify-Hmac-Sha256: <base64-signature>
X-Shopify-Webhook-Id: <unique-id>
X-Shopify-Shop-Domain: my-store.myshopify.com

{ ...provider-specific JSON payload... }
```

## Delivery and retries

Webhooks are delivered as HTTP `POST` requests with a JSON body. Respond with `2xx` to acknowledge receipt. Failed deliveries are retried with exponential backoff by the provider.

| Requirement | Value |
|---|---|
| Method | `POST` |
| Content-Type | `application/json` |
| Expected response | `2xx` within 5 seconds |
| Retry on failure | Yes (provider-specific backoff) |

Make your handler **idempotent** — providers may deliver the same event more than once. See [Webhooks Overview](doc:webhooks-overview) for details on idempotency patterns.

## Next steps

- [Webhooks Overview](doc:webhooks-overview) — registration, security, best practices
- [Shopify Webhooks](doc:webhooks-shopify) — full payload examples for product/order sync
- [Stripe Webhooks](doc:webhooks-stripe) — payment and subscription payloads
