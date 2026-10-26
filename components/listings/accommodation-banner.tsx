import { ArrowUpRight, BedDouble } from "lucide-react"
import type { Listing } from "@/lib/types/listing"
import { buildAirbnbSearchUrl, getSafeExternalUrl } from "@/lib/external-url"

export function AccommodationBanner({ listing }: { listing: Listing }) {
  const directUrl = getSafeExternalUrl(listing.accommodation_url)
  const searchQuery = listing.accommodation_search_query?.trim() ?? ""
  const href = directUrl ?? buildAirbnbSearchUrl(searchQuery)

  if (!href) return null

  const displayLocation = searchQuery
    .replace(/--/g, ", ")
    .replace(/-/g, " ")

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <BedDouble aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="block text-sm font-semibold text-foreground">
          {directUrl ? "Ver alojamiento recomendado" : "Buscar hospedaje en Airbnb"}
        </span>
        <span className="block text-sm text-muted-foreground">
          {directUrl
            ? "Consulta disponibilidad y detalles del hospedaje"
            : `Opciones cerca de ${displayLocation}`}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-muted-foreground transition group-hover:text-primary"
      />
    </a>
  )
}
