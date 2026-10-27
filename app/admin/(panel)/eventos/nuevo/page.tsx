import { ListingForm } from "@/components/admin/listing-form"
import { getAdminActivityCategories, getAdminCategories } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Nuevo evento" }

export default async function NewEventPage() {
  await requireAdmin()
  const [categories, activityCategories] = await Promise.all([getAdminCategories(), getAdminActivityCategories()])
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header><p className="text-sm font-medium text-primary">Gestión de eventos</p><h1 className="mt-1 text-2xl font-bold text-foreground">Crear evento</h1><p className="mt-1 text-sm text-muted-foreground">Completa sus fechas y agenda; puedes guardarlo como borrador o publicarlo.</p></header>
      <ListingForm type="event" categories={categories} activityCategories={activityCategories} />
    </div>
  )
}
