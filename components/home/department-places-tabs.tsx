"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "cn"
import type { Department, Listing } from "@/lib/types/listing"
import { EventCard, PlaceCard } from "@/components/listings/listing-cards"

type DepartmentPlacesTabsProps = {
  departments: Department[]
  listingsByDepartment: Record<string, Listing[]>
}

export function DepartmentPlacesTabs({
  departments,
  listingsByDepartment,
}: DepartmentPlacesTabsProps) {
  const initial =
    departments.find((dep) => (listingsByDepartment[dep.slug]?.length ?? 0) > 0) ?? departments[0]
  const [active, setActive] = useState<string>(initial?.slug ?? "")
  const listings = listingsByDepartment[active] ?? []
  const activeDepartment = departments.find((department) => department.slug === active)

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">
          Explora por departamento
        </h2>
        <Link
          href={active ? `/explorar?departamento=${encodeURIComponent(active)}` : "/explorar"}
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div
        role="tablist"
        aria-label="Departamentos"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:px-0"
      >
        {departments.map((department) => {
          const selected = department.slug === active
          return (
            <button
              key={department.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(department.slug)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
              )}
            >
              {department.name}
            </button>
          )
        })}
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          {activeDepartment
            ? `Aún no hay lugares ni eventos próximos publicados en ${activeDepartment.name}.`
            : "Todavía no hay departamentos activos en el catálogo."}
        </div>
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:px-0">
          {listings.map((listing) => (
            listing.type === "event"
              ? <EventCard key={listing.id} listing={listing} />
              : <PlaceCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}
