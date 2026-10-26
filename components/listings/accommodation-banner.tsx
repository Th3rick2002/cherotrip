import { ArrowUpRight, BedDouble, House } from "lucide-react"
import type { Listing } from "@/lib/types/listing"
import { buildAirbnbSearchUrl, getSafeExternalUrl } from "@/lib/external-url"

export function AccommodationBanner({ listing }: { listing: Listing }) {
  const directUrl = getSafeExternalUrl(listing.accommodation_url)
  const searchQuery = listing.accommodation_search_query?.trim() ?? ""
  const href = directUrl ?? buildAirbnbSearchUrl(searchQuery)

  if (!href) return null

  const directAirbnb = directUrl ? isAirbnbUrl(directUrl) : false
  const displayLocation = searchQuery
    .replace(/--/g, ", ")
    .replace(/-/g, " ")
  const description = directUrl
    ? directAirbnb
      ? "Consulta esta recomendación en Airbnb."
      : "Consulta disponibilidad en el sitio del alojamiento."
    : `Explora opciones cerca de ${displayLocation} en Airbnb.`

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <House aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground">Alojamiento recomendado</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <BedDouble aria-hidden="true" className="size-5" />
        {directUrl ? "Ver alojamiento" : "Ver opciones de hospedaje"}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </a>
    </section>
  )
}

function isAirbnbUrl(value: string) {
  try {
    const hostname = new URL(value).hostname.toLowerCase()
    return (
      hostname === "airbnb.com" ||
      hostname.endsWith(".airbnb.com") ||
      /^airbnb\.[a-z]{2,}(\.[a-z]{2,})?$/.test(hostname)
    )
  } catch {
    return false
  }
}
