import {
  BadgeCheck,
  Bus,
  CalendarClock,
  MapPin,
  Ticket,
  Users,
} from "lucide-react"
import type { Listing, SubEvent } from "@/lib/types/listing"
import { formatEventWhen, formatPriceFrom } from "@/lib/format"
import { AccommodationBanner } from "@/components/listings/accommodation-banner"
import { SocialLinks } from "@/components/listings/social-links"
import { ShareButton } from "@/components/listings/share-button"
import { BackButton } from "@/components/listings/back-button"
import { CoverImage } from "@/components/listings/cover-image"
import { EventAgenda } from "@/components/listings/event-agenda"
import { FavoriteButton } from "@/components/listings/favorite-button"
import { TicketPurchaseCta } from "@/components/listings/ticket-purchase-cta"

function extrasLabel(extras: Record<string, unknown>): string {
  const labels: string[] = []
  if (extras.guia) labels.push("Guía local incluido")
  if (extras.banos) labels.push("Baños")
  if (extras.camping) labels.push("Camping")
  if (extras.equipo_incluido) labels.push("Equipo incluido")
  if (extras.restaurantes) labels.push("Restaurantes")
  if (extras.degustacion || extras.degustaciones) labels.push("Degustación")
  if (extras.transporte_incluido) labels.push("Transporte incluido")
  if (extras.familiar) labels.push("Ambiente familiar")
  return labels.length > 0 ? labels.join(", ") : "Detalles con el anfitrión"
}

export function ListingDetail({
  listing,
  subEvents = [],
}: {
  listing: Listing
  subEvents?: SubEvent[]
}) {
  const when =
    listing.type === "event"
      ? formatEventWhen(listing.starts_at)
      : listing.schedule_text ?? "Todo el año"
  const price = formatPriceFrom(listing.price_from)
  const payments =
    listing.payment_methods.length > 0
      ? listing.payment_methods.join(", ")
      : null

  return (
    <article className="flex min-h-full flex-1 flex-col">
      <div className="relative aspect-[16/11] w-full bg-muted sm:aspect-[21/9] sm:max-h-[28rem]">
        <CoverImage
          src={listing.cover_image_url}
          slug={listing.slug}
          alt={listing.title}
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <BackButton />
          <ShareButton title={listing.title} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-5 pb-8 sm:px-6 sm:pt-8">
        <header className="space-y-3">
          <div className="flex items-start gap-2">
            {listing.verified ? (
              <BadgeCheck
                className="mt-1 size-6 shrink-0 text-primary"
                aria-label="Verificado por Cherotrip"
              />
            ) : null}
            <div className="min-w-0 flex-1 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {listing.title}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {listing.department} · Oriente SV
              </p>
            </div>
            <FavoriteButton listingId={listing.id} className="shrink-0" />
          </div>

          <div className="flex flex-wrap gap-2">
            {(listing.categories ?? []).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
              >
                {cat.name}
              </span>
            ))}
            {listing.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Descripción</h2>
          <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {listing.description}
          </p>
        </section>

        <SocialLinks listing={listing} />

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoTile
            icon={CalendarClock}
            title={when ?? "Horario por confirmar"}
            subtitle={listing.meeting_point ?? "Punto de encuentro por confirmar"}
          />
          <InfoTile
            icon={Ticket}
            title={price}
            subtitle={
              payments ? `Métodos de pago: ${payments}` : "Consultar métodos de pago"
            }
          />
          <InfoTile
            icon={Bus}
            title={listing.transport_info ?? "Transporte por confirmar"}
            subtitle={
              listing.accessibility_notes ?? "Más detalles al contactar"
            }
          />
          <InfoTile
            icon={Users}
            title={extrasLabel(listing.extras)}
            subtitle="Incluidos / extras"
          />
        </section>

        <AccommodationBanner listing={listing} />

        {listing.type === "event" && subEvents.length > 0 ? (
          <EventAgenda items={subEvents} />
        ) : null}

        {listing.restrictions ? (
          <div className="rounded-2xl border border-sand-strong/30 bg-sand-strong/10 px-4 py-3 text-sm text-foreground">
            {listing.restrictions}
          </div>
        ) : null}

        <TicketPurchaseCta listing={listing} />
      </div>
    </article>
  )
}

function InfoTile({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-muted/80 p-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-brand" />
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
