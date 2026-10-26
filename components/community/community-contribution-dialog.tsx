"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, ImagePlus, LoaderCircle } from "lucide-react"
import { createPublicClient } from "@/lib/supabase/public"
import { DEPARTMENTS } from "@/lib/types/listing"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}

export function CommunityContributionDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const form = event.currentTarget
    const data = new FormData(form)
    const placeName = String(data.get("place_name") ?? "").trim()
    const department = String(data.get("department") ?? "").trim()
    const comment = String(data.get("comment") ?? "").trim()
    const contact = String(data.get("contact_optional") ?? "").trim()
    const photo = data.get("photo")

    if (placeName.length < 2 || placeName.length > 120) {
      setError("El nombre debe tener entre 2 y 120 caracteres.")
      return
    }
    if (!DEPARTMENTS.includes(department as (typeof DEPARTMENTS)[number])) {
      setError("Selecciona un departamento válido.")
      return
    }
    if (comment.length < 10 || comment.length > 2000) {
      setError("El comentario debe tener entre 10 y 2,000 caracteres.")
      return
    }
    if (contact.length > 160) {
      setError("El contacto no puede superar 160 caracteres.")
      return
    }
    if (photo instanceof File && photo.size > 0) {
      if (!PHOTO_EXTENSIONS[photo.type]) {
        setError("La foto debe ser JPG, PNG, WebP o AVIF.")
        return
      }
      if (photo.size > MAX_PHOTO_SIZE) {
        setError("La foto no puede pesar más de 5 MB.")
        return
      }
    }

    setBusy(true)
    try {
      const supabase = createPublicClient()
      let photoPath: string | null = null

      if (photo instanceof File && photo.size > 0) {
        photoPath = `${crypto.randomUUID()}.${PHOTO_EXTENSIONS[photo.type]}`
        const { error: uploadError } = await supabase.storage
          .from("community-submission-photos")
          .upload(photoPath, photo, {
            contentType: photo.type,
            upsert: false,
          })
        if (uploadError) throw new Error("No pudimos subir la foto. Intenta con otra imagen.")
      }

      const { error: insertError } = await supabase
        .from("community_submissions")
        .insert({
          place_name: placeName,
          department,
          comment,
          photo_path: photoPath,
          contact_optional: contact || null,
        })
      if (insertError) throw new Error("No pudimos enviar tu aporte. Inténtalo de nuevo.")

      form.reset()
      setSuccess(true)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Ocurrió un error al enviar el aporte. Inténtalo de nuevo."
      )
    } finally {
      setBusy(false)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (nextOpen) {
      setError("")
      setSuccess(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border-border bg-card p-0 pb-[env(safe-area-inset-bottom)] sm:bottom-1/2 sm:rounded-3xl"
      >
        <SheetHeader className="border-b border-border px-5 py-5 pr-14 text-left sm:px-6">
          <SheetTitle className="text-xl font-bold text-foreground">
            Aporta a la comunidad
          </SheetTitle>
          <SheetDescription>
            Recomienda un lugar o evento. El equipo revisará la información antes de publicarla.
          </SheetDescription>
        </SheetHeader>

        {success ? (
          <div className="px-6 py-12 text-center" role="status">
            <CheckCircle2 className="mx-auto size-12 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              ¡Gracias por tu aporte!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Lo revisaremos pronto antes de compartirlo.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-6 min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 px-5 py-5 sm:px-6">
            <div className="space-y-1.5">
              <label htmlFor="contribution-place" className="text-sm font-medium text-foreground">
                Nombre del lugar o evento <span aria-hidden="true">*</span>
              </label>
              <input
                id="contribution-place"
                name="place_name"
                required
                minLength={2}
                maxLength={120}
                autoComplete="off"
                className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contribution-department" className="text-sm font-medium text-foreground">
                Departamento <span aria-hidden="true">*</span>
              </label>
              <select
                id="contribution-department"
                name="department"
                required
                defaultValue=""
                className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>Selecciona un departamento</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contribution-comment" className="text-sm font-medium text-foreground">
                ¿Qué deberíamos saber? <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="contribution-comment"
                name="comment"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contribution-contact" className="text-sm font-medium text-foreground">
                Contacto opcional (WhatsApp o Instagram)
              </label>
              <input
                id="contribution-contact"
                name="contact_optional"
                maxLength={160}
                autoComplete="off"
                className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contribution-photo" className="text-sm font-medium text-foreground">
                Foto opcional
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5">
                <ImagePlus className="size-5 shrink-0 text-muted-foreground" />
                <input
                  id="contribution-photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="min-w-0 flex-1 text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground"
                />
              </div>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP o AVIF · máximo 5 MB</p>
            </div>

            {error ? (
              <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
            >
              {busy ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {busy ? "Enviando aporte…" : "Enviar aporte"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Tu aporte queda pendiente de revisión y no se publica automáticamente.
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
