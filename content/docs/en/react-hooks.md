---
title: "React Hooks"
description: "React hooks for data fetching with SWR."
---

## Overview

`@reponseai/react` provides SWR-powered hooks for declarative data fetching with automatic caching, revalidation, and error handling. Wrap your app in `ReponseProvider`, then use hooks like `useProducts`, `useProduct`, and `useChat` in any component.

## Setup

Install the package:

```bash
npm install @reponseai/react
```

Wrap your application with `ReponseProvider`:

```tsx
import { ReponseProvider } from "@reponseai/react";

export default function App({ children }) {
  return (
    <ReponseProvider apiKey="rp_live_..." baseUrl="https://api.reponse.ai">
      {children}
    </ReponseProvider>
  );
}
```

### Provider Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | Yes | Your workspace API key. |
| `baseUrl` | `string` | No | Override the default API URL. |
| `swrConfig` | `SWRConfiguration` | No | Global SWR options (dedupingInterval, etc.). |

## useProducts

Fetch a paginated list of products.

```tsx
import { useProducts } from "@reponseai/react";

function ProductGrid() {
  const { data, error, isLoading, mutate } = useProducts({
    limit: 20,
    offset: 0,
    query: "sneaker",
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.title} — ${product.variants[0]?.price}</li>
      ))}
    </ul>
  );
}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | `number` | `20` | Number of products per page. |
| `offset` | `number` | `0` | Pagination offset. |
| `query` | `string` | — | Free-text search filter. |

## useProduct

Fetch a single product by ID.

```tsx
import { useProduct } from "@reponseai/react";

function ProductDetail({ productId }: { productId: string }) {
  const { data: product, error, isLoading } = useProduct(productId);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Product not found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## useChat

Manage a chat conversation with the AI engine.

```tsx
import { useChat } from "@reponseai/react";

function ChatPanel({ campaignId }: { campaignId: string }) {
  const { messages, sendMessage, isStreaming, error } = useChat({
    campaignId,
  });

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <p key={i} className={msg.role}>
          {msg.content}
        </p>
      ))}
      {isStreaming && <p>Typing…</p>}
    </div>
  );
}
```

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `campaignId` | `string` | Yes | The campaign to chat with. |
| `conversationId` | `string` | No | Resume an existing conversation. |
| `utmParams` | `Record<string, string>` | No | UTM params for engine dispatch. |

## useCart

Manage cart state synced with the Reponse backend.

```tsx
import { useCart } from "@reponseai/react";

function CartButton({ variantId }: { variantId: string }) {
  const { addItem, cart, isUpdating } = useCart();

  return (
    <button onClick={() => addItem(variantId, 1)} disabled={isUpdating}>
      Add to cart ({cart?.items.length ?? 0})
    </button>
  );
}
```

## Hooks Reference

| Hook | Returns | Description |
| --- | --- | --- |
| `useProducts(opts)` | `{ data, error, isLoading, mutate }` | Paginated product list. |
| `useProduct(id)` | `{ data, error, isLoading }` | Single product by ID. |
| `useChat(opts)` | `{ messages, sendMessage, isStreaming, error }` | Chat conversation. |
| `useCart()` | `{ cart, addItem, removeItem, isUpdating }` | Cart management. |

## Troubleshooting

| Issue | Solution |
| --- | --- |
| `useProducts` returns `undefined` | Ensure the component is inside `ReponseProvider`. |
| Stale data after mutation | Call `mutate()` to revalidate or pass `revalidateOnFocus: true`. |
| `401` errors in the browser | Never use `rp_live_` keys client-side. Proxy through your backend or use `rp_test_` keys. |
| TypeScript errors on hook return types | Update `@reponseai/react` to the latest version. |
