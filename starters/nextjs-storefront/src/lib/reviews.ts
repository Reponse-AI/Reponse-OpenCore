// ─── Reviews Data Fetcher ─────────────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  title: string | null;
  content: string | null;
  rating: number;
  author_first_name: string | null;
  author_last_initial: string | null;
  verified_purchase: boolean;
  media_urls: string[];
  published_at: string;
  response_content: string | null;
  response_sent_at: string | null;
  /** Present only on store-wide reviews */
  product_id?: string;
  /** Present only on store-wide reviews */
  product_title_snapshot?: string;
}

export interface ReviewAggregates {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  aggregates: ReviewAggregates;
  next_cursor: string | null;
  has_more: boolean;
}

export interface StoreReviewsResponse {
  reviews: Review[];
  next_cursor: string | null;
  has_more: boolean;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getProductReviews(
  productId: string,
  options?: { limit?: number; cursor?: string; sort?: "recent" | "rating" }
): Promise<ProductReviewsResponse | null> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.cursor) params.set("cursor", options.cursor);
  if (options?.sort) params.set("sort", options.sort);

  const qs = params.toString();
  const url = `${apiUrl}/v1/products/${productId}/reviews${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { "x-workspace-id": workspaceId },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return (await res.json()) as ProductReviewsResponse;
  } catch {
    return null;
  }
}

export async function getStoreReviews(
  options?: { limit?: number; cursor?: string }
): Promise<StoreReviewsResponse | null> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.cursor) params.set("cursor", options.cursor);

  const qs = params.toString();
  const url = `${apiUrl}/v1/reviews${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { "x-workspace-id": workspaceId },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return (await res.json()) as StoreReviewsResponse;
  } catch {
    return null;
  }
}
