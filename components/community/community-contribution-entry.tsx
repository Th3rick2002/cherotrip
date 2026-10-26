"use client"

import { useState } from "react"
import { HeartHandshake } from "lucide-react"
import { CommunityContributionDialog } from "@/components/community/community-contribution-dialog"

export function CommunityContributionEntry() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            ¿Conoces un lugar que deberíamos agregar?
          </h2>
          <p className="text-sm text-muted-foreground">
            Recomiéndalo a la comunidad; revisaremos la información antes de publicarla.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <HeartHandshake aria-hidden="true" className="size-4" />
          Aporta a la comunidad
        </button>
      </section>
      <CommunityContributionDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
