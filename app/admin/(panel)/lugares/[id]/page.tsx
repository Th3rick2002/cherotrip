import { notFound } from "next/navigation"
import { ListingForm } from "@/components/admin/listing-form"
import { getAdminActivityCategories, getAdminCategories, getAdminDepartments, getAdminListing } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Editar lugar" }

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id: rawId } = await params
  if (!/^\d+$/.test(rawId)) notFound()
  const id = Number(rawId)
  const [listing, categories, activityCategories, departments] = await Promise.all([
    getAdminListing(id, "place"),
    getAdminCategories(),
    getAdminActivityCategories(),
    getAdminDepartments(),
  ])
  if (!listing) notFound()
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header><p className="text-sm font-medium text-primary">Gestión de lugares</p><h1 className="mt-1 text-2xl font-bold text-foreground">Editar lugar</h1><p className="mt-1 text-sm text-muted-foreground">{listing.title}</p></header>
      <ListingForm type="place" initial={listing} categories={categories} activityCategories={activityCategories} departments={departments} />
    </div>
  )
}
