import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="flex-grow max-w-6xl w-full mx-auto px-8 py-10">
      <Skeleton className="h-5 w-72 mb-8" />
      <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div>
          <Skeleton className="h-12 w-4/5 mb-6" />
          <Skeleton className="h-7 w-36 mb-8" />
          <Skeleton className="h-24 w-full mb-8" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </main>
  );
}
