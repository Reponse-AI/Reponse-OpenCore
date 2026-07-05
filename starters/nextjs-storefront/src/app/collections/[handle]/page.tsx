import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { reponse } from "@/lib/reponse";
import { addToCart } from "@/lib/cart";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/currency";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  try {
    const collectionsRes = await reponse.catalog.listCollections();
    const collection = collectionsRes.data?.data?.find((c: any) => c.handle === handle);
    
    if (collection) {
      const siteUrl = process.env.SITE_URL || "";
      const canonicalUrl = `${siteUrl}/collections/${handle}`;

      return {
        title: collection.seo_title || collection.title,
        description: collection.seo_description || collection.description,
        alternates: { canonical: canonicalUrl },
      };
    }
  } catch (e) {
    // Ignore
  }
  
  return { title: "Collection Not Found" };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  let collection: any | null = null;
  let products: any[] = [];
  let error: string | null = null;

  try {
    // Fetch collection info
    const collectionsRes = await reponse.catalog.listCollections();
    collection = collectionsRes.data?.data?.find((c: any) => c.handle === handle) || null;

    if (collection) {
      const apiUrl = process.env.REPONSE_API_URL || "http://localhost:3000/api";
      const apiKey = process.env.REPONSE_API_KEY || "";
      const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

      const productsRes = await fetch(
        `${apiUrl}/api/v1/collections/${handle}/products?workspace_id=${workspaceId}&limit=50`,
        { headers: { "x-api-key": apiKey } }
      );

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        products = productsData.products || [];
      } else if (productsRes.status !== 404) {
        throw new Error(`Failed to fetch collection products: ${productsRes.statusText}`);
      }
    }
  } catch (err: any) {
    console.error("Failed to fetch collection:", err.message);
    error = err.message;
  }

  if (!collection && !error) {
    notFound();
  }

  const siteUrl = process.env.SITE_URL || "";
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
      itemListElement: products.map((product: Record<string, unknown>, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/products/${(product.slug as string) || (product.id as string)}`,
        name: product.title as string,
        image: Array.isArray(product.images) ? product.images[0] : undefined,
      })),
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl || "/" },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${siteUrl}/collections` },
      { "@type": "ListItem", position: 3, name: collectionTitle },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-gray-700 transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">
            {collectionTitle}
          </span>
        </nav>

        <div className="mb-10 text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{collectionTitle}</h1>
          {collection?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{collection.description}</p>
          )}
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col relative">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-0">
                  <span className="sr-only">View {product.title}</span>
                </Link>
                
                <div className="aspect-square bg-gray-100 relative flex items-center justify-center text-gray-400 overflow-hidden">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span>No image</span>
                  )}
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Sale
                    </span>
                  )}
                  {!product.in_stock && (
                    <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow z-10 pointer-events-none">
                  <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex flex-col">
                      {product.compare_at_price && product.compare_at_price > product.price ? (
                        <>
                          <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_at_price, product.currency)}</span>
                          <span className="font-bold text-lg text-red-600">{formatPrice(product.price, product.currency)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">{formatPrice(product.price, product.currency)}</span>
                      )}
                    </div>
                    
                    <form action={async () => {
                      "use server";
                      if (!product.in_stock) return;
                      const variantId = product.variants?.[0]?.id;
                      await addToCart(product.id, variantId, 1);
                      revalidatePath(`/collections/${handle}`);
                    }} className="pointer-events-auto">
                      <button 
                        disabled={!product.in_stock}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.in_stock ? 'Add to Cart' : 'Sold Out'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}

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
