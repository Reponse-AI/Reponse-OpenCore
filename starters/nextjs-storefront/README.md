# Réponse — Next.js Storefront Starter

A production-ready **Next.js 15** storefront starter for [Réponse Headless Commerce](https://app.reponse.ai).  
Built with the App Router, Server Components, Tailwind CSS v4, and the `@reponse/sdk`.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsupernebuleux%2FReponse%2Ftree%2Fmain%2Fstarters%2Fnextjs-storefront&env=NEXT_PUBLIC_REPONSE_API_KEY,NEXT_PUBLIC_REPONSE_API_URL&envDescription=Get%20your%20API%20key%20from%20the%20Reponse%20dashboard&project-name=my-reponse-store&repository-name=my-reponse-store)

---

## Features

- ✅ Product catalog with variant support
- ✅ Product Detail Page (PDP) with image gallery & click-to-zoom
- ✅ Interactive variant selector with live price updates
- ✅ Collection pages with JSON-LD structured data
- ✅ Cart with add / remove / update quantity
- ✅ Stripe Checkout (via Réponse)
- ✅ Order confirmation page
- ✅ SEO metadata (`seo_title`, `seo_description`, Open Graph, canonical URLs)
- ✅ SEO link obfuscation (crawl budget optimisation)
- ✅ JSON-LD structured data (Product, BreadcrumbList, CollectionPage)
- ✅ Dynamic sitemap & robots.txt
- ✅ Conversational AI widget (optional — drop in your Réponse chat snippet)

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/reponse-ai/reponse.git
cd reponse/starters/nextjs-storefront
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_REPONSE_API_URL=https://api.reponse.ai
NEXT_PUBLIC_REPONSE_API_KEY=your_api_key_here
NEXT_PUBLIC_WORKSPACE_ID=your_workspace_id_here

# Server-side only (used by the SDK in Server Components)
REPONSE_API_KEY=your_api_key_here
REPONSE_API_URL=https://api.reponse.ai
```

> Get your API key from [app.reponse.ai → Settings → API](https://app.reponse.ai).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

Click **Deploy with Vercel** above, or use the CLI:

```bash
npx vercel
```

Set the following environment variables in your Vercel project settings  
(or add them as [Vercel secrets](https://vercel.com/docs/environment-variables)):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_REPONSE_API_URL` | Your Réponse API base URL |
| `NEXT_PUBLIC_REPONSE_API_KEY` | Your Réponse API key |
| `NEXT_PUBLIC_WORKSPACE_ID` | Your Réponse workspace ID |
| `REPONSE_API_KEY` | Same API key (server-side) |
| `REPONSE_API_URL` | Same base URL (server-side) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home — featured products
│   ├── products/
│   │   ├── page.tsx              # Product catalog
│   │   └── [slug]/page.tsx       # Product detail page (PDP)
│   ├── collections/[handle]/page.tsx # Collection page
│   ├── cart/page.tsx             # Shopping cart
│   ├── checkout/page.tsx         # Stripe Checkout redirect
│   ├── order/success/page.tsx    # Order confirmation
│   ├── sitemap.ts                # Dynamic sitemap (products + collections)
│   └── robots.ts                 # Crawl directives
├── components/
│   ├── Header.tsx                # Sticky header with cart count
│   ├── Footer.tsx                # Policy links (obfuscated)
│   ├── ImageGallery.tsx          # PDP image gallery with zoom
│   ├── VariantSelector.tsx       # Interactive variant + add-to-cart
│   └── seo/
│       ├── ObfuscatedLink.tsx    # Link hidden from search crawlers
│       └── HeaderNav.tsx         # Client nav with obfuscated cart link
└── lib/
    ├── reponse.ts                # SDK client (server-side)
    └── cart.ts                   # Cart server actions & helpers
```

---

## How it works

### Product pages

Products are fetched server-side using `@reponse/sdk`. The PDP (`/products/[slug]`) uses:

- **`ImageGallery`** — client component with thumbnail strip and lightbox zoom
- **`VariantSelector`** — client component that resolves variant prices dynamically and calls `POST /api/v1/carts/{id}/items` directly from the browser

### Cart

The cart ID is stored in:
- **`reponse_cart_id` cookie** — for server-side reads (header count, cart page)
- **`reponse_cart_id` localStorage** — for client-side add-to-cart from the PDP

If no cart exists when adding an item, one is created automatically via `POST /api/v1/carts`.

### Checkout

`/checkout` creates a Stripe Checkout session via the Réponse SDK and redirects the browser. On success, Stripe redirects back to `/order/success`.

---

## SEO

The storefront includes enterprise-grade SEO out of the box.

### Link obfuscation

The `ObfuscatedLink` component hides links from search engine crawlers to optimise crawl budget and PageRank distribution. It renders a `<span>` with JS navigation instead of an `<a href>`, so Googlebot never sees the URL.

**Use `ObfuscatedLink` for:** cart, checkout, account, policy pages, filters, sort controls — anything with no SEO value.

**Use standard `<Link>` for:** products, collections, homepage, breadcrumbs — anything Google should index.

```tsx
import { ObfuscatedLink } from "@/components/seo/ObfuscatedLink";

// Hidden from crawlers
<ObfuscatedLink to="/cart" ariaLabel="View cart">Cart</ObfuscatedLink>

// Crawlable — use standard Next.js Link
import Link from "next/link";
<Link href="/products/my-product">My Product</Link>
```

### Structured data

- **Product pages**: Product JSON-LD + BreadcrumbList JSON-LD (automatic)
- **Collection pages**: CollectionPage + ItemList + BreadcrumbList JSON-LD (automatic)
- **Canonical URLs**: Set on product and collection pages

### Sitemap & robots.txt

- `src/app/sitemap.ts` — auto-generates URLs for products and collections (revalidates hourly)
- `src/app/robots.ts` — blocks `/cart`, `/checkout`, `/order/` from crawlers

---

## Customisation

- **Styling**: Edit `src/app/globals.css` and Tailwind utilities in each component.
- **Currency**: Products use `product.currency`; defaults to `EUR`.
- **AI widget**: Add your Réponse chat embed script to `src/app/layout.tsx`.

---

## License

MIT
