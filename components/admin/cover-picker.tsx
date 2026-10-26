"use client"

import Image from "next/image"
import { useEffect, useId, useRef, useState, type DragEvent } from "react"
import { ImagePlus, LoaderCircle, X } from "lucide-react"
import { createCoverUpload } from "@/lib/admin/cover-actions"
import { COVER_BUCKET, COVER_MAX_BYTES, isCoverContentType } from "@/lib/admin/covers"
import { createClient } from "@/lib/supabase/client"

export type UploadedCover = { path: string; publicUrl: string }

type CoverPickerProps = {
  /** Carpeta dentro del bucket: slug del listing o `general`. */
  folder?: string
  /** URL pública actual (p. ej. `cover_image_url` del listing al editar). */
  defaultUrl?: string | null
  /** Nombre del `<input type="hidden">` con la URL, para usarlo dentro de un `<form>`. */
  name?: string
  label?: string
  /** Bloquea la subida, p. ej. mientras otro campo del formulario es inválido. */
  disabled?: boolean
  onUploaded?: (cover: UploadedCover) => void
  onCleared?: () => void
}

type Status = "idle" | "uploading" | "error"

/**
 * Selector de portada con arrastrar y soltar, vista previa inmediata y subida
 * directa a Supabase Storage mediante un token firmado del servidor.
 */
export function CoverPicker({
  folder,
  defaultUrl = null,
  name,
  label = "Portada",
  disabled = false,
  onUploaded,
  onCleared,
}: CoverPickerProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string | null>(defaultUrl)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  async function handleFile(file: File) {
    setError("")
    if (!isCoverContentType(file.type)) {
      fail("La imagen debe ser JPG, PNG o WebP.")
      return
    }
    if (file.size > COVER_MAX_BYTES) {
      fail("La imagen no puede pesar más de 5 MB.")
      return
    }
    // A renamed non-image file passes the MIME check above; decoding catches it.
    try {
      const bitmap = await createImageBitmap(file)
      bitmap.close()
    } catch {
      fail("El archivo no es una imagen válida.")
      return
    }

    setPreview(URL.createObjectURL(file))
    setStatus("uploading")

    const ticket = await createCoverUpload({ contentType: file.type, size: file.size, folder })
    if (!ticket.ok) {
      fail(ticket.error)
      return
    }

    const { error: uploadError } = await createClient()
      .storage.from(COVER_BUCKET)
      .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type })
    if (uploadError) {
      fail("No pudimos subir la imagen. Inténtalo de nuevo.")
      return
    }

    setUrl(ticket.publicUrl)
    setStatus("idle")
    onUploaded?.({ path: ticket.path, publicUrl: ticket.publicUrl })
  }

  function fail(message: string) {
    setPreview(null)
    setStatus("error")
    setError(message)
  }

  function clear() {
    setUrl(null)
    setPreview(null)
    setStatus("idle")
    setError("")
    if (inputRef.current) inputRef.current.value = ""
    onCleared?.()
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    if (status === "uploading" || disabled) return
    const file = event.dataTransfer.files[0]
    if (file) void handleFile(file)
  }

  const shown = preview ?? url
  const uploading = status === "uploading"
  const locked = uploading || disabled

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {url && !uploading ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            Quitar
          </button>
        ) : null}
      </div>

      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          if (!locked) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-busy={uploading}
        aria-disabled={disabled || undefined}
        className={`relative flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition focus-within:ring-2 focus-within:ring-ring ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/40 hover:border-primary/60"
        } ${uploading ? "cursor-wait" : ""} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {shown ? (
          <Image
            src={shown}
            alt="Vista previa de la portada"
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            unoptimized
            className={`object-cover ${uploading ? "opacity-60" : ""}`}
          />
        ) : (
          <span className="flex flex-col items-center gap-2 px-6 text-sm text-muted-foreground">
            <ImagePlus className="size-8 text-primary" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground">Arrastra una imagen</span> o haz clic
              para elegirla
            </span>
            <span className="text-xs">JPG, PNG o WebP · máximo 5 MB</span>
          </span>
        )}

        {uploading ? (
          <span className="absolute inset-0 flex items-center justify-center gap-2 bg-background/40 text-sm font-semibold text-foreground">
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            Subiendo…
          </span>
        ) : shown ? (
          <span className="absolute bottom-2 right-2 rounded-lg bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
            Cambiar imagen
          </span>
        ) : null}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={locked}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void handleFile(file)
          }}
        />
      </label>

      {name ? <input type="hidden" name={name} value={url ?? ""} /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p className="sr-only" aria-live="polite">
          {uploading ? "Subiendo imagen" : url ? "Imagen lista" : ""}
        </p>
      )}
    </div>
  )
}
