import { notFound } from "next/navigation"
import { ListingForm } from "@/components/admin/listing-form"
import { getAdminActivityCategories, getAdminCategories, getAdminListing } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Editar evento" }

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id: rawId } = await params
  if (!/^\d+$/.test(rawId)) notFound()
  const id = Number(rawId)
  const [listing, categories, activityCategories] = await Promise.all([
    getAdminListing(id, "event"),
    getAdminCategories(),
    getAdminActivityCategories(),
  ])
  if (!listing) notFound()
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header><p className="text-sm font-medium text-primary">Gestión de eventos</p><h1 className="mt-1 text-2xl font-bold text-foreground">Editar evento</h1><p className="mt-1 text-sm text-muted-foreground">{listing.title}</p></header>
      <ListingForm type="event" initial={listing} categories={categories} activityCategories={activityCategories} />
    </div>
  )
}
