// ─── Reviews Data Fetcher ─────────────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

import type { ProductReviewsResponse, StoreReviewsResponse } from "@/types/storefront";
import { env } from "@/env";

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  ProductReviewsResponse,
  Review,
  ReviewAggregates,
  StoreReviewsResponse,
} from "@/types/storefront";

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
