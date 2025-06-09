
import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailsLoading = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6 bg-gray-800" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full bg-gray-800" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="w-16 h-16 bg-gray-800" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-full bg-gray-800" />
            <Skeleton className="h-12 w-3/4 bg-gray-800" />
            <Skeleton className="h-6 w-1/2 bg-gray-800" />
            <Skeleton className="h-16 w-full bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};
