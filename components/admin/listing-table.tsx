import Link from "next/link"
import { CalendarDays, MapPin, Plus } from "lucide-react"
import type { AdminListing } from "@/lib/admin/content"
import type { ListingType } from "@/lib/types/listing"

export function ListingTable({ type, listings, saved = false }: { type: ListingType; listings: AdminListing[]; saved?: boolean }) {
  const base = type === "place" ? "/admin/lugares" : "/admin/eventos"
  const label = type === "place" ? "lugares" : "eventos"
  const Icon = type === "place" ? MapPin : CalendarDays
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-primary"><Icon className="size-4" /> Gestión de {label}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{type === "place" ? "Lugares" : "Eventos"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{listings.length} registro{listings.length === 1 ? "" : "s"} · borradores y publicaciones</p>
        </div>
        <Link href={`${base}/nuevo`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" aria-hidden="true" /> Crear {type === "place" ? "lugar" : "evento"}
        </Link>
      </header>
      {saved ? <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">Los cambios se guardaron correctamente.</p> : null}
      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center">
          <Icon className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 font-medium text-foreground">Aún no hay {label} en el panel.</p>
          <p className="mt-1 text-sm text-muted-foreground">Crea un borrador para comenzar a cargar contenido.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3 font-semibold">Contenido</th><th className="px-4 py-3 font-semibold">Departamento</th><th className="px-4 py-3 font-semibold">Estado</th><th className="px-4 py-3 font-semibold">Última publicación</th><th className="px-4 py-3 text-right font-semibold">Acción</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-4 py-3"><Link href={`${base}/${listing.id}`} className="font-semibold text-foreground hover:text-primary hover:underline">{listing.title}</Link><p className="mt-0.5 text-xs text-muted-foreground">/{type === "place" ? "lugar" : "evento"}/{listing.slug}</p></td>
                  <td className="px-4 py-3 text-muted-foreground">{listing.department}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${listing.is_published ? "bg-emerald-500/10 text-emerald-800" : "bg-amber-500/10 text-amber-800"}`}>{listing.is_published ? "Publicado" : "Borrador"}</span>{listing.featured ? <span className="ml-1.5 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Destacado</span> : null}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{listing.published_at ? formatDate(listing.published_at) : "—"}</td>
                  <td className="px-4 py-3 text-right"><Link href={`${base}/${listing.id}`} className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted">Editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeZone: "America/El_Salvador" }).format(new Date(value))
}
