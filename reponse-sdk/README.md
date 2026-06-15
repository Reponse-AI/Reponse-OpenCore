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

console.log(product.variants); // [{ title: 'S / Red', price: 29.99, sku: '...' }]

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

// Redirect to checkout.url
window.location.href = checkout.url;
```

## Orders

```typescript
// Update shipping address
await reponse.orders.updateShippingAddress({
  path: { orderId: 'order-uuid' },
  body: {
    shipping_address: {
      address1: '123 Main St',
      city: 'Paris',
      zip: '75001',
      country: 'FR'
    }
  }
});

// Resend confirmation email
await reponse.orders.resendConfirmation({
  path: { orderId: 'order-uuid' }
});

// Resend invoice PDF
await reponse.orders.resendInvoice({
  path: { orderId: 'order-uuid' }
});

// Cancel order with refund
await reponse.orders.cancel({
  path: { orderId: 'order-uuid' },
  body: { reason: 'customer_changed_mind' }
});
```

## Features

- 🛒 **Full Cart CRUD** — Create, read, add items, update quantities, remove items
- 🏷️ **Product Variants** — Options, SKUs, compare-at pricing, inventory
- 🔍 **SEO-ready** — Slug-based routing, SEO title/description
- 💰 **Multi-discount Engine** — Automatic discounts, codes, BXGY, free shipping
- 🤖 **AI-native** — Built-in conversational support widget
- 📦 **Order Management** — Shipping updates, cancellations, invoices
- 🔄 **Shopify Migration** — One-click import of products, customers, orders

## TypeScript

The SDK is fully typed. All request/response types are exported:

```typescript
import type { Product, ProductVariant, Cart } from '@reponseai/sdk';
```

## Links

- [API Documentation](https://reponse.ai/openapi.yaml)
- [Next.js Starter](https://github.com/supernebuleux/Reponse/tree/main/starters/nextjs-storefront)
- [MCP Server](https://github.com/supernebuleux/Reponse/tree/main/mcp-server)

## License

MIT
