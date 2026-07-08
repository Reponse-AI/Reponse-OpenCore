import Image from "next/image";
import Link from "next/link";
import { reponse } from "@/lib/reponse";
import { addToCart } from "@/lib/cart";
import { Header } from "@/components/Header";
import { revalidatePath } from "next/cache";
import type { Product } from '@reponseai/sdk';
import { formatPrice } from "@/lib/currency";

export default async function Home() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const response = await reponse.catalog.listProducts({ query: { limit: 12 } });
    products = response.data?.data || [];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to fetch products:', message);
    error = message;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Latest Arrivals</h2>
          <p className="text-lg text-gray-600">Built with Reponse Headless Commerce.</p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            <strong>Error connecting to Reponse backend:</strong> {error}
            <br />
            <span className="text-sm mt-2 block">
              Make sure REPONSE_API_KEY is set in .env.local and the Reponse server is running.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const currency = product.currency || "EUR";
              const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

              return (
                // Bug #5 fix: image & title link separately — form is a sibling, no overlay Link
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                  <Link href={`/products/${product.slug || product.id}`} className="block relative">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                      {isOnSale && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          -{Math.round((1 - product.price / (product.compare_at_price ?? product.price)) * 100)}%
                        </span>
                      )}
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <Link href={`/products/${product.slug || product.id}`} className="hover:underline underline-offset-2">
                      <h3 className="font-semibold text-base mb-3 line-clamp-2 leading-snug">{product.title}</h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {isOnSale ? (
                          <>
                            <span className="text-xs text-gray-400 line-through leading-none">
                              {formatPrice(product.compare_at_price ?? 0, currency)}
                            </span>
                            <span className="font-bold text-base text-red-600">
                              {formatPrice(product.price, currency)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-base">{formatPrice(product.price, currency)}</span>
                        )}
                      </div>

                      <form action={async () => {
                        "use server";
                        if (!product.in_stock) return;
                        const variantId = product.variants?.[0]?.id;
                        await addToCart(product.id, variantId, 1);
                        revalidatePath("/");
                      }}>
                        <button
                          disabled={!product.in_stock}
                          type="submit"
                          className="px-3 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {product.in_stock ? "Add" : "Sold Out"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400">
                No products found. Add some in your Reponse dashboard.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
