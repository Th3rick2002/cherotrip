import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ListingDetail } from "@/components/listings/listing-detail"
import { getListingBySlug } from "@/lib/listings/queries"
import { absoluteMediaUrl } from "@/lib/media"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing || listing.type !== "place") {
    return { title: "Lugar no encontrado" }
  }
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: absoluteMediaUrl(
        listing.cover_image_url ?? `/covers/${listing.slug}.jpg`
      )
        ? [
            absoluteMediaUrl(
              listing.cover_image_url ?? `/covers/${listing.slug}.jpg`
            )!,
          ]
        : undefined,
    },
  }
}

export default function LugarPage({ params }: Props) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <LugarContent params={params} />
    </Suspense>
  )
}

async function LugarContent({ params }: Props) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing || listing.type !== "place") notFound()
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
