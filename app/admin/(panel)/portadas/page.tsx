import { Suspense } from "react"
import { requireAdmin } from "@/lib/admin/auth"
import { COVER_BUCKET, getCoverPublicUrl } from "@/lib/admin/covers"
import { createClient } from "@/lib/supabase/server"
import { CoverLibrary, type CoverItem } from "@/components/admin/cover-library"
import { CoverUploadPanel } from "@/components/admin/cover-upload-panel"

export const metadata = {
  title: "Portadas",
}

export default function AdminCoversPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Portadas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sube imágenes al bucket <code className="text-xs">{COVER_BUCKET}</code> y copia su URL
          pública. Los formularios de lugares y eventos usarán este mismo selector.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-card" />}>
        <CoversContent />
      </Suspense>
    </div>
  )
}

async function CoversContent() {
  await requireAdmin()
  const covers = await listCovers()

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section className="h-fit rounded-2xl border border-border bg-card p-5">
        <CoverUploadPanel />
      </section>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Imágenes subidas <span className="text-muted-foreground">({covers.length})</span>
        </h2>
        <CoverLibrary covers={covers} />
      </section>
    </div>
  )
}

/** Lista las carpetas del bucket (slug o `general`) y sus imágenes, más recientes primero. */
async function listCovers(): Promise<CoverItem[]> {
  const supabase = await createClient()
  const bucket = supabase.storage.from(COVER_BUCKET)

  const { data: entries } = await bucket.list("", { limit: 1000 })
  // Folders come back without an id; files at the root are not expected.
  const folders = (entries ?? []).filter((entry) => entry.id === null).map((entry) => entry.name)

  const perFolder = await Promise.all(
    folders.map(async (folder) => {
      const { data } = await bucket.list(folder, {
        limit: 1000,
        sortBy: { column: "created_at", order: "desc" },
      })
      return (data ?? [])
        .filter((file) => file.id !== null)
        .map((file) => {
          const path = `${folder}/${file.name}`
          return {
            path,
            folder,
            publicUrl: getCoverPublicUrl(path),
            createdAt: file.created_at ?? null,
            size: typeof file.metadata?.size === "number" ? file.metadata.size : null,
          }
        })
    })
  )

  return perFolder
    .flat()
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
}
