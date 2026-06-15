# Reponse Vibe-Coding Starters

This directory will contain starter templates (Next.js, Astro, Vite) configured with `@reponse/sdk` out of the box.

## The Vision: "Vibe-Coding" a Storefront

When a developer or an AI (like Cursor, Lovable, Bolt) wants to build an e-commerce storefront, they can simply use the `@reponse/sdk` to fetch products, manage carts, and create orders, without touching a database.

### Quick Start Example (Next.js App Router)

```tsx
// app/page.tsx
import { Reponse } from '@reponse/sdk';

const reponse = new Reponse({ apiKey: process.env.REPONSE_API_KEY });

export default async function Home() {
  const { data: products } = await reponse.catalog.listProducts({ limit: 12 });

  return (
    <main>
      <h1>Our Latest Products</h1>
      <div className="grid grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="card">
            <h2>{product.title}</h2>
            <p>{product.price} {product.currency}</p>
            <form action="/api/add-to-cart" method="POST">
              <input type="hidden" name="productId" value={product.id} />
              <button type="submit">Add to Cart</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
```

## Creating an Order

Once the user is ready to checkout:

```typescript
const cart = await reponse.cart.create({
  items: [{ product_id: "...", quantity: 1 }]
});

const order = await reponse.orders.create({
  cart_id: cart.id,
  customer_email: "customer@example.com"
});

console.log("Order created:", order.id);
```

Next step: we will publish the SDK to npm so it can be installed via `npm install @reponse/sdk`.
