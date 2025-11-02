import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonRevenueChart = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] min-h-[300px] flex items-end space-x-2 px-4">
          {/* Bar chart skeleton */}
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <Skeleton 
                className="w-full rounded-t-md" 
                style={{ 
                  height: `${Math.random() * 60 + 40}%` 
                }} 
              />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SkeletonRevenueChart