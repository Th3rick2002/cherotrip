/** Configuración compartida del bucket de portadas (cliente y servidor). */

export const COVER_BUCKET = "listing-covers"

/** Debe coincidir con `file_size_limit` del bucket. */
export const COVER_MAX_BYTES = 5 * 1024 * 1024

/** Debe coincidir con `allowed_mime_types` del bucket. */
export const COVER_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const

export type CoverContentType = keyof typeof COVER_TYPES

export const COVER_DEFAULT_FOLDER = "general"

/** Carpeta = slug del listing (`kebab-case`) o `general`. */
export const COVER_FOLDER_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Misma forma que exige la política de `storage.objects`. */
export const COVER_PATH_PATTERN =
  /^[a-z0-9]+(-[a-z0-9]+)*\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/

export function isCoverContentType(type: string): type is CoverContentType {
  return Object.hasOwn(COVER_TYPES, type)
}

/** URL pública permanente de un objeto del bucket (no requiere sesión). */
export function getCoverPublicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")
  const encoded = path.split("/").map(encodeURIComponent).join("/")
  return `${base}/storage/v1/object/public/${COVER_BUCKET}/${encoded}`
}
