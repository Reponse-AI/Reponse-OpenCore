import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-12">
      <Skeleton className="h-10 w-64 mb-3" />
      <Skeleton className="h-5 w-80 mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-4"
          >
            <Skeleton className="aspect-square w-full rounded-xl mb-4" />
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
