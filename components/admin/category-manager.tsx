import {
  saveActivityCategory,
  saveDirectoryCategory,
} from "@/lib/admin/catalog-actions"
import type { AdminActivityCategory, AdminCategory } from "@/lib/admin/content"

const inputClass = "min-h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function CategoryManager({
  categories,
  activityCategories,
  saved,
  error,
}: {
  categories: AdminCategory[]
  activityCategories: AdminActivityCategory[]
  saved: boolean
  error?: string
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header>
        <p className="text-sm font-medium text-primary">Catálogos</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Categorías</h1>
        <p className="mt-1 text-sm text-muted-foreground">Organiza filtros del directorio y las actividades dentro de la agenda.</p>
      </header>
      {saved ? <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">Cambios guardados.</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorText(error)}</p> : null}

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div><h2 className="text-lg font-semibold">Categorías del directorio</h2><p className="mt-1 text-sm text-muted-foreground">Cada categoría puede aplicarse a lugares, eventos o ambos. Las categorías en uso se desactivan; no se eliminan.</p></div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-2">Slug</th><th className="px-3 py-2">Nombre</th><th className="px-3 py-2">Ícono</th><th className="px-3 py-2">Orden</th><th className="px-3 py-2">Aplica a</th><th className="px-3 py-2">Activa</th><th className="px-3 py-2">Guardar</th></tr></thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => <tr key={category.id}><td colSpan={7} className="p-0"><form action={saveDirectoryCategory} className="grid grid-cols-7 items-center gap-2 p-2">
                <input type="hidden" name="category_id" value={category.id} />
                <input name="slug" aria-label="Slug" required defaultValue={category.slug} className={inputClass} />
                <input name="name" aria-label="Nombre" required defaultValue={category.name} className={inputClass} />
                <input name="icon" aria-label="Ícono" defaultValue={category.icon ?? ""} className={inputClass} />
                <input name="sort_order" aria-label="Orden" type="number" min="0" defaultValue={category.sort_order} className={inputClass} />
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <label className="flex items-center gap-1"><input type="checkbox" name="listing_types" value="place" defaultChecked={category.listing_types.includes("place")} />Lugar</label>
                  <label className="flex items-center gap-1"><input type="checkbox" name="listing_types" value="event" defaultChecked={category.listing_types.includes("event")} />Evento</label>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="is_active" defaultChecked={category.is_active} />Sí</label>
                  <button className="rounded-lg bg-primary px-2.5 py-2 text-xs font-semibold text-primary-foreground">Guardar</button>
                </div>
              </form></td></tr>)}
              {categories.length === 0 ? <tr><td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">No hay categorías.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <form action={saveDirectoryCategory} className="grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-2 lg:grid-cols-6">
          <input name="slug" aria-label="Slug" placeholder="Slug (ej. playa)" className={inputClass} />
          <input name="name" aria-label="Nombre" required placeholder="Nombre visible" className={inputClass} />
          <input name="icon" aria-label="Ícono" placeholder="Ícono (opcional)" className={inputClass} />
          <input name="sort_order" aria-label="Orden" type="number" min="0" defaultValue="0" className={inputClass} />
          <div className="flex items-center gap-3 text-sm"><label className="flex items-center gap-1"><input type="checkbox" name="listing_types" value="place" defaultChecked />Lugar</label><label className="flex items-center gap-1"><input type="checkbox" name="listing_types" value="event" defaultChecked />Evento</label><input type="checkbox" name="is_active" defaultChecked hidden /></div>
          <button className="min-h-10 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">Agregar categoría</button>
        </form>
        <p className="text-xs text-muted-foreground">En las categorías existentes puedes desmarcar “Activa” para retirarlas de los filtros sin afectar listings anteriores.</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div><h2 className="text-lg font-semibold">Categorías de actividades</h2><p className="mt-1 text-sm text-muted-foreground">Este catálogo solo clasifica sub-eventos de una agenda.</p></div>
        <div className="grid gap-3 md:grid-cols-2">
          {activityCategories.map((category) => <form key={category.id} action={saveActivityCategory} className="grid grid-cols-[1fr_1fr_5rem_auto_auto] items-center gap-2 rounded-xl border border-border p-3">
            <input type="hidden" name="category_id" value={category.id} />
            <input name="slug" aria-label="Slug" required defaultValue={category.slug} className={inputClass} />
            <input name="name" aria-label="Nombre" required defaultValue={category.name} className={inputClass} />
            <input name="sort_order" aria-label="Orden" type="number" min="0" defaultValue={category.sort_order} className={inputClass} />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="is_active" defaultChecked={category.is_active} />Activa</label>
            <button className="rounded-lg bg-primary px-2.5 py-2 text-xs font-semibold text-primary-foreground">Guardar</button>
          </form>)}
        </div>
        <form action={saveActivityCategory} className="grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-4">
          <input name="slug" aria-label="Slug" required placeholder="Slug (ej. music-concert)" className={inputClass} />
          <input name="name" aria-label="Nombre" required placeholder="Nombre visible" className={inputClass} />
          <input name="sort_order" aria-label="Orden" type="number" min="0" defaultValue="0" className={inputClass} />
          <button className="min-h-10 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">Agregar actividad</button>
          <input type="checkbox" name="is_active" defaultChecked hidden />
        </form>
      </section>
    </div>
  )
}

function errorText(error: string) {
  if (error === "duplicate") return "Ese slug ya está en uso. Elige otro."
  if (error === "activity") return "No se pudo guardar la categoría de actividad. Revisa los campos y que no esté en uso."
  return "No se pudo guardar. Revisa nombre, slug y tipo asignado."
}
