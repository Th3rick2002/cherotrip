import { Suspense } from "react"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminAccount } from "@/components/admin/admin-account"
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 bg-slate-900 px-4 py-5 text-slate-100 md:sticky md:top-0 md:h-dvh md:w-60">
        <div>
          <p className="text-lg font-bold tracking-tight">Cherotrip</p>
          <p className="text-xs text-slate-400">Panel interno</p>
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-slate-800 pt-4">
          <Suspense fallback={<div className="space-y-3"><Skeleton className="h-3 w-32 bg-slate-800" /><Skeleton className="h-10 w-full bg-slate-800" /></div>}>
            <AdminAccount />
          </Suspense>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <Suspense fallback={<AdminPageSkeleton />}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
