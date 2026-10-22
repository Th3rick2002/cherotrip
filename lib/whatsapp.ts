type BuildWhatsAppUrlInput = {
  phone: string
  title: string
  type: "event" | "place"
  slug: string
  origin?: string
}

/** Normaliza a dígitos internacionales (SV: 503…). */
export function normalizeWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, "")
}

export function buildWhatsAppUrl({
  phone,
  title,
  type,
  slug,
  origin = "https://cherotrip.com",
}: BuildWhatsAppUrlInput): string {
  const path = type === "event" ? "evento" : "lugar"
  const url = `${origin.replace(/\/$/, "")}/${path}/${slug}`
  const text = `Hola, vengo de Cherotrip. Me interesa "${title}" (${url}). ¿Me dan más info?`
  const digits = normalizeWhatsAppPhone(phone)
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
