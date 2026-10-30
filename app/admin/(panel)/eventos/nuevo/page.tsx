import { ListingForm } from "@/components/admin/listing-form"
import { getAdminActivityCategories, getAdminCategories, getAdminDepartments, getPendingCommunitySubmission } from "@/lib/admin/content"
import { requireAdmin } from "@/lib/admin/auth"

export const metadata = { title: "Nuevo evento" }

export default async function NewEventPage({ searchParams }: { searchParams: Promise<{ submission?: string }> }) {
  await requireAdmin()
  const [{ submission }, categories, activityCategories, departments] = await Promise.all([searchParams, getAdminCategories(), getAdminActivityCategories(), getAdminDepartments()])
  const submissionId = submission && /^\d+$/.test(submission) ? Number(submission) : null
  const communitySubmission = submissionId ? await getPendingCommunitySubmission(submissionId) : null
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header><p className="text-sm font-medium text-primary">Gestión de eventos</p><h1 className="mt-1 text-2xl font-bold text-foreground">{communitySubmission ? "Convertir aporte en borrador" : "Crear evento"}</h1><p className="mt-1 text-sm text-muted-foreground">Completa sus fechas y agenda; puedes guardarlo como borrador o publicarlo.</p></header>
      {submissionId && !communitySubmission ? <p role="alert" className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-900">El aporte ya no está pendiente o no se pudo cargar. Puedes crear el evento manualmente.</p> : null}
      <ListingForm type="event" categories={categories} activityCategories={activityCategories} departments={departments} submission={communitySubmission ?? null} />
    </div>
  )
}
