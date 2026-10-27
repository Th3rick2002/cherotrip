"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getAdmin } from "@/lib/admin/auth"
import { DEPARTMENTS, type ListingType } from "@/lib/types/listing"
import { createClient } from "@/lib/supabase/server"

export type ListingActionState = { error: string | null }

const optionalUrl = z.union([
  z.literal(""),
  z.string().url().refine((value) => /^https?:\/\//i.test(value), "Usa una URL HTTP o HTTPS."),
])

const coreSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(10000),
  department: z.enum(DEPARTMENTS),
  meeting_point: z.string().trim().max(300),
  cover_image_url: optionalUrl,
  price_from: z.number().nonnegative().nullable(),
  payment_methods: z.array(z.string().min(1).max(60)).max(20),
  transport_info: z.string().trim().max(3000),
  accessibility_notes: z.string().trim().max(3000),
  extras: z.record(z.string(), z.unknown()),
  restrictions: z.string().trim().max(3000),
  tags: z.array(z.string().min(1).max(60)).max(40),
  whatsapp_phone: z.string().trim().max(40),
  instagram_url: optionalUrl,
  facebook_url: optionalUrl,
  tiktok_url: optionalUrl,
  accommodation_url: optionalUrl,
  accommodation_search_query: z.string().trim().max(300),
  verified: z.boolean(),
  featured: z.boolean(),
  is_published: z.boolean(),
})

const eventFieldsSchema = z.object({
  starts_at: z.string().min(1),
  ends_at: z.string(),
  ticket_url: optionalUrl,
  ticket_provider: z.string().trim().max(100),
  agenda: z.array(z.object({
    event_date: z.iso.date(),
    start_time: z.string().regex(/^\d{2}:\d{2}$/),
    end_time: z.union([z.literal(""), z.string().regex(/^\d{2}:\d{2}$/)]),
    title: z.string().trim().min(1).max(180),
    description: z.string().trim().max(3000),
    venue: z.string().trim().max(300),
    activity_category_id: z.number().int().positive(),
    sort_order: z.number().int(),
  })).max(100),
})

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function optionalNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim()
  if (!raw) return null
  const number = Number(raw)
  return Number.isFinite(number) ? number : Number.NaN
}

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on"
}

function parseLocalElSalvadorDate(value: string) {
  if (!value) return ""
  const date = new Date(`${value}:00-06:00`)
  return Number.isNaN(date.valueOf()) ? "invalid" : date.toISOString()
}

function parseAgenda(formData: FormData) {
  const raw = String(formData.get("agenda_json") ?? "[]")
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

async function saveListing(
  type: ListingType,
  _previous: ListingActionState,
  formData: FormData
): Promise<ListingActionState> {
  const admin = await getAdmin()
  if (!admin) return { error: "Tu sesión expiró. Inicia sesión de nuevo." }

  const idRaw = String(formData.get("id") ?? "")
  const id = idRaw ? Number(idRaw) : null
  if (idRaw && (!Number.isSafeInteger(id) || (id ?? 0) < 1)) {
    return { error: "El registro solicitado no es válido." }
  }

  const agenda = type === "event" ? parseAgenda(formData) : []
  if (!agenda) return { error: "La agenda no tiene un formato válido." }

  const startsAtRaw = String(formData.get("starts_at") ?? "")
  const endsAtRaw = String(formData.get("ends_at") ?? "")
  const extrasRaw = String(formData.get("extras") ?? "{}").trim() || "{}"
  let extras: unknown
  try {
    extras = JSON.parse(extrasRaw)
  } catch {
    return { error: "El campo de servicios adicionales debe contener JSON válido." }
  }
  if (!extras || typeof extras !== "object" || Array.isArray(extras)) {
    return { error: "Los servicios adicionales deben ser un objeto JSON." }
  }

  const rawTitle = String(formData.get("title") ?? "").trim()
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  const parsed = coreSchema.safeParse({
    title: rawTitle,
    slug,
    description: String(formData.get("description") ?? ""),
    department: String(formData.get("department") ?? ""),
    meeting_point: String(formData.get("meeting_point") ?? ""),
    cover_image_url: String(formData.get("cover_image_url") ?? ""),
    price_from: optionalNumber(formData.get("price_from")),
    payment_methods: splitList(formData.get("payment_methods")),
    transport_info: String(formData.get("transport_info") ?? ""),
    accessibility_notes: String(formData.get("accessibility_notes") ?? ""),
    extras,
    restrictions: String(formData.get("restrictions") ?? ""),
    tags: splitList(formData.get("tags")),
    whatsapp_phone: String(formData.get("whatsapp_phone") ?? "").trim(),
    instagram_url: String(formData.get("instagram_url") ?? "").trim(),
    facebook_url: String(formData.get("facebook_url") ?? "").trim(),
    tiktok_url: String(formData.get("tiktok_url") ?? "").trim(),
    accommodation_url: String(formData.get("accommodation_url") ?? "").trim(),
    accommodation_search_query: String(formData.get("accommodation_search_query") ?? ""),
    verified: checkbox(formData, "verified"),
    featured: checkbox(formData, "featured"),
    is_published: formData.get("publish") === "true"
      ? true
      : formData.get("publish") === "keep"
        ? formData.get("current_is_published") === "true"
        : false,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los campos del formulario." }
  }
  if (parsed.data.is_published && !parsed.data.cover_image_url) {
    return { error: "Sube una portada antes de publicar el contenido." }
  }

  let eventFields: z.infer<typeof eventFieldsSchema> | null = null
  if (type === "event") {
    const startIso = parseLocalElSalvadorDate(startsAtRaw)
    const endIso = parseLocalElSalvadorDate(endsAtRaw)
    if (startIso === "invalid" || endIso === "invalid") {
      return { error: "Las fechas del evento no son válidas." }
    }
    const eventParsed = eventFieldsSchema.safeParse({
      starts_at: startIso,
      ends_at: endIso,
      ticket_url: String(formData.get("ticket_url") ?? "").trim(),
      ticket_provider: String(formData.get("ticket_provider") ?? "").trim(),
      agenda,
    })
    if (!eventParsed.success) {
      return { error: eventParsed.error.issues[0]?.message ?? "Revisa las fechas y la agenda." }
    }
    if (eventParsed.data.ends_at && eventParsed.data.ends_at < eventParsed.data.starts_at) {
      return { error: "La fecha de cierre debe ser posterior al inicio." }
    }
    eventFields = eventParsed.data
  }

  const categoryIds = [...new Set(formData.getAll("category_ids").map(Number))]
  if (categoryIds.some((value) => !Number.isSafeInteger(value) || value < 1)) {
    return { error: "Una de las categorías seleccionadas no es válida." }
  }
  if (categoryIds.length === 0) return { error: "Selecciona al menos una categoría." }

  const submissionRaw = String(formData.get("submission_id") ?? "")
  const submissionId = submissionRaw ? Number(submissionRaw) : null
  if (submissionRaw && (!Number.isSafeInteger(submissionId) || (submissionId ?? 0) < 1)) {
    return { error: "El aporte que se quiere convertir no es válido." }
  }

  const payload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    description: parsed.data.description,
    department: parsed.data.department,
    meeting_point: parsed.data.meeting_point,
    cover_image_url: parsed.data.cover_image_url,
    starts_at: eventFields?.starts_at ?? null,
    ends_at: eventFields?.ends_at || null,
    schedule_text: type === "place" ? String(formData.get("schedule_text") ?? "").trim() : null,
    price_from: parsed.data.price_from,
    payment_methods: parsed.data.payment_methods,
    transport_info: parsed.data.transport_info,
    accessibility_notes: parsed.data.accessibility_notes,
    extras: parsed.data.extras,
    restrictions: parsed.data.restrictions,
    tags: parsed.data.tags,
    whatsapp_phone: parsed.data.whatsapp_phone,
    instagram_url: parsed.data.instagram_url,
    facebook_url: parsed.data.facebook_url,
    tiktok_url: parsed.data.tiktok_url,
    ticket_url: eventFields?.ticket_url ?? "",
    ticket_provider: eventFields?.ticket_provider ?? "",
    accommodation_url: parsed.data.accommodation_url,
    accommodation_search_query: parsed.data.accommodation_search_query,
    verified: parsed.data.verified,
    featured: parsed.data.featured,
    is_published: parsed.data.is_published,
  }

  const supabase = await createClient()
  const { data: listingId, error } = await supabase.rpc("save_admin_listing", {
    p_listing_type: type,
    p_listing_id: id,
    p_listing: payload,
    p_category_ids: categoryIds,
    p_sub_events: eventFields?.agenda ?? [],
    p_submission_id: submissionId,
  })
  if (error || !listingId) {
    if (error?.code === "23505") return { error: "Ese slug ya existe o el aporte ya fue convertido." }
    if (error?.code === "23514") return { error: "Una categoría seleccionada ya no está activa para este tipo." }
    return { error: "No se pudo guardar. Revisa los datos y vuelve a intentarlo." }
  }

  revalidateTag("public-listings", "max")
  revalidateTag("public-categories", "max")
  revalidateTag("home-content", "max")
  revalidatePath("/")
  revalidatePath("/explorar")
  revalidatePath(type === "event" ? `/evento/${parsed.data.slug}` : `/lugar/${parsed.data.slug}`)
  revalidatePath(`/admin/${type === "event" ? "eventos" : "lugares"}`)
  redirect(`/admin/${type === "event" ? "eventos" : "lugares"}?saved=1`)
}

export async function savePlaceAction(previous: ListingActionState, formData: FormData) {
  return saveListing("place", previous, formData)
}

export async function saveEventAction(previous: ListingActionState, formData: FormData) {
  return saveListing("event", previous, formData)
}
