import { Backpack, Bus, CalendarDays, MapPin, Mountain, Ship, Tent, Users, Utensils, Waves } from "lucide-react"
import type { HomeQuickLink } from "@/lib/types/listing"
import { saveHomeQuickLink } from "@/lib/admin/catalog-actions"

const iconOptions = {
  backpack: Backpack,
  users: Users,
  mountain: Mountain,
  bus: Bus,
  ship: Ship,
  tent: Tent,
  "map-pin": MapPin,
  "calendar-days": CalendarDays,
  utensils: Utensils,
  waves: Waves,
} as const

const inputClass = "min-h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function HomeContentManager({ links, saved, error }: { links: HomeQuickLink[]; saved: boolean; error?: string }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header><p className="text-sm font-medium text-primary">Contenido del Home</p><h1 className="mt-1 text-2xl font-bold text-foreground">Colecciones y servicios rápidos</h1><p className="mt-1 text-sm text-muted-foreground">Administra los accesos que llevan a filtros de Explorar. Los enlaces se muestran en el Home cuando están activos.</p></header>
      {saved ? <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">Cambios guardados.</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error === "duplicate" ? "Ese slug ya está en uso." : "No se pudo guardar el acceso. Revisa los campos."}</p> : null}
      {(["collection", "service"] as const).map((section) => (
        <section key={section} className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div><h2 className="text-lg font-semibold">{section === "collection" ? "Colecciones rápidas" : "Servicios rápidos"}</h2><p className="mt-1 text-sm text-muted-foreground">Elige un icono, define el filtro y ajusta el orden de aparición.</p></div>
          <div className="grid gap-3">
            {links.filter((link) => link.section === section).map((link) => <QuickLinkForm key={link.id} link={link} />)}
          </div>
          <QuickLinkForm section={section} />
        </section>
      ))}
    </div>
  )
}

function QuickLinkForm({ link, section }: { link?: HomeQuickLink; section?: HomeQuickLink["section"] }) {
  const Icon = link ? iconOptions[link.icon_key as keyof typeof iconOptions] : null
  return (
    <form action={saveHomeQuickLink} className="grid gap-2 rounded-xl border border-border p-3 lg:grid-cols-[1fr_1.2fr_1fr_10rem_8rem_8rem_auto_auto] lg:items-center">
      {link ? <input type="hidden" name="link_id" value={link.id} /> : null}
      <input type="hidden" name="section" value={link?.section ?? section} />
      <label className="space-y-1 text-xs text-muted-foreground">Slug<input name="slug" required defaultValue={link?.slug ?? ""} placeholder="mochilero" className={inputClass} /></label>
      <label className="space-y-1 text-xs text-muted-foreground">Texto<input name="label" required defaultValue={link?.label ?? ""} placeholder="Nombre visible" className={inputClass} /></label>
      <label className="space-y-1 text-xs text-muted-foreground">Filtro<input name="target_value" required defaultValue={link?.target_value ?? ""} placeholder="Texto, tag o slug de categoría" className={inputClass} /></label>
      <label className="space-y-1 text-xs text-muted-foreground">Tipo de filtro<select name="target_kind" defaultValue={link?.target_kind ?? "search"} className={inputClass}><option value="search">Búsqueda</option><option value="tag">Etiqueta</option><option value="category">Categoría</option></select></label>
      <label className="space-y-1 text-xs text-muted-foreground">Icono<select name="icon_key" defaultValue={link?.icon_key ?? "map-pin"} className={inputClass}>{Object.keys(iconOptions).map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
      <label className="space-y-1 text-xs text-muted-foreground">Orden<input name="sort_order" type="number" min="0" defaultValue={link?.sort_order ?? 0} className={inputClass} /></label>
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground"><input type="checkbox" name="is_active" defaultChecked={link?.is_active ?? true} />Activo</label>
      <button className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">{Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}{link ? "Guardar" : "Agregar"}</button>
    </form>
  )
}
