import { Skeleton } from "@/components/ui/skeleton"

export function DonutChartSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-[180px] flex items-center justify-center">
        <div className="relative size-[150px]">
          <Skeleton className="size-full rounded-full" />
          <div className="absolute inset-[30px] rounded-full bg-card" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {[70, 55, 80, 50, 65, 45].map((w, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <Skeleton className="size-2 shrink-0 rounded-full" />
            <Skeleton className="h-3 flex-1" style={{ maxWidth: `${w}%` }} />
            <Skeleton className="h-3 w-10 shrink-0 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarChartSkeleton() {
  const bars = [55, 80, 38, 72, 90, 48, 65]
  return (
    <div className="space-y-3">
      <div className="h-[200px] flex flex-col">
        <div className="flex-1 flex items-end gap-1.5 px-[50px] pb-1">
          {bars.map((h, i) => (
            <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex gap-1.5 px-[50px] pt-2 h-5">
          {bars.map((_, i) => <Skeleton key={i} className="h-3 flex-1" />)}
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
