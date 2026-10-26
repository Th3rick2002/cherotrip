"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Bookmark, Compass } from "lucide-react"
import type { Listing } from "@/lib/types/listing"
import { useFavorites } from "@/hooks/use-favorites"
import { DirectoryCard } from "@/components/listings/listing-cards"

export function FavoriteListings() {
  const { ids, ready } = useFavorites()
  const [result, setResult] = useState<{
    key: string
    items: Listing[]
    error: boolean
  } | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const idsKey = ids.join(",")

  useEffect(() => {
    if (!ready || idsKey.length === 0) return

    const controller = new AbortController()
    const savedIds = idsKey.split(",").map(Number)
    const batches = Array.from(
      { length: Math.ceil(savedIds.length / 100) },
      (_, index) => savedIds.slice(index * 100, index * 100 + 100)
    )
    Promise.all(
      batches.map(async (batch) => {
        const response = await fetch(`/api/listings?ids=${batch.join(",")}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Could not load saved listings")
        return (await response.json()) as Listing[]
      })
    )
      .then((batchesOfListings) => {
        const listings = batchesOfListings.flat()
        const byId = new Map(listings.map((listing) => [listing.id, listing]))
        setResult({
          key: idsKey,
          items: savedIds.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])),
          error: false,
        })
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return
        setResult({ key: idsKey, items: [], error: true })
      })

    return () => controller.abort()
  }, [idsKey, ready, reloadKey])

  const loading = !ready || (ids.length > 0 && result?.key !== idsKey)
  const error = ids.length > 0 && result?.key === idsKey && result.error
  const visibleItems = ids.length === 0 || result?.key !== idsKey ? [] : result.items

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Bookmark aria-hidden="true" className="size-5" />
          <span className="text-sm font-semibold">Tu colección personal</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Guardados</h1>
        <p className="text-muted-foreground">
          Ten a mano los lugares y eventos que quieres visitar.
        </p>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Cargando tus guardados…
        </div>
      ) : ids.length > 0 && error ? (
        <div role="alert" className="rounded-2xl border border-border bg-card px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No pudimos cargar tus guardados.</p>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Compass aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Aún no tienes lugares guardados
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Explora el directorio y toca el corazón de los sitios o eventos que quieras tener a mano.
          </p>
          <Link
            href="/explorar"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Compass className="size-4" />
            Explorar el directorio
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleItems.map((listing) => (
            <DirectoryCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}
