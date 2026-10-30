"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { CheckCircle2, ImagePlus, LoaderCircle } from "lucide-react"
import { createPublicClient } from "@/lib/supabase/public"
import type { Department, ListingType } from "@/lib/types/listing"

const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif",
}
const fieldClass = "min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
const areaClass = "w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function CommunityContributionForm({ departments }: { departments: Department[] }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [type, setType] = useState<ListingType>("place")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const form = event.currentTarget
    const data = new FormData(form)
    const title = String(data.get("title") ?? "").trim()
    const departmentId = Number(data.get("department_id"))
    const description = String(data.get("description") ?? "").trim()
    const comment = String(data.get("comment") ?? "").trim()
    const contact = String(data.get("contact_optional") ?? "").trim()
    const startsAtRaw = String(data.get("starts_at") ?? "")
    const endsAtRaw = String(data.get("ends_at") ?? "")
    const photo = data.get("photo")

    if (title.length < 2 || title.length > 160) return setError("El nombre debe tener entre 2 y 160 caracteres.")
    if (!departments.some((department) => department.id === departmentId && department.is_active)) return setError("Selecciona un departamento válido.")
    if (description.length < 10 || description.length > 10000) return setError("La descripción debe tener entre 10 y 10,000 caracteres.")
    if (comment.length < 10 || comment.length > 2000) return setError("Cuéntanos un detalle adicional (10 a 2,000 caracteres).")
    if (contact.length > 160) return setError("El contacto no puede superar 160 caracteres.")
    if (type === "event" && !startsAtRaw) return setError("Indica cuándo inicia el evento.")
    if (photo instanceof File && photo.size > 0) {
      if (!PHOTO_EXTENSIONS[photo.type]) return setError("La foto debe ser JPG, PNG, WebP o AVIF.")
      if (photo.size > MAX_PHOTO_SIZE) return setError("La foto no puede pesar más de 5 MB.")
    }

    setBusy(true)
    try {
      const supabase = createPublicClient()
      let photoPath: string | null = null
      if (photo instanceof File && photo.size > 0) {
        photoPath = `${crypto.randomUUID()}.${PHOTO_EXTENSIONS[photo.type]}`
        const { error: uploadError } = await supabase.storage.from("community-submission-photos").upload(photoPath, photo, { contentType: photo.type, upsert: false })
        if (uploadError) throw new Error("No pudimos subir la foto. Intenta con otra imagen.")
      }

      const localToIso = (value: string) => value ? new Date(`${value}:00-06:00`).toISOString() : null
      const { error: insertError } = await supabase.from("community_submissions").insert({
        title,
        listing_type: type,
        department_id: departmentId,
        description,
        comment,
        meeting_point: String(data.get("meeting_point") ?? "").trim() || null,
        schedule_text: type === "place" ? String(data.get("schedule_text") ?? "").trim() || null : null,
        price_from: String(data.get("price_from") ?? "").trim() ? Number(data.get("price_from")) : null,
        payment_methods: String(data.get("payment_methods") ?? "").split(/[\n,]/).map((x) => x.trim()).filter(Boolean),
        transport_info: String(data.get("transport_info") ?? "").trim() || null,
        accessibility_notes: String(data.get("accessibility_notes") ?? "").trim() || null,
        tags: String(data.get("tags") ?? "").split(/[\n,]/).map((x) => x.trim()).filter(Boolean),
        starts_at: type === "event" ? localToIso(startsAtRaw) : null,
        ends_at: type === "event" ? localToIso(endsAtRaw) : null,
        photo_path: photoPath,
        contact_optional: contact || null,
      })
      if (insertError) throw new Error("No pudimos enviar tu aporte. Inténtalo de nuevo.")
      form.reset()
      setType("place")
      setSuccess(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ocurrió un error al enviar el aporte. Inténtalo de nuevo.")
    } finally {
      setBusy(false)
    }
  }

  if (success) return <div className="py-6 text-center" role="status"><CheckCircle2 className="mx-auto size-12 text-primary" /><h2 className="mt-4 text-xl font-semibold text-foreground">¡Gracias por tu aporte!</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Lo revisaremos antes de compartirlo con la comunidad.</p><Link href="/" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Volver al inicio</Link></div>

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="¿Qué quieres recomendar?" htmlFor="contribution-type">
        <select id="contribution-type" name="listing_type" value={type} onChange={(e) => setType(e.target.value as ListingType)} className={fieldClass}>
          <option value="place">Un lugar</option><option value="event">Un evento</option>
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={type === "event" ? "Nombre del evento" : "Nombre del lugar"} htmlFor="contribution-title"><input id="contribution-title" name="title" required minLength={2} maxLength={160} autoComplete="off" className={fieldClass} /></Field>
        <Field label="Departamento" htmlFor="contribution-department"><select id="contribution-department" name="department_id" required defaultValue="" className={fieldClass}><option value="" disabled>Selecciona un departamento</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></Field>
        <Field label={type === "event" ? "Lugar / punto de encuentro" : "Punto de referencia"} htmlFor="contribution-meeting"><input id="contribution-meeting" name="meeting_point" maxLength={300} className={fieldClass} /></Field>
        {type === "place" ? <Field label="Horario habitual" htmlFor="contribution-schedule"><input id="contribution-schedule" name="schedule_text" maxLength={500} placeholder="Ej. Martes a domingo, 8:00 a. m. – 5:00 p. m." className={fieldClass} /></Field> : <>
          <Field label="Fecha y hora de inicio" htmlFor="contribution-start"><input id="contribution-start" name="starts_at" type="datetime-local" required className={fieldClass} /></Field>
          <Field label="Fecha y hora de cierre (opcional)" htmlFor="contribution-end"><input id="contribution-end" name="ends_at" type="datetime-local" className={fieldClass} /></Field>
        </>}
        <Field label="Precio aproximado desde (USD)" htmlFor="contribution-price"><input id="contribution-price" name="price_from" type="number" min="0" step="0.01" className={fieldClass} /></Field>
        <Field label="Formas de pago" htmlFor="contribution-payments"><input id="contribution-payments" name="payment_methods" maxLength={300} placeholder="Efectivo, tarjeta…" className={fieldClass} /></Field>
      </div>
      <Field label="Descripción" htmlFor="contribution-description"><textarea id="contribution-description" name="description" required minLength={10} maxLength={10000} rows={5} placeholder="Qué ofrece y qué puede hacer una persona visitante…" className={areaClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cómo llegar / transporte" htmlFor="contribution-transport"><textarea id="contribution-transport" name="transport_info" maxLength={3000} rows={3} className={areaClass} /></Field>
        <Field label="Accesibilidad o recomendaciones" htmlFor="contribution-access"><textarea id="contribution-access" name="accessibility_notes" maxLength={3000} rows={3} className={areaClass} /></Field>
      </div>
      <Field label="Etiquetas (separadas por coma)" htmlFor="contribution-tags"><input id="contribution-tags" name="tags" maxLength={500} placeholder="Familiar, aventura, gastronomía…" className={fieldClass} /></Field>
      <Field label="Otro detalle que debamos confirmar" htmlFor="contribution-comment"><textarea id="contribution-comment" name="comment" required minLength={10} maxLength={2000} rows={3} placeholder="Cuéntanos por qué lo recomiendas o cuándo fue la última vez que verificaste la información." className={areaClass} /></Field>
      <Field label="Contacto para dar seguimiento (opcional)" htmlFor="contribution-contact"><input id="contribution-contact" name="contact_optional" maxLength={160} autoComplete="off" className={fieldClass} /></Field>
      <Field label="Foto opcional" htmlFor="contribution-photo"><div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5"><ImagePlus className="size-5 shrink-0 text-muted-foreground" /><input id="contribution-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="min-w-0 flex-1 text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground" /></div><p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP o AVIF · máximo 5 MB</p></Field>
      {error ? <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p> : null}
      <button type="submit" disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70">{busy ? <LoaderCircle className="size-4 animate-spin" /> : null}{busy ? "Enviando aporte…" : "Enviar aporte"}</button>
      <p className="text-center text-xs text-muted-foreground">Tu aporte queda pendiente de revisión y no se publica automáticamente.</p>
    </form>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</label>{children}</div>
}
