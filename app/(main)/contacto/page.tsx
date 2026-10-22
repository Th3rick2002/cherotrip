import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl } from "@/lib/whatsapp"

export const metadata = {
  title: "Contacto / Soporte",
}

const SUPPORT_PHONE = "50370000000"

export default function ContactoPage() {
  const href = buildWhatsAppUrl({
    phone: SUPPORT_PHONE,
    title: "Soporte Cherotrip",
    type: "place",
    slug: "soporte",
  })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Contacto / Soporte
        </h1>
        <p className="text-muted-foreground">
          ¿Dudas sobre un listado o quieres publicar con nosotros? Escríbenos.
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-whatsapp px-5 text-base font-semibold text-whatsapp-foreground shadow-sm transition hover:brightness-95"
      >
        <MessageCircle className="size-5" />
        WhatsApp de soporte
      </a>
      <p className="text-xs text-muted-foreground">
        Número placeholder MVP: +{SUPPORT_PHONE}
      </p>
    </div>
  )
}
