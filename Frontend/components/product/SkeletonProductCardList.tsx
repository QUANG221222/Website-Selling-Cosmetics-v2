import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonProductCardListProps {
  count?: number;
}

const SkeletonProductCardList = ({ count = 6 }: SkeletonProductCardListProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-border bg-white overflow-hidden flex flex-col">
          <div className="relative w-full overflow-hidden rounded-t-lg">
            <div className="relative w-full h-56 md:h-64 lg:h-72">
              <Skeleton className="w-full h-full" />
            </div>
            
            {/* Badges Skeleton */}
            <div className="absolute top-3 left-3 space-y-2">
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        
          <CardContent className="p-4">
            <div className="space-y-2">
              {/* Brand Skeleton */}
              <Skeleton className="h-4 w-24" />
              
              {/* Product Name Skeleton */}
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              
              {/* Category Skeleton */}
              <Skeleton className="h-4 w-32" />
              
              {/* Price Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
              
              {/* Rating Skeleton */}
              <div className="flex items-center space-x-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </CardContent>
        
          <CardFooter className="p-4 pt-0">
            <div className="w-full space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

export default SkeletonProductCardList