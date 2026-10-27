import Link from "next/link"
import type { ReactNode } from "react"
import { CalendarDays, FileEdit, MapPin, Send, Users } from "lucide-react"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/lib/supabase/server"

export const metadata = { title: "Dashboard" }

export default async function AdminDashboardPage() {
  const admin = await requireAdmin()
  const supabase = await createClient()
  const [places, events, published, drafts, pendingSubmissions] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("type", "place"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("type", "event"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("community_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ])
  const cards = [
    { label: "Lugares", value: places.count ?? 0, icon: MapPin },
    { label: "Eventos", value: events.count ?? 0, icon: CalendarDays },
    { label: "Publicados", value: published.count ?? 0, icon: Send },
    { label: "Borradores", value: drafts.count ?? 0, icon: FileEdit },
    { label: "Aportes pendientes", value: pendingSubmissions.count ?? 0, icon: Users },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header><h1 className="text-2xl font-bold text-foreground">Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Resumen del contenido de Cherotrip. Sesión: {admin.email ?? "admin"}.</p></header>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-border bg-card p-4"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" aria-hidden="true" /></span><p className="mt-4 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold text-foreground">{value}</p></div>)}
      </section>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground">Accesos directos</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <QuickLink href="/admin/lugares/nuevo">Crear lugar</QuickLink>
          <QuickLink href="/admin/eventos/nuevo">Crear evento</QuickLink>
          <QuickLink href="/admin/categorias">Administrar categorías</QuickLink>
          <QuickLink href="/admin/contenido">Editar contenido del Home</QuickLink>
          <QuickLink href="/admin/moderacion">Revisar aportes</QuickLink>
        </div>
      </section>
    </div>
  )
}

function QuickLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="inline-flex min-h-10 items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-muted">{children}</Link>
}
