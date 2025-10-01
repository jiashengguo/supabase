import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />
}

// Deterministic widths for skeleton to avoid hydration mismatch
const SKELETON_WIDTHS = ['75%', '85%', '70%', '80%', '90%']

export function TableListSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" style={{ width: SKELETON_WIDTHS[i] }} />
        </div>
      ))}
    </div>
  )
}
