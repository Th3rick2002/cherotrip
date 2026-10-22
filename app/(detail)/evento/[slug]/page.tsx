import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ListingDetail } from "@/components/listings/listing-detail"
import { getListingBySlug } from "@/lib/listings/queries"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing || listing.type !== "event") {
    return { title: "Evento no encontrado" }
  }
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.cover_image_url ? [listing.cover_image_url] : undefined,
    },
  }
}

export default function EventoPage({ params }: Props) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <EventoContent params={params} />
    </Suspense>
  )
}

async function EventoContent({ params }: Props) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing || listing.type !== "event") notFound()
  return <ListingDetail listing={listing} />
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[16/11] w-full rounded-none" />
      <div className="space-y-3 px-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}
