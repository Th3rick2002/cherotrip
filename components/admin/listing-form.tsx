"use client"

import { useActionState, useMemo, useState, type Dispatch, type InputHTMLAttributes, type ReactNode, type SetStateAction } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { AdminCategory, AdminActivityCategory } from "@/lib/admin/content"
import type { Listing, ListingType, SubEvent } from "@/lib/types/listing"
import { DEPARTMENTS } from "@/lib/types/listing"
import { CoverPicker } from "@/components/admin/cover-picker"
import { saveEventAction, savePlaceAction, type ListingActionState } from "@/lib/admin/listing-actions"

type FormListing = Partial<Listing> & {
  id?: number
  is_published?: boolean
  category_ids?: number[]
  sub_events?: SubEvent[]
  submission_id?: number
}

type ListingFormProps = {
  type: ListingType
  categories: AdminCategory[]
  activityCategories: AdminActivityCategory[]
  initial?: FormListing
  submission?: { id: number; place_name: string; department: string; comment: string } | null
}

const fieldClass = "min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
const areaClass = "w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
const labelClass = "mb-1.5 block text-sm font-medium text-foreground"

export function ListingForm({ type, categories, activityCategories, initial = {}, submission }: ListingFormProps) {
  const action = type === "place" ? savePlaceAction : saveEventAction
  const [state, formAction, pending] = useActionState<ListingActionState, FormData>(action, { error: null })
  const [title, setTitle] = useState(initial.title ?? submission?.place_name ?? "")
  const [slug, setSlug] = useState(initial.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug))
  const [agenda, setAgenda] = useState<AgendaDraft[]>(toAgendaDrafts(initial.sub_events ?? [], activityCategories[0]?.id ?? 0))
  const selected = new Set(initial.category_ids ?? [])
  const categoryOptions = categories.filter((category) => category.listing_types.includes(type) && (category.is_active || selected.has(category.id)))
  const extrasValue = useMemo(() => JSON.stringify(initial.extras ?? {}, null, 2), [initial.extras])

  const descriptionValue = initial.description ?? submission?.comment ?? ""

  return (
    <form action={formAction} className="space-y-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {initial.id ? <input type="hidden" name="current_is_published" value={initial.is_published ? "true" : "false"} /> : null}
      {submission ? <input type="hidden" name="submission_id" value={submission.id} /> : null}

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <SectionTitle title="Información general" description="Los datos que identifican y presentan el contenido." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre" htmlFor="title">
            <input id="title" name="title" required minLength={2} maxLength={160} value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugEdited) setSlug(slugify(value)) }} className={fieldClass} />
          </Field>
          <Field label="Slug de la URL" htmlFor="slug">
            <input id="slug" name="slug" required minLength={2} maxLength={180} value={slug} onChange={(event) => { setSlugEdited(true); setSlug(slugify(event.target.value)) }} className={fieldClass} />
          </Field>
          <Field label="Departamento" htmlFor="department">
            <select id="department" name="department" required defaultValue={initial.department ?? submission?.department ?? ""} className={fieldClass}>
              <option value="" disabled>Selecciona un departamento</option>
              {DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </Field>
          <Field label="Punto de referencia" htmlFor="meeting_point">
            <input id="meeting_point" name="meeting_point" maxLength={300} defaultValue={initial.meeting_point ?? ""} className={fieldClass} />
          </Field>
        </div>
        <Field label="Descripción" htmlFor="description">
          <textarea id="description" name="description" required minLength={10} maxLength={10000} rows={5} defaultValue={descriptionValue} className={areaClass} />
        </Field>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <SectionTitle title="Tipo y portada" description="El tipo de contenido queda fijado por esta sección." />
        <p className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
          Tipo: <strong className="text-foreground">{type === "place" ? "Lugar" : "Evento"}</strong>
        </p>
        <fieldset>
          <legend className={labelClass}>Categorías</legend>
          {categoryOptions.length === 0 ? (
            <p className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-800">No hay categorías activas para este tipo. Crea o asigna una desde Categorías.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categoryOptions.map((category) => (
                <label key={category.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm">
                  <input type="checkbox" name="category_ids" value={category.id} defaultChecked={selected.has(category.id)} className="size-4 accent-primary" />
                  <span>{category.name}{category.is_active ? "" : " (inactiva)"}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
        <CoverPicker folder={slug || undefined} defaultUrl={initial.cover_image_url} name="cover_image_url" label="Portada" />
      </section>

      {type === "place" ? (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <SectionTitle title="Visita y logística" description="Información práctica para planificar la visita." />
          <Field label="Horario habitual" htmlFor="schedule_text">
            <textarea id="schedule_text" name="schedule_text" rows={3} maxLength={1000} defaultValue={initial.schedule_text ?? ""} placeholder="Ej. Todos los días · 8:00 a. m. – 5:00 p. m." className={areaClass} />
          </Field>
          <LogisticsFields initial={initial} extrasValue={extrasValue} />
        </section>
      ) : (
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <SectionTitle title="Fechas y agenda" description="Define cuándo ocurre y agrega actividades opcionales por día." />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Fecha y hora de inicio" htmlFor="starts_at">
              <input id="starts_at" name="starts_at" type="datetime-local" required defaultValue={toDateTimeLocal(initial.starts_at)} className={fieldClass} />
            </Field>
            <Field label="Fecha y hora de cierre" htmlFor="ends_at">
              <input id="ends_at" name="ends_at" type="datetime-local" defaultValue={toDateTimeLocal(initial.ends_at)} className={fieldClass} />
            </Field>
          </div>
          <fieldset className="space-y-3">
            <legend className={labelClass}>Agenda (opcional)</legend>
            <input type="hidden" name="agenda_json" value={JSON.stringify(agenda.map((item, index) => ({ ...item, sort_order: index * 10 })))} />
            {agenda.map((item, index) => (
              <div key={item.key} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                <Field label="Fecha" htmlFor={`agenda-date-${index}`}>
                  <input id={`agenda-date-${index}`} type="date" required value={item.event_date} onChange={(event) => updateAgenda(setAgenda, index, "event_date", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Categoría de actividad" htmlFor={`agenda-category-${index}`}>
                  <select id={`agenda-category-${index}`} required value={item.activity_category_id} onChange={(event) => updateAgenda(setAgenda, index, "activity_category_id", Number(event.target.value))} className={fieldClass}>
                    {activityCategories.map((category) => <option key={category.id} value={category.id} disabled={!category.is_active && item.activity_category_id !== category.id}>{category.name}{category.is_active ? "" : " (inactiva)"}</option>)}
                  </select>
                </Field>
                <Field label="Hora de inicio" htmlFor={`agenda-start-${index}`}>
                  <input id={`agenda-start-${index}`} type="time" required value={item.start_time} onChange={(event) => updateAgenda(setAgenda, index, "start_time", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Hora de cierre" htmlFor={`agenda-end-${index}`}>
                  <input id={`agenda-end-${index}`} type="time" value={item.end_time} onChange={(event) => updateAgenda(setAgenda, index, "end_time", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Actividad" htmlFor={`agenda-title-${index}`}>
                  <input id={`agenda-title-${index}`} required maxLength={180} value={item.title} onChange={(event) => updateAgenda(setAgenda, index, "title", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Lugar" htmlFor={`agenda-venue-${index}`}>
                  <input id={`agenda-venue-${index}`} maxLength={300} value={item.venue} onChange={(event) => updateAgenda(setAgenda, index, "venue", event.target.value)} className={fieldClass} />
                </Field>
                <Field label="Descripción de actividad" htmlFor={`agenda-description-${index}`}>
                  <textarea id={`agenda-description-${index}`} rows={2} maxLength={3000} value={item.description} onChange={(event) => updateAgenda(setAgenda, index, "description", event.target.value)} className={areaClass} />
                </Field>
                <div className="flex items-end justify-end">
                  <button type="button" onClick={() => setAgenda((rows) => rows.filter((_, rowIndex) => rowIndex !== index))} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm text-destructive hover:bg-destructive/10">
                    <Trash2 className="size-4" aria-hidden="true" /> Quitar actividad
                  </button>
                </div>
              </div>
            ))}
              <button type="button" onClick={() => setAgenda((rows) => [...rows, emptyAgenda(activityCategories.find((category) => category.is_active)?.id ?? 0)])} disabled={activityCategories.filter((category) => category.is_active).length === 0} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50">
              <Plus className="size-4" aria-hidden="true" /> Agregar actividad
            </button>
          </fieldset>
          <LogisticsFields initial={initial} extrasValue={extrasValue} />
        </section>
      )}

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <SectionTitle title="Contacto y enlaces" description="Agrega solo los canales oficiales que correspondan." />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput name="whatsapp_phone" label="WhatsApp (con código de país)" defaultValue={initial.whatsapp_phone ?? ""} placeholder="50370000000" />
          <TextInput name="instagram_url" label="Instagram" type="url" defaultValue={initial.instagram_url ?? ""} />
          <TextInput name="facebook_url" label="Facebook" type="url" defaultValue={initial.facebook_url ?? ""} />
          <TextInput name="tiktok_url" label="TikTok" type="url" defaultValue={initial.tiktok_url ?? ""} />
          <TextInput name="accommodation_url" label="Alojamiento (URL directa)" type="url" defaultValue={initial.accommodation_url ?? ""} />
          <TextInput name="accommodation_search_query" label="Búsqueda de alojamiento" defaultValue={initial.accommodation_search_query ?? ""} placeholder="Ruta-de-las-Flores--El-Salvador" />
          {type === "event" ? <>
            <TextInput name="ticket_url" label="Enlace de compra de entradas" type="url" defaultValue={initial.ticket_url ?? ""} />
            <TextInput name="ticket_provider" label="Proveedor de entradas (interno)" defaultValue={initial.ticket_provider ?? ""} />
          </> : null}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <SectionTitle title="Publicación" description="Guardar como borrador o publicar el contenido para visitantes." />
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <CheckField name="featured" label="Destacar en Home" defaultChecked={initial.featured ?? false} />
          <CheckField name="verified" label="Marcar como verificado" defaultChecked={initial.verified ?? false} />
          {initial.id && initial.is_published ? <p className="basis-full text-muted-foreground">Este contenido está publicado. Al guardar podrás conservarlo publicado o retirarlo como borrador.</p> : null}
        </div>
      </section>

      {state.error ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{state.error}</p> : null}
      <div className="sticky bottom-3 z-10 flex flex-wrap justify-end gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
        <SubmitButton name="publish" value="false" pending={pending} variant="outline" confirmMessage={initial.is_published ? "¿Retirar esta publicación y guardarla como borrador?" : undefined}>Guardar como borrador</SubmitButton>
        {initial.id ? <SubmitButton name="publish" value="keep" pending={pending} variant="outline">Guardar cambios</SubmitButton> : null}
        <SubmitButton name="publish" value="true" pending={pending}>Guardar y publicar</SubmitButton>
      </div>
    </form>
  )
}

type AgendaDraft = {
  key: string
  event_date: string
  start_time: string
  end_time: string
  title: string
  description: string
  venue: string
  activity_category_id: number
}

function emptyAgenda(activityCategoryId: number): AgendaDraft {
  return { key: crypto.randomUUID(), event_date: "", start_time: "", end_time: "", title: "", description: "", venue: "", activity_category_id: activityCategoryId }
}

function toAgendaDrafts(events: SubEvent[], fallbackCategory: number): AgendaDraft[] {
  return events.map((event) => ({
    key: String(event.id),
    event_date: event.event_date,
    start_time: event.start_time.slice(0, 5),
    end_time: event.end_time?.slice(0, 5) ?? "",
    title: event.title,
    description: event.description ?? "",
    venue: event.venue ?? "",
    activity_category_id: event.activity_category_id || fallbackCategory,
  }))
}

function updateAgenda<K extends keyof Omit<AgendaDraft, "key">>(
  setRows: Dispatch<SetStateAction<AgendaDraft[]>>,
  index: number,
  key: K,
  value: AgendaDraft[K]
) {
  setRows((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
}

function LogisticsFields({ initial, extrasValue }: { initial: FormListing; extrasValue: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TextInput name="price_from" label="Precio desde (USD)" type="number" min="0" step="0.01" defaultValue={initial.price_from ?? ""} />
      <Field label="Formas de pago" htmlFor="payment_methods">
        <textarea id="payment_methods" name="payment_methods" rows={2} defaultValue={(initial.payment_methods ?? []).join(", ")} placeholder="Efectivo, tarjeta, transferencia" className={areaClass} />
      </Field>
      <Field label="Transporte / cómo llegar" htmlFor="transport_info">
        <textarea id="transport_info" name="transport_info" rows={3} defaultValue={initial.transport_info ?? ""} className={areaClass} />
      </Field>
      <Field label="Accesibilidad" htmlFor="accessibility_notes">
        <textarea id="accessibility_notes" name="accessibility_notes" rows={3} defaultValue={initial.accessibility_notes ?? ""} className={areaClass} />
      </Field>
      <Field label="Restricciones" htmlFor="restrictions">
        <textarea id="restrictions" name="restrictions" rows={2} defaultValue={initial.restrictions ?? ""} className={areaClass} />
      </Field>
      <Field label="Etiquetas (separadas por coma)" htmlFor="tags">
        <textarea id="tags" name="tags" rows={2} defaultValue={(initial.tags ?? []).join(", ")} className={areaClass} />
      </Field>
      <Field label="Servicios adicionales (JSON)" htmlFor="extras">
        <textarea id="extras" name="extras" rows={4} defaultValue={extrasValue} className={`${areaClass} font-mono text-xs`} />
      </Field>
    </div>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return <div><label htmlFor={htmlFor} className={labelClass}>{label}</label>{children}</div>
}

function TextInput({ name, label, defaultValue, type = "text", ...props }: InputHTMLAttributes<HTMLInputElement> & { name: string; label: string }) {
  return <Field label={label} htmlFor={name}><input id={name} name={name} type={type} defaultValue={defaultValue} className={fieldClass} {...props} /></Field>
}

function CheckField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return <label className="inline-flex items-center gap-2"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-primary" />{label}</label>
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return <header><h2 className="text-base font-semibold text-foreground">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></header>
}

function SubmitButton({ children, name, value, pending, variant = "primary", confirmMessage }: { children: ReactNode; name: string; value: string; pending: boolean; variant?: "primary" | "outline"; confirmMessage?: string }) {
  return <button type="submit" name={name} value={value} disabled={pending} onClick={(event) => { if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault() }} className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold disabled:opacity-60 ${variant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-muted"}`}>
    {pending ? "Guardando…" : children}
  </button>
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return ""
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/El_Salvador",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(value)).replace(" ", "T")
}
