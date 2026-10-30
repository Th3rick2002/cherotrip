import type { Metadata } from "next"
import { CommunityContributionForm } from "@/components/community/community-contribution-form"
import { getPublicDepartments } from "@/lib/listings/queries"

export const metadata: Metadata = {
  title: "Aporta a la comunidad",
  description: "Recomienda un lugar o evento para que el equipo de Cherotrip lo revise.",
}

export default async function AportarPage() {
  const departments = await getPublicDepartments()
  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary">Comunidad Cherotrip</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Aporta a la comunidad
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          ¿Conoces un lugar o evento que otras personas deberían descubrir? Comparte la información y la revisaremos antes de publicarla.
        </p>
      </header>
      <CommunityContributionForm departments={departments} />
    </section>
  )
}
