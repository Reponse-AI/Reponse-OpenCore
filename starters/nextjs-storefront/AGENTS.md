# Reponse Storefront — Agent Instructions

> This is a headless commerce storefront built with the **Reponse SDK**. Read these rules before writing any code.

## Stack

- **SDK**: `@reponseai/sdk` — TypeScript HTTP client (auto-generated from OpenAPI)
- **React hooks**: `@reponseai/react` — SWR-based hooks (useProducts, useCart, etc.)
- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Payments**: Stripe (Checkout redirect or embedded Payment Elements)
- **Styling**: Tailwind CSS v4
- **MCP**: `@reponseai/mcp` — 35 tools for AI agent commerce operations

## Critical Rules

1. **ALWAYS** use `@reponseai/sdk` for API calls. **NEVER** use raw `fetch()` against `/api/v1/*`.
2. Product listing pages → **Server Components** (fetch with SDK server-side).
3. Interactive UI (variant selector, cart, checkout) → **Client Components** with `'use client'`.
4. Cart mutations → **Server Actions** in `lib/cart.ts`.
5. **ALWAYS** pass `market_id` to checkout for correct currency/tax/shipping.
6. **NEVER** hardcode prices — they come from the API (`product.price`, `variant.price`).
7. **NEVER** build custom cart state with `useState` — use the Cart API or `useCart()` hook.
8. Persist `cart_id` in cookies (server-side) not localStorage.

## SDK Quick Reference

```typescript
import { Reponse } from '@reponseai/sdk';
const reponse = new Reponse({ apiKey: process.env.REPONSE_API_KEY!, baseUrl: process.env.NEXT_PUBLIC_REPONSE_API_URL! });

// Catalog
const { data } = await reponse.catalog.listProducts({ query: { limit: 12 } });
const product = await reponse.catalog.getProduct({ path: { id: '...' } });
const collections = await reponse.catalog.listCollections();

// Cart
const cart = await reponse.cart.create({ body: { currency: 'EUR' } });
await reponse.cart.addItem({ path: { id: cartId }, body: { items: [{ product_id: '...', quantity: 1 }] } });
await reponse.cart.updateItem({ path: { id: cartId, lineId: '...' }, body: { quantity: 2 } });
await reponse.cart.removeItem({ path: { id: cartId, lineId: '...' } });

// Checkout → returns Stripe URL
const checkout = await reponse.cart.createCheckout({ body: { cart_id: cartId, market_id: '...' } });
// Redirect to checkout.data.url
```

## Variant Resolution Pattern

```typescript
// Match a variant from user selections
const matchedVariant = variants.find(v =>
  optionDefinitions.every((opt, idx) =>
    v.option_values?.[idx] === selectedOptions[opt.name]
  )
);
```

## Key Files

| Purpose | File |
|---------|------|
| SDK singleton | `src/lib/reponse.ts` |
| Cart Server Actions | `src/lib/cart.ts` |
| Product grid (home) | `src/app/page.tsx` |
| Product detail (PDP) | `src/app/products/[slug]/page.tsx` |
| Variant selector | `src/components/VariantSelector.tsx` |
| Image gallery | `src/components/ImageGallery.tsx` |
| Cart page | `src/app/cart/page.tsx` |
| Checkout flow | `src/app/checkout/page.tsx` |
| Checkout steps | `src/components/checkout/` |
| Currency formatting | `src/lib/currency.ts` |

## AI Chat Widget

```tsx
// Add to app/layout.tsx for conversational commerce
<Script
  src="https://reponse.ai/assets/sdk/reponse-widget.min.js"
  data-workspace-id={process.env.NEXT_PUBLIC_WORKSPACE_ID}
  strategy="lazyOnload"
/>
```

## Environment Variables

Required in `.env.local` (see `.env.example`):
- `REPONSE_API_KEY` — Server-side SDK auth
- `NEXT_PUBLIC_REPONSE_API_URL` — API base URL
- `NEXT_PUBLIC_WORKSPACE_ID` — Workspace identifier
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe public key
- `NEXT_PUBLIC_MARKET_ID` — Market for currency/tax
- `CHECKOUT_MODE` — `embedded` or `redirect`

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 Warning

This version has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
