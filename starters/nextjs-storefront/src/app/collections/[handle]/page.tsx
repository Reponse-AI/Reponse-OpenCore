import { Header } from "@/components/Header";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { reponse } from "@/lib/reponse";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/env";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CollectionSeo {
  seo_title?: string | null;
  seo_description?: string | null;
}

interface CollectionData {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  try {
    const collectionsRes = await reponse.catalog.listCollections();
    const collections = (collectionsRes.data?.data ?? []) as unknown as Array<
      { handle: string; title: string; description?: string | null } & CollectionSeo
    >;
    const collection = collections.find((c) => c.handle === handle);

    if (collection) {
      const siteUrl = env.SITE_URL;
      const canonicalUrl = `${siteUrl}/collections/${handle}`;

      return {
        title: collection.seo_title || collection.title,
        description: collection.seo_description || collection.description,
        alternates: { canonical: canonicalUrl },
      };
    }
  } catch {
    // Ignore
  }

  return { title: "Collection Not Found" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let collection: CollectionData | null = null;
  let products: Array<Record<string, unknown>> = [];
  let error: string | null = null;

  try {
    // Fetch collection info
    const collectionsRes = await reponse.catalog.listCollections();
    const allCollections = (collectionsRes.data?.data ?? []) as unknown as Array<
      CollectionData & Record<string, unknown>
    >;
    collection =
      allCollections.find((c) => c?.handle === handle) ?? null;

    if (collection) {
      const apiUrl = env.REPONSE_API_URL;
      const apiKey = env.REPONSE_API_KEY;
      const workspaceId = env.REPONSE_WORKSPACE_ID;

      const productsRes = await fetch(
        `${apiUrl}/v1/collections/${handle}/products?workspace_id=${workspaceId}&limit=50`,
        { headers: { "x-api-key": apiKey } },
      );

      if (productsRes.ok) {
        const productsData = (await productsRes.json()) as {
          products?: Array<Record<string, unknown>>;
        };
        products = productsData.products || [];
      } else if (productsRes.status !== 404) {
        throw new Error(
          `Failed to fetch collection products: ${productsRes.statusText}`,
        );
      }
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to fetch collection:", message);
    error = message;
  }

  if (!collection && !error) {
    notFound();
  }

  const siteUrl = env.SITE_URL;
  const collectionTitle = collection?.title || "Collection";

  // JSON-LD: CollectionPage with ItemList
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionTitle,
    description: collection?.description || undefined,
    url: `${siteUrl}/collections/${handle}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/products/${(product.slug as string) || (product.id as string)}`,
        name: product.title as string,
        image: Array.isArray(product.images)
          ? product.images[0]
          : undefined,
      })),
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl || "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${siteUrl}/collections`,
      },
      { "@type": "ListItem", position: 3, name: collectionTitle },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link
            href="/"
            className="hover:text-gray-700 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/collections"
            className="hover:text-gray-700 transition-colors"
          >
            Collections
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">
            {collectionTitle}
          </span>
        </nav>

        <div className="mb-10 text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            {collectionTitle}
          </h1>
          {collection?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              const id = product.id as string;
              const title = product.title as string;
              const slug = (product.slug as string) || id;
              const price = product.price as number;
              const compareAtPrice = product.compare_at_price as
                | number
                | undefined;
              const currency =
                (product.currency as string) || "EUR";
              const inStock = product.in_stock as boolean;
              const images = product.images as
                | string[]
                | undefined;
              const variants = product.variants as
                | Array<{ id: string }>
                | undefined;

              const isOnSale =
                compareAtPrice != null && compareAtPrice > price;

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
                    <div className="aspect-square bg-gray-100 relative flex items-center justify-center text-gray-400 overflow-hidden">
                      {images?.[0] ? (
                        <Image
                          src={images[0]}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
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
                      )}
                      {isOnSale && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Sale
                        </span>
                      )}
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
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Title — clickable */}
                    <Link
                      href={`/products/${slug}`}
                      className="hover:underline underline-offset-2"
                    >
                      <h3 className="font-semibold text-lg mb-1">
                        {title}
                      </h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex flex-col">
                        {isOnSale ? (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(
                                compareAtPrice,
                                currency,
                              )}
                            </span>
                            <span className="font-bold text-lg text-red-600">
                              {formatPrice(price, currency)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">
                            {formatPrice(price, currency)}
                          </span>
                        )}
                      </div>

                      <form
                        action={async () => {
                          "use server";
                          if (!inStock) return;
                          const variantId = variants?.[0]?.id;
                          await addToCart(id, variantId, 1);
                          revalidatePath(
                            `/collections/${handle}`,
                          );
                        }}
                      >
                        <button
                          disabled={!inStock}
                          type="submit"
                          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {inStock ? "Add to Cart" : "Sold Out"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                No products found in this collection.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
