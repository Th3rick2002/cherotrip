import Image from "next/image"
import Link from "next/link"
import { CalendarClock } from "lucide-react"
import type { Listing } from "@/lib/types/listing"
import { formatEventWhen, formatPriceFrom } from "@/lib/format"

function listingHref(listing: Listing) {
  return listing.type === "event"
    ? `/evento/${listing.slug}`
    : `/lugar/${listing.slug}`
}

function Cover({
  listing,
  className,
  sizes,
}: {
  listing: Listing
  className: string
  sizes: string
}) {
  if (!listing.cover_image_url) {
    return <div className={`bg-primary/20 ${className}`} />
  }
  return (
    <Image
      src={listing.cover_image_url}
      alt={listing.title}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  )
}

export function EventCard({ listing }: { listing: Listing }) {
  const when = formatEventWhen(listing.starts_at)

  return (
    <Link
      href={listingHref(listing)}
      className="block w-[16.5rem] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:shadow-md sm:w-[18rem]"
    >
      <div className="relative aspect-[4/3] bg-muted">
        <Cover listing={listing} className="" sizes="288px" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-foreground">
          <CalendarClock className="size-3.5" />
          Próximo
        </span>
      </div>
      <div className="space-y-1 p-3.5">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {[when, listing.department].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  )
}

export function PlaceCard({ listing }: { listing: Listing }) {
  const category = listing.categories?.[0]?.name

  return (
    <Link
      href={listingHref(listing)}
      className="block w-[14rem] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:shadow-md sm:w-[16rem]"
    >
      <div className="relative aspect-[5/4] bg-muted">
        <Cover listing={listing} className="" sizes="256px" />
      </div>
      <div className="space-y-1 p-3.5">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {[listing.department, category].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  )
}

export function DirectoryCard({ listing }: { listing: Listing }) {
  const when =
    listing.type === "event"
      ? formatEventWhen(listing.starts_at)
      : listing.schedule_text?.split("·")[0]?.trim() ?? "Todo el año"
  const price = formatPriceFrom(listing.price_from)
  const access = listing.transport_info?.split(/[·,]/)[0]?.trim()

  return (
    <Link
      href={listingHref(listing)}
      className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28">
        <Cover listing={listing} className="" sizes="112px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {[listing.department, when].filter(Boolean).join(" · ")}
        </p>
        <p className="text-sm font-medium text-primary">
          {[price, access].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  )
}
