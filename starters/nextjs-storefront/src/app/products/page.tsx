import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { reponse } from "@/lib/reponse";
import { addToCart } from "@/lib/cart";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/currency";

export const metadata = {
  title: "Catalog",
  description: "Browse all our products",
};

export default async function ProductsPage() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    const response = await reponse.catalog.listProducts({ query: { limit: 50 } });
    products = response.data?.data || [];
  } catch (err: any) {
    console.error("Failed to fetch products:", err.message);
    error = err.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">All Products</h1>
          <p className="text-gray-500">Discover our full collection.</p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const currency = product.currency || "EUR";
              const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
              const discount = isOnSale
                ? Math.round((1 - product.price / product.compare_at_price) * 100)
                : null;

              return (
                // Bug #5 fix: no overlay Link pattern — card is a regular element,
                // image+title link to PDP, Add to Cart button sits outside the <a>
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
                >
                  {/* Image — clickable */}
                  <Link href={`/products/${product.slug || product.id}`} className="block relative">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
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
                      {!product.in_stock && (
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
                    <Link href={`/products/${product.slug || product.id}`} className="hover:underline underline-offset-2">
                      <h3 className="font-semibold text-base mb-3 line-clamp-2 leading-snug">{product.title}</h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      {/* Price — P1 UX: formatted */}
                      <div className="flex flex-col">
                        {isOnSale ? (
                          <>
                            <span className="text-xs text-gray-400 line-through leading-none">
                              {formatPrice(product.compare_at_price, currency)}
                            </span>
                            <span className="font-bold text-base text-red-600">
                              {formatPrice(product.price, currency)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-base">
                            {formatPrice(product.price, currency)}
                          </span>
                        )}
                      </div>

                      {/* Bug #5 fix: form is a direct sibling of the Link, not nested inside */}
                      <form action={async () => {
                        "use server";
                        if (!product.in_stock) return;
                        const variantId = product.variants?.[0]?.id;
                        await addToCart(product.id, variantId, 1);
                        revalidatePath("/products");
                      }}>
                        <button
                          disabled={!product.in_stock}
                          type="submit"
                          className="px-3 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                          {product.in_stock ? "Add" : "Sold Out"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <p className="text-gray-400 text-lg">No products found.</p>
                <p className="text-gray-300 text-sm mt-2">Add some in your Reponse dashboard.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
