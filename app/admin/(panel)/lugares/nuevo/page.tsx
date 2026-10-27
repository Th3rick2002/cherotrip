import { ListingForm } from "@/components/admin/listing-form"
import { getAdminActivityCategories, getAdminCategories, getPendingCommunitySubmission } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Nuevo lugar" }

export default async function NewPlacePage({ searchParams }: { searchParams: Promise<{ submission?: string }> }) {
  await requireAdmin()
  const [{ submission }, categories, activityCategories] = await Promise.all([
    searchParams,
    getAdminCategories(),
    getAdminActivityCategories(),
  ])
  const submissionId = submission && /^\d+$/.test(submission) ? Number(submission) : null
  const communitySubmission = submissionId ? await getPendingCommunitySubmission(submissionId) : null

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <p className="text-sm font-medium text-primary">Gestión de lugares</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">{communitySubmission ? "Convertir aporte en borrador" : "Crear lugar"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Completa la ficha y guárdala como borrador o publícala.</p>
      </header>
      {submissionId && !communitySubmission ? <p role="alert" className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-900">El aporte ya no está pendiente o no se pudo cargar. Puedes crear el lugar manualmente.</p> : null}
      <ListingForm type="place" categories={categories} activityCategories={activityCategories} submission={communitySubmission ?? null} />
    </div>
  )
}
