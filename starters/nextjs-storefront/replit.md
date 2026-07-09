# Reponse Storefront

## Stack Preferences
- SDK: `@reponseai/sdk` (TypeScript HTTP client for Reponse Commerce API)
- React hooks: `@reponseai/react` (SWR-based: useProducts, useCart, useCollections)
- Framework: Next.js 16 with App Router, Server Components, Server Actions
- Payments: Stripe (embedded Payment Elements or Checkout redirect)
- Styling: Tailwind CSS v4
- Package Manager: npm

## Constraints
- ALWAYS use `@reponseai/sdk` for all commerce API calls. NEVER use raw `fetch()`.
- NEVER use Replit DB — all data comes from the Reponse API.
- Product listing pages must be Server Components (SSR).
- Cart and checkout UI must be Client Components (`'use client'`).
- Cart mutations use Server Actions defined in `src/lib/cart.ts`.
- ALWAYS pass `market_id` when creating a checkout session.
- NEVER hardcode prices — use `product.price` and `variant.price` from the API.
- Do not build custom cart state with useState — use the Cart API.

## Environment Variables
Required in `.env` (see `.env.example`):
- `REPONSE_API_KEY` — Server-side SDK authentication
- `NEXT_PUBLIC_REPONSE_API_URL` — API base URL
- `NEXT_PUBLIC_WORKSPACE_ID` — Workspace identifier
- Stripe’s publishable key is loaded from the configured Reponse workspace.
- `NEXT_PUBLIC_MARKET_ID` — Market for currency/tax resolution
- `CHECKOUT_MODE` — `embedded` or `redirect`

## SDK Usage
```typescript
import { Reponse } from '@reponseai/sdk';
const reponse = new Reponse({
  apiKey: process.env.REPONSE_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_REPONSE_API_URL!,
});

// List products
const { data } = await reponse.catalog.listProducts({ query: { limit: 12 } });

// Add to cart
await reponse.cart.addItem({
  path: { id: cartId },
  body: { items: [{ product_id: '...', quantity: 1 }] }
});

// Create checkout
const checkout = await reponse.cart.createCheckout({
  body: { cart_id: cartId, market_id: process.env.NEXT_PUBLIC_MARKET_ID! }
});
// Redirect to checkout.data.url
```

## Key Files
- `src/lib/reponse.ts` — SDK singleton instance
- `src/lib/cart.ts` — Server Actions for cart CRUD
- `src/components/VariantSelector.tsx` — Full variant picker
- `src/components/checkout/` — Multi-step checkout flow
- `src/app/products/[slug]/page.tsx` — Product detail page
