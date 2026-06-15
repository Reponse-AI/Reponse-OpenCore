---
trigger: always_on
description: "Reponse Headless Commerce SDK — storefront development rules and patterns"
---

# Reponse Storefront Development Rules

## Stack
- SDK: `@reponseai/sdk` (TypeScript, auto-generated from OpenAPI)
- React: `@reponseai/react` (SWR hooks: useProducts, useCart, etc.)
- Framework: Next.js 16 (App Router, Server Components, Server Actions)
- Payments: Stripe (Checkout redirect or embedded Elements)
- Styling: Tailwind CSS v4

## Critical Rules
1. ALWAYS use `@reponseai/sdk` for API calls. NEVER use raw `fetch()`.
2. Product listings → Server Components. Cart/Checkout → Client Components.
3. Cart mutations → Server Actions (`lib/cart.ts`).
4. ALWAYS pass `market_id` to checkout for correct currency/tax.
5. Persist `cart_id` in cookies, not localStorage.
6. NEVER hardcode prices — they come from the API.
7. NEVER build custom cart state — use Cart API or `useCart()` hook.

## SDK Usage

```typescript
import { Reponse } from '@reponseai/sdk';
const reponse = new Reponse({ apiKey: '...', baseUrl: '...' });

// Catalog
await reponse.catalog.listProducts({ query: { limit: 12 } });
await reponse.catalog.getProduct({ path: { id: '...' } });

// Cart
await reponse.cart.create({ body: { currency: 'EUR' } });
await reponse.cart.addItem({ path: { id: cartId }, body: { items: [...] } });

// Checkout → returns Stripe URL
await reponse.cart.createCheckout({ body: { cart_id: cartId, market_id: '...' } });
```

## Variant Resolution

```typescript
const matchedVariant = variants.find(v =>
  optionDefinitions.every((opt, idx) =>
    v.option_values?.[idx] === selectedOptions[opt.name]
  )
);
```

## Key Files
- `src/lib/reponse.ts` — SDK singleton
- `src/lib/cart.ts` — Cart Server Actions
- `src/components/VariantSelector.tsx` — Variant picker (canonical)
- `src/components/ImageGallery.tsx` — Product images with zoom
- `src/components/checkout/` — Multi-step checkout (Contact, Shipping, Payment)
- `src/app/products/[slug]/page.tsx` — Product detail page
- `src/app/cart/page.tsx` — Cart page
- `src/app/checkout/page.tsx` — Checkout flow
