"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getStorefrontEnv } from "@/lib/api/env";
import { workspaceHeaders } from "@/lib/api/headers";
import { queryKeys } from "@/lib/api/query-keys";
import { readJsonResult } from "@/lib/api/response";
import type { ProductReviewsResponse, Review, StoreReviewsResponse } from "@/types/storefront";

export type ReviewSort = "recent" | "rating";

export function useProductReviews({
  productId,
  sort,
  initialReviews,
  initialNextCursor,
  initialHasMore,
}: {
  productId: string;
  sort: ReviewSort;
  initialReviews: Review[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}) {
  const initialData =
    sort === "recent"
      ? {
          pages: [
            {
              reviews: initialReviews,
              next_cursor: initialNextCursor,
              has_more: initialHasMore,
              aggregates: {
                average: 0,
                count: initialReviews.length,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              },
            },
          ],
          pageParams: [null],
        }
      : undefined;

  return useInfiniteQuery({
    queryKey: queryKeys.reviews.product(productId, sort),
    initialPageParam: null as string | null,
    initialData,
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.next_cursor : undefined),
    queryFn: async ({ pageParam }) => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const params = new URLSearchParams({ limit: "10", sort });
      if (pageParam) params.set("cursor", pageParam);

      const response = await fetch(`${apiUrl}/v1/products/${productId}/reviews?${params}`, {
        headers: workspaceHeaders(workspaceId),
      });
      return readJsonResult<ProductReviewsResponse>(response, "Failed to load reviews");
    },
  });
}

export function useStoreReviews({
  initialReviews,
  initialNextCursor,
  initialHasMore,
}: {
  initialReviews: Review[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}) {
  return useInfiniteQuery({
    queryKey: queryKeys.reviews.store(),
    initialPageParam: null as string | null,
    initialData: {
      pages: [{ reviews: initialReviews, next_cursor: initialNextCursor, has_more: initialHasMore }],
      pageParams: [null],
    },
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.next_cursor : undefined),
    queryFn: async ({ pageParam }) => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const params = new URLSearchParams({ limit: "10" });
      if (pageParam) params.set("cursor", pageParam);

      const response = await fetch(`${apiUrl}/v1/reviews?${params}`, {
        headers: workspaceHeaders(workspaceId),
      });
      return readJsonResult<StoreReviewsResponse>(response, "Failed to load reviews");
    },
  });
}
