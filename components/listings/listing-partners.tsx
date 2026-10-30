import Image from "next/image"
import { BadgeCheck, Handshake } from "lucide-react"
import type { ListingPartner } from "@/lib/types/listing"

const categoryLabels: Record<ListingPartner["partner"]["category"], string> = {
  food: "Gastronomía",
  accommodation: "Alojamiento",
  transport: "Transporte",
  activities: "Actividades",
  other: "Servicios locales",
}

export function ListingPartners({ partners }: { partners: ListingPartner[] }) {
  if (partners.length === 0) return null
  return (
    <section className="space-y-3" aria-labelledby="local-partners-title">
      <div>
        <p className="text-sm font-medium text-primary">Servicios en la zona</p>
        <h2 id="local-partners-title" className="mt-1 text-lg font-semibold text-foreground">Aliados y patrocinadores</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {partners.map(({ id, relationship_type, display_text, partner }) => {
          const paid = relationship_type !== "editorial"
          const relationshipLabel = relationship_type === "editorial" ? "Aliado local" : relationship_type === "paid_marketing" ? "Anuncio pagado" : "Patrocinador"
          const href = partner.website_url || (partner.whatsapp_phone ? `https://wa.me/${partner.whatsapp_phone.replace(/\D/g, "")}` : partner.instagram_url)
          return (
            <article key={id} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
              {partner.logo_url ? <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted"><Image src={partner.logo_url} alt="" fill sizes="56px" className="object-contain" unoptimized /></div> : <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-primary"><Handshake className="size-6" /></div>}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="font-semibold text-foreground">{partner.name}</h3>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${paid ? "bg-amber-500/15 text-amber-900" : "bg-primary/10 text-primary"}`}>
                    {paid ? <BadgeCheck className="size-3" /> : null}{relationshipLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{categoryLabels[partner.category]}</p>
                {display_text || partner.description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{display_text || partner.description}</p> : null}
                {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-primary hover:underline">Ver servicio</a> : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
