import { TicketCheck } from "lucide-react"
import type { Listing } from "@/lib/types/listing"
import { getSafeExternalUrl } from "@/lib/external-url"

export function TicketPurchaseCta({ listing }: { listing: Listing }) {
  const ticketUrl = getSafeExternalUrl(listing.ticket_url)
  if (listing.type !== "event" || !ticketUrl) return null

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <TicketCheck aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground">Entradas del evento</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Serás dirigido a la plataforma externa de venta.
          </p>
        </div>
      </div>
      <a
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <TicketCheck aria-hidden="true" className="size-5" />
        Comprar entradas
      </a>
    </section>
  )
}
