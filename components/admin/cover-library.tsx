"use client"

import Image from "next/image"
import { useState, useTransition } from "react"
import { Check, Copy, LoaderCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteCover } from "@/lib/admin/cover-actions"

export type CoverItem = {
  path: string
  folder: string
  publicUrl: string
  createdAt: string | null
  size: number | null
}

export function CoverLibrary({ covers }: { covers: CoverItem[] }) {
  if (covers.length === 0) {
    return (
      <p className="mt-4 rounded-xl bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
        Todavía no hay imágenes. Sube la primera desde el panel de la izquierda.
      </p>
    )
  }

  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
      {covers.map((cover) => (
        <CoverCard key={cover.path} cover={cover} />
      ))}
    </ul>
  )
}

function CoverCard({ cover }: { cover: CoverItem }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [deleting, startDelete] = useTransition()

  async function copy() {
    await navigator.clipboard.writeText(cover.publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function remove() {
    if (!window.confirm("¿Borrar esta imagen? Los listings que la usen quedarán sin portada.")) return
    setError("")
    startDelete(async () => {
      const result = await deleteCover(cover.path)
      if (!result.ok) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <li className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="relative aspect-[16/9] bg-muted">
        <Image
          src={cover.publicUrl}
          alt={`Portada en ${cover.folder}`}
          fill
          sizes="(min-width: 640px) 320px, 100vw"
          unoptimized
          className={`object-cover ${deleting ? "opacity-50" : ""}`}
        />
      </div>
      <div className="space-y-2 p-3">
        <p className="truncate text-xs text-muted-foreground" title={cover.path}>
          <span className="font-semibold text-foreground">{cover.folder}</span>
          {cover.size ? ` · ${formatSize(cover.size)}` : null}
          {cover.createdAt ? ` · ${formatDate(cover.createdAt)}` : null}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            {copied ? (
              <Check className="size-3.5 text-primary" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? "Copiada" : "Copiar URL"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            aria-label="Borrar imagen"
            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border px-3 text-destructive transition hover:bg-destructive/10 disabled:cursor-wait"
          >
            {deleting ? (
              <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
        {error ? (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </li>
  )
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium" }).format(new Date(iso))
}
