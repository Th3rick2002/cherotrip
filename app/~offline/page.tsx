import Link from "next/link"

export const metadata = {
  title: "Sin conexión",
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">Sin conexión</h1>
      <p className="text-muted-foreground">
        No hay internet ahora. Revisa tu red e intenta de nuevo.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        Ir al inicio
      </Link>
    </div>
  )
}
