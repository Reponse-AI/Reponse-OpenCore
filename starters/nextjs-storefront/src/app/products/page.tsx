import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductBuyNowAction } from "@/components/ProductBuyNowAction";
import { AddToCartButton } from "@/components/AddToCartButton";
import { listProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import type { StorefrontProduct } from "@/types/storefront";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsSearchParams {
  q?: string;
  cursor?: string;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for '${q}'` : "Catalog",
    description: q
      ? `Products matching "${q}"`
      : "Browse all our products",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const { q, cursor } = await searchParams;

  let products: StorefrontProduct[] = [];
  let nextCursor: string | null = null;
  let hasMore = false;
  let error: string | null = null;

  try {
    const query: Record<string, string | number> = { limit: 24 };
    if (q) query.query = q;
    if (cursor) query.cursor = cursor;

    const data = await listProducts(query);
    products = data.data;
    nextCursor = data.next_cursor;
    hasMore = data.has_more;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to fetch products:", message);
    error = message;
  }

  const pageTitle = q ? `Search results for '${q}'` : "All Products";
  const pageSubtitle = q
    ? `${products.length} result${products.length !== 1 ? "s" : ""} found`
    : "Discover our full collection.";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {pageTitle}
          </h1>
          <p className="text-gray-500">{pageSubtitle}</p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const id = product.id;
                const title = product.title;
                const slug = product.slug || product.handle || id;
                const price = product.price;
                const compareAtPrice = product.compare_at_price;
                const currency = product.currency || "EUR";
                const inStock = product.in_stock ?? true;
                const images = product.images;
                const variants = product.variants;
                const hasOnlyDefaultVariant =
                  product.has_only_default_variant ?? (variants?.length ?? 0) <= 1;

                const isOnSale =
                  compareAtPrice != null && compareAtPrice > price;
                const discount = isOnSale
                  ? Math.round((1 - price / compareAtPrice) * 100)
                  : null;

                return (
                  <div
                    key={id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
                  >
                    {/* Image — clickable */}
                    <Link
                      href={`/products/${slug}`}
                      className="block relative"
                    >
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        {images?.[0] ? (
                          <Image
                            src={images[0]}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                              />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {isOnSale && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>
                        {!inStock && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Title — clickable */}
                      <Link
                        href={`/products/${slug}`}
                        className="hover:underline underline-offset-2"
                      >
                        <h3 className="font-semibold text-base mb-3 line-clamp-2 leading-snug">
                          {title}
                        </h3>
                      </Link>

                      <div className="mt-auto flex items-center justify-between gap-2">
                        {/* Price */}
                        <div className="flex flex-col">
                          {isOnSale ? (
                            <>
                              <span className="text-xs text-gray-400 line-through leading-none">
                                {formatPrice(compareAtPrice, currency)}
                              </span>
                              <span className="font-bold text-base text-red-600">
                                {formatPrice(price, currency)}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-base">
                              {formatPrice(price, currency)}
                            </span>
                          )}
                        </div>

                        <AddToCartButton
                          productId={id}
                          variantId={variants?.[0]?.id}
                          price={price}
                          currency={currency}
                          disabled={!inStock}
                          compact
                        />
                      </div>

                      <div className="mt-3">
                        {hasOnlyDefaultVariant ? (
                          <ProductBuyNowAction
                            productId={id}
                            variantId={variants?.[0]?.id}
                            disabled={!inStock}
                          />
                        ) : (
                          <Link
                            href={`/products/${slug}`}
                            className="w-full px-3 py-2 border border-black text-black text-xs font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center"
                          >
                            Choose options
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {products.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-gray-400 text-lg">No products found.</p>
                  <p className="text-gray-300 text-sm mt-2">
                    {q
                      ? "Try a different search term."
                      : "Add some in your Reponse dashboard."}
                  </p>
                </div>
              )}
            </div>

            {/* Cursor pagination */}
            {hasMore && nextCursor && (
              <div className="mt-10 flex justify-center">
                <Link
                  href={`/products?cursor=${nextCursor}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Load more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
