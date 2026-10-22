"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "cn"
import { DEPARTMENTS } from "@/lib/types/listing"
import type { Listing } from "@/lib/types/listing"
import { PlaceCard } from "@/components/listings/listing-cards"

type DepartmentPlacesTabsProps = {
  placesByDepartment: Record<string, Listing[]>
}

export function DepartmentPlacesTabs({
  placesByDepartment,
}: DepartmentPlacesTabsProps) {
  const initial =
    DEPARTMENTS.find((dep) => (placesByDepartment[dep]?.length ?? 0) > 0) ??
    DEPARTMENTS[0]
  const [active, setActive] = useState<string>(initial)
  const places = placesByDepartment[active] ?? []

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">
          Explora por departamento
        </h2>
        <Link
          href={`/explorar?departamento=${encodeURIComponent(active)}`}
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
        {DEPARTMENTS.map((department) => {
          const selected = department === active
          return (
            <button
              key={department}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(department)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
              )}
            >
              {department}
            </button>
          )
        })}
      </div>

      {places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Aún no hay lugares publicados en {active}.
        </div>
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:px-0">
          {places.map((listing) => (
            <PlaceCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}
