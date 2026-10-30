import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/lib/supabase/server"
import { createPartnerAction, linkPartnerAction } from "@/lib/admin/partner-actions"

export const metadata = { title: "Aliados y patrocinadores" }

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  await requireAdmin()
  const [{ error, saved }, supabase] = await Promise.all([searchParams, createClient()])
  const [{ data: partners, error: partnerError }, { data: listings, error: listingError }, { data: links, error: linksError }] = await Promise.all([
    supabase.from("partners").select("id, name, category, is_active").order("name"),
    supabase.from("listings").select("id, title, type, department_info:departments!listings_department_id_fkey(name), is_published").order("title"),
    supabase.from("listing_partners").select("id, listing_id, partner_id, relationship_type, display_text, is_active, listings(title), partners(name)").order("created_at", { ascending: false }),
  ])
  if (partnerError || listingError || linksError) throw new Error("No se pudo cargar la gestión de aliados.")
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-medium text-primary">Relaciones comerciales</p><h1 className="mt-1 text-2xl font-bold text-foreground">Aliados y patrocinadores</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Registra negocios y relaciónalos con lugares. La ficha pública identifica los vínculos editoriales y la promoción pagada por separado.</p></header>
      {error ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">No se pudo guardar. Revisa los campos e inténtalo de nuevo.</p> : null}
      {saved ? <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">Cambios guardados.</p> : null}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Registrar negocio</h2>
        <form action={createPartnerAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Nombre"><input name="name" required minLength={2} maxLength={160} className={inputClass} /></Field>
          <Field label="Categoría"><select name="category" className={inputClass}><option value="food">Gastronomía</option><option value="accommodation">Alojamiento</option><option value="transport">Transporte</option><option value="activities">Actividades</option><option value="other">Otros servicios</option></select></Field>
          <Field label="Descripción"><textarea name="description" maxLength={1000} rows={3} className={inputClass} /></Field>
          <div className="grid gap-3"><Field label="Sitio web"><input name="website_url" type="url" className={inputClass} /></Field><Field label="URL del logo"><input name="logo_url" type="url" className={inputClass} /></Field></div>
          <Field label="WhatsApp oficial"><input name="whatsapp_phone" maxLength={40} placeholder="50370000000" className={inputClass} /></Field>
          <Field label="Instagram"><input name="instagram_url" type="url" className={inputClass} /></Field>
          <div className="md:col-span-2"><button className={buttonClass}>Registrar negocio</button></div>
        </form>
      </section>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Relacionar con un lugar</h2>
        <p className="mt-1 text-sm text-muted-foreground">Marketing pagado y patrocinio se identifican por separado de los aliados editoriales. Esta fase no registra descuentos ni compras referidas.</p>
        <form action={linkPartnerAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Lugar"><select name="listing_id" required defaultValue="" className={inputClass}><option value="" disabled>Selecciona un lugar</option>{(listings ?? []).filter((item) => item.type === "place").map((item) => <option key={item.id} value={item.id}>{item.title} · {relationDepartment(item.department_info)}{item.is_published ? "" : " (borrador)"}</option>)}</select></Field>
          <Field label="Negocio"><select name="partner_id" required defaultValue="" className={inputClass}><option value="" disabled>Selecciona un negocio</option>{(partners ?? []).filter((p) => p.is_active).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <Field label="Tipo de relación"><select name="relationship_type" className={inputClass}><option value="editorial">Aliado local (editorial)</option><option value="paid_marketing">Marketing pagado</option><option value="sponsor">Patrocinador</option></select></Field>
          <Field label="Texto para mostrar (opcional)"><input name="display_text" maxLength={500} placeholder="Servicio, ubicación u otra descripción breve" className={inputClass} /></Field>
          <div className="md:col-span-2"><button className={buttonClass}>Guardar relación</button></div>
        </form>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Relaciones actuales</h2>
        {(links ?? []).length === 0 ? <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Todavía no hay negocios asociados a lugares.</p> : <div className="overflow-x-auto rounded-2xl border border-border bg-card"><table className="w-full text-left text-sm"><thead className="bg-muted/70 text-muted-foreground"><tr><th className="p-3">Lugar</th><th className="p-3">Negocio</th><th className="p-3">Relación pública</th><th className="p-3">Estado</th></tr></thead><tbody>{links?.map((row) => <tr key={row.id} className="border-t border-border"><td className="p-3">{relationName(row.listings)}</td><td className="p-3">{relationName(row.partners)}</td><td className="p-3">{row.relationship_type === "editorial" ? "Aliado local" : row.relationship_type === "paid_marketing" ? "Anuncio pagado" : "Patrocinador"}</td><td className="p-3">{row.is_active ? "Activo" : "Oculto"}</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  )
}

const inputClass = "min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
const buttonClass = "inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1.5 text-sm font-medium">{label}{children}</label> }
function relationName(value: { name?: string; title?: string } | Array<{ name?: string; title?: string }> | null) { const item = Array.isArray(value) ? value[0] : value; return item?.name ?? item?.title ?? "—" }
function relationDepartment(value: { name?: string } | Array<{ name?: string }> | null) { const item = Array.isArray(value) ? value[0] : value; return item?.name ?? "—" }
