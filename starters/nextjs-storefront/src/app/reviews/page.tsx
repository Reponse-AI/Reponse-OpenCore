import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreReviews } from "@/lib/reviews";
import { StoreReviewsList } from "@/components/StoreReviewsList";
import { getStoreConfig, isModuleActive } from "@/lib/config";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read what our customers have to say about their experience.",
  openGraph: {
    title: "Customer Reviews",
    description: "Read what our customers have to say about their experience.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Customer Reviews",
    description: "Read what our customers have to say about their experience.",
  },
};

export default async function ReviewsPage() {
  const config = await getStoreConfig();
  if (!isModuleActive(config, "reviews")) notFound();

  const data = await getStoreReviews({ limit: 10 });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">

      <main className="flex-grow max-w-4xl w-full mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Customer Reviews</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          Customer Reviews
        </h1>

        {data && data.reviews.length > 0 ? (
          <StoreReviewsList
            initialReviews={data.reviews}
            initialNextCursor={data.next_cursor}
            initialHasMore={data.has_more}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400">No reviews yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
