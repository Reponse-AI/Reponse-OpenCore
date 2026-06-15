# @reponseai/react

React hooks for the [Reponse](https://reponse.ai) Headless Commerce API — powered by [SWR](https://swr.vercel.app).

## Install

```bash
npm install @reponseai/react @reponseai/sdk
```

## Setup

Wrap your app with `<ReponseProvider>`:

```tsx
import { ReponseProvider } from '@reponseai/react';

function App() {
  return (
    <ReponseProvider apiKey="rp_live_...">
      <Shop />
    </ReponseProvider>
  );
}
```

You can also pass a custom `baseUrl`:

```tsx
<ReponseProvider apiKey="rp_test_..." baseUrl="http://localhost:3001">
```

## Hooks

### `useProducts`

Fetch a list of products with optional filtering.

```tsx
import { useProducts } from '@reponseai/react';

function ProductList() {
  const { data, error, isLoading } = useProducts({ limit: 20 });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <ul>
      {data?.data?.map((product) => (
        <li key={product.id}>{product.title} — {product.price} {product.currency}</li>
      ))}
    </ul>
  );
}
```

#### Parameters

| Param    | Type     | Description          |
| -------- | -------- | -------------------- |
| `query`  | `string` | Search query         |
| `slug`   | `string` | Filter by slug       |
| `limit`  | `number` | Items to return      |
| `cursor` | `string` | Cursor for pagination |

### `useProduct`

Fetch a single product by ID.

```tsx
import { useProduct } from '@reponseai/react';

function ProductPage({ id }: { id: string }) {
  const { data, error, isLoading } = useProduct(id);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Product not found</p>;

  return <h1>{data?.data?.title}</h1>;
}
```

### `useCollections`

Fetch collections.

```tsx
import { useCollections } from '@reponseai/react';

function Collections() {
  const { data } = useCollections({ limit: 10 });

  return (
    <ul>
      {data?.data?.map((col) => (
        <li key={col.id}>{col.title}</li>
      ))}
    </ul>
  );
}
```

### `useCart`

Full cart management with read + mutations. Pass `null` to disable fetching (e.g. before a cart is created).

```tsx
import { useCart } from '@reponseai/react';

function Cart({ cartId }: { cartId: string }) {
  const { data, isLoading, addItem, updateItem, removeItem } = useCart(cartId);

  if (isLoading) return <p>Loading cart…</p>;

  return (
    <div>
      <h2>Cart ({data?.data?.items.length} items)</h2>

      {data?.data?.items.map((item) => (
        <div key={item.id}>
          <span>Product: {item.product_id}</span>
          <span>Qty: {item.quantity}</span>
          <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
          <button onClick={() => updateItem(item.id, item.quantity - 1)}>−</button>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      <button onClick={() => addItem('prod_abc123', 1)}>
        Add product
      </button>
    </div>
  );
}
```

#### Mutation helpers

| Method                                          | Description                    |
| ----------------------------------------------- | ------------------------------ |
| `addItem(productId, quantity?, variantId?)`      | Add an item to the cart        |
| `updateItem(lineId, quantity)`                   | Update item quantity           |
| `removeItem(lineId)`                             | Remove an item from the cart   |

All mutations automatically revalidate the cart data after completion.

## Direct SDK access

Use `useReponse()` to access the underlying SDK client for advanced use cases:

```tsx
import { useReponse } from '@reponseai/react';

function Checkout({ cartId }: { cartId: string }) {
  const client = useReponse();

  const handleCheckout = async () => {
    const session = await client.cart.createCheckout({
      body: { cart_id: cartId, success_url: '/success', cancel_url: '/cart' },
    });
    window.location.href = session.data!.url;
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

## License

MIT
