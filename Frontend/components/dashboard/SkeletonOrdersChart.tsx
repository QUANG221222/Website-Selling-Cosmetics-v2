import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonOrdersChart = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center space-x-4 px-4">
          {/* Line chart skeleton - simulating points connected by lines */}
          <div className="w-full h-full relative flex items-end justify-between px-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Skeleton 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    marginBottom: `${Math.random() * 150 + 50}px` 
                  }} 
                />
                <Skeleton className="h-3 w-6" />
              </div>
            ))}
            {/* Simulated line connecting points */}
            <div className="absolute inset-0 flex items-center px-8">
              <Skeleton className="w-full h-0.5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkeletonOrdersChart