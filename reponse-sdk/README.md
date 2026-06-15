# @reponseai/sdk

Official TypeScript SDK for the [Reponse](https://reponse.ai) Headless Commerce API.

## Install

```bash
npm install @reponseai/sdk
# or
pnpm add @reponseai/sdk
# or
yarn add @reponseai/sdk
```

## Quick Start

```typescript
import { Reponse } from '@reponseai/sdk';

const reponse = new Reponse({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-store.reponse.ai',
});
```

## Catalog

```typescript
// List all products
const { data } = await reponse.catalog.listProducts();

// Search products
const { data } = await reponse.catalog.listProducts({
  query: { query: 't-shirt', limit: 10 }
});

// Get by slug
const { data } = await reponse.catalog.listProducts({
  query: { slug: 't-shirt-logo' }
});

// Get single product with variants
const { data: product } = await reponse.catalog.getProduct({
  path: { id: 'product-uuid' }
});

// List collections
const { data } = await reponse.catalog.listCollections();
```

## Cart & Checkout

```typescript
// Create a cart
const { data: cart } = await reponse.cart.create({
  body: {
    items: [{ product_id: 'uuid', variant_id: 'uuid', quantity: 1 }],
    currency: 'EUR'
  }
});

// Get cart (includes automatic discount calculation)
const { data: cart } = await reponse.cart.get({
  path: { id: cart.id }
});

// Add items
await reponse.cart.addItem({
  path: { id: cart.id },
  body: { items: [{ product_id: 'uuid', variant_id: 'uuid', quantity: 2 }] }
});

// Update quantity
await reponse.cart.updateItem({
  path: { id: cart.id, lineId: 'line-uuid' },
  body: { quantity: 3 }
});

// Remove item
await reponse.cart.removeItem({
  path: { id: cart.id, lineId: 'line-uuid' }
});

// Checkout via Stripe
const { data: checkout } = await reponse.cart.createCheckout({
  body: {
    cart_id: cart.id,
    success_url: 'https://mystore.com/success',
    cancel_url: 'https://mystore.com/cart'
  }
});
```

## Orders

```typescript
// List orders
const { data } = await reponse.orders.list();
const { data } = await reponse.orders.list({ query: { status: 'paid', limit: 20 } });

// Fulfill with tracking
await reponse.orders.fulfill({
  path: { orderId: 'order-uuid' },
  body: { tracking_number: '1Z999...', tracking_company: 'UPS' }
});

// Refund (full or partial)
await reponse.orders.refund({
  path: { orderId: 'order-uuid' },
  body: { amount: 15.00, reason: 'damaged_item' }
});

// Cancel order
await reponse.orders.cancel({
  path: { orderId: 'order-uuid' },
  body: { reason: 'customer_changed_mind' }
});

// Resend confirmation / invoice
await reponse.orders.resendConfirmation({ path: { orderId: 'order-uuid' } });
await reponse.orders.resendInvoice({ path: { orderId: 'order-uuid' } });
```

## Inventory

```typescript
// Get inventory levels
const { data } = await reponse.inventory.get({ query: { variant_id: 'uuid' } });

// Update stock
await reponse.inventory.update({
  body: { variant_id: 'uuid', quantity: 50, mode: 'set', reason: 'restock' }
});
```

## Discounts

```typescript
// List discount codes
const { data } = await reponse.discounts.list({ query: { active: true } });

// Validate a code
const { data } = await reponse.discounts.validate({
  body: { code: 'SUMMER20', cart_total: 100 }
});

// Create a code
await reponse.discounts.create({
  body: { code: 'VIP10', type: 'percentage', value: 10 }
});
```

## Loyalty & Referrals

```typescript
// Get points balance
const { data } = await reponse.loyalty.getBalance({ query: { contact_id: 'uuid' } });

// Redeem points
await reponse.loyalty.redeem({
  body: { contact_id: 'uuid', points: 500, order_id: 'order-uuid' }
});

// Referral info
const { data } = await reponse.loyalty.getReferralInfo({ query: { contact_id: 'uuid' } });
```

## Gift Cards

```typescript
// List gift cards
const { data } = await reponse.giftCards.list();

// Create a gift card
const { data: card } = await reponse.giftCards.create({
  body: { initial_value: 50, currency: 'EUR' }
});

// Redeem
await reponse.giftCards.redeem({
  body: { code: 'GC-ABCD-1234', amount: 25, order_id: 'order-uuid' }
});
```

## Tickets

```typescript
// List support tickets
const { data } = await reponse.tickets.list({ query: { status: 'open' } });

// Create a ticket
await reponse.tickets.create({
  body: { customer_email: 'john@example.com', subject: 'Missing item', message: '...' }
});

// Reply to a ticket
await reponse.tickets.reply({
  path: { id: 'ticket-uuid' },
  body: { message: 'We are looking into this.' }
});
```

## Subscriptions

```typescript
// Delay next shipment
await reponse.subscriptions.update({
  path: { subscriptionId: 'sub-uuid' },
  body: { action: 'delay', target_date: '2026-07-15' }
});

// Ship now
await reponse.subscriptions.update({
  path: { subscriptionId: 'sub-uuid' },
  body: { action: 'ship_now' }
});
```

## Approvals

```typescript
// Execute a pending approval
await reponse.approvals.execute({ path: { approvalId: 'uuid' } });

// Reject with reason
await reponse.approvals.reject({
  path: { approvalId: 'uuid' },
  body: { reason: 'Price too high' }
});
```

## Features

- 🛒 **Full Cart CRUD** — Create, read, add items, update quantities, remove items
- 🏷️ **Product Variants** — Options, SKUs, compare-at pricing, inventory
- 🔍 **SEO-ready** — Slug-based routing, SEO title/description
- 💰 **Multi-discount Engine** — Automatic discounts, codes, BXGY, free shipping
- 📦 **Order Management** — Fulfill, refund, cancel, shipping updates, invoices
- 📊 **Inventory** — Real-time stock levels, set/adjust quantities
- 🎟️ **Loyalty & Gift Cards** — Points, redemption, referrals, gift cards
- 🎫 **Support Tickets** — Create, reply, track support requests
- 🔄 **Subscriptions** — Delay or trigger shipments
- ✅ **Approvals** — Execute or reject pending approval workflows
- 🤖 **AI-native** — Built-in conversational support widget

## TypeScript

The SDK is fully typed. All request/response types are exported:

```typescript
import type { Product, ProductVariant, Cart } from '@reponseai/sdk';
```

## Links

- [API Documentation](https://reponse.ai/openapi.yaml)
- [React Hooks](https://www.npmjs.com/package/@reponseai/react)
- [MCP Server](https://www.npmjs.com/package/@reponseai/mcp)
- [Next.js Starter](https://github.com/supernebuleux/Reponse/tree/main/starters/nextjs-storefront)

## License

MIT

