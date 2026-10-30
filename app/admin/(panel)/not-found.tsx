import Link from "next/link"

export default function AdminPanelNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">Registro no encontrado</h1>
      <p className="text-muted-foreground">No existe en el panel o no corresponde al tipo de contenido solicitado.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/admin/lugares" className="inline-flex min-h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted">Lugares</Link>
        <Link href="/admin/eventos" className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Eventos</Link>
      </div>
    </div>
  )
}
