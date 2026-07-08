"use client";

import { useMemo } from "react";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";
import { useStoreReviews } from "@/hooks/useReviews";
import type { Review } from "@/types/storefront";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Single store review card ────────────────────────────────────────────────

function StoreReviewCard({ review }: { review: Review }) {
  const authorName = [review.author_first_name, review.author_last_initial]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
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

      {review.product_title_snapshot && (
        <p className="text-xs text-gray-400 mb-2">
          Review for{" "}
          <span className="font-medium text-gray-500">
            {review.product_title_snapshot}
          </span>
        </p>
      )}

      {review.title && (
        <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
      )}

      {review.content && (
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {review.content}
        </p>
      )}

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

      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
        {authorName && (
          <span className="font-medium text-gray-500">{authorName}</span>
        )}
        {authorName && <span>·</span>}
        <time dateTime={review.published_at}>
          {formatDate(review.published_at)}
        </time>
      </div>

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

interface StoreReviewsListProps {
  initialReviews: Review[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}

export function StoreReviewsList({
  initialReviews,
  initialNextCursor,
  initialHasMore,
}: StoreReviewsListProps) {
  const reviewsQuery = useStoreReviews({
    initialReviews,
    initialNextCursor,
    initialHasMore,
  });
  const reviews = useMemo(
    () => reviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [],
    [reviewsQuery.data],
  );
  const loading = reviewsQuery.isFetching || reviewsQuery.isFetchingNextPage;

  return (
    <div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <StoreReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviewsQuery.hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={() => reviewsQuery.fetchNextPage()}
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
    </div>
  );
}
