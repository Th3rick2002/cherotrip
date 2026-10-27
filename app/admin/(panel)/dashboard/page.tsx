import { Suspense } from "react"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = {
  title: "Dashboard",
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen del contenido de Cherotrip.
        </p>
      </header>
      <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-card" />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

async function DashboardContent() {
  const admin = await requireAdmin()
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-foreground">
        Sesión iniciada como <span className="font-semibold">{admin.email ?? "admin"}</span>.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Las métricas, la gestión de lugares y eventos y la moderación llegan con #43 y #44.
      </p>
    </section>
  )
}
