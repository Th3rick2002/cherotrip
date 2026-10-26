import { TicketCheck } from "lucide-react"
import type { Listing } from "@/lib/types/listing"
import { getSafeExternalUrl } from "@/lib/external-url"
import { WhatsAppCta } from "@/components/listings/whatsapp-cta"

export function DetailCta({ listing }: { listing: Listing }) {
  const ticketUrl = getSafeExternalUrl(listing.ticket_url)

  if (!ticketUrl) return <WhatsAppCta listing={listing} />

  return (
    <div className="space-y-2">
      <a
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <TicketCheck aria-hidden="true" className="size-5" />
        <span>Comprar entradas</span>
        {listing.ticket_provider ? (
          <span className="max-w-32 truncate rounded-full bg-white/15 px-2 py-1 text-xs font-medium text-white">
            {listing.ticket_provider}
          </span>
        ) : null}
      </a>
      <p className="text-center text-xs text-muted-foreground">
        {listing.ticket_provider
          ? `Venta gestionada por ${listing.ticket_provider}`
          : "Serás redirigido a la plataforma de venta"}
      </p>
    </div>
  )
}
