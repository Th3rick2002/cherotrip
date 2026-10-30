import Link from "next/link"

export default function AdminNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Panel Cherotrip</p>
      <h1 className="text-2xl font-bold text-foreground">No encontramos esa sección</h1>
      <p className="max-w-md text-muted-foreground">La dirección del panel no existe o el contenido ya no está disponible.</p>
      <Link href="/admin/dashboard" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Volver al panel</Link>
    </main>
  )
}
