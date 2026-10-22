import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl } from "@/lib/whatsapp"
import type { Listing } from "@/lib/types/listing"

export function WhatsAppCta({ listing }: { listing: Listing }) {
  const href = buildWhatsAppUrl({
    phone: listing.whatsapp_phone,
    title: listing.title,
    type: listing.type,
    slug: listing.slug,
  })

  return (
    <div className="space-y-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp text-base font-semibold text-whatsapp-foreground shadow-sm transition hover:brightness-95"
      >
        <MessageCircle className="size-5" />
        Contactar por WhatsApp
      </a>
      <p className="text-center text-xs text-muted-foreground">
        Te conectamos por WhatsApp · Mensaje prearmado Cherotrip
      </p>
    </div>
  )
}
