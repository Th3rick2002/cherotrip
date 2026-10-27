import Image from "next/image"
import Link from "next/link"
import { CalendarClock, MapPin, MessageSquare, UserRound } from "lucide-react"
import type { AdminCommunitySubmission } from "@/lib/admin/content"
import { rejectCommunitySubmission } from "@/lib/admin/community-actions"

export function CommunityReview({ submissions, saved, error }: { submissions: AdminCommunitySubmission[]; saved: boolean; error?: string }) {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header><p className="text-sm font-medium text-primary">Moderación</p><h1 className="mt-1 text-2xl font-bold text-foreground">Aportes de la comunidad</h1><p className="mt-1 text-sm text-muted-foreground">{submissions.length} pendiente{submissions.length === 1 ? "" : "s"}. Las fotos se muestran con un enlace temporal y privado.</p></header>
      {saved ? <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">El aporte se actualizó.</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">No se pudo actualizar el aporte. Recarga la página e inténtalo de nuevo.</p> : null}
      {submissions.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">No hay aportes pendientes.</div> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {submissions.map((submission) => <article key={submission.id} className="overflow-hidden rounded-2xl border border-border bg-card">
          {submission.photo_url ? <div className="relative aspect-[16/8] bg-muted"><Image src={submission.photo_url} alt={`Foto compartida para ${submission.place_name}`} fill sizes="(min-width: 1280px) 50vw, 100vw" unoptimized className="object-cover" /></div> : null}
          <div className="space-y-4 p-5">
            <div><span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800">Pendiente</span><h2 className="mt-3 text-xl font-semibold text-foreground">{submission.place_name}</h2></div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{submission.department}</span><span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" />{formatDate(submission.created_at)}</span>{submission.contact_optional ? <span className="inline-flex items-center gap-1.5"><UserRound className="size-4" />{submission.contact_optional}</span> : null}</div>
            <p className="flex gap-2 whitespace-pre-wrap rounded-xl bg-muted/50 p-3 text-sm leading-relaxed text-foreground"><MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{submission.comment}</p>
            <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
              <form action={rejectCommunitySubmission}><input type="hidden" name="submission_id" value={submission.id} /><button className="min-h-10 rounded-lg border border-destructive/30 px-3 text-sm font-semibold text-destructive hover:bg-destructive/10">Rechazar</button></form>
              <Link href={`/admin/lugares/nuevo?submission=${submission.id}`} className="inline-flex min-h-10 items-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Convertir en borrador</Link>
            </div>
          </div>
        </article>)}
      </div>
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short", timeZone: "America/El_Salvador" }).format(new Date(value))
}
