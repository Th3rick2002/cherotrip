import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchField } from "@/components/listings/search-field"
import {
  CategoryChip,
  FilterChip,
} from "@/components/listings/category-chip"
import { DirectoryCard } from "@/components/listings/listing-cards"
import { DEPARTMENTS } from "@/lib/types/listing"
import {
  getCategories,
  searchListings,
} from "@/lib/listings/queries"
import { Skeleton } from "@/components/ui/skeleton"

type ExplorarSearchParams = Promise<{
  q?: string
  categoria?: string
  departamento?: string
  tag?: string
}>

export const metadata: Metadata = {
  title: "Explorar",
  description:
    "Directorio verificado de eventos y lugares del oriente de El Salvador. Filtra por categoría y departamento.",
  alternates: { canonical: "/explorar" },
}

export default function ExplorarPage({
  searchParams,
}: {
  searchParams: ExplorarSearchParams
}) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Explorar
        </h1>
        <p className="text-muted-foreground">
          Directorio verificado · Oriente de El Salvador
        </p>
        <Suspense fallback={<Skeleton className="h-12 w-full rounded-2xl" />}>
          <ExplorarSearch searchParams={searchParams} />
        </Suspense>
      </section>

      <Suspense fallback={<ExplorarSkeleton />}>
        <ExplorarResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function ExplorarSearch({
  searchParams,
}: {
  searchParams: ExplorarSearchParams
}) {
  const params = await searchParams
  return <SearchField defaultValue={params.q?.trim() ?? ""} />
}

async function ExplorarResults({
  searchParams,
}: {
  searchParams: ExplorarSearchParams
}) {
  const params = await searchParams
  const q = params.q?.trim() || undefined
  const categoria = params.categoria || undefined
  const departamento = params.departamento || undefined
  const tag = params.tag || undefined

  const [categories, result] = await Promise.all([
    getCategories(),
    searchListings({
      q,
      category: categoria,
      department: departamento,
      tag,
    }),
  ])

  function hrefFor(next: {
    categoria?: string | null
    departamento?: string | null
    tag?: string | null
  }) {
    const sp = new URLSearchParams()
    if (q) sp.set("q", q)

    const cat =
      next.categoria === null ? undefined : (next.categoria ?? categoria)
    const dep =
      next.departamento === null
        ? undefined
        : (next.departamento ?? departamento)
    const nextTag = next.tag === null ? undefined : (next.tag ?? tag)

    if (cat) sp.set("categoria", cat)
    if (dep) sp.set("departamento", dep)
    if (nextTag) sp.set("tag", nextTag)

    const qs = sp.toString()
    return qs ? `/explorar?${qs}` : "/explorar"
  }

  return (
    <>
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Categoría
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                slug={cat.slug}
                name={cat.name}
                icon={cat.icon}
                active={categoria === cat.slug}
                href={hrefFor({
                  categoria: categoria === cat.slug ? null : cat.slug,
                })}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Departamento
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {DEPARTMENTS.map((dep) => (
              <FilterChip
                key={dep}
                label={dep}
                active={departamento === dep}
                href={hrefFor({
                  departamento: departamento === dep ? null : dep,
                })}
              />
            ))}
          </div>
        </div>

        {tag ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Colección: {tag}
            </span>
            <a
              href={hrefFor({ tag: null })}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Quitar
            </a>
          </div>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        {result.total} resultado{result.total === 1 ? "" : "s"}
      </p>

      {result.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          No hay resultados con esos filtros.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {result.items.map((listing) => (
            <DirectoryCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  )
}

function ExplorarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  )
}
