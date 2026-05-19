import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  skeleton: React.ReactNode
  isLoading: boolean
  isRefetching: boolean
  children: React.ReactNode
}

export function ChartCard({ title, skeleton, isLoading, isRefetching, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {isLoading ? <Skeleton className="h-4 w-32" /> : (
            <>
              {title}
              {isRefetching && <Spinner className="size-3 text-muted-foreground" />}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? skeleton : (
          <div className={cn("transition-opacity duration-200", isRefetching && "opacity-50")}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
