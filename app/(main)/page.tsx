import { Suspense } from "react"
import Link from "next/link"
import { SearchField } from "@/components/listings/search-field"
import {
  EventCard,
  PlaceCard,
} from "@/components/listings/listing-cards"
import { QuickCollections } from "@/components/home/quick-collections"
import { QuickServices } from "@/components/home/quick-services"
import { DepartmentPlacesTabs } from "@/components/home/department-places-tabs"
import {
  getFeaturedPlaces,
  getPlacesGroupedByDepartment,
  getUpcomingEvents,
} from "@/lib/listings/queries"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Descubre el oriente
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Eventos y lugares con información verificada
        </p>
        <SearchField />
      </section>

      <QuickCollections />

      <Suspense fallback={<CarouselSkeleton title="Eventos próximos" />}>
        <UpcomingSection />
      </Suspense>

      <QuickServices />

      <Suspense fallback={<DepartmentSkeleton />}>
        <DepartmentSection />
      </Suspense>

      <Suspense fallback={<CarouselSkeleton title="Lugares destacados" />}>
        <FeaturedSection />
      </Suspense>
    </div>
  )
}

async function UpcomingSection() {
  const events = await getUpcomingEvents(6)

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">
          Eventos próximos
        </h2>
        <Link
          href="/explorar"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>
      {events.length === 0 ? (
        <EmptyHint text="Aún no hay eventos próximos publicados." />
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:px-0">
          {events.map((listing) => (
            <EventCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}

async function DepartmentSection() {
  const placesByDepartment = await getPlacesGroupedByDepartment(6)
  return <DepartmentPlacesTabs placesByDepartment={placesByDepartment} />
}

async function FeaturedSection() {
  const places = await getFeaturedPlaces(6)

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">
          Lugares destacados
        </h2>
        <Link
          href="/explorar"
          className="text-sm font-medium text-primary hover:underline"
        >
          Explorar
        </Link>
      </div>
      {places.length === 0 ? (
        <EmptyHint text="Aún no hay lugares destacados." />
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:px-0">
          {places.map((listing) => (
            <PlaceCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function CarouselSkeleton({ title }: { title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="flex gap-3 overflow-hidden">
        <Skeleton className="h-56 w-66 shrink-0 rounded-2xl" />
        <Skeleton className="h-56 w-66 shrink-0 rounded-2xl" />
      </div>
    </section>
  )
}

function DepartmentSkeleton() {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">
        Explora por departamento
      </h2>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        <Skeleton className="h-52 w-56 shrink-0 rounded-2xl" />
        <Skeleton className="h-52 w-56 shrink-0 rounded-2xl" />
      </div>
    </section>
  )
}
