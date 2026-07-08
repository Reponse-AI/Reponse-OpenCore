import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { env } from "@/env";
import { ImageGallery } from "@/components/ImageGallery";
import { VariantSelector } from "@/components/VariantSelector";
import { StarRating } from "@/components/StarRating";
import { ReviewsList } from "@/components/ReviewsList";
import { ProductFacts } from "@/components/ProductFacts";
import { getProductBySlug } from "@/lib/catalog";
import { getProductReviews } from "@/lib/reviews";
import type { Review as ReviewType } from "@/lib/reviews";
import { getStoreConfig, isModuleActive } from "@/lib/config";
import { type Locale, parseLocale, getDictionary, LOCALE_COOKIE } from "@/lib/i18n";
import { isObjectRecord } from "@/lib/api/response";
import type {
  StorefrontOptionDefinition,
  StorefrontProduct,
  StorefrontProductVariant,
} from "@/types/storefront";

// ─── i18n helper ──────────────────────────────────────────────────────────────

function t(dict: Record<string, string>, key: string, fallback?: string): string {
  return dict[key] ?? fallback ?? key;
}

/** Resolve locale from cookie or Accept-Language header. */
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (localeCookie) return parseLocale(localeCookie);

  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";
  return parseLocale(acceptLang);
}

// ─── Data fetching ────────────────────────────────────────────────────────────

function buildOptionDefinitions(product: StorefrontProduct): StorefrontOptionDefinition[] {
  const variants = product.variants ?? [];
  const rawDefinitions = product.option_definitions;
  if (!Array.isArray(rawDefinitions)) return [];

  if (
    rawDefinitions.every(
      (option): option is StorefrontOptionDefinition =>
        typeof option === "object" && option !== null && "name" in option && "values" in option,
    )
  ) {
    return rawDefinitions;
  }

  return rawDefinitions
    .filter((name): name is string => typeof name === "string")
    .map((name, index) => {
      const values = [
        ...new Set(
          variants
            .map((variant) => variant.option_values?.[index])
            .filter((value): value is string => Boolean(value)),
        ),
      ];
      return { name, position: index + 1, values };
    });
}

/** Fetch product facts from the API (separate endpoint with ?include=facts). */
async function getProductFacts(productId: string): Promise<Array<{ question: string; answer: string }>> {
  try {
    const apiUrl = env.REPONSE_API_URL;
    const workspaceId = env.REPONSE_WORKSPACE_ID;
    const res = await fetch(
      `${apiUrl}/v1/products/${productId}?include=facts&workspace_id=${workspaceId}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (!isObjectRecord(data)) return [];
    const nestedData = isObjectRecord(data.data) ? data.data : undefined;
    const facts = data.facts ?? nestedData?.facts;
    if (!Array.isArray(facts)) return [];
    // API returns {topic, value}, map to {question, answer} for the component
    return facts
      .filter(
        (f): f is Record<string, unknown> =>
          isObjectRecord(f) && ("topic" in f || "question" in f),
      )
      .map((f) => ({
        question: String(f.question ?? f.topic ?? ""),
        answer: String(f.answer ?? f.value ?? ""),
      }))
      .filter((f) => f.question && f.answer);
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  const siteUrl = env.SITE_URL;
  const canonicalUrl = `${siteUrl}/products/${slug}`;
  const plainDescription = product.seo_description || product.description?.replace(/<[^>]*>/g, "") || undefined;

  return {
    title: product.seo_title || product.title,
    description: plainDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
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
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [locale, storeConfig, facts] = await Promise.all([
    resolveLocale(),
    getStoreConfig(),
    getProductFacts(product.id),
  ]);

  const variants: StorefrontProductVariant[] = product.variants ?? [];

  const hasOnlyDefaultVariant: boolean =
    product.has_only_default_variant ?? variants.length <= 1;
  const optionDefinitions = buildOptionDefinitions(product);
  const currency: string = product.currency || "EUR";
  const images: string[] = product.images ?? [];
  const isOnSale =
    product.compare_at_price != null && product.compare_at_price > product.price;

  // ─── Fetch reviews (only if reviews module is active) ────────
  const reviewsEnabled = isModuleActive(storeConfig, "reviews");

  const [dict, reviewsData] = await Promise.all([
    getDictionary(locale),
    reviewsEnabled
      ? getProductReviews(product.id, { limit: 10, sort: "recent" })
      : Promise.resolve(null),
  ]);

  const hasReviews =
    reviewsData !== null && reviewsData.aggregates.count > 0;

  // ─── JSON-LD ──────────────────────────────────────────────────
  const siteUrl = env.SITE_URL;

  // Build AggregateRating and Review structured data if reviews exist
  const aggregateRatingLd = hasReviews
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: reviewsData.aggregates.average,
          reviewCount: reviewsData.aggregates.count,
          bestRating: 5,
          worstRating: 1,
        },
        review: reviewsData.reviews.slice(0, 5).map((r: ReviewType) => ({
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          author: {
            "@type": "Person",
            name:
              [r.author_first_name, r.author_last_initial]
                .filter(Boolean)
                .join(" ") || "Anonymous",
          },
          datePublished: r.published_at,
          ...(r.title ? { name: r.title } : {}),
          ...(r.content ? { reviewBody: r.content } : {}),
        })),
      }
    : {};

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
      url: `${siteUrl}/products/${slug}`,
      priceCurrency: currency,
      price: product.price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...aggregateRatingLd,
  };

  // JSON-LD: BreadcrumbList matching the visual breadcrumbs
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t(dict, "common.home", "Home"), item: siteUrl || "/" },
      { "@type": "ListItem", position: 2, name: t(dict, "nav.catalog", "Catalog"), item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: product.title },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ReponseWidget = window.ReponseWidget || {}; window.ReponseWidget.activeProductId = ${JSON.stringify(product.id)};`,
        }}
      />

      <main className="flex-grow max-w-6xl w-full mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            {t(dict, "common.home", "Home")}
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-gray-700 transition-colors"
          >
            {t(dict, "nav.catalog", "Catalog")}
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

            {/* Inline star rating under title */}
            {hasReviews && (
              <a
                href="#reviews"
                className="inline-flex items-center gap-2 mb-4 group"
              >
                <StarRating
                  rating={reviewsData.aggregates.average}
                  size="sm"
                  showValue
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                  ({reviewsData.aggregates.count} review
                  {reviewsData.aggregates.count !== 1 ? "s" : ""})
                </span>
              </a>
            )}

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
              variants={hasOnlyDefaultVariant ? [] : variants}
              optionDefinitions={hasOnlyDefaultVariant ? [] : optionDefinitions}
              currency={currency}
              inStock={product.in_stock ?? true}
              initialPrice={product.price}
              initialCompareAtPrice={product.compare_at_price ?? null}
            />

            {/* SKU */}
            {variants[0]?.sku && (
              <p className="text-xs text-gray-400 mt-4">
                {t(dict, "product.sku", "SKU")}: {variants[0].sku}
              </p>
            )}
          </div>
        </div>

        {/* Product Facts (accordion, only shown if facts are returned) */}
        {facts.length > 0 && (
          <ProductFacts
            facts={facts}
            title={t(dict, "product.facts", "Product Facts")}
          />
        )}

        {/* Reviews section */}
        {hasReviews && (
          <ReviewsList
            productId={product.id}
            initialReviews={reviewsData.reviews}
            aggregates={reviewsData.aggregates}
            initialNextCursor={reviewsData.next_cursor}
            initialHasMore={reviewsData.has_more}
          />
        )}

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
            {t(dict, "product.backToProducts", "Back to products")}
          </Link>
        </div>
      </main>
    </div>
  );
}
