---
trigger: glob
description: "Reponse component patterns — triggered when editing React components"
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
---

# Reponse Component Patterns

## Server vs Client Components
- Pages in `src/app/` are **Server Components** by default. Use them for data fetching.
- Add `'use client'` only for interactive components (forms, buttons, state).
- Never mix server-only code (cookies, SDK calls) in client components.

## Component Guidelines
- Import SDK via `import { reponse } from '@/lib/reponse'` (server-side only).
- For client-side data, use `@reponseai/react` hooks: `useProducts`, `useCart`, `useCollections`.
- Cart mutations must go through Server Actions in `src/lib/cart.ts`.
- Use `formatMoney()` from `src/lib/currency.ts` for all price display.

## Checkout Components
The checkout flow uses a multi-step pattern in `src/components/checkout/`:
- `CheckoutProvider.tsx` — State machine managing Contact → Shipping → Payment steps
- `ContactStep.tsx` — Email and phone collection
- `ShippingStep.tsx` — Address form with validation
- `PaymentStep.tsx` — Stripe Elements integration
- `OrderSummary.tsx` — Cart summary sidebar
- `DiscountInput.tsx` — Promo code application

## Variant Selector
When modifying `VariantSelector.tsx`, preserve the variant matching algorithm:
```typescript
const matchedVariant = variants.find(v =>
  optionDefinitions.every((opt, idx) =>
    v.option_values?.[idx] === selectedOptions[opt.name]
  )
);
```
