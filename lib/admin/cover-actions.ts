"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getAdmin } from "@/lib/admin/auth"
import {
  COVER_BUCKET,
  COVER_DEFAULT_FOLDER,
  COVER_FOLDER_PATTERN,
  COVER_MAX_BYTES,
  COVER_PATH_PATTERN,
  COVER_TYPES,
  getCoverPublicUrl,
  isCoverContentType,
} from "@/lib/admin/covers"
import { createClient } from "@/lib/supabase/server"

export type CoverUploadTicket =
  | { ok: true; path: string; token: string; publicUrl: string }
  | { ok: false; error: string }

const uploadSchema = z.object({
  contentType: z.string().refine(isCoverContentType, "La imagen debe ser JPG, PNG o WebP."),
  size: z
    .number()
    .int()
    .positive("El archivo está vacío.")
    .max(COVER_MAX_BYTES, "La imagen no puede pesar más de 5 MB."),
  folder: z
    .string()
    .max(120)
    .regex(COVER_FOLDER_PATTERN, "Carpeta inválida.")
    .optional(),
})

/**
 * Reserva una ruta en `listing-covers` y devuelve un token de subida firmado.
 * El navegador sube el archivo directo a Storage con ese token, así la imagen
 * no pasa por la función (Vercel limita el cuerpo de las peticiones a ~4.5 MB).
 * Storage vuelve a aplicar el tamaño y los tipos del bucket al recibirlo.
 */
export async function createCoverUpload(input: {
  contentType: string
  size: number
  folder?: string
}): Promise<CoverUploadTicket> {
  const admin = await getAdmin()
  if (!admin) return { ok: false, error: "Tu sesión expiró. Vuelve a iniciar sesión." }

  const parsed = uploadSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Imagen inválida." }
  }

  const { contentType, folder = COVER_DEFAULT_FOLDER } = parsed.data
  const extension = COVER_TYPES[contentType as keyof typeof COVER_TYPES]
  const path = `${folder}/${crypto.randomUUID()}.${extension}`

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(COVER_BUCKET)
    .createSignedUploadUrl(path)
  if (error || !data) {
    return { ok: false, error: "No pudimos preparar la subida. Inténtalo de nuevo." }
  }

  return { ok: true, path: data.path, token: data.token, publicUrl: getCoverPublicUrl(data.path) }
}

export type DeleteCoverResult = { ok: true } | { ok: false; error: string }

/** Borra una portada del bucket. No toca listings que todavía la referencien. */
export async function deleteCover(path: string): Promise<DeleteCoverResult> {
  const admin = await getAdmin()
  if (!admin) return { ok: false, error: "Tu sesión expiró. Vuelve a iniciar sesión." }

  if (!COVER_PATH_PATTERN.test(path)) return { ok: false, error: "Ruta inválida." }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(COVER_BUCKET).remove([path])
  if (error || !data?.length) {
    return { ok: false, error: "No pudimos borrar la imagen." }
  }

  revalidatePath("/admin/portadas")
  return { ok: true }
}
