"use client";

import { useState, useCallback } from "react";
import { StarRating } from "@/components/StarRating";
import type {
  Review,
  ReviewAggregates,
  ProductReviewsResponse,
} from "@/lib/reviews";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewsListProps {
  productId: string;
  initialReviews: Review[];
  aggregates: ReviewAggregates;
  initialNextCursor: string | null;
  initialHasMore: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getEnv(): { apiUrl: string; workspaceId: string } {
  if (typeof window !== "undefined" && (globalThis as Record<string, unknown>).__ENV) {
    const env = (globalThis as Record<string, unknown>).__ENV as Record<
      string,
      string
    >;
    return {
      apiUrl: env.REPONSE_API_URL || "https://reponse.ai/api",
      workspaceId: env.REPONSE_WORKSPACE_ID || "",
    };
  }
  return {
    apiUrl: "https://reponse.ai/api",
    workspaceId: "",
  };
}

// ─── Distribution bar ────────────────────────────────────────────────────────

function RatingDistribution({
  distribution,
  total,
}: {
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  total: number;
}) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <div className="space-y-1.5">
      {stars.map((star) => {
        const count = distribution[star] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-right text-gray-500">{star}</span>
            <StarRating rating={star} size="sm" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-gray-400">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Single review card ──────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const authorName = [review.author_first_name, review.author_last_initial]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="border-b border-gray-100 py-6 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} size="sm" />
            {review.verified_purchase && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified
              </span>
            )}
          </div>

          {review.title && (
            <h4 className="font-semibold text-gray-900 mb-1">
              {review.title}
            </h4>
          )}

          {review.content && (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {review.content}
            </p>
          )}

          {/* Review images */}
          {review.media_urls.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.media_urls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Review photo ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            {authorName && <span className="font-medium text-gray-500">{authorName}</span>}
            {authorName && <span>·</span>}
            <time dateTime={review.published_at}>
              {formatDate(review.published_at)}
            </time>
          </div>
        </div>
      </div>

      {/* Merchant response */}
      {review.response_content && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded-r-lg p-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Store response
            {review.response_sent_at && (
              <span className="font-normal ml-1">
                · {formatDate(review.response_sent_at)}
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600">{review.response_content}</p>
        </div>
      )}
    </article>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ReviewsList({
  productId,
  initialReviews,
  aggregates,
  initialNextCursor,
  initialHasMore,
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<"recent" | "rating">("recent");

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;
    setLoading(true);

    try {
      const { apiUrl, workspaceId } = getEnv();
      const params = new URLSearchParams({
        limit: "10",
        cursor: nextCursor,
        sort,
      });
      const res = await fetch(
        `${apiUrl}/v1/products/${productId}/reviews?${params}`,
        { headers: { "x-workspace-id": workspaceId } }
      );

      if (res.ok) {
        const data = (await res.json()) as ProductReviewsResponse;
        setReviews((prev) => [...prev, ...data.reviews]);
        setNextCursor(data.next_cursor);
        setHasMore(data.has_more);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, sort, productId]);

  const handleSortChange = useCallback(
    async (newSort: "recent" | "rating") => {
      if (newSort === sort) return;
      setSort(newSort);
      setLoading(true);

      try {
        const { apiUrl, workspaceId } = getEnv();
        const params = new URLSearchParams({ limit: "10", sort: newSort });
        const res = await fetch(
          `${apiUrl}/v1/products/${productId}/reviews?${params}`,
          { headers: { "x-workspace-id": workspaceId } }
        );

        if (res.ok) {
          const data = (await res.json()) as ProductReviewsResponse;
          setReviews(data.reviews);
          setNextCursor(data.next_cursor);
          setHasMore(data.has_more);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [sort, productId]
  );

  return (
    <section id="reviews" className="mt-16">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Summary header */}
        <div className="p-8 md:p-12 border-b border-gray-100">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Customer Reviews
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Average */}
            <div className="flex flex-col items-center justify-center text-center min-w-[140px]">
              <span className="text-5xl font-extrabold text-gray-900">
                {aggregates.average.toFixed(1)}
              </span>
              <StarRating
                rating={aggregates.average}
                size="lg"
                className="mt-2"
              />
              <span className="text-sm text-gray-400 mt-1">
                {aggregates.count} review{aggregates.count !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Distribution */}
            <div className="flex-1 max-w-sm">
              <RatingDistribution
                distribution={aggregates.distribution}
                total={aggregates.count}
              />
            </div>
          </div>
        </div>

        {/* Sort & list */}
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing {reviews.length} of {aggregates.count} reviews
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="review-sort" className="text-sm text-gray-500">
                Sort by
              </label>
              <select
                id="review-sort"
                value={sort}
                onChange={(e) =>
                  handleSortChange(e.target.value as "recent" | "rating")
                }
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="recent">Most recent</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>
          </div>

          {/* Reviews */}
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Loading…
                  </>
                ) : (
                  "Load more reviews"
                )}
              </button>
            </div>
          )}

          {reviews.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No reviews yet. Be the first to share your experience!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
