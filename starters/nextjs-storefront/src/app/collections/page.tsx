import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { reponse } from "@/lib/reponse";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our product collections",
  openGraph: {
    title: "Collections",
    description: "Browse our product collections",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Collections",
    description: "Browse our product collections",
  },
};

export default async function CollectionsPage() {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  let collections: Array<{
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    products_count?: number;
  }> = [];
  let error: string | null = null;

  try {
    const response = await reponse.catalog.listCollections();
    collections = (response.data?.data ?? []) as typeof collections;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to fetch collections:", message);
    error = message;
  }

  // ─── JSON-LD: CollectionPage ───────────────────────────────────────────────
  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Collections",
    description: "Browse our product collections",
    url: `${siteUrl}/collections`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collections.length,
      itemListElement: collections.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        url: `${siteUrl}/collections/${c.handle}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Collections
          </h1>
          <p className="text-gray-500">Explore our curated collections.</p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 group-hover:underline underline-offset-2">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {collection.description}
                    </p>
                  )}
                  {collection.products_count != null && (
                    <span className="text-xs text-gray-400">
                      {collection.products_count}{" "}
                      {collection.products_count === 1
                        ? "product"
                        : "products"}
                    </span>
                  )}
                </div>
              </Link>
            ))}

            {collections.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <p className="text-gray-400 text-lg">
                  No collections found.
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Create some in your Reponse dashboard.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
