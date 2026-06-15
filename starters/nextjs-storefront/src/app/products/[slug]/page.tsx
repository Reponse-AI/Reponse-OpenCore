import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ImageGallery } from "@/components/ImageGallery";
import { VariantSelector } from "@/components/VariantSelector";
import { reponse } from "@/lib/reponse";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProduct(slug: string) {
  try {
    const response = await reponse.catalog.listProducts({ query: { slug } });
    return response.data?.data?.[0] ?? null;
  } catch {
    return null;
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonicalUrl = `${siteUrl}/products/${slug}`;
  const plainDescription = product.seo_description || product.description?.replace(/<[^>]*>/g, "") || undefined;

  return {
    title: product.seo_title || product.title,
    description: plainDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "og:product" as any,
      url: canonicalUrl,
      title: product.seo_title || product.title,
      description: plainDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Cast for fields that may not be in the SDK types yet
  const p = product as any;

  const variants: Array<{
    id: string;
    price?: number;
    compare_at_price?: number;
    inventory_quantity?: number;
    option_values?: string[];
    sku?: string;
  }> = p.variants ?? [];

  const hasOnlyDefaultVariant: boolean =
    p.has_only_default_variant ?? variants.length <= 1;

  const optionDefinitions: Array<{
    name: string;
    position: number;
    values: string[];
  }> = p.option_definitions ?? [];

  const currency: string = p.currency || "EUR";
  const images: string[] = p.images ?? [];
  const isOnSale =
    p.compare_at_price != null && p.compare_at_price > p.price;

  // JSON-LD Product structured data for rich search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description?.replace(/<[^>]*>/g, "") || undefined,
    image: images,
    sku: variants[0]?.sku || product.id,
    brand: { "@type": "Brand", name: "Store" },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${slug}`,
      priceCurrency: currency,
      price: product.price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-gray-700 transition-colors"
          >
            Catalog
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Image Gallery (client component — supports click-to-zoom) */}
          <ImageGallery
            images={images}
            title={product.title}
            isOnSale={isOnSale}
          />

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              {product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <div
                className="text-gray-600 leading-relaxed mb-6 text-sm [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Variant Selector (client component — handles price, options, add-to-cart) */}
            <VariantSelector
              productId={product.id}
              productSlug={slug}
              variants={hasOnlyDefaultVariant ? [] : variants}
              optionDefinitions={hasOnlyDefaultVariant ? [] : optionDefinitions}
              currency={currency}
              inStock={product.in_stock ?? true}
              initialPrice={product.price}
              initialCompareAtPrice={p.compare_at_price ?? null}
            />

            {/* SKU */}
            {variants[0]?.sku && (
              <p className="text-xs text-gray-400 mt-4">
                SKU: {variants[0].sku}
              </p>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to products
          </Link>
        </div>
      </main>
    </div>
  );
}
