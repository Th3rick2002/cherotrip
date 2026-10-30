import { Skeleton } from "@/components/ui/skeleton"

export function AdminPageSkeleton() {
  return (
    <div role="status" aria-label="Cargando panel" aria-busy="true" className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </header>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}
